import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-card">
          <h1 className="font-display font-bold text-3xl text-slate-900 mb-2 text-center">
            Create customer account
          </h1>
          <p className="text-slate-500 text-sm text-center mb-8">
            Track what you ordered in your account history.
          </p>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError("");
              try {
                await register(name, email, password);
                navigate("/account/orders");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Registration failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            <input
              type="text"
              required
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-200"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-200"
            />
            <input
              type="password"
              required
              minLength={8}
              placeholder="Password (min 8 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-200"
            />
            {error && <p className="text-sm text-accent-pink">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
          <p className="text-sm text-slate-500 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
