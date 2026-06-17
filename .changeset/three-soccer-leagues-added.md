---
'@mikelaferriere/espn-api': minor
---

Add three international soccer leagues to the `League` enum and URL mapping:

- `League.WORLD_CUP` → `soccer/fifa.world` (FIFA World Cup)
- `League.EUROS` → `soccer/uefa.euro` (UEFA European Championship)
- `League.CHAMPIONS_LEAGUE` → `soccer/uefa.champions` (UEFA Champions League)

Each enum value maps to a single, isolated competition, so all existing endpoints (scoreboard, summary, teams, roster, news, injuries, draft) work out of the box via the existing `enumToUrlString` registry. No other changes required.
