# Exametra

Exametra is a role-based online assessment portal for students, faculty, and administrators. It is built with Next.js and Supabase and supports the full assessment workflow: question management, exam publishing, timed delivery, automatic marking, results, notifications, and reporting.

## Highlights

- Role-aware dashboards and navigation for students, faculty, and administrators.
- Faculty question bank with MCQ, true/false, and multi-select questions, difficulty levels, topics, and bulk deletion.
- Four-step exam creation flow: details, question selection, settings, and review. Drafts are saved in the browser.
- Scheduled, live, completed, and missed exam states calculated from each exam's date, start time, and duration.
- Fullscreen timed exam experience with question navigation, answer review, option/question shuffling, auto-submit, and optional negative marking.
- Client-side exam-integrity checks that flag tab switches, fullscreen exits, and suspected background-tab throttling. Faculty and administrators can review attempts and allow a retake.
- Automatic scoring, pass/fail determination, per-question result review, performance charts, and pass/fail analytics.
- Supabase authentication, profile data, database-backed notifications, and real-time notification updates.
- Optional Electron launcher for running the application in a desktop shell.

## Tech stack

- Next.js 16, React 19, TypeScript, and Tailwind CSS 4
- Supabase Auth and Postgres via `@supabase/supabase-js`
- React Hook Form and Zod for forms and validation
- Recharts for analytics, Lucide for icons, and GSAP/Lottie for interface motion
- Electron for the optional desktop launcher

## Getting started

### Prerequisites

- Node.js (use a current LTS release)
- An accessible Supabase project
- A Supabase schema containing the tables used by the app: `users`, `subjects`, `questions`, `exams`, `exam_attempts`, `results`, and `notifications`


## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm run lockdown` | Start the Electron wrapper defined in `main.js`. |

## Supabase data and seeding

The application reads and writes the following Supabase tables:

| Table | Purpose |
| --- | --- |
| `users` | Profile and role data for students, faculty, and administrators. Each profile is associated with a Supabase Auth user. |
| `subjects` | Subjects, departments, semesters, and assigned faculty. |
| `questions` | Question content, options, marks, difficulty, topic, and ownership. |
| `exams` | Exam schedule, configuration, selected question IDs, and status. |
| `exam_attempts` | Student answers, elapsed time, attempt state, and integrity flags. |
| `results` | Calculated scores, question-level marking details, and pass/fail outcome. |
| `notifications` | In-app notification records and read state. |

[`seed.sql`](seed.sql) provides sample users, subjects, exams, questions, attempts, results, and notifications. It expects the application schema to exist and creates matching records in `auth.users` before inserting their public profiles. Run it in the Supabase SQL Editor only against a development project.

`scripts/seed-auth.ts` can create the matching Supabase Auth users through the Admin API. It deliberately clears existing user-related records and Auth users first, so it is destructive and must never be used against production. The script requires the service-role key and a TypeScript runner (for example, `npx tsx scripts/seed-auth.ts`) with the environment variables loaded.

The `scripts/check-*.ts` helpers query seeded users or subjects, while `scripts/fix-subjects-rls.sql` enables public read access for `subjects`. Review and adapt row-level-security policies to your deployment before allowing real users to access the system.

## Roles and capabilities

| Role | Main capabilities |
| --- | --- |
| Student | View dashboard and scheduled exams, take or resume an exam, review results, receive notifications, and manage preferences. |
| Faculty | Create exams, maintain the question bank, view assigned exam attempts and results, allow retakes, and view analytics. |
| Administrator | View platform metrics, manage student and faculty activation status, access examinations/results/analytics, and delete exams. |

## How the assessment workflow works

```text
Faculty creates questions
        ↓
Faculty creates an exam and selects questions/settings
        ↓
Students view the scheduled exam and acknowledge instructions
        ↓
The exam opens in fullscreen mode and an attempt is created or resumed
        ↓
Answers, elapsed time, navigation state, and violations are tracked
        ↓
Time expires or the student submits
        ↓
The result is calculated, saved, and made available for review/analytics
```

### 1. Question preparation

Faculty members use the **Question Bank** to view, filter, add, and delete questions. Questions contain a subject, topic, difficulty, marks, type, answer options, optional explanation, and correct-option flags. Supported answer types are:

| Type | Behaviour |
| --- | --- |
| `mcq` | One selected answer is expected. |
| `true-false` | A two-option question represented as an MCQ-style answer. |
| `multi-select` | Multiple answers can be selected; the full selected set must exactly match the correct set. |

### 2. Exam creation and configuration

The create-exam page is split into four stages: **Details**, **Questions**, **Settings**, and **Review**. The working draft is stored in local storage under `exam_draft_v1` so that an in-progress form can be resumed in the same browser.

Every exam includes a title, description, subject, scheduled date/time, duration, passing marks, selected questions, instructions, and allowed number of attempts. Its settings can enable or disable:

- question shuffling;
- answer-option shuffling;
- immediate result visibility;
- answer review after submission;
- negative marking with a configurable percentage; and
- automatic submission when the timer ends.

Exam status is derived at runtime from its scheduled date, start time, and duration. The interface uses `draft`, `upcoming`, `live`, `completed`, `cancelled`, and `missed` states.

### 3. Taking an exam

Students begin from an exam detail page after acknowledging its instructions. The application requests fullscreen mode and then redirects to the standalone `/exam/[id]` interface. This route is kept outside the normal sidebar/layout so the candidate can focus on the exam.

The exam interface loads the exam, its subject, selected questions, and any existing in-progress attempt. It supports a countdown timer, previous/next navigation, direct question navigation, marked-for-review answers, persisted attempts, and final submission. An in-progress attempt can be resumed when the exam allows it.

### 4. Integrity and violations

During an attempt the client listens for fullscreen changes, browser visibility changes, and abnormal background-tab timing. Leaving fullscreen or switching away shows a warning and can trigger submission after the configured grace period. The resulting attempt and result store `is_violation` plus a human-readable `violation_reason`.

These checks are browser-side deterrents, not a replacement for an institutional proctoring solution. The Electron wrapper offers a more restrictive kiosk-like environment, but its ability to block operating-system shortcuts depends on the platform.

### 5. Evaluation and results

When an attempt is submitted, the system compares every selected answer with its question's correct option IDs. It records question-level answers, awarded marks, deducted marks, correct/incorrect/unanswered counts, total time spent, percentage, and pass/fail status.

Incorrect answers can receive a configurable fraction of the question's marks as a deduction; scores are never allowed below zero. Students can view their own result history and per-question review, while faculty and administrators can view exam-level results and pass/fail metrics.

## Route guide

| Route | Audience | Purpose |
| --- | --- | --- |
| `/` | Visitor | Entry/loading route that forwards to login or dashboard. |
| `/login` | Visitor | Supabase email/password sign-in screen. |
| `/dashboard` | All signed-in roles | Renders the student, faculty, or admin dashboard. |
| `/exams` | All signed-in roles | Browse and filter examinations. |
| `/exams/create` | Faculty | Create an exam from question-bank items. |
| `/exams/[id]` | All signed-in roles | View an exam, instructions, attempts, and role-specific actions. |
| `/exams/[id]/take` | Student | Redirects to the standalone assessment screen. |
| `/exam/[id]` | Student | Fullscreen exam-taking experience. |
| `/question-bank` | Faculty | Manage questions. |
| `/results` and `/results/[id]` | Student, faculty, admin | Result lists, statistics, and detailed review. |
| `/analytics` | Faculty, admin | Score distribution and pass/fail charts for completed exams. |
| `/students` and `/faculty-manage` | Admin | Search, filter, enable, or disable accounts. |
| `/notifications` | Student, faculty | View and mark notifications as read. |
| `/settings` | All signed-in roles | Account and preference interface. |

## Application architecture

```text
Next.js App Router
├── Public/auth routes: `/` and `/login`
├── Protected app shell: `src/app/(app)`
│   ├── AuthProvider loads a Supabase session and profile
│   ├── AuthGuard redirects users without a profile to `/login`
│   ├── Sidebar exposes links appropriate to the current role
│   └── Header shows the current area and live unread-notification count
├── Standalone exam routes: `src/app/exam/[id]`
└── Server API route: notification mark-as-read endpoint

Supabase
├── Auth: email/password session management
├── Postgres: profiles, exams, questions, attempts, results, notifications
└── Realtime: notification changes reflected in the header/page
```

### Key source areas

| Location | Responsibility |
| --- | --- |
| `src/lib/supabase.ts` | Browser Supabase client created from public environment variables. |
| `src/lib/auth-context.tsx` | Session listener, profile lookup from `users`, login, logout, and `useAuth`. |
| `src/lib/data/supabase-service.ts` | Reusable dashboard/exam/result/subject queries and summary calculations. |
| `src/lib/evaluation.ts` | Deterministic scoring and time-formatting helpers. |
| `src/lib/utils/exam-status.ts` | Runtime exam-status calculation from date/time/duration. |
| `src/types/index.ts` | Shared domain contracts for users, exams, questions, attempts, results, and notifications. |
| `src/components/layout` | Shared sidebar and header used in the authenticated shell. |
| `src/components/ui` | Toasts, badges, skeletons, dialogs, empty states, metrics, and page-header primitives. |
| `src/app/api/notifications/mark-read/route.ts` | Server-side notification update endpoint using an admin Supabase client. |

## Dashboards and reporting

The dashboard selected at `/dashboard` is determined by the profile role:

- **Student dashboard:** upcoming and completed exams, result summaries, subject context, recent results, and performance visualizations.
- **Faculty dashboard:** owned exams, active/upcoming counts, student count, calculated exam-level averages, pass rates, and performance charts.
- **Administrator dashboard:** platform-wide totals for students, faculty, exams, and completed attempts, plus management shortcuts.

The analytics area currently focuses on a selected completed exam. It displays score ranges (`0–20%` through `81–100%`), passed/failed counts, and average score using Recharts. Per-question analytics is structurally prepared but not currently populated.

## Notifications

Notifications are stored in the `notifications` table with a target user, type, title, message, link, timestamp, and read state. The header uses a Supabase Realtime subscription to refresh the unread badge whenever that user's notification records change. The notifications page can mark one notification or all notifications as read through the dedicated API route.

## Desktop/kiosk mode

`npm run lockdown` starts `main.js`, which opens the already-running web app at `http://localhost:3000` in an Electron fullscreen, always-on-top kiosk window. Start `npm run dev` first. The wrapper attempts to register handlers for common close/window-switch shortcuts and asks for confirmation when the window is closed.

## Project structure

```text
src/
  app/                 Next.js routes, protected app shell, exam flow, and API routes
  components/          authentication, layout, and reusable UI components
  lib/                 Supabase client, auth context, data access, evaluation, and exam-status logic
  types/               shared TypeScript domain models
scripts/               Supabase seeding, inspection, and RLS helper scripts
seed.sql               development seed data
main.js                Electron main process
```

## Important implementation notes

- The protected application shell lives under `src/app/(app)` and redirects unauthenticated visitors to `/login`.
- The dedicated exam-taking interface is at `/exam/[id]`; `/exams/[id]/take` redirects there so the assessment can run outside the normal dashboard shell.
- Exam scoring is implemented in `src/lib/evaluation.ts`, including multi-select matching and optional negative marking.
- The notification mark-read API route uses the Supabase service-role key. Deploy it only in an environment where its server-side variables are configured securely.

## Production checklist

- Define and test restrictive Supabase row-level-security policies for every table.
- Keep the service-role key server-only and rotate it if it is ever exposed.
- Replace the development seed data and test password before launch.
- Validate the fullscreen and integrity behavior across the browsers your institution supports.
- Run `npm run lint` and `npm run build` before deployment.
