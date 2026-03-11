import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, Activity, AlertCircle, TrendingUp, Clock,
    User, ChevronRight, Zap, Shield, Dna,
    Heart, Droplets, Ruler, Weight, Calculator, ClipboardList, CheckCircle2, Circle
} from "lucide-react";
import { usePatients } from "./PatientContext";
import { predictRareDisease } from "./rareDiseasePrediction";
import { SYMPTOM_KEYS } from "./modelWeights";

function StatCard({ icon: Icon, value, label, color, bg, border }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl border ${border} shadow-sm p-5 flex items-center gap-4`}
        >
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={22} className={color} />
            </div>
            <div>
                <p className="text-2xl font-extrabold text-slate-800 leading-none">{value}</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{label}</p>
            </div>
        </motion.div>
    );
}

function PredictionRow({ patient, index }) {
    const disease = patient.prediction?.disease;
    const confidence = patient.prediction?.confidence ?? 0;
    const date = new Date(patient.timestamp);
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = date.toLocaleDateString([], { month: "short", day: "numeric" });

    const barColor = confidence >= 75 ? "bg-emerald-500" : confidence >= 55 ? "bg-amber-500" : "bg-slate-400";

    return (
        <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="hover:bg-indigo-50/30 transition-colors"
        >
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0">
                        <User size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                        {patient.name || "—"}
                    </span>
                </div>
            </td>
            <td className="px-4 py-3 text-xs text-slate-500">{patient.gender || "—"}</td>
            <td className="px-4 py-3 text-xs text-slate-500">{patient.vitals?.age ? `${patient.vitals.age} yr` : "—"}</td>
            <td className="px-4 py-3">
                {disease ? (
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                        {disease.name}
                    </span>
                ) : (
                    <span className="text-xs text-slate-400">—</span>
                )}
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[60px] overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${confidence}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{confidence}%</span>
                </div>
            </td>
            <td className="px-4 py-3 text-xs text-slate-500 text-right">{dateStr} · {timeStr}</td>
        </motion.tr>
    );
}

// ─── Input primitives ─────────────────────────────────────────────────────────
function Label({ children }) {
    return <p className="uppercase text-xs font-semibold tracking-wider text-slate-500 mb-1.5">{children}</p>;
}

function InputField({ icon: Icon, placeholder, type = "text", value, onChange, rightLabel }) {
    return (
        <div className="relative">
            {Icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon size={14} /></span>}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all
        ${Icon ? "pl-9" : "pl-3"} ${rightLabel ? "pr-14" : "pr-3"}`}
            />
            {rightLabel && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 uppercase">{rightLabel}</span>
            )}
        </div>
    );
}

function SectionCard({ title, badge, icon: Icon, children }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                {Icon && <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center"><Icon size={14} className="text-indigo-600" /></div>}
                <p className="text-slate-800 font-semibold text-sm">{title}</p>
                {badge && <span className="ml-auto bg-slate-100 text-slate-500 text-xs font-semibold px-2.5 py-1 rounded-full">{badge}</span>}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function SymptomToggle({ label, checked, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 border
      ${checked ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/40"}`}
        >
            {checked ? <CheckCircle2 size={13} className="text-indigo-500 shrink-0" /> : <Circle size={13} className="text-slate-300 shrink-0" />}
            {label}
        </button>
    );
}


export default function DashboardHome({ onPatientDiagnosed }) {
    const { patients, totalPatients, predictionsToday, highConfidence, addPatient, setActivePatient } = usePatients();

    // Patient Entry State
    const [symptoms, setSymptoms] = useState({});
    const [vitals, setVitals] = useState({ age: "", hr: "", spo2: "", height: "", weight: "" });
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);

    const bmi = useMemo(() => {
        const h = parseFloat(vitals.height) / 100;
        const w = parseFloat(vitals.weight);
        if (h > 0 && w > 0) return (w / (h * h)).toFixed(1);
        return "—";
    }, [vitals.height, vitals.weight]);

    const toggleSymptom = (s) => setSymptoms((prev) => ({ ...prev, [s]: !prev[s] }));
    const handleVital = (key) => (e) => setVitals((prev) => ({ ...prev, [key]: e.target.value }));
    const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setUploadedFile(f.name); };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const runDiagnostic = async () => {
        setIsSubmitting(true);
        setSubmitError("");
        // 1. Run inference
        const result = predictRareDisease({ ...vitals, bmi, symptoms });

        // 2. Save patient array
        const newPatient = await addPatient({ name, gender, vitals, symptoms, bmi, uploadedFile, prediction: result });

        if (newPatient) {
            // 3. Mark as active
            setActivePatient(newPatient);

            // 4. Trigger navigation callback passed from SafePulseDashboard
            onPatientDiagnosed();
        } else {
            setSubmitError("Failed to save patient. Make sure your Supabase keys are correct and the patients table exists.");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h2 className="text-xl font-bold text-slate-800">Overview</h2>
                <p className="text-sm text-slate-500 mt-0.5">Welcome back, Doctor — here's today's summary</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={Users} value={totalPatients} label="Total Patients" color="text-indigo-600" bg="bg-indigo-50" border="border-indigo-100" />
                <StatCard icon={Activity} value={predictionsToday} label="Predictions Today" color="text-blue-600" bg="bg-blue-50" border="border-blue-100" />
                <StatCard icon={Shield} value={highConfidence} label="High Confidence Alerts" color="text-emerald-600" bg="bg-emerald-50" border="border-emerald-100" />
            </div>

            {/* Spacer */}
            <hr className="border-slate-200" />

            <div>
                <h2 className="text-lg font-bold text-slate-800">New Patient Entry</h2>
                <p className="text-sm text-slate-500 mt-0.5">Fill in details for immediate diagnostic prediction</p>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                {/* Col 1: Demographics & Vitals */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <SectionCard title="Demographics & Vitals" icon={User}>
                        <div className="space-y-4">
                            <div><Label>Full Name</Label><InputField icon={User} placeholder="e.g. Jane Doe" value={name} onChange={e => setName(e.target.value)} /></div>
                            <div>
                                <Label>Gender</Label>
                                <select value={gender} onChange={e => setGender(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all">
                                    <option value="">Select gender...</option>
                                    <option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option>
                                </select>
                            </div>
                            {/* Vitals Grid */}
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                {[
                                    { key: "age", label: "Age", icon: User, unit: "YR" },
                                    { key: "hr", label: "Heart Rate", icon: Heart, unit: "BPM" },
                                    { key: "spo2", label: "SpO2", icon: Droplets, unit: "%" },
                                    { key: "height", label: "Height", icon: Ruler, unit: "CM" },
                                    { key: "weight", label: "Weight", icon: Weight, unit: "KG" },
                                ].map(({ key, label, icon, unit }) => (
                                    <div key={key}><Label>{label}</Label><InputField icon={icon} placeholder="—" type="number" value={vitals[key]} onChange={handleVital(key)} rightLabel={unit} /></div>
                                ))}
                                <div>
                                    <Label>BMI</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Calculator size={14} /></span>
                                        <div className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm font-bold text-indigo-600">{bmi}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SectionCard>
                </div>

                {/* Col 2: Symptoms */}
                <div className="lg:col-span-1">
                    <SectionCard title="Observed Symptoms" icon={ClipboardList} badge={`${Object.values(symptoms).filter(Boolean).length} Selected`}>
                        <div className="grid grid-cols-1 gap-2">
                            {SYMPTOM_KEYS.map(s => <SymptomToggle key={s} label={s} checked={!!symptoms[s]} onToggle={() => toggleSymptom(s)} />)}
                        </div>
                    </SectionCard>
                </div>

                {/* Col 3: Genomic & Submit */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <SectionCard title="Genomic Sequencing" icon={Dna}>
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer h-full min-h-[160px]
                ${dragOver ? "border-indigo-500 bg-indigo-100/50" : uploadedFile ? "border-emerald-400 bg-emerald-50" : "border-indigo-300 bg-indigo-50/50 hover:border-indigo-400 hover:bg-indigo-50"}`}
                            onClick={() => document.getElementById("vcf-input").click()}
                        >
                            <input id="vcf-input" type="file" className="hidden" accept=".vcf,.fastq,.gz"
                                onChange={e => setUploadedFile(e.target.files[0]?.name)} />
                            {uploadedFile ? (
                                <><CheckCircle2 size={32} className="text-emerald-500 mb-2" />
                                    <p className="text-sm font-semibold text-emerald-700 truncate max-w-full px-4">{uploadedFile}</p>
                                    <p className="text-xs text-emerald-600 mt-1">File ready for analysis</p></>
                            ) : (
                                <><div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center mb-3"><Dna size={22} className="text-indigo-500" /></div>
                                    <p className="text-sm font-semibold text-slate-700">Upload VCF / FASTQ</p>
                                    <p className="text-xs text-slate-400 mt-1">Drag & drop or click to browse</p>
                                    <p className="text-xs text-indigo-400 mt-2 font-medium">Supports .vcf, .fastq, .gz</p></>
                            )}
                        </div>
                    </SectionCard>

                    {submitError && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 flex items-start gap-2">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{submitError}</span>
                        </div>
                    )}

                    <motion.button
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={runDiagnostic}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-base shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-shadow flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isSubmitting ? "Processing..." : <><Zap size={18} /> Run XAI Diagnostic <ChevronRight size={18} /></>}
                    </motion.button>
                </div>

            </div>

            <hr className="border-slate-200 my-2" />

            {/* Recently Predicted Table */}
            <div>
                <h2 className="text-lg font-bold text-slate-800">All Predictions</h2>
                <p className="text-sm text-slate-500 mt-0.5">Patient history and diagnostic results</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                        <TrendingUp size={14} className="text-slate-600" />
                    </div>
                    <p className="text-slate-800 font-semibold text-sm">Recent Queries</p>
                    <span className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock size={11} /> Most recent first
                    </span>
                </div>

                {patients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertCircle size={28} className="text-slate-300 mb-3" />
                        <p className="text-sm text-slate-400">No predictions yet — run your first diagnostic above</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    {["Patient", "Gender", "Age", "Predicted Disease", "Confidence", "Time"].map((h) => (
                                        <th key={h} className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {patients.map((p, i) => <PredictionRow key={p.id} patient={p} index={i} />)}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
