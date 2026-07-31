import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Email Verified!</h1>
        <p className="text-surface-500">Redirecting you to sign in...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/25">
          <Mail size={24} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Verify your email</h1>
        <p className="text-surface-500 mt-2">Enter the 6-digit code we sent to your email.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-3">Verification Code</label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    const newOtp = [...otp];
                    newOtp[index] = value;
                    setOtp(newOtp);
                    if (value && index < 5) {
                      document.getElementById(`otp-${index + 1}`)?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[index] && index > 0) {
                      document.getElementById(`otp-${index - 1}`)?.focus();
                    }
                  }}
                  id={`otp-${index}`}
                  className="w-12 h-14 text-center text-xl font-bold text-surface-900 bg-surface-50 border-2 border-surface-200 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              ))}
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full" size="lg">
            {loading ? "Verifying..." : "Verify Email"}
            {!loading && <ArrowRight size={18} />}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-surface-600">
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              className="text-brand-600 hover:text-brand-700 font-semibold"
            >
              Resend
            </button>
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
