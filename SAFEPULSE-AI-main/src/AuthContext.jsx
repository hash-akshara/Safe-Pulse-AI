import { createContext, useContext, useState, useEffect } from "react";
import { supabase, IS_DEMO_MODE } from "./supabaseClient";

const AuthContext = createContext(null);

// Demo user for when Supabase is not configured
const DEMO_DOCTOR = {
    id: "demo-user",
    email: "doctor@safepulse.ai",
    user_metadata: { full_name: "Dr. Sarah Chen", specialty: "Neurologist" },
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        if (IS_DEMO_MODE) {
            // Check localStorage for demo session
            const savedUser = localStorage.getItem("safepulse_demo_user");
            if (savedUser) setUser(JSON.parse(savedUser));
            setLoading(false);
            return;
        }

        // Real Supabase auth
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        setAuthError(null);
        setEmailSent(false);

        if (IS_DEMO_MODE) {
            // Demo mode: accept any credentials or specific demo ones
            if (email && password.length >= 6) {
                const demoUser = { ...DEMO_DOCTOR, email };
                localStorage.setItem("safepulse_demo_user", JSON.stringify(demoUser));
                setUser(demoUser);
                return { success: true };
            } else {
                setAuthError("Password must be at least 6 characters.");
                return { success: false };
            }
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setAuthError(error.message);
            return { success: false };
        }
        setUser(data.user);
        return { success: true };
    };

    const signUp = async (email, password, fullName) => {
        setAuthError(null);
        setEmailSent(false);

        if (IS_DEMO_MODE) {
            setEmailSent(true);
            return { success: true };
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName, specialty: "General Practitioner" } },
        });
        if (error) {
            setAuthError(error.message);
            return { success: false };
        }
        setEmailSent(true);
        return { success: true };
    };

    const logout = async () => {
        if (IS_DEMO_MODE) {
            localStorage.removeItem("safepulse_demo_user");
            setUser(null);
            return;
        }
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, authError, emailSent, login, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
}
