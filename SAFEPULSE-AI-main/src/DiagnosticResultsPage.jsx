import { motion } from "framer-motion";
import { Network, ZoomIn, ZoomOut, Move, Shield, AlertCircle, Circle, Dna, Activity, Brain } from "lucide-react";
import { usePatients } from "./PatientContext";
import DoctorChatBot from "./DoctorChatBot";

// ─── Neo4j Graph SVG ─────────────────────────────────────────────────────────
function Neo4jGraphSVG({ predictionResult }) {
    const disease = predictionResult?.disease;
    const diseaseName = disease?.name ?? "Rare Disease";
    const diseaseColor = disease?.color ?? "#dc2626";

    const nodes = [
        { id: "A", x: 120, y: 60, r: 24, color: "#7c3aed", label: "CFTR Mutation", sub: "VCF Variant", ring: "#a78bfa" },
        { id: "B", x: 440, y: 60, r: 22, color: "#2563eb", label: "Seizures", sub: "Symptom", ring: "#60a5fa" },
        { id: "C", x: 460, y: 200, r: 22, color: "#2563eb", label: "Motor Skills", sub: "Delayed", ring: "#60a5fa" },
        { id: "D", x: 100, y: 200, r: 22, color: "#2563eb", label: "Fatigue", sub: "Symptom", ring: "#60a5fa" },
        { id: "E", x: 500, y: 130, r: 22, color: "#0891b2", label: "Cough", sub: "Symptom", ring: "#22d3ee" },
        { id: "F", x: 280, y: 130, r: 42, color: diseaseColor, label: diseaseName, sub: "PREDICTED", ring: "#f87171", center: true },
        { id: "G", x: 280, y: 230, r: 18, color: "#7c3aed", label: "HEXA Gene", sub: "Marker", ring: "#a78bfa" },
    ];
    const edges = [
        { from: "A", to: "F", label: "HAS_MUTATION" }, { from: "B", to: "F", label: "PRESENTS_WITH" },
        { from: "C", to: "F", label: "PRESENTS_WITH" }, { from: "D", to: "F", label: "PRESENTS_WITH" },
        { from: "E", to: "F", label: "PRESENTS_WITH" }, { from: "G", to: "A", label: "LOCATED_IN" },
        { from: "G", to: "F", label: "ASSOCIATED_WITH" },
    ];
    const getNode = (id) => nodes.find(n => n.id === id);

    return (
        <div className="relative w-full h-[340px] bg-slate-900 rounded-xl overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="#94a3b8" strokeWidth="0.5" /></pattern></defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <svg viewBox="0 0 560 260" className="absolute inset-0 w-full h-full">
                <defs>
                    <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    <filter id="glow-center"><feGaussianBlur stdDeviation="5" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                {edges.map((e, i) => {
                    const from = getNode(e.from); const to = getNode(e.to);
                    const mx = (from.x + to.x) / 2; const my = (from.y + to.y) / 2 - 18;
                    const isToCenter = e.to === "F" || e.from === "F";
                    return (
                        <g key={i}>
                            <path d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`} fill="none"
                                stroke={isToCenter ? "#f87171" : "#4f46e5"} strokeWidth={isToCenter ? "1.5" : "1"}
                                strokeOpacity="0.55" strokeDasharray={isToCenter ? "none" : "4 3"} />
                            <text x={mx} y={my - 4} textAnchor="middle" fontSize="5.5" fill="#94a3b8" fontFamily="Inter, sans-serif" fontWeight="500">{e.label}</text>
                        </g>
                    );
                })}
                {nodes.map((n) => {
                    const isLong = n.label.length > 12;
                    const labelSize = n.center ? (isLong ? "5" : "7") : (isLong ? "4.5" : "6");
                    return (
                        <g key={n.id} filter={n.center ? "url(#glow-center)" : "url(#glow)"}>
                            <circle cx={n.x} cy={n.y} r={n.r + 6} fill="none" stroke={n.ring} strokeWidth="1" strokeOpacity="0.25" />
                            <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} fillOpacity="0.9" />
                            <text x={n.x} y={n.y - (n.center ? 3 : 2)} textAnchor="middle" fontSize={labelSize} fill="white" fontFamily="Inter, sans-serif" fontWeight="700">{n.label}</text>
                            <text x={n.x} y={n.y + (n.center ? 7 : 6)} textAnchor="middle" fontSize={n.center ? "5" : "4.5"} fill={n.ring} fontFamily="Inter, sans-serif" fontWeight="500">{n.sub}</text>
                        </g>
                    );
                })}
            </svg>
            <div className="absolute bottom-3 left-3 flex gap-3">
                {[{ color: "bg-purple-600", label: "Genomic" }, { color: "bg-blue-600", label: "Symptom" }, { color: "bg-red-600", label: "Predicted" }].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${l.color}`} /><span className="text-slate-400 text-xs">{l.label}</span>
                    </div>
                ))}
            </div>
            <div className="absolute top-3 right-3 flex gap-1.5">
                {[ZoomIn, ZoomOut, Move].map((Icon, i) => (
                    <button key={i} className="w-7 h-7 bg-slate-700/80 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors border border-slate-600/50"><Icon size={12} className="text-slate-300" /></button>
                ))}
            </div>
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 px-2.5 py-1.5 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 text-xs font-medium">Neo4j Live</span>
            </div>
        </div>
    );
}

// ─── Confidence Gauge ─────────────────────────────────────────────────────────
function ConfidenceGauge({ predictionResult }) {
    const value = predictionResult?.confidence ?? 0;
    const disease = predictionResult?.disease;
    const alternates = predictionResult?.alternates ?? [];
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - value / 100);

    const bars = [
        { label: disease?.name ?? "—", pct: value, color: "bg-indigo-500" },
        { label: alternates[0]?.name ?? "—", pct: alternates[0]?.confidence ?? 0, color: "bg-blue-400" },
        { label: alternates[1]?.name ?? "—", pct: alternates[1]?.confidence ?? 0, color: "bg-slate-300" },
    ];

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative w-36 h-36">
                <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                    <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
                    <circle cx="70" cy="70" r={radius} fill="none" stroke="url(#gaugeGrad)" strokeWidth="10"
                        strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 1.2s ease" }} />
                    <defs>
                        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-800 leading-none">{value}%</span>
                    <span className="text-xs text-slate-500 font-medium mt-0.5">Match</span>
                </div>
            </div>
            <div className="text-center">
                <p className="text-sm font-bold text-slate-800">{disease?.name ?? "No prediction yet"}</p>
                {value >= 75
                    ? <span className="inline-flex items-center gap-1.5 mt-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200"><Shield size={10} /> High Confidence</span>
                    : value >= 55
                        ? <span className="inline-flex items-center gap-1.5 mt-1 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200"><AlertCircle size={10} /> Moderate</span>
                        : <span className="inline-flex items-center gap-1.5 mt-1 bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200"><Circle size={10} /> Low Confidence</span>
                }
            </div>
            <div className="w-full space-y-1.5">
                {bars.map(d => (
                    <div key={d.label} className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-28 shrink-0 truncate">{d.label}</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.pct}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-slate-600 w-8 text-right">{d.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Diagnostic Timeline ──────────────────────────────────────────────────────
function DiagnosticTimeline({ predictionResult }) {
    const disease = predictionResult?.disease;
    const steps = [
        { icon: Dna, label: "Genomic Match", detail: "VCF analysis indicates pathogenic variant. Genomic marker confirmed.", color: "text-purple-600", bg: "bg-purple-50", ring: "ring-purple-200" },
        { icon: Activity, label: "Symptom Correlation", detail: `Patient's symptom profile aligns with ${disease?.name ?? "predicted disease"} clinical indicators.`, color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-200" },
        { icon: Network, label: "Graph Traversal", detail: "Neo4j traversal found matching paths linking nodes to disease entity.", color: "text-cyan-600", bg: "bg-cyan-50", ring: "ring-cyan-200" },
        { icon: Brain, label: "Conclusion", detail: `High probability of ${disease?.name ?? "rare disease"}. Recommend specialist referral.`, color: "text-indigo-600", bg: "bg-indigo-50", ring: "ring-indigo-200" },
    ];
    return (
        <div className="space-y-3">
            {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                    <div key={i} className="flex gap-3 items-start">
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-lg ${step.bg} ring-1 ${step.ring} flex items-center justify-center shrink-0`}>
                                <Icon size={15} className={step.color} />
                            </div>
                            {i < steps.length - 1 && <div className="w-px h-full mt-1.5 bg-slate-200 min-h-[20px]" />}
                        </div>
                        <div className="pb-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {i + 1}</span>
                            <p className="text-sm font-semibold text-slate-800 mt-0.5">{step.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.detail}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


export default function DiagnosticResultsPage() {
    const { activePatient } = usePatients();

    if (!activePatient || !activePatient.prediction) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center h-full">
                <div className="w-16 h-16 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center mb-4">
                    <AlertCircle size={28} className="text-slate-400" />
                </div>
                <h2 className="text-lg font-bold text-slate-600">No Active Diagnosis</h2>
                <p className="text-sm text-slate-400 mt-1">Please enter a new patient to view diagnostic results.</p>
            </div>
        );
    }

    const predictionResult = activePatient.prediction;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-120px)]">
            {/* Left Col: XAI Trace & Results */}
            <div className="lg:col-span-8 flex flex-col gap-4 h-full overflow-y-auto pr-2 no-scrollbar">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Diagnostic Results & XAI Analysis</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Clinical Decision Support for {activePatient.name || "Patient"}</p>
                </div>

                {/* Graph */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden shrink-0">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center"><Network size={14} className="text-slate-600" /></div>
                        <div>
                            <p className="text-slate-800 font-semibold text-sm">Biological Knowledge Graph (Neo4j)</p>
                            <p className="text-xs text-slate-400">Mapping genomic markers & symptoms to rare diseases</p>
                        </div>
                    </div>
                    <div className="p-4">
                        <Neo4jGraphSVG predictionResult={predictionResult} />
                    </div>
                </div>

                {/* Confidence + Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 shrink-0">
                    <div className="sm:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col items-center justify-center gap-2">
                        <p className="uppercase text-xs font-semibold tracking-wider text-slate-500">Confidence Score</p>
                        <ConfidenceGauge predictionResult={predictionResult} />
                    </div>
                    <div className="sm:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center"><Activity size={14} className="text-indigo-600" /></div>
                            <div><p className="text-slate-800 font-semibold text-sm">Diagnostic Path</p></div>
                        </div>
                        <DiagnosticTimeline predictionResult={predictionResult} />
                    </div>
                </div>

                {/* AI Summary */}
                <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-xl border border-indigo-100 shadow-sm p-5 shrink-0">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center"><Brain size={14} className="text-indigo-600" /></div>
                        <p className="text-slate-800 font-semibold text-sm">AI Summary</p>
                        <span className="ml-auto text-xs font-semibold text-indigo-500 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">SafePulse AI + Neo4j</span>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-indigo-100">
                        <p className="text-sm text-slate-700 leading-relaxed">
                            Based on the entered clinical data and symptom profile, the AI model predicts a high likelihood of <strong className="text-indigo-700">{predictionResult.disease.name}</strong> (ICD: {predictionResult.disease.icd}).
                            With a <strong className="text-indigo-700">{predictionResult.confidence}% confidence score</strong>, this is the leading differential.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Col: Doctor ChatBot */}
            <div className="lg:col-span-4 h-full pt-12">
                <DoctorChatBot patient={activePatient} />
            </div>
        </div>
    );
}
