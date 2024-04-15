import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Confirmation = () => {
  const [verified, setVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      console.log("Running verification function");
      const sessionId = localStorage.getItem("checkoutSessionId");

      if (!sessionId) {
        console.error("No session ID found in local storage");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3001/payments/verify-session",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to verify session");
        }

        setVerified(data.verified);
        if (!data.verified) {
          setTimeout(() => navigate("/"), 5000);
        }
      } catch (error) {
        console.error("Error verifying session:", error);
      } finally {
        localStorage.removeItem("checkoutSessionId");
        setIsLoading(false);
      }
    };

    verifySession();
  }, [navigate]);
  const goToStartPage = () => {
    navigate("/");
  };

  return (
    <div>
      <h3>
        {!isLoading
          ? verified
            ? "TACK FÖR DITT KÖP ✅"
            : "KÖP KUNDE INTE BEKRÄFTAS ❌"
          : "LADDAR..."}
      </h3>
      <button onClick={goToStartPage}>Gå till startsida</button>
    </div>
  );
};

export default Confirmation;
