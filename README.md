# Exametra

Exametra is an internal online assessment platform for students, faculty, and administrators. It combines scheduled examinations, a reusable question bank, coding exercises, AI-assisted written-answer grading, assignment submissions, results, and administration in one portal.

The web application runs on **Next.js**, with **InsForge** providing authentication, Postgres data, and assignment file storage. An **Electron desktop application** wraps the portal and enables lockdown controls during examinations.

This README describes the implementation in this repository. It is an onboarding and project-overview document; it does not certify the configuration or availability of the deployed services.

## Contents

- [Project at a glance](#project-at-a-glance)
- [Roles and main workflows](#roles-and-main-workflows)
- [Examination workflow](#examination-workflow)
- [Assignments and AI evaluation](#assignments-and-ai-evaluation)
- [Architecture and backend migration](#architecture-and-backend-migration)
- [Data model](#data-model)
- [Routes and API endpoints](#routes-and-api-endpoints)
- [Local setup and configuration](#local-setup-and-configuration)
- [Desktop application and packaging](#desktop-application-and-packaging)
- [Database setup and legacy scripts](#database-setup-and-legacy-scripts)
- [Notifications and operational checks](#notifications-and-operational-checks)
- [Source map](#source-map)
- [Current implementation boundaries](#current-implementation-boundaries)
- [Troubleshooting and verification](#troubleshooting-and-verification)

## Project at a glance

| Area | Implementation |
| --- | --- |
| Product | Exametra; package name `exametra-desktop`, version `1.0.0` |
| Web framework | Next.js `16.2.12`, React `19.2.4`, TypeScript |
| Styling and UI | Tailwind CSS 4, Lucide icons, GSAP/Lottie animations, reusable UI components |
| Backend | InsForge project **Online Exam**, using `@insforge/sdk` |
| Configured backend API | `https://kbia4qk4.us-east.insforge.app` |
| Desktop runtime | Electron 44; Windows packaging through Electron Builder or the custom installer script |
| Code editor and runner | Monaco editor and an external Judge0 API |
| AI integration | Direct OpenRouter requests, with Google Gemini as a configured fallback |
| Charts and documents | Recharts, React Markdown, PDF.js for assignment text extraction |
| Application roles | `student`, `faculty`, `admin` |

InsForge also offers other platform services, but this repository's current AI calls go through `src/lib/ai.ts`, and notification updates use polling. Do not infer that InsForge AI, realtime channels, payments, or edge functions are integrated merely because the backend platform supports them.

## Roles and main workflows

### Students

Students sign in with an existing account, browse examinations and assignments, take live exams, submit assignment work, and review their scores and feedback.

Their dashboard brings together upcoming/completed examinations, result summaries, subjects, and performance charts. The sidebar links to Dashboard, Examinations, Assignments, Results, Notifications, and Settings.

A typical journey is:

1. Sign in and review the dashboard.
2. Open an exam to read its schedule, instructions, marks, and duration.
3. Enter the live exam through the desktop flow, answer questions, and submit.
4. Open the result for question-level marks and available feedback.
5. Separately, submit text, PDF, or image work for assignments before their deadlines.

### Faculty

Faculty prepare questions, publish examinations, create assignments, monitor attempts, and inspect performance.

The question bank supports manual creation, filters, selection, bulk deletion, and AI-assisted generation. Exam creation can select existing questions or add generated ones. Faculty can inspect student attempts, allow retakes, change exam settings, and extend time through the exam detail screen.

Faculty dashboards summarize their exams, live/upcoming counts, average scores, and pass rates. The student count shown there is a platform-wide count, not an enrollment-specific roster.

### Administrators

Administrators see platform totals and management shortcuts. Student/faculty screens support account creation, search, activation-state updates, and faculty subject assignment. Subject assignment updates the faculty profile's `teaching_subjects` array.

Administrators can inspect examinations, results, assignments, and analytics, and the exam detail screen exposes exam deletion. Role-specific navigation describes the intended workflow; it is not a substitute for authorization at the API/database layer.

## Examination workflow

```text
Question bank -> Exam details + question selection + settings -> Publish
                                                               |
                                                Student opens live exam
                                                               |
                                             Answer / review / run code
                                                               |
                                                  Submit or timer ends
                                                               |
                               Objective marking + Judge0 + AI evaluation
                                                               |
                                          Result and attempt are persisted
                                                               |
                                           Result review and exam analytics
```

### Question types

| Type | Authoring data | Evaluation behavior |
| --- | --- | --- |
| `mcq` | Options and a correct-answer flag | Exact selected-option match |
| `true-false` | True/false options and correct answer | Same option-matching path |
| `multi-select` | Multiple correct options | Full selected set must match; no partial credit |
| `coding` | Allowed languages, starter code, test cases, execution limits | Marks proportional to test cases passed |
| `subjective` | Question text, expected answer, optional rubric | AI returns a score and written feedback |

Questions also carry subject, topic, difficulty (`easy`, `medium`, `hard`), marks, author, and optional explanation.

The coding language map includes C, C++, Python, JavaScript, Java, and SQL. These are the language identifiers configured in `src/lib/judge0.ts`; the selected Judge0 service must support them.

### Creating and publishing an exam

The four-step form is **Details -> Questions -> Settings -> Review**:

- **Details:** title, subject, description, date, start time, duration, and passing marks.
- **Questions:** choose questions with subject/topic/type/search filters and sorting; total marks are calculated from the selection.
- **Settings:** configure stored options for shuffling, result/review visibility, negative marking, time-end submission, copy/paste, and attempts allowed.
- **Review:** inspect and publish the exam.

Defaults in the current form include a 60-minute duration, one allowed attempt, negative marking off, a 25% negative-mark percentage, and copy/paste blocked. If no nonzero passing mark is supplied, publishing uses a rounded 40% of total marks. A missing start time falls back to 09:00.

The form saves its working draft as `exam_draft_v1` in browser local storage. Publishing inserts an `exams` record with `question_ids`, JSON settings, generated instructions, and `upcoming` status, then requests notifications for the faculty member and students. The local draft is removed after successful creation.

### Scheduling and admission

`getDynamicExamStatus` preserves a draft and otherwise compares the current browser time with the exam date/start time and duration:

| Condition | Computed status |
| --- | --- |
| Before scheduled start | `upcoming` |
| From start through scheduled end | `live` |
| After scheduled end | `completed` |

The type model also includes `cancelled` and `missed`; the timing helper does not itself generate those states. Date/time parsing uses the browser's local timezone.

The exam detail screen shows a countdown before the start. The standalone exam page refuses entry unless the computed status is `live`. It loads the latest attempt for that student/exam; a submitted attempt blocks entry until it is reset.

### During the exam

The dedicated `/exam/[id]` route sits outside the dashboard shell. It provides a countdown, previous/next navigation, a question palette, marked-for-review state, answer clearing, subjective answer entry, and the Monaco coding interface.

Objective/subjective answers and navigation state are saved under `exam_<examId>_state` in local storage. The page can restore this state or fall back to stored attempt answers. The current save payload does not include the separate `codingAnswers` state, so coding drafts should not be assumed to survive a reload.

The page polls the exam's `settings` and `duration` every three seconds. Copy/paste setting changes update the interface, and positive duration increases add time to the running countdown. Timer expiry invokes submission.

### Integrity controls and retakes

The exam page monitors fullscreen changes, focus/visibility changes, screenshot-related shortcuts, and background timing. It can show visual/spoken warnings and notify faculty. Leaving fullscreen starts a 45-second return countdown; expiry submits with a violation reason.

The desktop wrapper adds kiosk, always-on-top, content-protection, and shortcut interception during exam navigation. These are application controls whose effectiveness depends on the browser/OS; they do not establish a server-side trust boundary.

Faculty/admin retake handling deletes results for the student's attempts on the exam and resets the attempts to `in-progress`, clearing submitted/violation fields. It keeps the attempt records and their stored answers. Re-entry still depends on the exam being live.

### Submission and scoring

The active mixed-question scoring flow is in `src/app/exam/[id]/page.tsx`:

1. Objective questions compare selected IDs with the correct option IDs. Unanswered questions receive zero; incorrect answers can deduct the configured percentage of that question's marks.
2. Coding submissions call `/api/execute` against all configured test cases, including hidden ones. Marks equal question marks multiplied by passed cases / total cases. The stored per-test `points` field is not used to weight this calculation.
3. Subjective answers call `/api/evaluate-subjective` with the question, answer, rubric, expected answer, and maximum marks.
4. The page inserts or updates a result, updates the attempt to `submitted`, clears its local answer state, and redirects to the result page on success.

The result contains totals, percentage, pass/fail status, elapsed time, question-level marks, coding output/feedback where applicable, and violation metadata.

`src/lib/evaluation.ts` remains an objective-scoring helper; it is not the orchestrator for the mixed exam submission. Its zero-floor rule for total marks differs from the active page, which clamps percentage to zero but can persist negative `obtained_marks`.

## Assignments and AI evaluation

Assignments are a separate assessment workflow with their own deadline, maximum marks, rubric, accepted submission types, and optional teacher attachment.

Faculty can create an active assignment or draft. A teacher attachment is uploaded after creating the assignment, then its URL/type is stored on the record. Assignment states are `draft`, `active`, and `closed`.

Students submit one of the allowed formats:

| Submission | Processing |
| --- | --- |
| Text | Answer text is stored and sent for evaluation |
| PDF | File is uploaded; PDF.js extracts text in the browser for evaluation |
| Image | File is uploaded; base64 image data is sent to the AI evaluation route |

The storage bucket is named `assignments`. Student file paths use `<assignmentId>/<studentId>/<timestamp>.<extension>`; teacher attachment paths use the assignment ID plus a timestamped filename.

There is one submission row per assignment/student pair. Resubmitting upserts that row. The form checks the deadline, saves the submission with `evaluating` status, notifies faculty, calls `/api/evaluate-assignment`, and saves the score/feedback. Failures change the submission to `error`; successful evaluations use `evaluated`.

PDF extraction reads an existing text layer; it is not an OCR pipeline. Image evaluation needs a model that accepts images. The AI routes validate score/feedback types and clamp scores to the supplied maximum.

### AI provider flow

`src/lib/ai.ts` is shared by question generation, subjective grading, and assignment grading:

- If `OPENROUTER_API_KEY` is configured, OpenRouter is tried first.
- `OPENROUTER_MODEL` overrides the model name. The source currently defaults to `nvidia/nemotron-3.5-lightning:free`; that is a code default, not a guarantee of provider availability.
- If `GEMINI_API_KEY` is configured, Gemini is used when OpenRouter is unavailable/fails or no OpenRouter key is present.
- Responses are parsed as JSON by the calling route. Evaluation returns score and feedback; generation returns candidate questions for review and insertion.

These calls run through Next.js API routes. They do not use the InsForge AI gateway. Without either provider key, the non-AI portal can still be explored, but generation and AI grading fail.

## Architecture and backend migration

```text
Browser / Electron renderer
  |
  +-- React pages + AuthProvider + shared UI
  |     |
  |     +-- InsForge SDK -> Auth, Postgres, assignment storage
  |     +-- Local storage -> exam draft, answer/navigation state
  |
  +-- Next.js API routes
        |
        +-- InsForge admin client -> account creation, notifications, health
        +-- AI helper -> OpenRouter / Google Gemini
        +-- Judge0 helper -> remote code execution
```

Most application data queries run directly from client components or the shared data service. There is no separate Express backend. Next.js supplies the server endpoints for account creation, notifications, AI calls, code execution, and health checks.

### Authentication and profiles

`AuthProvider` calls `insforge.auth.getCurrentUser()`, then fetches the matching `public.users` row. It listens for auth changes and maps database fields such as `student_id` and `teaching_subjects` into the UI user model.

A usable account needs both an InsForge Auth identity and its application profile with the same UUID. The app shell redirects users without a loaded profile to `/login`. The login page offers sign-in/help; account creation is exposed through the admin interface.

The root route still checks the legacy local-storage key `exam_user_id` to choose between login and dashboard. That routing hint is separate from the InsForge session check.

### Migration compatibility layer

`src/lib/insforge.ts` exports `insforge` and `insforgeAdmin`. Its wrapper adds the familiar `.from(table)` shorthand over `client.database.from(table)` and converts single insert/upsert objects into arrays.

The following files/names remain for compatibility:

| Legacy name | Current meaning |
| --- | --- |
| `src/lib/supabase.ts` | Re-exports the InsForge clients under old and new names |
| `src/lib/data/supabase-service.ts` | Re-exports `insforge-service.ts` |
| `supabase` / `supabaseAdmin` exports | Aliases for the InsForge clients |
| Root seed/migration files and old export utilities | Historical Supabase assets; not the primary InsForge setup path |

The application dependency list uses `@insforge/sdk`; it no longer declares `@supabase/supabase-js`.

## Data model

The checked-in InsForge SQL defines the following application tables. JSON fields retain nested answer/test-case/settings data; many relational identifiers are UUIDs.

| Table | Main data and relationships |
| --- | --- |
| `users` | Profile/role/activation fields; `id` references `auth.users(id)`; student enrollment and faculty teaching-subject arrays |
| `subjects` | Code, name, department, semester, faculty reference field |
| `questions` | Subject and author references; options, marks, difficulty, coding fields, expected answer, rubric |
| `exams` | Subject/faculty references, schedule, duration, passing/total marks, JSON settings/instructions/question IDs |
| `exam_attempts` | Exam/student references, start/submit times, status, JSON answers, elapsed time, violation fields |
| `results` | Attempt/exam/student references, aggregate score, counts, JSON question results, violations |
| `notifications` | User reference, type, title/message, link, read state, creation time |
| `activity_logs` | User, action, details, timestamp, IP; schema exists, but no active application writer was found |
| `assignments` | Subject/faculty references, description, deadline, maximum marks, rubric, accepted types, attachment URL/type |
| `assignment_submissions` | Unique assignment/student pair, text or file URL/name, score, feedback, evaluation status/times |

Exam and question JSON commonly use camelCase keys while database columns use snake_case. Auth profiles are explicitly mapped; many page queries still use raw database rows, so new changes must account for both shapes.

Exam duration is expressed in minutes, attempt/result time in seconds, coding execution time in milliseconds, and memory in KB. Assignment deadlines use timestamps; exams store date and start time separately.

Storage URLs are currently persisted without a separate object-key field. This matters for future attachment deletion/replacement: the InsForge integration convention is to retain both the returned URL and key.

## Routes and API endpoints

### Page routes

Audiences below describe intended navigation and workflow, not a complete access-control guarantee.

| Route | Audience | Purpose |
| --- | --- | --- |
| `/` | Visitor | Entry redirect |
| `/login` | Visitor | InsForge email/password login and help |
| `/dashboard` | All roles | Role-specific dashboard |
| `/exams` | All roles | Exam list, search, filters, status |
| `/exams/create` | Faculty | Four-step exam publishing |
| `/exams/[id]` | All roles | Schedule/instructions, entry, attempts, live controls |
| `/exams/[id]/take` | Student | Redirect to standalone exam route |
| `/exam/[id]` | Student | Timed assessment interface |
| `/question-bank` | Faculty | Question authoring and AI generation |
| `/assignments` | All roles | Assignment list |
| `/assignments/create` | Faculty | Assignment creation |
| `/assignments/[id]` | All roles | Assignment details, student submission, faculty review |
| `/results`, `/results/[id]` | All roles | Role-aware lists and detailed results |
| `/analytics` | Faculty/admin | Completed-exam distributions and pass/fail charts |
| `/students`, `/faculty-manage` | Admin | Accounts, activation state, faculty subject assignment |
| `/notifications` | Signed-in users | Notifications and read state |
| `/settings` | All roles | Profile display and preference/security UI |

### Server endpoints

| Method and route | Purpose / inputs |
| --- | --- |
| `POST /api/admin/create-user` | Creates an Auth identity and profile from email, password, name, role, department |
| `POST /api/generate-questions` | Generates candidate questions from subject, topic, type, difficulty, count |
| `POST /api/execute` | Sends code, language, and test cases to Judge0; returns outputs and pass counts |
| `POST /api/evaluate-subjective` | Grades a written answer using question, rubric/expected answer, maximum marks |
| `POST /api/evaluate-assignment` | Grades text/extracted PDF text or image content |
| `POST /api/notifications/exam-created` | Notifies faculty and all student profiles about an exam |
| `POST /api/notifications/assignment-created` | Notifies faculty and all student profiles about an assignment |
| `POST /api/notifications/assignment-submitted` | Notifies the assignment's faculty member of a submission |
| `POST /api/notifications/notify-faculty` | Creates faculty-targeted notifications, including exam violations |
| `POST /api/notifications/mark-read` | Marks one notification or all unread notifications for a supplied user |
| `GET /api/health` | Queries one subject ID and returns database connectivity, latency, timestamp |

## Local setup and configuration

### Requirements

Use Node.js **24 or newer** for a straightforward match with the installed toolchain. Next.js itself allows Node 20.9+, but the installed PDF.js package requires Node 22.13+ or 24+; the framework minimum alone is insufficient for this checkout.

You need npm, access to the InsForge project and its schema, an account/profile for each role you want to exercise, and the relevant external services for AI/coding. Windows-specific tools are needed only for building the custom Windows installer.

### Environment

Create `.env.local` in the project root with your own values:

```dotenv
NEXT_PUBLIC_INSFORGE_URL=https://kbia4qk4.us-east.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=<project-anon-key>
INSFORGE_API_KEY=<server-api-key>

# Configure at least one provider for AI features.
OPENROUTER_API_KEY=<openrouter-key>
# Optional model override:
OPENROUTER_MODEL=<model-id>
# Optional fallback, or use Gemini as the only configured provider:
GEMINI_API_KEY=<gemini-key>

# Optional override; current source default is shown here.
JUDGE0_API_URL=https://ce.judge0.com
```

Remove unused optional entries rather than leaving placeholder values. The public URL and anon key are read by the browser client. `INSFORGE_API_KEY`, AI keys, and Judge0 configuration belong to server-side configuration.

The app reads `.env.local`; the CLI's local project link is `.insforge/project.json`. Both are ignored by Git. Obtain credentials through the project owner/approved credential store and do not copy keys into this README. Existing hardcoded fallbacks are tracked under [current implementation boundaries](#current-implementation-boundaries).

### Start the application

Install from the lockfile:

```bash
npm ci
```

Start Next.js and Electron together:

```bash
npm run dev
```

The `dev` script uses `concurrently`. Electron retries the local URL until Next.js is ready.

For browser-only development:

```bash
npx next dev
```

Open [http://localhost:3000/login](http://localhost:3000/login). If Next.js moves to another port because 3000 is occupied, Electron still targets 3000.

### Commands

| Command | Behavior |
| --- | --- |
| `npm run dev` | Next.js development server plus Electron |
| `npx next dev` | Web development server only |
| `npm run lockdown` | Electron only; requires the local web server in development |
| `npm run lint` | ESLint |
| `npm run build` | Next.js production build |
| `npm run start` | Serve the production build |
| `npm run package-exe` | Electron Builder Windows NSIS packaging |
| `npm run build-installer` | Custom Windows installer build |
| `node scripts/keep-alive.mjs` | One database connectivity query using local environment configuration |

For a local production web run, execute `npm run build` followed by `npm run start`. Hosting must support the Next.js server/API routes; a static-only export cannot run the AI, execution, admin, and notification endpoints.

## Desktop application and packaging

`main.js` opens a normal 1200 x 800 window first. Navigating to `/exam/` enables kiosk mode, always-on-top, content protection, and shortcut interception. Leaving that route disables those controls. Closing during lockdown prompts for confirmation.

Development loads `http://localhost:3000`. Packaged builds load the URL currently configured in the source: `https://exametra-online-examination-system.vercel.app`. The packaged wrapper therefore needs the hosted application and backend; it does not bundle an offline Next.js server.

The exam detail page detects Electron through the user agent. Browser users see a desktop download prompt; desktop entry requires the exam to be live and instructions to be acknowledged. This is a UI entry check, not server-side attestation of the desktop application.

There are two packaging paths:

| Path | Output and dependencies |
| --- | --- |
| Electron Builder: `npm run package-exe` | Windows NSIS output in `dist-electron`; build configuration includes `main.js` and `package.json` |
| Custom: `npm run build-installer` | Runs `npx electron-packager`, archives the app, compiles `scripts/Installer.cs`, and creates `public/Exametra-Setup.exe` plus a ZIP |

The custom script assumes Windows `tar` and the .NET Framework compiler at `C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe`. `electron-packager` is invoked through `npx` but is not declared in package dependencies.

The download link points to `/Exametra-Setup.exe`. Installer binaries/archives and distribution directories are ignored by Git, so a clean checkout/deployment will not automatically contain that download.

## Database setup and legacy scripts

The InsForge schema sources are:

1. `scripts/insforge-schema.sql`: users, subjects, exams, questions, attempts, results, notifications, activity logs.
2. `scripts/insforge-assignments-schema.sql`: assignments/submissions and indexes.
3. `scripts/insforge-data-migration.sql`: historical data import from Supabase, including Auth rows.

These are checked-in SQL files, not an automated migration runner. For a fresh environment, the core tables precede assignment tables; the `assignments` storage bucket must also be configured in InsForge. The SQL files do not provision that bucket. Treat the historical data import as a separate migration, not an everyday development seed command.

| File(s) | Current purpose / status |
| --- | --- |
| `scripts/check-users.ts`, `check-public-users.ts`, `check-subjects.ts` | InsForge reads for basic inspection; environment must be supplied to the runner |
| `scripts/seed-auth.ts` | Despite its name, now only queries profile rows and prints a count; it does not create/delete users |
| `scripts/verify-insforge.mjs` | Table checks and sign-in attempts using historical demo accounts; not proof those credentials are valid now |
| `scripts/keep-alive.mjs` | Loads `.env.local` and queries one subject |
| `scripts/generate-migration-sql.mjs` | Generates an import SQL file from a local Supabase dump |
| `scripts/analyze-types.mjs`, `check-user-fields.mjs` | Inspect the local dump |
| `scripts/dump-supabase-schema.mjs`, `inspect-db.mjs` | Legacy utilities still importing the removed Supabase SDK |
| `seed.sql`, `migration.sql`, `migration-assignments.sql`, `scripts/fix-subjects-rls.sql` | Historical Supabase-era assets; do not use as the default InsForge setup |
| `scripts/generate-seed.mjs` | References the absent `src/lib/data/mock-data` module; not a working seed path |

The current InsForge schema files enable RLS but grant broad `FOR ALL USING (true) WITH CHECK (true)` access. They describe the migration baseline, not role-restricted access rules. Live project policy state must be checked separately.

## Notifications and operational checks

Both the header badge and notifications page refresh from InsForge every **15 seconds**. Mark-read actions update the UI optimistically and dispatch a local `notifications_read` event so the header can update immediately. There is no active database realtime subscription in these components.

Exam/assignment creation currently broadcasts to all student profiles. It is not filtered to subject enrollment. Submission and violation messages target faculty through the notification API routes.

The health endpoint reads one subject ID through the admin client and returns a healthy/error response with latency and timestamp. A successful response means that query worked; it does not verify AI, storage, Judge0, or every user role.

`.github/workflows/keep-alive.yml` schedules a database ping at **00:00 and 12:00 UTC** and permits manual dispatch. It runs `scripts/keep-alive.mjs` and expects InsForge URL/API-key configuration through repository secrets. The workflow currently uses Node 20 and allows the ping step to fail without failing the job, so its green status is not a full application-health signal.

## Source map

```text
src/
  app/
    (app)/                 Authenticated dashboard shell and feature pages
      assignments/         List, create, detail and submission views
      dashboard/           Student, faculty and admin dashboards
      exams/               List, publish, detail and take-route redirect
      question-bank/       Question authoring and AI generation
      results/             Result history and detailed review
      analytics/           Exam performance charts
      students/            Student management
      faculty-manage/      Faculty management and subject assignment
      notifications/       Notification inbox
      settings/            Account/preference UI
    exam/[id]/             Standalone timed exam and mixed-question scoring
    api/                   Admin, AI, execution, health and notification routes
    login/                 Sign-in/help entry
  components/
    admin/                 Account, subject assignment and AI dialogs
    assignments/           Submission form and evaluation display
    auth/                  Login/help and reset-password component
    coding/                Monaco editor, language and test-case components
    layout/                Sidebar and header
    ui/                    Toasts, skeletons, badges, dialogs, metrics, navigation
  lib/
    insforge.ts            SDK client wrapper and compatibility aliases
    auth-context.tsx       Current user/profile, login and logout
    data/insforge-service.ts  Data access, dashboard summaries, assignments
    ai.ts                  OpenRouter/Gemini provider calls and JSON parsing
    judge0.ts              Language mapping, submission, polling, normalization
    evaluation.ts          Objective scoring/time-formatting helper
    utils/exam-status.ts   Schedule-derived status
  types/index.ts           Shared domain models
scripts/                   SQL, diagnostics, historical migration and installer tools
.github/workflows/         Scheduled backend ping
main.js                    Electron window and route-based lockdown
```

## Current implementation boundaries

These are source-level details relevant to anyone extending or demonstrating the project:

- **Stored settings versus enforcement:** question/option shuffle flags, immediate-result visibility, review visibility, attempts allowed, and time-end behavior are configurable, but the active exam page does not consistently enforce those settings. It currently always submits at timer expiry and redirects to a result after successful submission.
- **Resume behavior:** ordinary answers/navigation are locally saved; coding drafts are not included. Answer updates are written to the attempt on submission, not continuously synced to the database.
- **Scoring:** the page and shared helper have different negative-total handling. Partial-credit coding/subjective answers do not always increment correct/incorrect counters, so those counters may not sum to question count.
- **Authorization:** client role navigation and activation toggles do not provide complete enforcement. The auth context does not reject inactive profiles. Several privileged endpoints lack caller authorization; the create-user route reads a bearer value but does not enforce the queried admin role.
- **Credential migration:** `src/lib/insforge.ts`, some scripts, and the keep-alive workflow contain hardcoded credential fallbacks. Browser/admin clients also share a module. These need removal and credential rotation/server-only separation; supplying environment values alone does not remove literals already in source/history.
- **Account settings:** the settings password handler currently validates input and shows a success toast without calling Auth. Email/reminder preferences are UI state; the copy/paste override is saved locally.
- **Enrollment:** student exam queries accept a student ID but do not filter exams by enrollment. Faculty exam creation has a fallback that lists all subjects when assigned-subject lookup returns none.
- **Analytics:** selected-exam distributions and pass/fail reporting are implemented. Per-question analytics and cross-exam average charts remain unpopulated/hidden.
- **Files:** assignment storage persists URLs without keys; PDF grading relies on text extraction and a CDN-hosted PDF.js worker.
- **Testing:** no automated test command is defined in `package.json`. The scripts under `scripts/` are utilities, not a regression suite.

## Troubleshooting and verification

| Symptom | Where to look |
| --- | --- |
| Sign-in succeeds but the portal returns to login | Matching `auth.users` identity and `public.users` profile; profile read errors in `auth-context.tsx` |
| Tables appear empty or database reads fail | InsForge URL/key pairing, schema presence, access policies, and `/api/health` |
| AI generation/grading fails | Provider keys, selected model, image support, provider response and JSON parsing |
| Coding execution fails | `JUDGE0_API_URL`, configured language IDs, remote execution response and polling timeout |
| Assignment upload fails | `assignments` bucket, storage permissions, uploaded file and returned URL |
| PDF submission has no useful text | PDF text layer and PDF.js worker availability |
| Exam cannot be started | Local clock/timezone, live schedule, latest attempt status, entry mode |
| Progress is missing after reload | Same browser/profile local storage, exam state key, coding-draft limitation |
| Electron keeps retrying | Next.js is listening on port 3000; packaged app is using the configured hosted URL |
| Download link returns 404 | `public/Exametra-Setup.exe` was built and included in the deployment |
| Notification badge is stale | 15-second polling, mark-read API response, local notification event |

For code changes, run `npm run lint` and `npm run build` separately; Next.js 16's build does not run ESLint automatically. Read the relevant bundled Next.js guide under `node_modules/next/dist/docs/` before changing framework behavior.

For a functional walkthrough, use a development backend: create an account/profile, assign a faculty subject, publish a small exam, take it during its live window, inspect the result, submit an assignment, and check notifications. Include objective, coding, and subjective questions when verifying all evaluation paths.

This documentation refresh was checked against repository source and local file references. It did not execute database imports, run account-modifying scripts, validate live service credentials, or exercise an exam end to end.
