import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-card">
          <h1 className="font-display font-bold text-3xl text-slate-900 mb-2 text-center">
            Sign in
          </h1>
          <p className="text-slate-500 text-sm text-center mb-8">
            Clients can view order history. Admins open the admin panel after sign in.
          </p>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError("");
              try {
                const user = await login(email, password);
                navigate(user.role === "ADMIN" ? "/admin" : "/account/orders");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Login failed");
              } finally {
                setLoading(false);
              }
            }}
          >
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
              placeholder="Password"
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
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="text-sm text-slate-500 text-center mt-6">
            New customer?{" "}
            <Link to="/register" className="text-brand-600 font-semibold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
