import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, ChevronRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DoctorChatBot({ patient }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    // Initialize welcome message when patient changes
    useEffect(() => {
        if (patient) {
            const diseaseName = patient.prediction?.disease?.name || "a condition";
            setMessages([
                {
                    id: 1,
                    role: "assistant",
                    text: `Hello Doctor. I've analyzed the clinical data for ${patient.name || "this patient"}. The primary predicted diagnosis is **${diseaseName}**. How can I help you interpret these XAI results?`,
                    timestamp: new Date()
                }
            ]);
        }
    }, [patient]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = (text = input) => {
        if (!text.trim()) return;

        // Add user message
        const newMsg = { id: Date.now(), role: "user", text, timestamp: new Date() };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            let aiResponse = "";
            const lower = text.toLowerCase();
            const disease = patient?.prediction?.disease?.name || "the diagnosis";
            const confidence = patient?.prediction?.confidence || 0;

            if (lower.includes("why") || lower.includes("explain")) {
                const symptomsMsg = Object.keys(patient?.symptoms || {}).filter(k => patient.symptoms[k]).join(", ");
                aiResponse = `The prediction of **${disease}** (${confidence}% confidence) is primarily driven by the observed symptoms: *${symptomsMsg || "none selected"}*. The model assigned high feature weights to these indicators based on the training dataset.`;
            } else if (lower.includes("alternative") || lower.includes("other")) {
                const alts = patient?.prediction?.alternates || [];
                if (alts.length > 0) {
                    aiResponse = `Top differential diagnoses considered are:\n1. **${alts[0].disease?.name}** (${alts[0].confidence}%)\n2. **${alts[1]?.disease?.name}** (${alts[1]?.confidence}%)\n\nThe absence of certain key markers ruled these out as the primary.`;
                } else {
                    aiResponse = "There are no strong alternative differentials that passed the confidence threshold.";
                }
            } else {
                aiResponse = `I can provide deeper traces on feature importance, counterfactuals, or similar patient clusters for **${disease}**. What specific aspect of the XAI model would you like to explore?`;
            }

            setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: aiResponse, timestamp: new Date() }]);
            setIsTyping(false);
        }, 1200);
    };

    const suggestions = [
        "Explain this diagnosis",
        "Show alternative diagnoses",
        "What are the key feature weights?"
    ];

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Bot size={18} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">XAI Assistant</h3>
                        <p className="text-xs text-slate-500">Ask about model reasoning</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Online</span>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
                <AnimatePresence>
                    {messages.map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 max-w-[90%] ${m.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                        >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-indigo-600" : "bg-gradient-to-br from-indigo-400 to-purple-500"}`}>
                                {m.role === "user" ? <User size={14} className="text-white" /> : <Sparkles size={14} className="text-white" />}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm ${m.role === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-white border text-slate-700 border-slate-200 shadow-sm rounded-tl-sm whitespace-pre-wrap"}`}>
                                {/* Basic markdown bold parser */}
                                {m.text.split(/\\*(.*?)\\*/g).map((part, i) => i % 2 !== 0 ? <strong key={i}>{part}</strong> : part)}
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[80%]">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0">
                                <Bot size={14} className="text-white" />
                            </div>
                            <div className="p-4 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Suggested Chips */}
            {messages.length < 3 && !isTyping && (
                <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 bg-white">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(s)}
                            className="whitespace-nowrap px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100 transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="relative flex items-center"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask AI about this diagnosis..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
                    >
                        <Send size={14} className="ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
