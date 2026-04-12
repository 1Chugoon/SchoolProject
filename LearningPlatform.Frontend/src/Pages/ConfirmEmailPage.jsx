import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config.json"

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [resendState, setResendState] = useState("idle");

  const requestSentRef = useRef(false);
  const redirectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!userId || !token) {
      setStatus("invalid");
      return;
    }

    if (requestSentRef.current) return;
    requestSentRef.current = true;

    const confirmEmail = async () => {
      try {
        const response = await axios.post(
          `${config.BaseURL}/auth/confirm-email`,
          { userId, token },
          { validateStatus: () => true }
        );

        if (response.status === 200) {
          setStatus("success");

          redirectTimeoutRef.current = setTimeout(() => {
            navigate("/join/login", { replace: true });
          }, 3000);
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };

    confirmEmail();

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [userId, token, navigate]);

  const handleResend = async () => {
    if (!userId || resendState === "sending") return;

    setResendState("sending");

    try {
      const response = await axios.post(
        "/api/auth/resend-confirmation",
        { userId },
        { validateStatus: () => true }
      );

      if (response.status === 200) {
        setResendState("sent");
      } else {
        setResendState("failed");
      }
    } catch {
      setResendState("failed");
    }
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <>
          <div className="spinner" />
          <p className="text">Confirming your email...</p>
        </>
      );
    }

    if (status === "invalid") {
      return (
        <>
          <h2>Invalid confirmation link</h2>
        </>
      );
    }

    if (status === "success") {
      return (
        <>
          <h2>Email confirmed</h2>
          <p className="text">
            Your account has been successfully activated.
          </p>
          <button
            className="primary-btn"
            onClick={() => navigate("/join/login")}
          >
            Go to login
          </button>
        </>
      );
    }

    return (
      <>
        <h2>Confirmation failed</h2>
        <p className="text">
          The confirmation link is invalid or expired.
        </p>

        <button
          className="primary-btn"
          onClick={handleResend}
          disabled={resendState === "sending"}
        >
          {resendState === "sending"
            ? "Sending..."
            : "Resend confirmation email"}
        </button>

        {resendState === "sent" && (
          <p className="success-msg">Confirmation email sent</p>
        )}

        {resendState === "failed" && (
          <p className="error-msg">Failed to resend email</p>
        )}
      </>
    );
  };

  return (
    <div className="confirm-page">
      <div className="confirm-card">
        {renderContent()}
      </div>
    </div>
  );
}