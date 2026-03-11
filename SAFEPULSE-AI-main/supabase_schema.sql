-- Run this in your Supabase SQL Editor to create the patients table

CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    -- Demographics & Vitals
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    hr INTEGER,
    spo2 INTEGER,
    height INTEGER,
    weight INTEGER,
    bmi NUMERIC,
    
    -- Symptoms JSON (e.g. {"Cough": true, "Fatigue": true})
    symptoms JSONB DEFAULT '{}'::jsonb,
    
    -- Prediction Results JSON
    prediction JSONB
);

-- Turn on Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Allow users to only see and insert their own patients
CREATE POLICY "Users can view their own patients" 
ON public.patients FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patients" 
ON public.patients FOR INSERT 
WITH CHECK (auth.uid() = user_id);
