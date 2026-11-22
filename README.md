# GuildUp!

**A task manager that turns teamwork into a shared RPG guild.** Walk around the hall, pick up tasks, balance workloads and earn XP.

[Play the browser demo](https://Cel23010997.github.io/guild-up/) · [My contributions](CONTRIBUTIONS.md)

**My role — Celeste Tong:** original concept and overall design; assignment-planner interface, contextual interaction HUD, responsive UI, multiplayer position handling, and AI task-management features with an Express backend.

**Stack:** JavaScript, HTML5 Canvas, Node.js and Express. The original team project also used Supabase and the OpenAI API.

## What the original project was meant to be

A shared multiplayer guild for real teams: create work together, see teammates in the hall, consider workload and mood, use AI assistance for tasks and assignment suggestions, and connect task events to notifications. The original architecture combined the Canvas frontend, a Supabase database/realtime layer and an Express AI backend.

## What this browser demo does

The public link provides an independent, account-free way to explore that idea. It uses sample teammates and saves tasks in the visitor's own browser.

| Feature | Original project goal | Public demo |
| --- | --- | --- |
| Guild hall | A shared space with real teammates | Explore the hall with sample guild members |
| Tasks and XP | Shared team tasks and individual progress | Create, accept and complete local demo tasks |
| Assignment planner | AI-assisted suggestions informed by team workload | A transparent local workload rule; no AI request |
| Storage | Shared Supabase database | Browser local storage on this device |
| Multiplayer and notifications | Realtime presence and task notifications | No online multiplayer or email |
| Setup | Database and backend configuration, private service credentials | Open the link; no account, installation or API key |

The original backend source is included for technical review. Restoring the complete online experience would require a new database, service configuration and end-to-end testing; the demo does not connect to the original team's services.

## Try it

Enter with the prefilled demo name and choose a class. Move with **W A S D**, press **E** near an object, and use **Escape** to close an interface.

- **Task board:** create and accept shared tasks.
- **Cupboard:** manage personal tasks and complete accepted tasks for XP.
- **Assignment planner:** preview and accept a workload-based allocation.
- **Main table:** inspect workload and mood across the guild.

This edition stores its data on the visitor's device. Lumi and Finch are sample guild members. It does not connect to the original shared database, send email, or provide online multiplayer or AI responses. The original Express AI implementation is retained in `backend/` for code review; it is not deployed by the demo.

## Run locally

Serve `docs/` with any static HTTP server, for example `python -m http.server 8000 --directory docs`, then open `http://localhost:8000`.

The demo needs no account, API key, package installation or build step. It loads GSAP, Howler.js and a font from their public CDNs.

To inspect the original AI server, see `backend/server.js`. Its optional local setup uses `npm install` inside `backend/`, a private `.env` based on `.env.example`, and `npm start`. Enabling a complete online edition also requires deliberate frontend and database configuration; starting the server alone does not enable this browser demo's AI buttons.

## Collaboration and provenance

GuildUp was a two-person hackathon project by **Celeste Tong and Chloe Lau**. The canvas foundation originated in Chloe's earlier Paletteburg project. Chloe also contributed frontend and realtime work. See [CONTRIBUTIONS.md](CONTRIBUTIONS.md) for the specific work represented here.

This public repository starts from a reviewed snapshot of the original team project, followed by changes for an independent local demo. It is not a reconstructed or backdated version of the team's original Git history. The original repository remains preserved separately.

The guild hall and object artwork used AI-generated assets; character sprites came from Kenney's CC0 assets. Existing authorship and third-party notices remain applicable. No open-source license for the whole team project is implied.

## Validation

Run `node --test tests/demo-store.test.cjs` for the task lifecycle, persistence, workload and contact-data exclusion checks. The hosted demo is static; its data adapter does not make service requests.
