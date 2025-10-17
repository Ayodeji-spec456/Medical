import React, { useState } from "react";
import { toast } from "react-toastify";
import { paymentService } from "../../services/paymentService";

const StripePayment = ({ appointment, amount, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { sessionUrl } = await paymentService.createPaymentIntent(
        appointment._id,
        amount
      );
      window.location.href = sessionUrl;
    } catch (error) {
      toast.error("Payment setup failed");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        className="btn btn-primary"
        style={{ width: "100%" }}
        disabled={loading}
      >
        {loading ? "Redirecting..." : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
      <p
        style={{
          textAlign: "center",
          marginTop: "15px",
          fontSize: "0.9rem",
          color: "var(--text-secondary)",
        }}
      >
        <i className="fas fa-lock"></i> Secured by Stripe
      </p>
    </div>
  );
};

export default StripePayment;
