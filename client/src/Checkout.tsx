import { useEffect, useState } from "react";
import "./App.css";
import { Product, useCart } from "./context/CartContext";

const Checkout = () => {
  const { cart, addToCart, setCart } = useCart();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [user, setUser] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [showProducts, setShowProducts] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    const authorize = async () => {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/authorize",
        {
          credentials: "include",
        }
      );

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
      console.log("Fetching products...");
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/payments/products",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          setProducts(responseData.data);
          console.log("Products fetched:", responseData.data);
        } else {
          console.error("Failed to fetch products, status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    setShowProducts(!showProducts);
  };

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        }
      );

      const data = await response.json();
      console.log("Login response:", data);

      if (response.status === 200) {
        setUser(data);
        setShowLoginForm(false);
      } else {
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/register",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: registerEmail,
            password: registerPassword,
          }),
        }
      );

      const data = await response.json();
      console.log("Register response:", data);

      if (response.status === 201) {
        setUser(data);
        setShowRegisterForm(false);
      } else {
        console.error("Registration failed:", data.error);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setUser("");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handlePayment = async (cartItems: any[]) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/payments/create-checkout-session",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartItems),
        }
      );

      const data = await response.json();
      console.log("Payment response:", data);

      if (response.status === 200) {
        window.location.href = data.url;
      } else {
        console.error("Payment failed:", data.error);
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div>
      <h1>{user ? `Inloggad som ${user}` : "checkoutSession"}</h1>

      <button onClick={() => setShowLoginForm(!showLoginForm)}>
        {showLoginForm ? "Dölj logga in" : "Visa logga in"}
      </button>

      {showLoginForm && (
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
            placeholder="Lösenord"
            required
          />
          <button type="submit">Logga in</button>
        </form>
      )}

      <button onClick={() => setShowRegisterForm(!showRegisterForm)}>
        {showRegisterForm ? "Dölj registrering" : "Visa registrering"}
      </button>

      {showRegisterForm && (
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
            placeholder="Lösenord"
            required
          />
          <button type="submit">Registrera</button>
        </form>
      )}
      <button onClick={logout}>Logga ut</button>

      <button onClick={fetchProducts} disabled={!user}>
        {showProducts ? "Göm produkter" : "Visa produkter"}
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
                Lägg till varukorg
              </button>
            </div>
          ))}
          <button onClick={() => handlePayment(cart)} disabled={!user}>
            Skicka pengar
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
