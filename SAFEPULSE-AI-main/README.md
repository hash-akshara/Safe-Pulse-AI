# 🛡️ SafepulseAI – Advanced Health Monitoring & AI Diagnostics

SafepulseAI is a modern, AI-powered health dashboard designed to provide real-time monitoring and predictive diagnostics. Built with a focus on visual excellence and patient care, it integrates sophisticated machine learning models with a seamless user experience.

---

## ✨ Key Features

- **🏠 Interactive Dashboard**: Dynamic real-time monitoring of vital health metrics.
- **🤖 AI Diagnostics**: Predictive analysis for rare diseases using custom weight-based models.
- **💬 Doctor Chatbot**: An intelligent assistant to help patients understand symptoms and next steps.
- **📊 Diagnostic Results**: Comprehensive visualization of health data and prediction accuracy.
- **📂 Patient History**: Secure management and retrieval of historical patient records.
- **🔐 Secure Authentication**: Robust user login and profile management powered by Supabase.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend / Auth**: [Supabase](https://supabase.com/)
- **AI/Logic**: Custom JavaScript-based prediction models

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/REX-33/SAFEPULSE-AI.git
cd SAFEPULSE-AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server
```bash
npm run dev
```

---

## 📂 Project Structure

- `src/components/`: Reusable UI components.
- `src/pages/`: Main application views (Dashboard, Login, History).
- `src/logic/`: AI models and prediction algorithms.
- `supabase_schema.sql`: Database structure for Supabase.

---


