import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, Eye, EyeOff, UserRound, ArrowRight, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/authSchemas";
import { useRegister } from "../hooks/useAuthMutations";
import { toast } from "sonner";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const registerMutation = useRegister();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", username: "", email: "", password: "", confirmPassword: "", terms: false },
  });
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profileImage", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const onSubmit = (data) => {
    setServerError("");
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Account created — verify your email to continue.");
        navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
      },
      onError: (error) => {
        setServerError(error.response?.data?.message || error.message || "Registration failed. Please try again.");
      },
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left showcase */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-surface-950 via-surface-900 to-surface-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 max-w-lg">
          <div className="flex items-center gap-3">
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
              Join the community
            </Badge>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Start polling<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">in seconds.</span>
            </h1>
            <p className="text-surface-400 text-lg leading-relaxed max-w-md">
              Create polls, collect votes, and discover what your community truly thinks.
            </p>
          </motion.div>

          <p className="text-surface-500 text-sm">© {new Date().getFullYear()} Pollify · Made for the community</p>
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
              <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Create account</h1>
              <p className="text-surface-500 mt-1">Join thousands of people shaping opinions.</p>
            </div>

            {serverError && (
              <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm" role="alert">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Avatar picker */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-primary-600 border-2 border-dashed border-surface-300 overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <UserRound size={28} />
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors shadow-sm">
                    <Camera size={12} />
                    <input type="file" accept="image/png,image/jpeg" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-700">Profile photo</p>
                  <p className="text-xs text-surface-500">Optional · PNG or JPG</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full name"
                  placeholder="Your full name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              <Input
                label="Username"
                placeholder="your.username"
                error={errors.username?.message}
                {...register("username")}
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
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

              <Input
                label="Confirm password"
                type={showPassword ? "text" : "password"}
                placeholder="Repeat your password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("terms")}
                  className="mt-0.5 w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-surface-600 leading-relaxed">
                  I agree to the <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</Link>.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-danger-500 -mt-3">{errors.terms.message}</p>}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isSubmitting || registerMutation.isPending}
                icon={ArrowRight}
              >
                {isSubmitting || registerMutation.isPending ? "Creating account…" : "Create account"}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-surface-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
