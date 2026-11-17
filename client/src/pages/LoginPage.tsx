import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Admin-only login — not linked from the storefront. Open /admin/login */
export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-card">
          <h1 className="font-display font-bold text-3xl text-slate-900 mb-2 text-center">
            Paneli Admin
          </h1>
          <p className="text-slate-500 text-sm text-center mb-8">
            Hyrje vetëm për administratorin e AruLand.
          </p>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError("");
              try {
                const u = await login(email, password);
                if (u.role !== "ADMIN") {
                  setError("Ky llogari nuk ka akses admin.");
                  return;
                }
                navigate("/admin");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Hyrja dështoi");
              } finally {
                setLoading(false);
              }
            }}
          >
            <input
              type="email"
              required
              placeholder="Email admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-200"
            />
            <input
              type="password"
              required
              placeholder="Fjalëkalimi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-200"
            />
            {error && <p className="text-sm text-accent-pink">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50"
            >
              {loading ? "Duke hyrë..." : "Hyr në admin"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
