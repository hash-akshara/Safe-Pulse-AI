// ─────────────────────────────────────────────────────────────────────────────
// Rare Disease Prediction Engine – Browser (no external API needed)
// Uses weighted feature scoring from modelWeights.js
// ─────────────────────────────────────────────────────────────────────────────
import { DISEASES, FEATURE_WEIGHTS, SYMPTOM_KEYS } from "./modelWeights.js";

/**
 * Predict rare disease from patient data.
 * @param {Object} input - { age, gender, hr, spo2, height, weight, bmi, symptoms }
 *   symptoms: object like { "Cough": true, "Fatigue": true, ... }
 * @returns {{ disease: Object, confidence: number, alternates: Array }}
 */
export function predictRareDisease(input) {
    const { age, hr, spo2, height, bmi, symptoms } = input;

    const scores = DISEASES.map((disease) => {
        const weights = FEATURE_WEIGHTS[disease.id];
        let score = 0;

        // Symptom contributions
        SYMPTOM_KEYS.forEach((sym, idx) => {
            if (symptoms[sym]) {
                score += weights.symptoms?.[idx] ?? 0;
            }
        });

        // Vitals bonuses
        if (parseFloat(spo2) > 0 && parseFloat(spo2) < 93) {
            score += weights.spo2Low ?? 0;
        }
        if (parseFloat(age) > 0 && parseFloat(age) < 30) {
            score += weights.ageYoung ?? 0;
        }
        if (parseFloat(age) >= 30 && parseFloat(age) <= 55) {
            score += weights.ageMiddle ?? 0;
        }
        if (parseFloat(hr) > 100) {
            score += weights.hrHigh ?? 0;
        }
        // Marfan: tall + thin
        if (parseFloat(height) > 185 && parseFloat(bmi) > 0 && parseFloat(bmi) < 20) {
            score += weights.tallThin ?? 0;
        }

        return { disease, score };
    });

    // Sort descending
    scores.sort((a, b) => b.score - a.score);

    // Normalizing confidence score
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

    // Low / No confidence fallback
    if (totalScore === 0) {
        return {
            disease: { name: "Insufficient Data", icd: "N/A", color: "#64748b" },
            confidence: 0,
            alternates: []
        };
    }

    const ranked = scores.map((s) => ({
        disease: s.disease,
        score: s.score,
        basePct: (s.score / totalScore) * 100,
    }));

    // Non-linear scaling: boosts top match significantly if signals are clear,
    // but without hard-clamping to a baseline of 50%.
    const topRaw = ranked[0].basePct;
    const adjustedTop = Math.min(98, Math.round(topRaw * 1.5 + 10));

    return {
        disease: ranked[0].disease,
        confidence: adjustedTop,
        alternates: [
            { ...ranked[1].disease, confidence: Math.round(ranked[1].basePct * 0.8) },
            { ...ranked[2].disease, confidence: Math.round(ranked[2].basePct * 0.8) },
        ],
    };
}
