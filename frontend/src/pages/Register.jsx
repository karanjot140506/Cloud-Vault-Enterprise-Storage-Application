import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthInput from "../components/auth/AuthInput";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    const result = await register(name, email, password);
    setSubmitting(false);

    if (result.success) {
      setSuccessMsg("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setFormError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Create your account</h1>
        <p className="text-gray-500 mb-6">Start storing files securely with CloudVault</p>

        {formError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{formError}</div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg">{successMsg}</div>
        )}

        <form onSubmit={handleSubmit}>
          <AuthInput label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
          <AuthInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <AuthInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          <AuthInput label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;