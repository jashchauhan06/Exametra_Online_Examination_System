# Exametra Workflow

Exametra connects administrators, faculty, and students through a Next.js portal. InsForge handles authentication, database records, and assignment files. Electron adds desktop exam controls, while Next.js API routes connect to AI providers and Judge0 for evaluation.

## 1. Accounts and login

1. An administrator creates an account through the management interface. The server creates an InsForge Auth identity and a matching `users` profile.
2. The user signs in with email and password. `AuthProvider` retrieves the identity and loads its profile from InsForge.
3. The profile's role determines the dashboard and navigation: **admin**, **faculty**, or **student**.
4. Administrators manage profiles and assign teaching subjects. Faculty prepare assessments; students take them and view results.

The application shell redirects users without a loaded profile to `/login`. Role-based navigation describes the intended workflow; it does not enforce every backend permission.

## 2. Preparing and publishing an exam

1. Faculty create questions manually or use AI-assisted generation, then review and save them in the question bank.
2. Questions can be multiple choice, true/false, multi-select, coding, or subjective written answers.
3. The exam creation form follows **Details → Questions → Settings → Review**. Faculty choose the schedule, duration, questions, passing marks, and settings.
4. The form keeps an unfinished draft in browser local storage. Publishing saves the exam in InsForge and requests notifications for faculty and students.
5. The interface calculates whether the exam is upcoming, live, or completed from its schedule and the browser's current time.

## 3. Taking an exam

1. The student opens the exam details, reads the instructions, and starts when the exam is live. The normal entry flow requires the Electron desktop app.
2. `/exam/[id]` loads the exam and questions, then creates or resumes an `exam_attempts` record.
3. The student answers questions, marks items for review, and runs coding examples while the timer counts down.
4. Ordinary answers and navigation state are saved locally. Coding drafts are currently held separately and are not included in this local recovery data.
5. The page checks fullscreen/focus changes and can notify faculty about violations. Leaving fullscreen starts a 45-second return countdown before forced submission.
6. Every three seconds, the page checks for instructor changes to settings or duration. Added time extends the countdown.
7. The student submits manually, or submission starts when time expires.

Electron enables kiosk, always-on-top, and content-protection controls on exam routes, then releases them when the user leaves those routes.

## 4. Evaluation and results

The exam page coordinates grading according to question type:

| Question type | How it is marked |
| --- | --- |
| MCQ / true-false / multi-select | Selected options must exactly match the correct set. Incorrect answers can receive negative marks when enabled. |
| Coding | `/api/execute` sends code and test cases to Judge0. Marks are proportional to test cases passed. |
| Subjective | `/api/evaluate-subjective` asks an AI provider to grade the answer against the question, expected answer, and rubric. |

After evaluation, the page saves a `results` record, updates the attempt to `submitted`, and opens the result page. Students see marks and available feedback; faculty/admin views aggregate results into scores, distributions, and pass rates.

Faculty/admins can allow a retake by deleting the previous result and resetting the student's attempts to `in-progress`. Stored attempt answers remain, and the exam must still be live to resume.

## 5. Assignment submissions

1. Faculty create an assignment with a description, subject, deadline, maximum marks, rubric, and accepted formats. A teacher attachment is optional.
2. Students submit text, a PDF, or an image before the deadline. Files go to the InsForge `assignments` storage bucket.
3. PDF.js extracts text from PDFs in the browser; image submissions send image data for evaluation.
4. The app saves an `assignment_submissions` row with `evaluating` status and notifies faculty. A resubmission updates the same assignment/student row.
5. `/api/evaluate-assignment` returns an AI-generated score and feedback. The client saves them and changes the status to `evaluated`; evaluation failures change it to `error`.

AI generation and grading share `src/lib/ai.ts`: OpenRouter is tried first when configured, with Gemini as an optional fallback. These are direct provider integrations, separate from InsForge.

## 6. Notifications and data flow

```text
Browser or Electron
  └─ Next.js interface
       ├─ InsForge SDK → authentication, database, assignment files
       ├─ Local storage → exam form draft and answer/navigation recovery
       └─ Next.js API routes
            ├─ InsForge admin client → accounts and notifications
            ├─ OpenRouter / Gemini → question generation and AI grading
            └─ Judge0 → code execution and test results
```

Exam/assignment creation notifies all student profiles; submissions and violations notify faculty. The notification page and header refresh every **15 seconds**. Marking notifications as read updates the interface immediately and calls the server to persist the change.

## 7. Where the workflow lives

| Source | Responsibility |
| --- | --- |
| `src/lib/auth-context.tsx` | Login, current identity, and profile loading |
| `src/lib/insforge.ts` | Backend clients and database query wrapper |
| `src/lib/data/insforge-service.ts` | Shared queries, assignment persistence, and file uploads |
| `src/app/exam/[id]/page.tsx` | Exam session, timer, submission, and mixed-question grading |
| `src/components/assignments/submission-form.tsx` | Assignment upload, evaluation, and result-saving sequence |
| `src/app/api/` | Account, notification, AI, code-execution, and health endpoints |
| `main.js` | Electron window and exam lockdown behavior |

This describes the current implementation. Some configurable exam options are not fully enforced, and local recovery is not continuous database synchronization. See [README.md](README.md) for setup, detailed behavior, and known limitations.
