import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { PatientProvider } from "./PatientContext";
import LoginPage from "./LoginPage";
import SafePulseDashboard from "./SafePulseDashboard";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading SafePulse AI…</p>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PatientProvider>
          <Routes>
            <Route
              path="/login"
              element={<PublicRoute><LoginPage /></PublicRoute>}
            />
            <Route
              path="/"
              element={<ProtectedRoute><SafePulseDashboard /></ProtectedRoute>}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PatientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
