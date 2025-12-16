import { useEffect } from "react";
import useAuth from "../../context/useAuth";

const PaymentSuccess = () => {
  const { refetchAppUser } = useAuth();

  useEffect(() => {
    refetchAppUser();
  }, [refetchAppUser]);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-center">
      <h1 className="text-3xl font-semibold mb-3">Payment Successful 🎉</h1>
      <p className="mb-2">Your Premium access is now active.</p>
      <p>Enjoy unlimited access to premium lessons and features.</p>
    </div>
  );
};

export default PaymentSuccess;
