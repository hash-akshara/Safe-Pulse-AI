// ──────────────────────────────────────────────────────────────────────────────
// Rare Disease Prediction – Decision Tree Rules (Synthetic Dataset Derived)
// Dataset: 500 synthetic patient records covering 8 rare diseases
// Features: age, gender, hr, spo2, height, weight, bmi, symptoms (10 binary)
// ──────────────────────────────────────────────────────────────────────────────

export const DISEASES = [
    { id: 0, name: "Cystic Fibrosis", icd: "E84", color: "#6366f1" },
    { id: 1, name: "Tay-Sachs Disease", icd: "E75.0", color: "#8b5cf6" },
    { id: 2, name: "Wilson's Disease", icd: "E83.0", color: "#0ea5e9" },
    { id: 3, name: "Huntington's Disease", icd: "G10", color: "#f59e0b" },
    { id: 4, name: "Phenylketonuria (PKU)", icd: "E70.0", color: "#10b981" },
    { id: 5, name: "Gaucher's Disease", icd: "E75.2", color: "#ef4444" },
    { id: 6, name: "Marfan Syndrome", icd: "Q87.4", color: "#14b8a6" },
    { id: 7, name: "Pompe Disease", icd: "E74.0", color: "#f97316" },
];

// Symptom indices: 0=Cough, 1=DifficultyBreathing, 2=Fatigue, 3=Fever,
//                  4=Seizures, 5=DelayedMotorSkills, 6=IntellectualDisability,
//                  7=Jaundice, 8=Swelling, 9=DifficultySpea king
export const SYMPTOM_KEYS = [
    "Cough", "Difficulty Breathing", "Fatigue", "Fever",
    "Seizures", "Delayed Motor Skills", "Intellectual Disability",
    "Jaundice", "Swelling", "Difficulty Speaking",
];

// Feature-weight scoring matrix: [disease][feature] = weight contribution
// Each row sums to ~1 for normalized scoring
export const FEATURE_WEIGHTS = {
    // Cystic Fibrosis: respiratory symptoms dominant, low SpO2, young age
    0: {
        symptoms: { 0: 0.22, 1: 0.20, 2: 0.12, 3: 0.06, 4: 0, 5: 0, 6: 0, 7: 0.02, 8: 0.04, 9: 0.04 },
        spo2Low: 0.18,        // SpO2 < 93%
        ageYoung: 0.08,       // age < 30
        hrHigh: 0.04,
    },
    // Tay-Sachs: neurological symptoms, infant/young, intellectual disability
    1: {
        symptoms: { 0: 0, 1: 0.04, 2: 0.06, 3: 0.02, 4: 0.25, 5: 0.24, 6: 0.22, 7: 0, 8: 0, 9: 0.08 },
        spo2Low: 0.02,
        ageYoung: 0.07,
        hrHigh: 0,
    },
    // Wilson's Disease: liver/neurological, jaundice, fatigue, speaking issues
    2: {
        symptoms: { 0: 0.02, 1: 0.04, 2: 0.16, 3: 0.06, 4: 0.08, 5: 0, 6: 0, 7: 0.28, 8: 0.14, 9: 0.12 },
        spo2Low: 0.04,
        ageYoung: 0.06,
        hrHigh: 0,
    },
    // Huntington's Disease: motor/speech, middle age
    3: {
        symptoms: { 0: 0, 1: 0.02, 2: 0.12, 3: 0, 4: 0.14, 5: 0.22, 6: 0.10, 7: 0, 8: 0.02, 9: 0.24 },
        spo2Low: 0.02,
        ageYoung: 0,          // typically older onset
        ageMiddle: 0.12,      // age 30-55
    },
    // PKU: infant, intellectual disability, seizures
    4: {
        symptoms: { 0: 0, 1: 0.02, 2: 0.08, 3: 0.02, 4: 0.20, 5: 0.16, 6: 0.28, 7: 0, 8: 0, 9: 0.10 },
        spo2Low: 0,
        ageYoung: 0.14,
    },
    // Gaucher's Disease: fatigue, swelling, jaundice, bone pain
    5: {
        symptoms: { 0: 0.02, 1: 0.06, 2: 0.20, 3: 0.04, 4: 0, 5: 0.06, 6: 0, 7: 0.18, 8: 0.28, 9: 0 },
        spo2Low: 0.06,
        ageYoung: 0.10,
    },
    // Marfan Syndrome: tall+thin (high BMI deviation), heart rate issues
    6: {
        symptoms: { 0: 0.04, 1: 0.12, 2: 0.10, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0.06, 9: 0 },
        spo2Low: 0.06,
        ageYoung: 0.06,
        hrHigh: 0.10,
        tallThin: 0.46,       // height > 185cm & BMI < 20
    },
    // Pompe Disease: muscle weakness/fatigue, breathing, swelling
    7: {
        symptoms: { 0: 0.04, 1: 0.22, 2: 0.26, 3: 0.02, 4: 0, 5: 0.10, 6: 0, 7: 0.02, 8: 0.16, 9: 0.04 },
        spo2Low: 0.10,
        ageYoung: 0.04,
    },
};
