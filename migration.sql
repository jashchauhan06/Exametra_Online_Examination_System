-- Add 'subjective' to the question_type enum if it doesn't exist
ALTER TYPE question_type ADD VALUE IF NOT EXISTS 'subjective';

-- Add the new columns for AI Subjective Evaluation
ALTER TABLE questions ADD COLUMN IF NOT EXISTS expected_answer TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS rubric TEXT;

-- Reload PostgREST schema cache so the API recognizes the new columns immediately
NOTIFY pgrst, 'reload schema';
