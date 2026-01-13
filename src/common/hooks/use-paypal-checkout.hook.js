import { useState, useEffect } from "react";

const usePayPalCheckout = ({
  amount,
  currency = "USD",
  onSuccess,
  onError,
  onCancel,
  orderData = {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);
  const [error, setError] = useState(null);

  // Load PayPal SDK
  useEffect(() => {
    const loadPayPalScript = () => {
      if (window.paypal) {
        setPaypalReady(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}&intent=capture&components=buttons`;
      script.async = true;

      script.onload = () => {
        setPaypalReady(true);
      };

      script.onerror = () => {
        setError("Failed to load PayPal SDK");
      };

      document.body.appendChild(script);
    };

    loadPayPalScript();

    return () => {
      // Cleanup script if component unmounts
      const script = document.querySelector(`script[src*="paypal.com/sdk/js"]`);
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [currency]);

  // Create PayPal order
  const createOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/payments/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount).toFixed(2),
          currency,
          orderData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create PayPal order");
      }

      const data = await response.json();

      if (data.success && data.orderId) {
        return data.orderId;
      } else {
        throw new Error(data.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      setError(error.message);
      if (onError) onError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Capture PayPal payment
  const captureOrder = async (orderId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/payments/paypal/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          orderData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to capture PayPal payment");
      }

      const data = await response.json();

      if (data.success) {
        if (onSuccess) onSuccess(data);
        return data;
      } else {
        throw new Error(data.message || "Payment capture failed");
      }
    } catch (error) {
      console.error("Error capturing PayPal payment:", error);
      setError(error.message);
      if (onError) onError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // PayPal button configuration
  const paypalButtonConfig = {
    createOrder: async () => {
      try {
        return await createOrder();
      } catch (error) {
        console.error("Error in createOrder:", error);
        throw error;
      }
    },

    onApprove: async (data) => {
      try {
        return await captureOrder(data.orderID);
      } catch (error) {
        console.error("Error in onApprove:", error);
        if (onError) onError(error);
      }
    },

    onError: (err) => {
      console.error("PayPal button error:", err);
      setError("PayPal payment failed");
      if (onError) onError(err);
    },

    onCancel: (data) => {
      console.log("PayPal payment cancelled:", data);
      if (onCancel) onCancel(data);
    },

    style: {
      layout: "vertical",
      color: "gold",
      shape: "rect",
      label: "paypal",
      height: 45,
    },
  };

  // Express checkout (for cart page)
  const expressCheckout = async (cartItems) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/payments/paypal/express-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to initiate express checkout");
      }

      const data = await response.json();

      if (data.success && data.approvalUrl) {
        // Redirect to PayPal for approval
        window.location.href = data.approvalUrl;
      } else {
        throw new Error(data.message || "Express checkout failed");
      }
    } catch (error) {
      console.error("Express checkout error:", error);
      setError(error.message);
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    paypalReady,
    error,
    paypalButtonConfig,
    createOrder,
    captureOrder,
    expressCheckout,
    setError,
  };
};

export default usePayPalCheckout;
