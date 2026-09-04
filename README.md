# ESPN-API

A Typescript Wrapper Over the ESPN Public API

**Description:**

This project provides a Typescript wrapper around the ESPN public API, currently supporting functions and type mappings for the "/{sport}/{league}/scoreboard" and "/{sport}/{league}/summary?event={eventid}" endpoints. Use this library to easily consume data from the ESPN API in your project

**Features:**

- Supports multiple sports and leagues.
- Provides easy access to scoreboards and summaries via the ESPN API.
- Comes with well-documented functions and types for better understanding of development experience.

## Technologies Used

- **Typescript**: The primary language used for developing this wrapper.
- **ESPN API**: The public API used as the data source.

## Documentation

To view the documentation for this project, visit the project documentation site hosted on GitHub Pages [here](https://mikelaferriere.github.io/espn-api).

## Setup & Installation

To set up and run the project locally, follow these steps:

### Clone the repository using HTTPS:

```bash
  git clone https://github.com/mikelaferriere/espn-api.git
```

### Install dependencies:

```bash
  npm install
```

### Build the project:

```bash
  npm run build
```

### Run the tests:

```bash
  npm run test
```

## Usage

Once you have successfully set up the project locally, you can use it by importing the relevant classes. For example:

```javascript
import { Scoreboard, Summary, Enums, Types } from '@mikelaferriere/espn-api'

const league = Enums.League.NFL
const scoreboards = await Scoreboard.fetch(league)
```

## Releasing

Releases are automated - no need to manually run `npx changeset` before committing. `main` is branch-protected (changes must go through a pull request), so the release pipeline never pushes directly to `main`:

- **Automatic patch release (default):** the `Add patch changeset` workflow detects any PR that changes files under `lib/` and adds a patch changeset to that PR (committed by `github-actions[bot]`). Merging the PR pushes to `main`, which triggers the `Trigger release` workflow.
- **Manual trigger (patch/minor/major):** the `Trigger release` workflow can also be run from the GitHub Actions UI (Actions > `Trigger release` > `Run workflow` > `main`), with a `patch`, `minor`, or `major` bump selected, which synthesizes a changeset first.
- **Versioning PR:** when the `Trigger release` workflow finds changesets on `main`, it builds, tests, and runs `changeset version`, then commits the bump to a throwaway branch and opens a `Version Packages` PR against `main` with auto-merge enabled (and waits for it to merge). Direct pushes to `main` are rejected by branch protection, so the PR is the only path in.
- **Publish + release:** the merge of the version PR re-pushes `main`, which runs the `Publish to npm` workflow. It publishes the new version to npm with provenance (OIDC trusted publishing) when it is numerically ahead of the version on npm (the old string comparison got `3.10.0` vs `3.9.0` wrong), then creates the `v{version}` git tag and GitHub Release. It also serves as the fallback publisher for any manual version edit that lands on `main` through a PR.
- **Docs-only changes** (no `lib/` changes) do not get a changeset and therefore do not trigger a release.

## Contributing

Contributions are always welcome! If you've found a bug, have feature requests, or want to improve something, please submit a pull request or open an issue with a detailed description.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Contact Me

If you have any questions or suggestions regarding this project, feel free to contact me on LinkedIn [here](https://www.linkedin.com/in/michael-laferriere).
