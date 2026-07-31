import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, Eye, EyeOff, UserRound, ArrowRight } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/authSchemas";
import { authService } from "../services/authService";
import { toast } from "sonner";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema), defaultValues: { name: "", username: "", email: "", password: "", confirmPassword: "", terms: false },
  });
  const image = useWatch({ control, name: "profileImage" });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await authService.register(data);
      toast.success("Account created — verify your email to continue.");
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      setServerError(error.response?.data?.message || error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-card auth-register-card">
      <header><h1>Create account</h1><p>Join thousands of people shaping opinions.</p></header>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <p className="form-error" role="alert">{serverError}</p>}
        <label className="avatar-picker"><span className="avatar-preview">{image ? <img src={URL.createObjectURL(image)} alt="Selected profile" /> : <UserRound size={28} />}</span><span><strong>Profile photo</strong><small>Optional · PNG or JPG</small></span><input type="file" accept="image/png,image/jpeg" onChange={(event) => setValue("profileImage", event.target.files?.[0], { shouldValidate: true })} /><Camera size={15} /></label>
        <div className="auth-field-grid">
          <label className="field">FULL NAME<input placeholder="Your full name" autoComplete="name" {...register("name")} />{errors.name && <small>{errors.name.message}</small>}</label>
          <label className="field">EMAIL<input type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />{errors.email && <small>{errors.email.message}</small>}</label>
        </div>
        <label className="field">USERNAME<span className="input-wrap"><UserRound size={16} /><input placeholder="your.username" autoComplete="username" {...register("username")} /></span>{errors.username && <small>{errors.username.message}</small>}</label>
        <label className="field">PASSWORD<span className="input-wrap"><input type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" autoComplete="new-password" {...register("password")} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{errors.password && <small>{errors.password.message}</small>}</label>
        <label className="field">CONFIRM PASSWORD<input type={showPassword ? "text" : "password"} placeholder="Repeat your password" autoComplete="new-password" {...register("confirmPassword")} />{errors.confirmPassword && <small>{errors.confirmPassword.message}</small>}</label>
        <label className="check terms-check"><input type="checkbox" {...register("terms")} /><span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</span></label>
        {errors.terms && <small className="field-error">{errors.terms.message}</small>}
        <button className="auth-submit" disabled={isSubmitting}>{isSubmitting ? "Creating account…" : <>Create account <ArrowRight size={18} /></>}</button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  );
}
