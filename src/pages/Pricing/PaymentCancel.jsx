import { Link, useSearchParams } from "react-router-dom";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="mb-4">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-2xl text-red-500">✕</span>
          </div>
          <h1 className="text-2xl font-semibold mb-2">
            Payment was cancelled
          </h1>
          <p className="text-sm text-slate-600">
            Your upgrade to the Premium plan was not completed. You can try
            again any time from the Pricing page.
          </p>
          {sessionId && (
            <p className="text-[11px] text-slate-400 mt-2">
              Session ID: {sessionId}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Link
            to="/pricing"
            className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:opacity-90 transition"
          >
            Back to Pricing
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}