import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Cloud,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Image,
  FileText,
  Music2,
  FolderClosed,
  AlertCircle,
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setFormError(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F7F8FC] dark:bg-[#05070F] font-[family-name:var(--font-body)] text-[#12142B] dark:text-[#E7E9F5] transition-colors duration-300">
      {/* ---------- Left panel: illustration + brand ---------- */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-[#4338CA] via-[#6D5AE6] to-[#8B5CF6]">
        {/* ambient drifting glow orbs */}
        <div className="absolute -top-24 -left-16 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-drift-slow" />
        <div className="absolute bottom-[-6rem] right-[-4rem] w-96 h-96 rounded-full bg-[#38BDF8]/20 blur-3xl animate-drift-slower" />
        <div className="absolute top-1/3 right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl animate-drift-slow" />

        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg">
              <Cloud className="w-5.5 h-5.5 text-white" strokeWidth={2.25} />
            </div>
            <span className="font-[family-name:var(--font-display)] text-xl font-semibold text-white tracking-tight">
              CloudVault
            </span>
          </div>

          {/* Illustration */}
          <div className="relative w-full flex items-center justify-center py-10">
            <div className="relative w-72 h-72">
              {/* glow behind cloud */}
              <div className="absolute inset-0 rounded-full bg-white/25 blur-3xl animate-blob-pulse" />

              {/* cloud blob shape */}
              <div
                className="absolute inset-6 bg-white/15 backdrop-blur-2xl border border-white/30 shadow-2xl animate-float-slow"
                style={{ borderRadius: "48% 52% 45% 55% / 55% 48% 52% 45%" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cloud
                  className="w-24 h-24 text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                  strokeWidth={1.5}
                  fill="rgba(255,255,255,0.12)"
                />
              </div>

              {/* floating glass file cards */}
              <div className="absolute -top-3 -right-4 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl flex items-center justify-center animate-float-medium">
                <Image className="w-6 h-6 text-white" strokeWidth={1.75} />
              </div>
              <div className="absolute top-10 -left-8 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl flex items-center justify-center animate-float-fast">
                <FileText className="w-5 h-5 text-white" strokeWidth={1.75} />
              </div>
              <div className="absolute bottom-6 -right-8 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl flex items-center justify-center animate-float-slow">
                <Music2 className="w-5 h-5 text-white" strokeWidth={1.75} />
              </div>
              <div className="absolute -bottom-4 left-6 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl flex items-center justify-center animate-float-medium">
                <FolderClosed className="w-6 h-6 text-white" strokeWidth={1.75} />
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl font-medium text-white leading-snug tracking-tight">
              Secure. Simple.
              <br />
              Seamless.
            </p>
            <p className="mt-3 text-sm text-white/70 max-w-xs">
              Your files, protected and always within reach — wherever work
              takes you.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- Right panel: login card ---------- */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* subtle background accents for right panel too */}
        <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 bg-violet-200/30 dark:bg-violet-500/10 rounded-full blur-3xl" />

        {/* mobile-only logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Cloud className="w-5.5 h-5.5 text-white" strokeWidth={2.25} />
          </div>
          <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
            CloudVault
          </span>
        </div>

        <div className="w-full max-w-[420px] relative z-10">
          <div className="bg-white/85 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[20px] shadow-[0_8px_40px_rgba(79,70,229,0.14)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] p-8 sm:p-10 transition-all duration-300">
            <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-semibold tracking-tight mb-1.5">
              Welcome back
            </h1>
            <p className="text-[#6B7094] dark:text-[#8B90B5] text-sm mb-7">
              Log in to your CloudVault account
            </p>

            {formError && (
              <div className="flex items-start gap-2.5 mb-5 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl animate-[float-fast_0.4s_ease-in-out]">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#3A3D5C] dark:text-[#C4C7E0] mb-1.5">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9296B8] group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F4F5FA] dark:bg-white/5 border border-transparent text-sm placeholder:text-[#A2A5C4] dark:placeholder:text-[#6C709A] focus:outline-none focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#3A3D5C] dark:text-[#C4C7E0] mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9296B8] group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-[#F4F5FA] dark:bg-white/5 border border-transparent text-sm placeholder:text-[#A2A5C4] dark:placeholder:text-[#6C709A] focus:outline-none focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9296B8] hover:text-indigo-500 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me + forgot password */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 text-sm text-[#5C5F80] dark:text-[#A3A6C4] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-indigo-600 cursor-pointer"
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3.5 rounded-xl font-medium text-white bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] bg-[length:160%_100%] bg-left hover:bg-right shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            <p className="text-sm text-[#6B7094] dark:text-[#8B90B5] mt-7 text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
