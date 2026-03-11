import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Mail, Lock, Eye, EyeOff, Shield, CheckCircle2, AlertCircle, User, ArrowRight } from "lucide-react";
import { useAuth } from "./AuthContext";
import { IS_DEMO_MODE } from "./supabaseClient";

export default function LoginPage() {
    const { login, signUp, authError, emailSent } = useAuth();
    const [mode, setMode] = useState("login"); // "login" | "signup"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [localError, setLocalError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");
        if (!email || !password) { setLocalError("Please fill in all fields."); return; }
        if (mode === "signup" && !fullName) { setLocalError("Please enter your full name."); return; }
        setLoading(true);
        if (mode === "login") {
            await login(email, password);
        } else {
            await signUp(email, password, fullName);
        }
        setLoading(false);
    };

    const displayError = localError || authError;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                {/* Logo Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-4">
                        <Activity size={30} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">SafePulse <span className="text-indigo-400">AI</span></h1>
                    <p className="text-slate-400 text-sm mt-1.5 flex items-center gap-2">
                        <Shield size={12} className="text-indigo-400" /> Clinical Decision Support System
                    </p>
                    {IS_DEMO_MODE && (
                        <div className="mt-3 px-4 py-2 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-300 text-xs font-semibold flex items-center gap-2">
                            <AlertCircle size={12} /> Demo Mode — any email + 6-char password works
                        </div>
                    )}
                </div>

                {/* Card */}
                <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Tab Toggle */}
                    <div className="flex border-b border-white/10">
                        {["login", "signup"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setMode(tab); setLocalError(""); }}
                                className={`flex-1 py-3.5 text-sm font-semibold transition-all duration-200 ${mode === tab
                                    ? "text-white bg-indigo-600/30 border-b-2 border-indigo-400"
                                    : "text-slate-400 hover:text-slate-200"}`}
                            >
                                {tab === "login" ? "Doctor Login" : "Create Account"}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {emailSent ? (
                                <motion.div
                                    key="email-sent"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center text-center py-6"
                                >
                                    <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/30">
                                        <CheckCircle2 size={32} className="text-emerald-400" />
                                    </div>
                                    <h2 className="text-white font-bold text-lg mb-2">Check your inbox!</h2>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        A confirmation email has been sent to <strong className="text-slate-200">{email}</strong>.
                                        Click the link in the email to verify your account, then log in.
                                    </p>
                                    <button
                                        onClick={() => setMode("login")}
                                        className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
                                    >
                                        Go to Login
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key={mode}
                                    initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    {mode === "signup" && (
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                                            <div className="relative">
                                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Dr. Jane Smith"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    className="w-full bg-white/[0.08] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/50 transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                                        <div className="relative">
                                            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="email"
                                                placeholder="doctor@hospital.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-white/[0.08] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/50 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                                        <div className="relative">
                                            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type={showPass ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-white/[0.08] border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/50 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPass(!showPass)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                            >
                                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Error */}
                                    <AnimatePresence>
                                        {displayError && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-lg px-3.5 py-2.5 text-red-400 text-xs font-medium"
                                            >
                                                <AlertCircle size={13} /> {displayError}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: loading ? 1 : 1.01 }}
                                        whileTap={{ scale: loading ? 1 : 0.98 }}
                                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</span>
                                        ) : (
                                            <>
                                                {mode === "login" ? "Sign In to Dashboard" : "Create Doctor Account"}
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </motion.button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-600 text-xs mt-6">
                    © 2026 SafePulse AI · For clinical decision support only
                </p>
            </motion.div>
        </div>
    );
}
