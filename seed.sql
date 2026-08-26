-- ==========================================================================================
-- CORRECTED SEED DATA FOR ONLINE EXAM SYSTEM
-- Supabase
-- ==========================================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

BEGIN;

-- ==========================================================================================
-- 1. CREATE MOCK USERS IN SUPABASE AUTH
-- ==========================================================================================
-- IMPORTANT:
-- public.users.id references auth.users.id.
-- Therefore auth.users must exist FIRST.

INSERT INTO auth.users (
    instance_id,
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    role,
    aud,
    created_at,
    updated_at
)
VALUES

-- Students
(
    '00000000-0000-0000-0000-000000000000',
    '92694f9d-0000-0000-0000-000000000000',
    'aarav.sharma@sit.edu.in',
    crypt('password123', gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Aarav Sharma"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
),

(
    '00000000-0000-0000-0000-000000000000',
    '92694f9e-0000-0000-0000-000000000000',
    'priya.patel@sit.edu.in',
    crypt('password123', gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Priya Patel"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
),

(
    '00000000-0000-0000-0000-000000000000',
    '92694f9f-0000-0000-0000-000000000000',
    'rohan.kumar@sit.edu.in',
    crypt('password123', gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Rohan Kumar"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
),

(
    '00000000-0000-0000-0000-000000000000',
    '92694fa0-0000-0000-0000-000000000000',
    'ananya.gupta@sit.edu.in',
    crypt('password123', gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Ananya Gupta"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
),

(
    '00000000-0000-0000-0000-000000000000',
    '92694fa1-0000-0000-0000-000000000000',
    'vikram.singh@sit.edu.in',
    crypt('password123', gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Vikram Singh"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
),

(
    '00000000-0000-0000-0000-000000000000',
    '92694fa2-0000-0000-0000-000000000000',
    'meera.reddy@sit.edu.in',
    crypt('password123', gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Meera Reddy"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
),

(
    '00000000-0000-0000-0000-000000000000',
    '92694fa3-0000-0000-0000-000000000000',
    'arjun.nair@sit.edu.in',
    crypt('password123', gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Arjun Nair"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
),

(
    '00000000-0000-0000-0000-000000000000',
    '92694fa4-0000-0000-0000-000000000000',
    'kavya.joshi@sit.edu.in',
    crypt('password123', gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Kavya Joshi"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
),

-- Faculty
(
    '00000000-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000',
    'priya.mehta@sit.edu.in',
    crypt('password123', gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Dr. Priya Mehta"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
),

(
    '00000000-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000',
    'rajesh.kumar@sit.edu.in',
    crypt('password123', gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Prof. Rajesh Kumar"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
),

(
    '00000000-0000-0000-0000-000000000000',
    '7b26624b-0000-0000-0000-000000000000',
    'sunita.verma@sit.edu.in',
    crypt('password123', gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Dr. Sunita Verma"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
),

-- Admin
(
    '00000000-0000-0000-0000-000000000000',
    '72ccf967-0000-0000-0000-000000000000',
    'admin@sit.edu.in',
    crypt('password123', gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"System Administrator"}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
)

ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at;

-- Create identity records so GoTrue can authenticate these users
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT
    u.id,
    u.id,
    jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true, 'phone_verified', false),
    'email',
    u.email,
    NOW(),
    NOW(),
    NOW()
FROM auth.users u
WHERE u.email LIKE '%@sit.edu.in'
  AND NOT EXISTS (
    SELECT 1 FROM auth.identities i WHERE i.user_id = u.id AND i.provider = 'email'
  );


-- ==========================================================================================
-- 2. PUBLIC USERS / PROFILES
-- ==========================================================================================

INSERT INTO public.users (
    id,
    email,
    name,
    role,
    department,
    is_active,
    student_id,
    semester,
    faculty_id,
    designation
)
VALUES

-- Students
(
    '92694f9d-0000-0000-0000-000000000000',
    'aarav.sharma@sit.edu.in',
    'Aarav Sharma',
    'student',
    'Computer Science',
    TRUE,
    'SIT23CS001',
    3,
    NULL,
    NULL
),

(
    '92694f9e-0000-0000-0000-000000000000',
    'priya.patel@sit.edu.in',
    'Priya Patel',
    'student',
    'Computer Science',
    TRUE,
    'SIT23CS002',
    3,
    NULL,
    NULL
),

(
    '92694f9f-0000-0000-0000-000000000000',
    'rohan.kumar@sit.edu.in',
    'Rohan Kumar',
    'student',
    'Computer Science',
    TRUE,
    'SIT23CS003',
    3,
    NULL,
    NULL
),

(
    '92694fa0-0000-0000-0000-000000000000',
    'ananya.gupta@sit.edu.in',
    'Ananya Gupta',
    'student',
    'Computer Science',
    TRUE,
    'SIT23CS004',
    3,
    NULL,
    NULL
),

(
    '92694fa1-0000-0000-0000-000000000000',
    'vikram.singh@sit.edu.in',
    'Vikram Singh',
    'student',
    'Computer Science',
    TRUE,
    'SIT23CS005',
    3,
    NULL,
    NULL
),

(
    '92694fa2-0000-0000-0000-000000000000',
    'meera.reddy@sit.edu.in',
    'Meera Reddy',
    'student',
    'Computer Science',
    TRUE,
    'SIT23CS006',
    3,
    NULL,
    NULL
),

(
    '92694fa3-0000-0000-0000-000000000000',
    'arjun.nair@sit.edu.in',
    'Arjun Nair',
    'student',
    'Information Technology',
    TRUE,
    'SIT23IT001',
    3,
    NULL,
    NULL
),

(
    '92694fa4-0000-0000-0000-000000000000',
    'kavya.joshi@sit.edu.in',
    'Kavya Joshi',
    'student',
    'Computer Science',
    TRUE,
    'SIT23CS007',
    3,
    NULL,
    NULL
),

-- Faculty
(
    '7b266249-0000-0000-0000-000000000000',
    'priya.mehta@sit.edu.in',
    'Dr. Priya Mehta',
    'faculty',
    'Computer Science',
    TRUE,
    NULL,
    NULL,
    'FAC001',
    'Associate Professor'
),

(
    '7b26624a-0000-0000-0000-000000000000',
    'rajesh.kumar@sit.edu.in',
    'Prof. Rajesh Kumar',
    'faculty',
    'Computer Science',
    TRUE,
    NULL,
    NULL,
    'FAC002',
    'Professor'
),

(
    '7b26624b-0000-0000-0000-000000000000',
    'sunita.verma@sit.edu.in',
    'Dr. Sunita Verma',
    'faculty',
    'Computer Science',
    TRUE,
    NULL,
    NULL,
    'FAC003',
    'Assistant Professor'
),

-- Admin
(
    '72ccf967-0000-0000-0000-000000000000',
    'admin@sit.edu.in',
    'System Administrator',
    'admin',
    'Administration',
    TRUE,
    NULL,
    NULL,
    NULL,
    NULL
)

ON CONFLICT (id) DO NOTHING;


-- ==========================================================================================
-- 3. SUBJECTS
-- ==========================================================================================

INSERT INTO subjects (
    id,
    code,
    name,
    department,
    semester,
    faculty_id
)
VALUES

(
    '926ec411-0000-0000-0000-000000000000',
    'CS201',
    'Data Structures',
    'Computer Science',
    3,
    '7b266249-0000-0000-0000-000000000000'
),

(
    '926ec412-0000-0000-0000-000000000000',
    'CS202',
    'Database Management Systems',
    'Computer Science',
    3,
    '7b266249-0000-0000-0000-000000000000'
),

(
    '926ec413-0000-0000-0000-000000000000',
    'CS203',
    'Computer Networks',
    'Computer Science',
    3,
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '926ec414-0000-0000-0000-000000000000',
    'CS204',
    'Operating Systems',
    'Computer Science',
    3,
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '926ec415-0000-0000-0000-000000000000',
    'CS205',
    'Web Technology',
    'Computer Science',
    3,
    '7b26624b-0000-0000-0000-000000000000'
)

ON CONFLICT (id) DO NOTHING;


-- ==========================================================================================
-- 4. EXAMS
-- ==========================================================================================

INSERT INTO exams (
    id,
    title,
    description,
    subject_id,
    faculty_id,
    date,
    start_time,
    duration,
    total_marks,
    passing_marks,
    total_questions,
    attempts_allowed,
    status,
    instructions,
    settings,
    question_ids
)
VALUES

(
    'dbf021b2-0000-0000-0000-000000000000',
    'Data Structures Midterm',
    'Midterm examination covering arrays, linked lists, stacks, queues, trees, graphs, sorting, and hashing.',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000',
    '2026-07-29',
    '10:00',
    60,
    40,
    16,
    20,
    1,
    'upcoming',
    ARRAY[
        'Read all questions carefully.',
        'Do not refresh the examination page.',
        'The exam will be automatically submitted when time expires.'
    ],
    '{
        "shuffleQuestions": false,
        "shuffleOptions": false,
        "showResultImmediately": true,
        "allowAnswerReview": true,
        "enableNegativeMarking": false,
        "autoSubmitOnTimeEnd": true,
        "negativeMarkPercentage": 25
    }'::jsonb,
    '{}'::uuid[]
),

(
    'dbf021b3-0000-0000-0000-000000000000',
    'Database Systems Quiz',
    'Quiz on SQL, normalization, transactions, and indexing fundamentals.',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000',
    '2026-07-22',
    '14:00',
    30,
    25,
    10,
    10,
    1,
    'completed',
    ARRAY[
        'Attempt all questions.',
        'Review your answers before submission.'
    ],
    '{
        "shuffleQuestions": true,
        "shuffleOptions": true,
        "showResultImmediately": true,
        "allowAnswerReview": true,
        "enableNegativeMarking": false,
        "autoSubmitOnTimeEnd": true,
        "negativeMarkPercentage": 0
    }'::jsonb,
    '{}'::uuid[]
),

(
    'dbf021b4-0000-0000-0000-000000000000',
    'Computer Networks Unit Test',
    'Unit test covering OSI model, TCP/IP, IP addressing, and network devices.',
    '926ec413-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000',
    '2026-08-05',
    '11:00',
    45,
    20,
    8,
    10,
    1,
    'upcoming',
    ARRAY[
        'Read the instructions before starting.',
        'Negative marking is enabled.'
    ],
    '{
        "shuffleQuestions": false,
        "shuffleOptions": true,
        "showResultImmediately": true,
        "allowAnswerReview": true,
        "enableNegativeMarking": true,
        "autoSubmitOnTimeEnd": true,
        "negativeMarkPercentage": 25
    }'::jsonb,
    '{}'::uuid[]
),

(
    'dbf021b5-0000-0000-0000-000000000000',
    'Operating Systems Midterm',
    'Midterm covering process management, scheduling, memory management, deadlocks, and disk scheduling.',
    '926ec414-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000',
    '2026-08-12',
    '09:00',
    60,
    20,
    8,
    10,
    1,
    'upcoming',
    ARRAY[
        'Read all questions carefully.',
        'Negative marking is enabled.'
    ],
    '{
        "shuffleQuestions": false,
        "shuffleOptions": false,
        "showResultImmediately": true,
        "allowAnswerReview": true,
        "enableNegativeMarking": true,
        "autoSubmitOnTimeEnd": true,
        "negativeMarkPercentage": 25
    }'::jsonb,
    '{}'::uuid[]
)

ON CONFLICT (id) DO NOTHING;


-- ==========================================================================================
-- 5. QUESTIONS, ATTEMPTS, RESULTS, AND NOTIFICATIONS
-- Mirrors src/lib/data/mock-data.ts so Supabase-backed dashboards have complete data.
-- ==========================================================================================

INSERT INTO questions (id, text, type, options, marks, difficulty, topic, subject_id, created_by)
VALUES
(
    '00258c40-0000-0000-0000-000000000000',
    'Which data structure follows the FIFO (First In, First Out) principle?',
    'mcq',
    '[{"id":"Q001_A","text":"Stack","isCorrect":false},{"id":"Q001_B","text":"Queue","isCorrect":true},{"id":"Q001_C","text":"Tree","isCorrect":false},{"id":"Q001_D","text":"Graph","isCorrect":false}]'::jsonb,
    2,
    'easy',
    'Queue',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c41-0000-0000-0000-000000000000',
    'What is the time complexity of searching for an element in a balanced Binary Search Tree?',
    'mcq',
    '[{"id":"Q002_A","text":"O(n)","isCorrect":false},{"id":"Q002_B","text":"O(log n)","isCorrect":true},{"id":"Q002_C","text":"O(n log n)","isCorrect":false},{"id":"Q002_D","text":"O(1)","isCorrect":false}]'::jsonb,
    2,
    'medium',
    'Trees',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c42-0000-0000-0000-000000000000',
    'A stack can be used to check balanced parentheses in an expression.',
    'true-false',
    '[{"id":"Q003_A","text":"True","isCorrect":true},{"id":"Q003_B","text":"False","isCorrect":false}]'::jsonb,
    1,
    'easy',
    'Stack',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c43-0000-0000-0000-000000000000',
    'Which of the following is NOT a linear data structure?',
    'mcq',
    '[{"id":"Q004_A","text":"Array","isCorrect":false},{"id":"Q004_B","text":"Linked List","isCorrect":false},{"id":"Q004_C","text":"Tree","isCorrect":true},{"id":"Q004_D","text":"Queue","isCorrect":false}]'::jsonb,
    2,
    'easy',
    'Basics',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c44-0000-0000-0000-000000000000',
    'What is the worst-case time complexity of QuickSort?',
    'mcq',
    '[{"id":"Q005_A","text":"O(n log n)","isCorrect":false},{"id":"Q005_B","text":"O(n)","isCorrect":false},{"id":"Q005_C","text":"O(n²)","isCorrect":true},{"id":"Q005_D","text":"O(log n)","isCorrect":false}]'::jsonb,
    2,
    'medium',
    'Sorting',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c45-0000-0000-0000-000000000000',
    'Which of the following are applications of a stack? (Select all that apply)',
    'multi-select',
    '[{"id":"Q006_A","text":"Function call management","isCorrect":true},{"id":"Q006_B","text":"Expression evaluation","isCorrect":true},{"id":"Q006_C","text":"BFS traversal","isCorrect":false},{"id":"Q006_D","text":"Undo/Redo operations","isCorrect":true}]'::jsonb,
    3,
    'medium',
    'Stack',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c46-0000-0000-0000-000000000000',
    'In a singly linked list, what is the time complexity of inserting an element at the beginning?',
    'mcq',
    '[{"id":"Q007_A","text":"O(1)","isCorrect":true},{"id":"Q007_B","text":"O(n)","isCorrect":false},{"id":"Q007_C","text":"O(log n)","isCorrect":false},{"id":"Q007_D","text":"O(n²)","isCorrect":false}]'::jsonb,
    2,
    'easy',
    'Linked List',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c47-0000-0000-0000-000000000000',
    'A complete binary tree with n nodes has a height of approximately log₂(n).',
    'true-false',
    '[{"id":"Q008_A","text":"True","isCorrect":true},{"id":"Q008_B","text":"False","isCorrect":false}]'::jsonb,
    1,
    'medium',
    'Trees',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c48-0000-0000-0000-000000000000',
    'Which traversal of a Binary Search Tree gives elements in sorted order?',
    'mcq',
    '[{"id":"Q009_A","text":"Preorder","isCorrect":false},{"id":"Q009_B","text":"Inorder","isCorrect":true},{"id":"Q009_C","text":"Postorder","isCorrect":false},{"id":"Q009_D","text":"Level order","isCorrect":false}]'::jsonb,
    2,
    'easy',
    'Trees',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c5e-0000-0000-0000-000000000000',
    'What data structure is used in Breadth-First Search (BFS)?',
    'mcq',
    '[{"id":"Q010_A","text":"Stack","isCorrect":false},{"id":"Q010_B","text":"Queue","isCorrect":true},{"id":"Q010_C","text":"Priority Queue","isCorrect":false},{"id":"Q010_D","text":"Deque","isCorrect":false}]'::jsonb,
    2,
    'easy',
    'Graph',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c5f-0000-0000-0000-000000000000',
    'Which sorting algorithm has the best average-case time complexity?',
    'mcq',
    '[{"id":"Q011_A","text":"Bubble Sort — O(n²)","isCorrect":false},{"id":"Q011_B","text":"Merge Sort — O(n log n)","isCorrect":true},{"id":"Q011_C","text":"Selection Sort — O(n²)","isCorrect":false},{"id":"Q011_D","text":"Insertion Sort — O(n²)","isCorrect":false}]'::jsonb,
    2,
    'medium',
    'Sorting',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c60-0000-0000-0000-000000000000',
    'What is the maximum number of nodes at level k of a binary tree?',
    'mcq',
    '[{"id":"Q012_A","text":"2k","isCorrect":false},{"id":"Q012_B","text":"2^k","isCorrect":true},{"id":"Q012_C","text":"k²","isCorrect":false},{"id":"Q012_D","text":"2^(k+1) - 1","isCorrect":false}]'::jsonb,
    2,
    'medium',
    'Trees',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c61-0000-0000-0000-000000000000',
    'A hash table provides O(1) average-case time for search operations.',
    'true-false',
    '[{"id":"Q013_A","text":"True","isCorrect":true},{"id":"Q013_B","text":"False","isCorrect":false}]'::jsonb,
    1,
    'easy',
    'Hashing',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c62-0000-0000-0000-000000000000',
    'Which of the following are valid collision resolution techniques in hashing? (Select all that apply)',
    'multi-select',
    '[{"id":"Q014_A","text":"Chaining","isCorrect":true},{"id":"Q014_B","text":"Linear Probing","isCorrect":true},{"id":"Q014_C","text":"Binary Search","isCorrect":false},{"id":"Q014_D","text":"Double Hashing","isCorrect":true}]'::jsonb,
    3,
    'hard',
    'Hashing',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c63-0000-0000-0000-000000000000',
    'What is the space complexity of Merge Sort?',
    'mcq',
    '[{"id":"Q015_A","text":"O(1)","isCorrect":false},{"id":"Q015_B","text":"O(log n)","isCorrect":false},{"id":"Q015_C","text":"O(n)","isCorrect":true},{"id":"Q015_D","text":"O(n²)","isCorrect":false}]'::jsonb,
    2,
    'hard',
    'Sorting',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c64-0000-0000-0000-000000000000',
    'In a max-heap, the value of each node is greater than or equal to the values of its children.',
    'true-false',
    '[{"id":"Q016_A","text":"True","isCorrect":true},{"id":"Q016_B","text":"False","isCorrect":false}]'::jsonb,
    1,
    'easy',
    'Heap',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c65-0000-0000-0000-000000000000',
    'What is the time complexity of building a heap from an unsorted array?',
    'mcq',
    '[{"id":"Q017_A","text":"O(n log n)","isCorrect":false},{"id":"Q017_B","text":"O(n²)","isCorrect":false},{"id":"Q017_C","text":"O(n)","isCorrect":true},{"id":"Q017_D","text":"O(log n)","isCorrect":false}]'::jsonb,
    2,
    'hard',
    'Heap',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c66-0000-0000-0000-000000000000',
    'Dijkstra''s algorithm is used to find the shortest path in a graph with non-negative edge weights.',
    'true-false',
    '[{"id":"Q018_A","text":"True","isCorrect":true},{"id":"Q018_B","text":"False","isCorrect":false}]'::jsonb,
    1,
    'medium',
    'Graph',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c67-0000-0000-0000-000000000000',
    'Which data structure is most appropriate for implementing a priority queue?',
    'mcq',
    '[{"id":"Q019_A","text":"Array","isCorrect":false},{"id":"Q019_B","text":"Linked List","isCorrect":false},{"id":"Q019_C","text":"Heap","isCorrect":true},{"id":"Q019_D","text":"Stack","isCorrect":false}]'::jsonb,
    2,
    'medium',
    'Heap',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00258c7d-0000-0000-0000-000000000000',
    'An adjacency matrix representation of a graph with V vertices requires O(V²) space.',
    'true-false',
    '[{"id":"Q020_A","text":"True","isCorrect":true},{"id":"Q020_B","text":"False","isCorrect":false}]'::jsonb,
    1,
    'easy',
    'Graph',
    '926ec411-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00259001-0000-0000-0000-000000000000',
    'What does SQL stand for?',
    'mcq',
    '[{"id":"Q101_A","text":"Structured Query Language","isCorrect":true},{"id":"Q101_B","text":"Sequential Query Language","isCorrect":false},{"id":"Q101_C","text":"Standard Query Logic","isCorrect":false},{"id":"Q101_D","text":"Simple Query Language","isCorrect":false}]'::jsonb,
    2,
    'easy',
    'SQL Basics',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00259002-0000-0000-0000-000000000000',
    'Which normal form removes partial dependencies?',
    'mcq',
    '[{"id":"Q102_A","text":"1NF","isCorrect":false},{"id":"Q102_B","text":"2NF","isCorrect":true},{"id":"Q102_C","text":"3NF","isCorrect":false},{"id":"Q102_D","text":"BCNF","isCorrect":false}]'::jsonb,
    2,
    'medium',
    'Normalization',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00259003-0000-0000-0000-000000000000',
    'A primary key can contain NULL values.',
    'true-false',
    '[{"id":"Q103_A","text":"True","isCorrect":false},{"id":"Q103_B","text":"False","isCorrect":true}]'::jsonb,
    1,
    'easy',
    'Keys',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00259004-0000-0000-0000-000000000000',
    'Which SQL clause is used to filter grouped results?',
    'mcq',
    '[{"id":"Q104_A","text":"WHERE","isCorrect":false},{"id":"Q104_B","text":"GROUP BY","isCorrect":false},{"id":"Q104_C","text":"HAVING","isCorrect":true},{"id":"Q104_D","text":"ORDER BY","isCorrect":false}]'::jsonb,
    2,
    'medium',
    'SQL Basics',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00259005-0000-0000-0000-000000000000',
    'Which of the following are properties of a transaction (ACID)? (Select all that apply)',
    'multi-select',
    '[{"id":"Q105_A","text":"Atomicity","isCorrect":true},{"id":"Q105_B","text":"Consistency","isCorrect":true},{"id":"Q105_C","text":"Isolation","isCorrect":true},{"id":"Q105_D","text":"Durability","isCorrect":true}]'::jsonb,
    3,
    'medium',
    'Transactions',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00259006-0000-0000-0000-000000000000',
    'A foreign key in a table refers to the primary key of another table.',
    'true-false',
    '[{"id":"Q106_A","text":"True","isCorrect":true},{"id":"Q106_B","text":"False","isCorrect":false}]'::jsonb,
    1,
    'easy',
    'Keys',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00259007-0000-0000-0000-000000000000',
    'Which type of JOIN returns all rows from both tables, including unmatched rows?',
    'mcq',
    '[{"id":"Q107_A","text":"INNER JOIN","isCorrect":false},{"id":"Q107_B","text":"LEFT JOIN","isCorrect":false},{"id":"Q107_C","text":"RIGHT JOIN","isCorrect":false},{"id":"Q107_D","text":"FULL OUTER JOIN","isCorrect":true}]'::jsonb,
    2,
    'medium',
    'Joins',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00259008-0000-0000-0000-000000000000',
    'Which of the following are types of database indexes? (Select all that apply)',
    'multi-select',
    '[{"id":"Q108_A","text":"B-Tree Index","isCorrect":true},{"id":"Q108_B","text":"Hash Index","isCorrect":true},{"id":"Q108_C","text":"Stack Index","isCorrect":false},{"id":"Q108_D","text":"Bitmap Index","isCorrect":true}]'::jsonb,
    3,
    'hard',
    'Indexing',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00259009-0000-0000-0000-000000000000',
    'What is a deadlock in database systems?',
    'mcq',
    '[{"id":"Q109_A","text":"A transaction that takes too long","isCorrect":false},{"id":"Q109_B","text":"Two or more transactions waiting for each other to release locks","isCorrect":true},{"id":"Q109_C","text":"A database crash","isCorrect":false},{"id":"Q109_D","text":"An index becoming corrupted","isCorrect":false}]'::jsonb,
    2,
    'medium',
    'Transactions',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '0025901f-0000-0000-0000-000000000000',
    'The TRUNCATE command in SQL can be rolled back.',
    'true-false',
    '[{"id":"Q110_A","text":"True","isCorrect":false},{"id":"Q110_B","text":"False","isCorrect":true}]'::jsonb,
    1,
    'hard',
    'SQL Basics',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00259020-0000-0000-0000-000000000000',
    'What does the DISTINCT keyword do in SQL?',
    'mcq',
    '[{"id":"Q111_A","text":"Sorts the results","isCorrect":false},{"id":"Q111_B","text":"Removes duplicate rows","isCorrect":true},{"id":"Q111_C","text":"Limits the number of rows","isCorrect":false},{"id":"Q111_D","text":"Groups the results","isCorrect":false}]'::jsonb,
    2,
    'easy',
    'SQL Basics',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00259021-0000-0000-0000-000000000000',
    'In the relational model, a relation is essentially a table.',
    'true-false',
    '[{"id":"Q112_A","text":"True","isCorrect":true},{"id":"Q112_B","text":"False","isCorrect":false}]'::jsonb,
    1,
    'easy',
    'Relational Model',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00259022-0000-0000-0000-000000000000',
    'Which command is used to create a new table in SQL?',
    'mcq',
    '[{"id":"Q113_A","text":"INSERT TABLE","isCorrect":false},{"id":"Q113_B","text":"CREATE TABLE","isCorrect":true},{"id":"Q113_C","text":"NEW TABLE","isCorrect":false},{"id":"Q113_D","text":"ADD TABLE","isCorrect":false}]'::jsonb,
    2,
    'easy',
    'DDL',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00259023-0000-0000-0000-000000000000',
    'A view in SQL stores data physically on disk.',
    'true-false',
    '[{"id":"Q114_A","text":"True","isCorrect":false},{"id":"Q114_B","text":"False","isCorrect":true}]'::jsonb,
    1,
    'medium',
    'Views',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '00259024-0000-0000-0000-000000000000',
    'Which aggregate function returns the number of rows in a result set?',
    'mcq',
    '[{"id":"Q115_A","text":"SUM()","isCorrect":false},{"id":"Q115_B","text":"AVG()","isCorrect":false},{"id":"Q115_C","text":"COUNT()","isCorrect":true},{"id":"Q115_D","text":"MAX()","isCorrect":false}]'::jsonb,
    2,
    'easy',
    'SQL Basics',
    '926ec412-0000-0000-0000-000000000000',
    '7b266249-0000-0000-0000-000000000000'
),

(
    '002593c2-0000-0000-0000-000000000000',
    'Which layer of the OSI model is responsible for routing?',
    'mcq',
    '[{"id":"Q201_A","text":"Data Link Layer","isCorrect":false},{"id":"Q201_B","text":"Network Layer","isCorrect":true},{"id":"Q201_C","text":"Transport Layer","isCorrect":false},{"id":"Q201_D","text":"Session Layer","isCorrect":false}]'::jsonb,
    2,
    'easy',
    'OSI Model',
    '926ec413-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '002593c3-0000-0000-0000-000000000000',
    'TCP is a connectionless protocol.',
    'true-false',
    '[{"id":"Q202_A","text":"True","isCorrect":false},{"id":"Q202_B","text":"False","isCorrect":true}]'::jsonb,
    1,
    'easy',
    'TCP/IP',
    '926ec413-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '002593c4-0000-0000-0000-000000000000',
    'What is the default port number for HTTP?',
    'mcq',
    '[{"id":"Q203_A","text":"21","isCorrect":false},{"id":"Q203_B","text":"25","isCorrect":false},{"id":"Q203_C","text":"80","isCorrect":true},{"id":"Q203_D","text":"443","isCorrect":false}]'::jsonb,
    2,
    'easy',
    'Application Layer',
    '926ec413-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '002593c5-0000-0000-0000-000000000000',
    'Which protocol is used to resolve IP addresses to MAC addresses?',
    'mcq',
    '[{"id":"Q204_A","text":"DNS","isCorrect":false},{"id":"Q204_B","text":"ARP","isCorrect":true},{"id":"Q204_C","text":"DHCP","isCorrect":false},{"id":"Q204_D","text":"RARP","isCorrect":false}]'::jsonb,
    2,
    'medium',
    'Network Layer',
    '926ec413-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '002593c6-0000-0000-0000-000000000000',
    'Which of the following are transport layer protocols? (Select all that apply)',
    'multi-select',
    '[{"id":"Q205_A","text":"TCP","isCorrect":true},{"id":"Q205_B","text":"UDP","isCorrect":true},{"id":"Q205_C","text":"IP","isCorrect":false},{"id":"Q205_D","text":"HTTP","isCorrect":false}]'::jsonb,
    3,
    'easy',
    'Transport Layer',
    '926ec413-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '002593c7-0000-0000-0000-000000000000',
    'A subnet mask is used to identify the network and host portions of an IP address.',
    'true-false',
    '[{"id":"Q206_A","text":"True","isCorrect":true},{"id":"Q206_B","text":"False","isCorrect":false}]'::jsonb,
    1,
    'easy',
    'IP Addressing',
    '926ec413-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '002593c8-0000-0000-0000-000000000000',
    'What is the maximum data rate of Fast Ethernet?',
    'mcq',
    '[{"id":"Q207_A","text":"10 Mbps","isCorrect":false},{"id":"Q207_B","text":"100 Mbps","isCorrect":true},{"id":"Q207_C","text":"1 Gbps","isCorrect":false},{"id":"Q207_D","text":"10 Gbps","isCorrect":false}]'::jsonb,
    2,
    'medium',
    'Data Link Layer',
    '926ec413-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '002593c9-0000-0000-0000-000000000000',
    'DNS translates domain names to IP addresses.',
    'true-false',
    '[{"id":"Q208_A","text":"True","isCorrect":true},{"id":"Q208_B","text":"False","isCorrect":false}]'::jsonb,
    1,
    'easy',
    'Application Layer',
    '926ec413-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '002593ca-0000-0000-0000-000000000000',
    'Which device operates at the Data Link Layer?',
    'mcq',
    '[{"id":"Q209_A","text":"Hub","isCorrect":false},{"id":"Q209_B","text":"Repeater","isCorrect":false},{"id":"Q209_C","text":"Switch","isCorrect":true},{"id":"Q209_D","text":"Router","isCorrect":false}]'::jsonb,
    2,
    'medium',
    'Network Devices',
    '926ec413-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '002593e0-0000-0000-0000-000000000000',
    'What is the size of an IPv4 address?',
    'mcq',
    '[{"id":"Q210_A","text":"16 bits","isCorrect":false},{"id":"Q210_B","text":"32 bits","isCorrect":true},{"id":"Q210_C","text":"64 bits","isCorrect":false},{"id":"Q210_D","text":"128 bits","isCorrect":false}]'::jsonb,
    2,
    'easy',
    'IP Addressing',
    '926ec413-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '00259783-0000-0000-0000-000000000000',
    'Which scheduling algorithm gives the minimum average waiting time?',
    'mcq',
    '[{"id":"Q301_A","text":"FCFS","isCorrect":false},{"id":"Q301_B","text":"SJF (Shortest Job First)","isCorrect":true},{"id":"Q301_C","text":"Round Robin","isCorrect":false},{"id":"Q301_D","text":"Priority Scheduling","isCorrect":false}]'::jsonb,
    2,
    'medium',
    'Scheduling',
    '926ec414-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '00259784-0000-0000-0000-000000000000',
    'A semaphore is a synchronization mechanism used in operating systems.',
    'true-false',
    '[{"id":"Q302_A","text":"True","isCorrect":true},{"id":"Q302_B","text":"False","isCorrect":false}]'::jsonb,
    1,
    'easy',
    'Synchronization',
    '926ec414-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '00259785-0000-0000-0000-000000000000',
    'What is thrashing in an operating system?',
    'mcq',
    '[{"id":"Q303_A","text":"A type of CPU scheduling","isCorrect":false},{"id":"Q303_B","text":"Excessive paging activity causing low CPU utilization","isCorrect":true},{"id":"Q303_C","text":"A deadlock resolution technique","isCorrect":false},{"id":"Q303_D","text":"A disk scheduling algorithm","isCorrect":false}]'::jsonb,
    2,
    'hard',
    'Memory Management',
    '926ec414-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '00259786-0000-0000-0000-000000000000',
    'Which page replacement algorithm is known as the optimal algorithm?',
    'mcq',
    '[{"id":"Q304_A","text":"FIFO","isCorrect":false},{"id":"Q304_B","text":"LRU","isCorrect":false},{"id":"Q304_C","text":"Optimal (OPT)","isCorrect":true},{"id":"Q304_D","text":"Clock","isCorrect":false}]'::jsonb,
    2,
    'medium',
    'Memory Management',
    '926ec414-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '00259787-0000-0000-0000-000000000000',
    'Which of the following are necessary conditions for deadlock? (Select all that apply)',
    'multi-select',
    '[{"id":"Q305_A","text":"Mutual Exclusion","isCorrect":true},{"id":"Q305_B","text":"Hold and Wait","isCorrect":true},{"id":"Q305_C","text":"Preemption","isCorrect":false},{"id":"Q305_D","text":"Circular Wait","isCorrect":true}]'::jsonb,
    3,
    'hard',
    'Deadlock',
    '926ec414-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '00259788-0000-0000-0000-000000000000',
    'Virtual memory allows a process to execute even if it is not completely in main memory.',
    'true-false',
    '[{"id":"Q306_A","text":"True","isCorrect":true},{"id":"Q306_B","text":"False","isCorrect":false}]'::jsonb,
    1,
    'easy',
    'Memory Management',
    '926ec414-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '00259789-0000-0000-0000-000000000000',
    'What is the purpose of a Translation Lookaside Buffer (TLB)?',
    'mcq',
    '[{"id":"Q307_A","text":"To store frequently used data","isCorrect":false},{"id":"Q307_B","text":"To speed up virtual-to-physical address translation","isCorrect":true},{"id":"Q307_C","text":"To manage disk I/O","isCorrect":false},{"id":"Q307_D","text":"To schedule processes","isCorrect":false}]'::jsonb,
    2,
    'hard',
    'Memory Management',
    '926ec414-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '0025978a-0000-0000-0000-000000000000',
    'A context switch involves saving and restoring the state of a process.',
    'true-false',
    '[{"id":"Q308_A","text":"True","isCorrect":true},{"id":"Q308_B","text":"False","isCorrect":false}]'::jsonb,
    1,
    'easy',
    'Process Management',
    '926ec414-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '0025978b-0000-0000-0000-000000000000',
    'Which disk scheduling algorithm services requests in the order they arrive?',
    'mcq',
    '[{"id":"Q309_A","text":"FCFS","isCorrect":true},{"id":"Q309_B","text":"SSTF","isCorrect":false},{"id":"Q309_C","text":"SCAN","isCorrect":false},{"id":"Q309_D","text":"C-SCAN","isCorrect":false}]'::jsonb,
    2,
    'easy',
    'Disk Scheduling',
    '926ec414-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
),

(
    '002597a1-0000-0000-0000-000000000000',
    'What is the role of a kernel in an operating system?',
    'mcq',
    '[{"id":"Q310_A","text":"Managing user interface only","isCorrect":false},{"id":"Q310_B","text":"Core component managing system resources and hardware","isCorrect":true},{"id":"Q310_C","text":"Compiling programs","isCorrect":false},{"id":"Q310_D","text":"Managing network connections only","isCorrect":false}]'::jsonb,
    2,
    'medium',
    'OS Basics',
    '926ec414-0000-0000-0000-000000000000',
    '7b26624a-0000-0000-0000-000000000000'
)
ON CONFLICT (id) DO UPDATE SET
    text = EXCLUDED.text,
    type = EXCLUDED.type,
    options = EXCLUDED.options,
    marks = EXCLUDED.marks,
    difficulty = EXCLUDED.difficulty,
    topic = EXCLUDED.topic,
    subject_id = EXCLUDED.subject_id,
    created_by = EXCLUDED.created_by;

UPDATE exams
SET
    total_questions = CASE id
        WHEN 'dbf021b2-0000-0000-0000-000000000000' THEN 20
        WHEN 'dbf021b3-0000-0000-0000-000000000000' THEN 10
        WHEN 'dbf021b4-0000-0000-0000-000000000000' THEN 10
        WHEN 'dbf021b5-0000-0000-0000-000000000000' THEN 10
    END,
    question_ids = CASE id
        WHEN 'dbf021b2-0000-0000-0000-000000000000' THEN ARRAY['00258c40-0000-0000-0000-000000000000', '00258c41-0000-0000-0000-000000000000', '00258c42-0000-0000-0000-000000000000', '00258c43-0000-0000-0000-000000000000', '00258c44-0000-0000-0000-000000000000', '00258c45-0000-0000-0000-000000000000', '00258c46-0000-0000-0000-000000000000', '00258c47-0000-0000-0000-000000000000', '00258c48-0000-0000-0000-000000000000', '00258c5e-0000-0000-0000-000000000000', '00258c5f-0000-0000-0000-000000000000', '00258c60-0000-0000-0000-000000000000', '00258c61-0000-0000-0000-000000000000', '00258c62-0000-0000-0000-000000000000', '00258c63-0000-0000-0000-000000000000', '00258c64-0000-0000-0000-000000000000', '00258c65-0000-0000-0000-000000000000', '00258c66-0000-0000-0000-000000000000', '00258c67-0000-0000-0000-000000000000', '00258c7d-0000-0000-0000-000000000000']::uuid[]
        WHEN 'dbf021b3-0000-0000-0000-000000000000' THEN ARRAY['00259001-0000-0000-0000-000000000000', '00259002-0000-0000-0000-000000000000', '00259003-0000-0000-0000-000000000000', '00259004-0000-0000-0000-000000000000', '00259005-0000-0000-0000-000000000000', '00259006-0000-0000-0000-000000000000', '00259007-0000-0000-0000-000000000000', '00259008-0000-0000-0000-000000000000', '00259009-0000-0000-0000-000000000000', '0025901f-0000-0000-0000-000000000000']::uuid[]
        WHEN 'dbf021b4-0000-0000-0000-000000000000' THEN ARRAY['002593c2-0000-0000-0000-000000000000', '002593c3-0000-0000-0000-000000000000', '002593c4-0000-0000-0000-000000000000', '002593c5-0000-0000-0000-000000000000', '002593c6-0000-0000-0000-000000000000', '002593c7-0000-0000-0000-000000000000', '002593c8-0000-0000-0000-000000000000', '002593c9-0000-0000-0000-000000000000', '002593ca-0000-0000-0000-000000000000', '002593e0-0000-0000-0000-000000000000']::uuid[]
        WHEN 'dbf021b5-0000-0000-0000-000000000000' THEN ARRAY['00259783-0000-0000-0000-000000000000', '00259784-0000-0000-0000-000000000000', '00259785-0000-0000-0000-000000000000', '00259786-0000-0000-0000-000000000000', '00259787-0000-0000-0000-000000000000', '00259788-0000-0000-0000-000000000000', '00259789-0000-0000-0000-000000000000', '0025978a-0000-0000-0000-000000000000', '0025978b-0000-0000-0000-000000000000', '002597a1-0000-0000-0000-000000000000']::uuid[]
    END
WHERE id IN ('dbf021b2-0000-0000-0000-000000000000', 'dbf021b3-0000-0000-0000-000000000000', 'dbf021b4-0000-0000-0000-000000000000', 'dbf021b5-0000-0000-0000-000000000000');

INSERT INTO exam_attempts (id, exam_id, student_id, started_at, submitted_at, status, answers, tab_switch_count, time_spent)
VALUES
('73b1a010-0000-0000-0000-000000000000', 'dbf021b3-0000-0000-0000-000000000000', '92694f9d-0000-0000-0000-000000000000', '2026-07-22T14:00:00Z', '2026-07-22T14:24:32Z', 'evaluated', '[{"questionId":"Q101","selectedOptionIds":["Q101_A"],"isMarkedForReview":false,"answeredAt":"2026-07-22T14:01:20Z","timeTaken":80},{"questionId":"Q102","selectedOptionIds":["Q102_B"],"isMarkedForReview":false,"answeredAt":"2026-07-22T14:03:10Z","timeTaken":110},{"questionId":"Q103","selectedOptionIds":["Q103_B"],"isMarkedForReview":false,"answeredAt":"2026-07-22T14:04:00Z","timeTaken":50},{"questionId":"Q104","selectedOptionIds":["Q104_C"],"isMarkedForReview":false,"answeredAt":"2026-07-22T14:06:30Z","timeTaken":150},{"questionId":"Q105","selectedOptionIds":["Q105_A","Q105_B","Q105_C","Q105_D"],"isMarkedForReview":false,"answeredAt":"2026-07-22T14:08:00Z","timeTaken":90},{"questionId":"Q106","selectedOptionIds":["Q106_A"],"isMarkedForReview":false,"answeredAt":"2026-07-22T14:09:00Z","timeTaken":60},{"questionId":"Q107","selectedOptionIds":["Q107_D"],"isMarkedForReview":true,"answeredAt":"2026-07-22T14:12:00Z","timeTaken":180},{"questionId":"Q108","selectedOptionIds":["Q108_A","Q108_B","Q108_D"],"isMarkedForReview":false,"answeredAt":"2026-07-22T14:15:00Z","timeTaken":180},{"questionId":"Q109","selectedOptionIds":["Q109_B"],"isMarkedForReview":false,"answeredAt":"2026-07-22T14:18:00Z","timeTaken":180},{"questionId":"Q110","selectedOptionIds":["Q110_A"],"isMarkedForReview":true,"answeredAt":"2026-07-22T14:20:00Z","timeTaken":120}]'::jsonb, 0, 1472),
('73b1a011-0000-0000-0000-000000000000', 'dbf021b3-0000-0000-0000-000000000000', '92694f9e-0000-0000-0000-000000000000', '2026-07-22T14:00:00Z', '2026-07-22T14:30:00Z', 'evaluated', '[]'::jsonb, 0, 1650),
('73b1a012-0000-0000-0000-000000000000', 'dbf021b3-0000-0000-0000-000000000000', '92694f9f-0000-0000-0000-000000000000', '2026-07-22T14:00:00Z', '2026-07-22T14:28:00Z', 'evaluated', '[]'::jsonb, 0, 1200),
('73b1a013-0000-0000-0000-000000000000', 'dbf021b3-0000-0000-0000-000000000000', '92694fa0-0000-0000-0000-000000000000', '2026-07-22T14:00:00Z', '2026-07-22T14:35:00Z', 'evaluated', '[]'::jsonb, 0, 1800),
('73b1a014-0000-0000-0000-000000000000', 'dbf021b3-0000-0000-0000-000000000000', '92694fa1-0000-0000-0000-000000000000', '2026-07-22T14:00:00Z', '2026-07-22T14:32:00Z', 'evaluated', '[]'::jsonb, 0, 1550),
('73b1a015-0000-0000-0000-000000000000', 'dbf021b3-0000-0000-0000-000000000000', '92694fa2-0000-0000-0000-000000000000', '2026-07-22T14:00:00Z', '2026-07-22T14:26:00Z', 'evaluated', '[]'::jsonb, 0, 1400)
ON CONFLICT (id) DO UPDATE SET
    submitted_at = EXCLUDED.submitted_at, status = EXCLUDED.status, answers = EXCLUDED.answers,
    tab_switch_count = EXCLUDED.tab_switch_count, time_spent = EXCLUDED.time_spent;

INSERT INTO results (id, attempt_id, exam_id, student_id, total_marks, obtained_marks, percentage, status, correct_count, incorrect_count, unanswered_count, time_spent, question_results, evaluated_at)
VALUES
('8fe02db1-0000-0000-0000-000000000000', '73b1a010-0000-0000-0000-000000000000', 'dbf021b3-0000-0000-0000-000000000000', '92694f9d-0000-0000-0000-000000000000', 25, 21, 84, 'passed', 8, 2, 0, 1472, '[{"questionId":"Q101","studentAnswer":["Q101_A"],"correctAnswer":["Q101_A"],"isCorrect":true,"marksAwarded":2,"marksDeducted":0},{"questionId":"Q102","studentAnswer":["Q102_B"],"correctAnswer":["Q102_B"],"isCorrect":true,"marksAwarded":2,"marksDeducted":0},{"questionId":"Q103","studentAnswer":["Q103_B"],"correctAnswer":["Q103_B"],"isCorrect":true,"marksAwarded":1,"marksDeducted":0},{"questionId":"Q104","studentAnswer":["Q104_C"],"correctAnswer":["Q104_C"],"isCorrect":true,"marksAwarded":2,"marksDeducted":0},{"questionId":"Q105","studentAnswer":["Q105_A","Q105_B","Q105_C","Q105_D"],"correctAnswer":["Q105_A","Q105_B","Q105_C","Q105_D"],"isCorrect":true,"marksAwarded":3,"marksDeducted":0},{"questionId":"Q106","studentAnswer":["Q106_A"],"correctAnswer":["Q106_A"],"isCorrect":true,"marksAwarded":1,"marksDeducted":0},{"questionId":"Q107","studentAnswer":["Q107_D"],"correctAnswer":["Q107_D"],"isCorrect":true,"marksAwarded":2,"marksDeducted":0},{"questionId":"Q108","studentAnswer":["Q108_A","Q108_B","Q108_D"],"correctAnswer":["Q108_A","Q108_B","Q108_D"],"isCorrect":true,"marksAwarded":3,"marksDeducted":0},{"questionId":"Q109","studentAnswer":["Q109_B"],"correctAnswer":["Q109_B"],"isCorrect":true,"marksAwarded":2,"marksDeducted":0},{"questionId":"Q110","studentAnswer":["Q110_A"],"correctAnswer":["Q110_B"],"isCorrect":false,"marksAwarded":0,"marksDeducted":0}]'::jsonb, '2026-07-22T14:24:35Z'),
('8fe02db2-0000-0000-0000-000000000000', '73b1a011-0000-0000-0000-000000000000', 'dbf021b3-0000-0000-0000-000000000000', '92694f9e-0000-0000-0000-000000000000', 25, 18, 72, 'passed', 7, 2, 1, 1650, '[]'::jsonb, '2026-07-22T14:30:00Z'),
('8fe02db3-0000-0000-0000-000000000000', '73b1a012-0000-0000-0000-000000000000', 'dbf021b3-0000-0000-0000-000000000000', '92694f9f-0000-0000-0000-000000000000', 25, 23, 92, 'passed', 9, 1, 0, 1200, '[]'::jsonb, '2026-07-22T14:28:00Z'),
('8fe02db4-0000-0000-0000-000000000000', '73b1a013-0000-0000-0000-000000000000', 'dbf021b3-0000-0000-0000-000000000000', '92694fa0-0000-0000-0000-000000000000', 25, 8, 32, 'failed', 3, 5, 2, 1800, '[]'::jsonb, '2026-07-22T14:35:00Z'),
('8fe02db5-0000-0000-0000-000000000000', '73b1a014-0000-0000-0000-000000000000', 'dbf021b3-0000-0000-0000-000000000000', '92694fa1-0000-0000-0000-000000000000', 25, 15, 60, 'passed', 6, 3, 1, 1550, '[]'::jsonb, '2026-07-22T14:32:00Z'),
('8fe02db6-0000-0000-0000-000000000000', '73b1a015-0000-0000-0000-000000000000', 'dbf021b3-0000-0000-0000-000000000000', '92694fa2-0000-0000-0000-000000000000', 25, 20, 80, 'passed', 8, 2, 0, 1400, '[]'::jsonb, '2026-07-22T14:26:00Z')
ON CONFLICT (id) DO UPDATE SET
    attempt_id = EXCLUDED.attempt_id, obtained_marks = EXCLUDED.obtained_marks, percentage = EXCLUDED.percentage,
    status = EXCLUDED.status, correct_count = EXCLUDED.correct_count, incorrect_count = EXCLUDED.incorrect_count,
    unanswered_count = EXCLUDED.unanswered_count, time_spent = EXCLUDED.time_spent, question_results = EXCLUDED.question_results,
    evaluated_at = EXCLUDED.evaluated_at;

INSERT INTO notifications (id, user_id, type, title, message, is_read, created_at, link)
VALUES
('899a2a9e-0000-0000-0000-000000000000', '92694f9d-0000-0000-0000-000000000000', 'exam-scheduled', 'New Exam Scheduled', 'Data Structures Midterm has been scheduled for July 29, 2026 at 10:00 AM.', false, '2026-07-25T10:00:00Z', '/exams/EXAM001'),
('899a2a9f-0000-0000-0000-000000000000', '92694f9d-0000-0000-0000-000000000000', 'result-published', 'Result Published', 'Your result for Database Systems Quiz has been published. You scored 84%.', true, '2026-07-22T14:25:00Z', '/results/RES001'),
('899a2aa0-0000-0000-0000-000000000000', '92694f9d-0000-0000-0000-000000000000', 'exam-scheduled', 'New Exam Scheduled', 'Computer Networks Unit Test has been scheduled for August 5, 2026 at 11:00 AM.', false, '2026-07-26T09:00:00Z', '/exams/EXAM003'),
('899a2aa1-0000-0000-0000-000000000000', '92694f9d-0000-0000-0000-000000000000', 'exam-starting-soon', 'Exam Starting Soon', 'Data Structures Midterm starts in 2 days. Make sure you are prepared.', false, '2026-07-27T08:00:00Z', '/exams/EXAM001'),
('899a2aa2-0000-0000-0000-000000000000', '92694f9d-0000-0000-0000-000000000000', 'exam-scheduled', 'New Exam Scheduled', 'Operating Systems Midterm has been scheduled for August 12, 2026.', true, '2026-07-24T15:00:00Z', '/exams/EXAM004'),
('899a2aa3-0000-0000-0000-000000000000', '7b266249-0000-0000-0000-000000000000', 'system', 'Quiz Completed', 'Database Systems Quiz has been completed by 6 students. View results.', false, '2026-07-22T14:40:00Z', '/results/manage')
ON CONFLICT (id) DO UPDATE SET
    is_read = EXCLUDED.is_read, title = EXCLUDED.title, message = EXCLUDED.message, link = EXCLUDED.link;


-- ==========================================================================================
-- 6. VERIFY DATA
-- ==========================================================================================

SELECT
    id,
    email,
    name,
    role
FROM public.users
ORDER BY role, name;

SELECT
    id,
    code,
    name,
    semester
FROM subjects
ORDER BY code;

SELECT
    id,
    title,
    date,
    start_time,
    status,
    total_marks,
    passing_marks,
    total_questions
FROM exams
ORDER BY date;

COMMIT;
