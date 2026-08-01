import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authSchemas";
import { useLogin } from "../hooks/useAuthMutations";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const loginMutation = useLogin();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema), defaultValues: { identifier: "", password: "", rememberMe: false },
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
    <div className="auth-card">
      <header><h1>Welcome back</h1><p>Sign in to your Pollify account.</p></header>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <p className="form-error" role="alert">{serverError}</p>}
        <label className="field">EMAIL ADDRESS
          <span className="input-wrap"><Mail size={17} /><input autoComplete="username" placeholder="you@example.com" {...register("identifier")} /></span>
          {errors.identifier && <small>{errors.identifier.message}</small>}
        </label>
        <label className="field field-password">PASSWORD
          <Link to="/forgot-password">Forgot password?</Link>
          <span className="input-wrap"><LockKeyhole size={17} /><input type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" {...register("password")} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
          {errors.password && <small>{errors.password.message}</small>}
        </label>
        <label className="check"><input type="checkbox" {...register("rememberMe")} /> <span>Remember me</span></label>
        <button className="auth-submit" disabled={isSubmitting || loginMutation.isPending}>{isSubmitting || loginMutation.isPending ? "Signing in…" : <>Sign in <ArrowRight size={18} /></>}</button>
        <div className="auth-divider"><span>Or sign in with</span></div>
        <div className="flex items-center gap-3">
          <button type="button" className="auth-outline flex-1 flex items-center justify-center gap-2" onClick={() => toast.info("SSO coming soon")}>
            Google
          </button>
          <button type="button" className="auth-outline flex-1 flex items-center justify-center gap-2" onClick={() => toast.info("SSO coming soon")}>
            GitHub
          </button>
        </div>
      </form>
      <div className="auth-divider"><span>New to Pollify?</span></div>
      <Link className="auth-outline" to="/register">Create a free account</Link>
    </div>
  );
}
