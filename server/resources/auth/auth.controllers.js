const fs = require("fs").promises;
const bcrypt = require("bcrypt");
const fetchUsers = require("../../utils/fetchUsers");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Email and password must not be empty");
  }

  const users = await fetchUsers();
  const userAlreadyExists = users.find((u) => u.email === email);
  if (userAlreadyExists) {
    return res.status(400).json("User already exists");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      password: hashedPassword,
    };
    users.push(newUser);

    const customer = await stripe.customers.create({
      email: email,
      description: `Customer for ${email}`,
    });

    newUser.stripeCustomerId = customer.id;

    await fs.writeFile("./data/users.json", JSON.stringify(users, null, 2));

    req.session.user = {
      email: newUser.email,
      stripeCustomerId: newUser.stripeCustomerId,
    };

    res
      .status(201)
      .json({ email: newUser.email, stripeCustomerId: customer.id });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Failed during registration process" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Email and password must not be empty");
  }

  const users = await fetchUsers();
  const userExists = users.find((u) => u.email === email);

  if (!userExists) {
    return res.status(400).json("User not found");
  }

  const passwordMatch = await bcrypt.compare(password, userExists.password);
  if (!passwordMatch) {
    return res.status(400).json("Incorrect password");
  }

  req.session.user = {
    email: userExists.email,
    stripeCustomerId: userExists.stripeCustomerId,
  };

  res.status(200).json(userExists.email);
  console.log("Received login data:", req.body);
};

const logout = (req, res) => {
  req.session = null;
  res.status(200).json("Successfully logged out");
};

const authorize = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json("You are not logged in");
  }
  res.status(200).json(req.session.user.email);
};

module.exports = { register, login, logout, authorize };
