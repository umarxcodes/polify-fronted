import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, Mail, ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { authService } from "../services/authService";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const email = new URLSearchParams(window.location.search).get("email") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const otpCode = otp.join("");

    try {
      await authService.verifyEmail({ email, otp: otpCode });
      setSuccess(true);
      toast.success("Email verified!", {
        description: "Your account is now active.",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Invalid verification code. Please try again.");
      toast.error("Verification failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendOtp({ email });
      toast.success("Verification code sent!", {
        description: "Please check your email.",
      });
    } catch (err) {
      toast.error("Failed to resend", { description: err.message });
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-success-50 flex items-center justify-center text-success-500 mx-auto mb-4">
          <CheckCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 mb-2">
          Email verified!
        </h1>
        <p className="text-surface-500 mb-6">
          Redirecting you to sign in...
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="p-8">
        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
            <Mail size={24} />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Verify your email</h1>
          <p className="text-surface-500 mt-1">
            We sent a 6-digit code to <span className="font-medium text-surface-700">{email || "your email"}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold text-surface-900 bg-surface-50 border-2 border-surface-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            ))}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            icon={ArrowRight}
          >
            {loading ? 'Verifying...' : 'Verify email'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-surface-500">
            Didn't receive it?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-primary-600 hover:text-primary-700"
            >
              Resend code
            </button>
          </p>
        </div>

        <p className="mt-4 text-center text-sm text-surface-600">
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
            Back to sign in
          </Link>
        </p>
      </Card>
    </motion.div>
  );
}
