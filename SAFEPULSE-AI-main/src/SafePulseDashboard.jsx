import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity, Users, Settings,
    ChevronRight, User, Shield, LogOut, BarChart2,
    Download, PlusCircle
} from "lucide-react";
import { useAuth } from "./AuthContext";
import DashboardHome from "./DashboardHome";
import DiagnosticResultsPage from "./DiagnosticResultsPage";
import PatientHistoryPage from "./PatientHistoryPage";

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { icon: BarChart2, label: "Dashboard", id: "dashboard" },
    { icon: Activity, label: "Diagnostic Results", id: "results" },
    { icon: Users, label: "Patient History", id: "history" },
    { icon: Settings, label: "Settings", id: "settings" },
];

function Sidebar({ activeNav, setActiveNav }) {
    const { user, logout } = useAuth();
    const doctorName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Doctor";
    const specialty = user?.user_metadata?.specialty || "Clinician";

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 flex flex-col z-20 shadow-2xl">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/60">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Activity size={18} className="text-white" />
                </div>
                <div>
                    <p className="text-white font-bold text-sm tracking-wide leading-none">SafePulse</p>
                    <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase leading-none mt-0.5">AI</p>
                </div>
            </div>

            {/* Badge */}
            <div className="mx-4 mt-4 px-3 py-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30">
                <p className="text-indigo-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                    <Shield size={11} /> Clinical Decision Support
                </p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 mt-6 space-y-1">
                {NAV_ITEMS.map(({ icon: Icon, label, id }) => {
                    const active = activeNav === id;
                    return (
                        <button
                            key={id}
                            onClick={() => setActiveNav(id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                ${active
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                                }`}
                        >
                            <Icon size={16} className={active ? "text-white" : "text-slate-500 group-hover:text-slate-300"} />
                            <span className="flex-1 text-left">{label}</span>
                            {active && <ChevronRight size={14} className="text-indigo-300" />}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700/60 space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                        <User size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-slate-200 text-xs font-semibold truncate">{doctorName}</p>
                        <p className="text-slate-500 text-xs truncate">{specialty} · Active</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors"
                >
                    <LogOut size={13} /> Sign Out
                </button>
            </div>
        </aside>
    );
}

// ─── Placeholder pages ────────────────────────────────────────────────────────
function ComingSoon({ title }) {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Settings size={26} className="text-slate-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-600">{title}</h2>
            <p className="text-sm text-slate-400 mt-1">This section is under development</p>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function SafePulseDashboard() {
    const [activeNav, setActiveNav] = useState("dashboard");
    const { user } = useAuth();

    const headerTitle = {
        dashboard: "Dashboard Overview",
        results: "Diagnostic Results & Explainable AI",
        history: "Patient History",
        settings: "Settings",
    }[activeNav] ?? "SafePulse AI";

    const headerSub = {
        dashboard: "New patient entry and recent diagnosis history",
        results: "XAI trace logs and Doctor ChatBot for clinical reasoning",
        history: "All historical patient records",
        settings: "System configuration",
    }[activeNav] ?? "";

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

            <div className="ml-64 flex-1 flex flex-col min-h-screen max-w-[calc(100vw-16rem)] overflow-hidden">
                {/* Top Header */}
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm shrink-0">
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 leading-none">{headerTitle}</h1>
                        <p className="text-xs text-slate-500 mt-0.5">{headerSub}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-full px-4 py-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <User size={11} className="text-white" />
                            </div>
                            <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                                {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Doctor"}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Body */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeNav}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {activeNav === "dashboard" && <DashboardHome onPatientDiagnosed={() => setActiveNav("results")} />}
                            {activeNav === "results" && <DiagnosticResultsPage />}
                            {activeNav === "history" && <PatientHistoryPage onPatientSelect={() => setActiveNav("results")} />}
                            {activeNav === "settings" && <ComingSoon title="Settings" />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
