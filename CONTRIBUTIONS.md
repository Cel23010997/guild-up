# Celeste's GuildUp contributions

## Concept and design

I originated the GuildUp concept and overall design: turning task coordination into a shared guild experience. The project was developed collaboratively with Chloe Lau, using her earlier canvas project as a starting point.

## Implementation evidence

The original local team repository retains these commits. These are provenance references, not commits manufactured for this public snapshot.

| Work | Original commit | What changed |
| --- | --- | --- |
| Assignment-planner interface and task workflows | `7900899` | Introduced the planner table, assignment interface, draft acceptance and rejection, projected fairness and related frontend/backend integration. |
| Contextual interaction HUD | `87cb262` | Added object-specific hints and descriptions for tasks, fairness, personal tasks and the planner. |
| Responsive interfaces | `53f21cf` | Refined task forms, overlays and responsive styling. |
| Multiplayer position consistency | `21bcda7` | Normalized saved and received positions and rescaled teammate positions across viewport sizes. |
| AI-assisted task creation | `c3476d2` | Added AI-assistance backend handling and frontend integration. |

Concept/design attribution above is my account of the work. The implementation descriptions were checked against the original commit diffs. Commit totals are not used as a workload percentage.

## This portfolio edition

The browser demo replaces external persistence with a local adapter, supplies sample tasks, hides the email field, and explains which online features are outside the demo. These are later portfolio adaptations, not claims about what shipped at the hackathon.
