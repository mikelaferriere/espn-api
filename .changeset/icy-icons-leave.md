---
'@mikelaferriere/espn-api': major
---

feat: expand ESPN API — 10 modules, 7 leagues, full endpoint coverage
BREAKING CHANGES:

- Types are now exported directly from the barrel (not nested under `Types`)
- `FeaturedAthelete` renamed to `FeaturedAthlete` (typo fix)
- `Competition.format` is now properly typed (was `any`)
- `BaseGameDetails.standings` and `gameInfo.officials` are now properly typed (were `any[]`)
  New Modules:
- teams: fetchTeams(), fetchTeam() — team list with pagination + team detail
- roster: fetchRoster() — full roster with athlete details and coach data
- draft: fetchDraft() — draft picks by year with round/pick details
- injuries: fetchInjuries() — league injuries with per-team filtering
- news: fetchNews() — league news articles
- standings: fetchStandings() — standings helper aggregating team records
- playoffs: getSeasonPhase(), isPlayoffs(), getSeriesStatus(), fetchPlayoffGames()
  New Leagues:
- NCAAF (college football)
- NCAAB (college basketball)
- MLS (soccer)
  Enhancements:
- Scoreboard now supports date ranges, week/year/seasontype params for historical queries
- Added SeasonPhase enum (Preseason, Regular, Postseason, Offseason)
- Consistent error handling across all modules with proper message extraction
- Fixed "Leauge" typo in utils.ts error message
  Quality:
- 116 tests across 11 suites, 99.51% statement coverage
- Zero `any` types in lib/
- All 7 leagues covered by test fixtures
- Integration tests verify cross-module data flows
- TypeDoc documentation regenerated
