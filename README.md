 In-Time – Developer Task Journal

A React web app that helps developers recover from interruptions.

<!-- Add 2–3 screenshots here: project list, pause journal, resume screen -->
<!-- ![Pause journal](docs/pause.png) -->

## What it does

Developers lose time every time they're interrupted, because getting back into a task means remembering where they were. In-Time makes that hand-over to your future self explicit.

- **Projects and tasks:** organise work into projects, each with tasks that have deadlines, objectives, dependencies, methods and a priority ranking
- **Interruption journal:** when you pause a task, In-Time asks four short questions: what you last worked on, where to pick up next time, whether you reached your goal for the session, and what's still missing
- **Context call:** store reference notes, links and resources alongside the task
- **Resume:** when you come back, In-Time shows your latest journal entry and saved context so you can start straight away
- **Filtering:** view all, active or completed projects

All data is stored locally in the browser (localStorage), so there's no account or backend needed.

## Tech stack

React 19 · Vite · localStorage · ESLint

## Run locally

```bash
git clone https://github.com/Wayneoooo/in-time
cd in-time
npm install
npm run dev
```

Then open http://localhost:5173.


