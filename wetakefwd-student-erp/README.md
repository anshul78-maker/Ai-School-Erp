# WeTakeFwd — AI Student Dashboard

A working full-stack version of the WeTakeFwd student dashboard: real login,
a database that remembers changes, and an AI study buddy powered by Claude.

Built with plain Node.js + Express + SQLite on the back end and vanilla
HTML/CSS/JS on the front end, so it is small, fast, and easy to host anywhere.

---

## What works out of the box

- Student login (username + password), with sessions
- A dashboard that loads real data from the server
- Overview with animated rings, a performance graph, and topic-level strengths
- Subjects, achievements, a leaderboard, and today's timetable
- A study plan where ticking tasks is **saved to the database**
- A **focus timer** for 25-minute study sprints
- An **AI study buddy** and **weekly insight** (live when you add an API key,
  built-in sample answers when you don't)

---

## Run it (about 3 minutes)

You need [Node.js](https://nodejs.org) version 18 or newer installed.

1. Open a terminal in this folder.
2. Install the dependencies:
   ```
   npm install
   ```
3. Create your config file by copying the example:
   - On Mac/Linux: `cp .env.example .env`
   - On Windows: `copy .env.example .env`
4. Start the app:
   ```
   npm start
   ```
5. Open your browser at **http://localhost:3000**

**Demo login:** username `priya`, password `priya123`

The database (`data.db`) is created automatically on first run.

---

## Turn on the real AI study buddy

The study buddy works immediately with built-in sample answers. To make it a
live AI tutor:

1. Get an API key from https://console.anthropic.com (API keys).
2. Open the `.env` file and paste it after `ANTHROPIC_API_KEY=`.
3. Restart the app (`npm start`).

Now the study buddy and the "Refresh with AI" insight button call Claude in
real time. The model is set by `AI_MODEL` in `.env` — see
https://docs.claude.com for the current list of models.

---

## Project layout

```
wetakefwd-student-erp/
├── server/
│   ├── index.js          Express server (serves the API and the site)
│   ├── db.js             SQLite database + auto-seeding
│   ├── auth.js           Login tokens and the "must be signed in" check
│   ├── ai.js             Claude study buddy + weekly insight (with fallback)
│   └── routes/
│       ├── auth.js       POST /api/login
│       └── student.js    dashboard data, task toggle, buddy, insight
├── public/               The website the browser loads
│   ├── login.html
│   ├── index.html        The dashboard
│   ├── css/styles.css
│   └── js/               api.js, login.js, app.js
├── seed/data.js          The starting data (edit this to change the demo)
├── .env.example          Configuration template
└── package.json
```

---

## Common tasks

- **Change the demo data** (marks, tasks, name, subjects): edit `seed/data.js`,
  then re-seed the database with `npm run seed`.
- **Add another student:** add an object to the `students` array in
  `seed/data.js` and run `npm run seed`.
- **Reset everything:** delete `data.db` and start the app again.

---

## Notes for going to production

This is a solid foundation, not a finished commercial ERP. Before real school
use you would want to add: HTTPS, stronger password rules and password reset,
rate limiting on the API, teacher/parent/admin roles, and a managed database
(e.g. Postgres) instead of the local SQLite file. The code is organised so each
of those slots in cleanly.
