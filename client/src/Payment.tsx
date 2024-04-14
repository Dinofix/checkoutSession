import { useEffect, useState } from "react";
import "./App.css";
import { Product, useCart } from "./context/CartContext";

const Payment = () => {
  const { cart, addToCart } = useCart();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [user, setUser] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    const authorize = async () => {
      const response = await fetch("http://localhost:3001/api/auth/authorize", {
        credentials: "include",
      });

      const data = await response.json();
      console.log("Response from server:", data);

      if (response.status === 200) {
        setUser(data);
      } else {
        setUser("");
      }
    };
    authorize();
  }, []);

  const fetchProducts = async () => {
    if (products.length === 0) {
      console.log("Hämtar produkter...");
      try {
        const response = await fetch("http://localhost:3001/payments/products");
        if (response.ok) {
          const responseData = await response.json();
          setProducts(responseData.data);
          console.log("Products fetched:", responseData.data);
        } else {
          console.error("Failed to fetch products, status:", response.status);
          alert("Could not fetch products. Status code: " + response.status);
        }
      } catch (error) {
        const typedError = error as Error;
        console.error("Login error:", typedError.message);
        alert(typedError.message);
      }
    }
    setShowProducts(!showProducts);
  };

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      setUser(data);
      console.log("Logged in:", data);
    } catch (error) {
      const typedError = error as Error; 
      console.error("Login error:", typedError.message);
      alert(typedError.message); 
    }
  };

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: registerEmail,
        password: registerPassword,
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  const logout = async () => {
    const response = await fetch("http://localhost:3001/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    if (response.status === 200) {
      setUser("");
    }
  };

  const handlePayment = async (cartItems: any[]) => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const payload = cartItems.map(
      (item: { product: { default_price: { id: any } }; quantity: any }) => ({
        product: item.product.default_price.id,
        quantity: item.quantity,
      })
    );

    try {
      const response = await fetch(
        "http://localhost:3001/payments/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      const session = await response.json();
      if (response.ok && session.url) {
        window.location.href = session.url; 
        localStorage.removeItem("cart"); 
        setCart([]); // 
      } else {
        console.error(
          "Failed to create checkout session:",
          session.message || "Unknown error"
        );
        alert("Failed to create checkout session. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(
        "An error occurred while processing your payment. Please try again."
      );
    }
  };

  return (
    <div>
      <h1>{user ? `INLOGGAD ${user}` : "UTLOGGAD"}</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>

      <form onSubmit={handleRegister}>
        <input
          type="email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Registrera</button>
      </form>

      <button onClick={fetchProducts} disabled={!user}>
        {showProducts ? "Hide Products" : "Check Products"}
      </button>

      {showProducts && products.length > 0 && (
        <div>
          <h2>Products:</h2>
          {products.map((product) => (
            <div key={product.id}>
              <img
                src={product.images[0]}
                alt={product.name}
                style={{ width: "100px", height: "100px" }}
              />
              <h3>{product.name}</h3>
              <p>
                {product.default_price
                  ? product.default_price.unit_amount / 100
                  : "Price Unavailable"}{" "}
                SEK
              </p>
              <button onClick={() => addToCart(product)}>
                Lägg till i kundvagn
              </button>
            </div>
          ))}
        </div>
      )}

      <button onClick={logout}>Logout</button>
      <button onClick={() => handlePayment(cart)} disabled={!user}>
        Betala
      </button>
    </div>
  );
};

export default Payment;
