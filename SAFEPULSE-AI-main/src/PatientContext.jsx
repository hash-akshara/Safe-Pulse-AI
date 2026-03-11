import { createContext, useContext, useState, useEffect } from "react";
import { supabase, IS_DEMO_MODE } from "./supabaseClient";
import { useAuth } from "./AuthContext";

const PatientContext = createContext(null);

export function PatientProvider({ children }) {
    const [patients, setPatients] = useState([]);
    const [activePatient, setActivePatient] = useState(null);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setPatients([]);
            setLoading(false);
            return;
        }

        const fetchPatients = async () => {
            if (IS_DEMO_MODE || !supabase) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('patients')
                    .select('*')
                    .order('timestamp', { ascending: false });

                if (error) throw error;

                const mappedData = (data || []).map(p => ({
                    id: p.id,
                    timestamp: p.timestamp,
                    name: p.name,
                    gender: p.gender,
                    vitals: {
                        age: p.age,
                        hr: p.hr,
                        spo2: p.spo2,
                        height: p.height,
                        weight: p.weight,
                    },
                    bmi: p.bmi,
                    symptoms: p.symptoms,
                    prediction: p.prediction
                }));

                setPatients(mappedData);
            } catch (err) {
                console.error("Error fetching patients:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [user]);

    const addPatient = async (patientData) => {
        const entry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...patientData,
        };

        if (IS_DEMO_MODE || !supabase || !user) {
            setPatients((prev) => [entry, ...prev]);
            return entry;
        }

        try {
            const { data, error } = await supabase
                .from('patients')
                .insert([{
                    user_id: user.id,
                    name: patientData.name,
                    age: patientData.vitals?.age ? parseInt(patientData.vitals.age, 10) : null,
                    gender: patientData.gender,
                    hr: patientData.vitals?.hr ? parseInt(patientData.vitals.hr, 10) : null,
                    spo2: patientData.vitals?.spo2 ? parseInt(patientData.vitals.spo2, 10) : null,
                    height: patientData.vitals?.height ? parseInt(patientData.vitals.height, 10) : null,
                    weight: patientData.vitals?.weight ? parseInt(patientData.vitals.weight, 10) : null,
                    bmi: patientData.bmi ? parseFloat(patientData.bmi) : null,
                    symptoms: patientData.symptoms || {},
                    prediction: patientData.prediction || null
                }])
                .select()
                .single();

            if (error) throw error;

            const newMapped = {
                id: data.id,
                timestamp: data.timestamp,
                name: data.name,
                gender: data.gender,
                vitals: {
                    age: data.age,
                    hr: data.hr,
                    spo2: data.spo2,
                    height: data.height,
                    weight: data.weight,
                },
                bmi: data.bmi,
                symptoms: data.symptoms,
                prediction: data.prediction
            };

            setPatients((prev) => [newMapped, ...prev]);
            return newMapped;
        } catch (err) {
            console.error("Error inserting patient:", err);
            return null;
        }
    };

    const totalPatients = patients.length;
    const predictionsToday = patients.filter((p) => {
        const today = new Date().toDateString();
        return new Date(p.timestamp).toDateString() === today;
    }).length;

    const highConfidence = patients.filter((p) => p.prediction?.confidence >= 75).length;

    return (
        <PatientContext.Provider value={{
            patients, addPatient, totalPatients, predictionsToday, highConfidence,
            activePatient, setActivePatient, loading
        }}>
            {children}
        </PatientContext.Provider>
    );
}

export function usePatients() {
    const ctx = useContext(PatientContext);
    if (!ctx) throw new Error("usePatients must be inside PatientProvider");
    return ctx;
}
