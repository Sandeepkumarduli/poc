# StudentKitPro — clickable prototype

A school management portal prototype for students, teachers and the principal.
**Not production:** no backend, no database, no real authentication. All data is hardcoded in [`data/mock.ts`](data/mock.ts) and changes are kept in the browser (Zustand + `localStorage`).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. It deploys to Vercel as-is (no environment variables).

## Demo accounts

Password for all three: **`demo123`**

| Role    | Email                | Name             | Lands on   |
|---------|----------------------|------------------|------------|
| Student | `student@school.com` | Aarav Sharma, 8-A, roll 12 | `/student` |
| Teacher | `teacher@school.com` | Mrs. Meera Rao, class teacher 8-A, Maths | `/teacher` |
| Admin   | `admin@school.com`   | Mr. Rajesh Kumar, Principal | `/admin` |

On the login page you can click an account under "Demo accounts" to fill the form.

## 3-minute demo script

**Before you start:** log in as admin and click **Reset demo** at the bottom of the sidebar, then log out.

1. **Student, before (30 s).** Log in as `student@school.com`. On the Overview, attendance is **93%**, and the pill at the top says *Today's attendance not marked yet*. Open **Marks** and note Maths Mid Term (77). Log out.
2. **Teacher marks attendance (60 s).** Log in as `teacher@school.com`. The Overview shows *Today's attendance is not marked yet*. Open **Attendance**, click **Mark all present**, switch **Aarav Sharma** to **Absent**, click **Save attendance**, and a toast confirms it.
   Optional: in **Marks**, keep *Mid Term / Maths*, change Aarav to 88 and save. In **Homework** or **Notices**, post a new item.
   Log out.
3. **Student sees it (45 s).** Log in as the student again. Attendance has dropped to **90%**, the top pill says **Today: Absent**, and today is **red** on the Attendance calendar. Marks, homework and notices show the teacher's changes. Try the **Guide** chat chips.
4. **Admin sees totals (45 s).** Log in as `admin@school.com`. **Attendance today** now counts all 500 students, and the trend chart's last point updates. Show **Fees** (defaulter list), **Classes**, **Timetable** (pick a class), and **Reports → Download report card**.

## How the shared state works

- [`lib/store.ts`](lib/store.ts) holds the session plus the editable data (attendance, marks, homework, notices), persisted to `localStorage` under `studentkitpro-demo-v1`. This is the prototype's "local JSON record". Vercel cannot write files at runtime, so it lives in the browser.
- All roles read from the same store, so a teacher's save is visible to the student and admin **in the same browser**.
- Untouched demo data re-seeds itself each new school day, so dates stay current. Once anything is edited, it stays until **Reset demo** is clicked.
- Route guards in [`components/AppShell.tsx`](components/AppShell.tsx): logged out → `/login`; another role's URL → your own dashboard.

## Project layout

```
app/            login, student/*, teacher/*, admin/* pages (App Router)
components/     AppShell, Sidebar, Topbar, StatCard & UI kit, DataTable, Calendar, TimetableGrid, Toaster …
data/mock.ts    every piece of hardcoded data
lib/            store (Zustand), selectors, utils
public/         sample-report-card.pdf (regenerate: node scripts/make-sample-pdf.mjs)
```

Stack: Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Zustand, Recharts. Font: Poppins, bundled in `app/fonts`.
