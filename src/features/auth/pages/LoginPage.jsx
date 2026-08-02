import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight, BarChart3, Bolt, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authSchemas";
import { useLogin } from "../hooks/useAuthMutations";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "sonner";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const loginMutation = useLogin();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "", rememberMe: false },
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = (data) => {
    setServerError("");
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Welcome back!");
      },
      onError: (error) => {
        setServerError(error.response?.data?.message || error.message || "Unable to sign in. Please try again.");
      },
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left showcase */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-surface-950 via-surface-900 to-surface-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 max-w-lg">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Pollify</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Badge variant="success" size="sm" dot className="mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
                Live community
              </Badge>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
                Every opinion<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">deserves to</span><br />
                be counted.
              </h1>
              <p className="text-surface-400 text-lg leading-relaxed max-w-md">
                Create polls in seconds, collect votes instantly, and discover what your community truly thinks.
              </p>
            </motion.div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Users className="w-5 h-5 text-primary-400 mb-2" />
                <strong className="block text-xl font-bold text-white">50K+</strong>
                <small className="text-surface-400 text-xs">Community members</small>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <BarChart3 className="w-5 h-5 text-primary-400 mb-2" />
                <strong className="block text-xl font-bold text-white">1M+</strong>
                <small className="text-surface-400 text-xs">Votes cast</small>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Bolt className="w-5 h-5 text-primary-400 mb-2" />
                <strong className="block text-xl font-bold text-white">500K+</strong>
                <small className="text-surface-400 text-xs">Polls created</small>
              </div>
            </div>
            <p className="text-surface-500 text-sm">© {new Date().getFullYear()} Pollify · Made for the community</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-surface-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900 tracking-tight">Pollify</span>
          </div>

          <Card className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Welcome back</h1>
              <p className="text-surface-500 mt-1">Sign in to your Pollify account.</p>
            </div>

            {serverError && (
              <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm" role="alert">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <Input
                label="Email address"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                error={errors.identifier?.message}
                {...register("identifier")}
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                icon={LockKeyhole}
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password")}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("rememberMe")} className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-surface-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isSubmitting || loginMutation.isPending}
                icon={ArrowRight}
              >
                {isSubmitting || loginMutation.isPending ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-surface-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-surface-500">Or sign in with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="secondary" className="w-full" onClick={() => toast.info("SSO coming soon")}>
                  Google
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => toast.info("SSO coming soon")}>
                  GitHub
                </Button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-surface-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
                Create a free account
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
