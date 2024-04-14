import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Confirmation = () => {
  const [verified, setVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      console.log("Running verification function");
      const dataFromLs = localStorage.getItem("sessionId");

      if (!dataFromLs) {
        console.error("No session ID found in local storage");
        setIsLoading(false);
        return; 
      }

      let sessionId;
      try {
        sessionId = JSON.parse(dataFromLs);
      } catch (error) {
        console.error("Error parsing session ID from local storage:", error);
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

        if (!response.ok) {
          throw new Error("Failed to verify session");
        }

        const data = await response.json();
        setVerified(data.verified);
      } catch (error) {
        console.error("Error verifying session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!verified) {
      verifySession();
    }
  }, [verified]);

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
