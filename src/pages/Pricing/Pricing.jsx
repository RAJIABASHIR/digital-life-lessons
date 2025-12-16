import axios from "../../utils/axiosInstance";
import useAuth from "../../context/useAuth";
import toast from "react-hot-toast";

const Pricing = () => {
  const { isPremium } = useAuth();

  const handleUpgrade = async () => {
    try {
      const res = await axios.post("/payments/create-checkout-session");
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      toast.error("Failed to start payment");
    }
  };

  if (isPremium) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-3">You are already Premium ⭐</h2>
        <p>Enjoy lifetime access to premium lessons and features.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">Choose Your Plan</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded p-6">
          <h2 className="text-xl font-semibold mb-2">Free Plan</h2>
          <p className="mb-4 text-sm text-gray-600">
            Get started with essential features for personal reflection.
          </p>
          <ul className="space-y-2 text-sm">
            <li>• Create unlimited free lessons</li>
            <li>• View all public free lessons</li>
            <li>• Save lessons to favorites</li>
            <li>• Basic dashboard insights</li>
            <li>• Standard listing in public feed</li>
            <li>• Community comments and reactions</li>
          </ul>
        </div>
        <div className="border rounded p-6 bg-slate-50">
          <h2 className="text-xl font-semibold mb-2">Premium Plan</h2>
          <p className="mb-4 text-sm text-gray-600">
            Unlock premium lessons and advanced features forever.
          </p>
          <ul className="space-y-2 text-sm">
            <li>• Everything in Free plan</li>
            <li>• Create premium lessons with paid access</li>
            <li>• View all premium public lessons</li>
            <li>• Priority listing in public feed</li>
            <li>• Ad-free browsing experience</li>
            <li>• Enhanced analytics on lesson performance</li>
            <li>• Early access to new features</li>
            <li>• Lifetime access with one-time payment</li>
          </ul>
          <p className="mt-4 text-lg font-bold">৳1500 (one-time)</p>
          <button
            onClick={handleUpgrade}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-full"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;