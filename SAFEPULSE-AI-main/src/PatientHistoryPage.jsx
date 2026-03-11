import { motion } from "framer-motion";
import { usePatients } from "./PatientContext";
import { Users, User, Clock, ChevronRight, Activity, Search, Filter } from "lucide-react";

export default function PatientHistoryPage({ onPatientSelect }) {
    const { patients, setActivePatient } = usePatients();

    const handleViewPatient = (patient) => {
        setActivePatient(patient);
        if (onPatientSelect) onPatientSelect();
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Historical Records</h2>
                    <p className="text-sm text-slate-500 mt-0.5">View and analyze all past patient predictions</p>
                </div>

                {/* Search & Filter bar */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full sm:w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <Filter size={14} />
                        <span className="hidden sm:inline">Filter</span>
                    </button>
                </div>
            </div>

            {/* List/Table content */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Users size={14} className="text-indigo-600" />
                    </div>
                    <p className="text-slate-800 font-semibold text-sm">All Diagnosed Patients ({patients.length})</p>
                </div>

                {patients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 text-center p-8">
                        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                            <Clock size={24} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No Patient History</h3>
                        <p className="text-sm text-slate-500 mt-1 max-w-sm">
                            You haven't run any diagnostics yet. Navigate to the Dashboard to enter a new patient.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto flex-1 h-full">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Patient</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Vitals</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Symptoms</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Prediction</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Confidence</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {patients.map((patient, index) => {
                                    const vitals = patient.vitals || {};
                                    const symptoms = patient.symptoms || {};
                                    const symptomList = Object.entries(symptoms)
                                        .filter(([_, value]) => value === true)
                                        .map(([key]) => key);

                                    const disease = patient.prediction?.disease;
                                    const confidence = patient.prediction?.confidence ?? 0;
                                    const date = new Date(patient.timestamp);

                                    const barColor = confidence >= 75 ? "bg-emerald-500" : confidence >= 55 ? "bg-amber-500" : "bg-slate-400";

                                    return (
                                        <motion.tr
                                            key={patient.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03, duration: 0.2 }}
                                            className="hover:bg-slate-50/80 transition-colors group"
                                        >
                                            {/* Name / Demographics */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shrink-0 border border-white shadow-sm">
                                                        <User size={14} className="text-slate-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{patient.name || "Unknown Patient"}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">{vitals.age ? `${vitals.age} yrs` : "--"} • {patient.gender || "--"}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Vitals */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3 text-xs">
                                                    {vitals.hr && (
                                                        <div className="flex flex-col items-center" title="Heart Rate">
                                                            <span className="text-slate-400 font-medium">HR</span>
                                                            <span className="font-semibold text-slate-700">{vitals.hr}</span>
                                                        </div>
                                                    )}
                                                    {vitals.spo2 && (
                                                        <div className="flex flex-col items-center" title="SpO2">
                                                            <span className="text-slate-400 font-medium">SpO2</span>
                                                            <span className="font-semibold text-slate-700">{vitals.spo2}%</span>
                                                        </div>
                                                    )}
                                                    {patient.bmi && (
                                                        <div className="flex flex-col items-center" title="BMI">
                                                            <span className="text-slate-400 font-medium">BMI</span>
                                                            <span className="font-semibold text-slate-700">{patient.bmi}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Symptoms */}
                                            <td className="px-5 py-4">
                                                <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                    {symptomList.length > 0 ? (
                                                        symptomList.slice(0, 2).map((s, i) => (
                                                            <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 whitespace-nowrap">
                                                                {s}
                                                            </span>
                                                        ))
                                                    ) : <span className="text-xs text-slate-400">None marked</span>}
                                                    {symptomList.length > 2 && (
                                                        <span className="text-[10px] font-semibold bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded-md border border-slate-200">
                                                            +{symptomList.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Prediction */}
                                            <td className="px-5 py-4">
                                                {disease ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold whitespace-nowrap">
                                                        <Activity size={10} />
                                                        {disease.name}
                                                    </span>
                                                ) : <span className="text-xs text-slate-400">—</span>}
                                            </td>

                                            {/* Confidence */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2 max-w-[100px]">
                                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${confidence}%` }} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700 w-8">{confidence}%</span>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <p className="text-xs font-semibold text-slate-700">{date.toLocaleDateString()}</p>
                                                <p className="text-[10px] font-medium text-slate-400 mt-0.5">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => handleViewPatient(patient)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-indigo-600 text-xs font-semibold hover:bg-indigo-50 hover:border-indigo-200 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    View XAI <ChevronRight size={12} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
