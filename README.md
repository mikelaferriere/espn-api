# ESPN-API

A Typescript Wrapper Over the ESPN Public API

**Description:**

This project provides a Typescript wrapper around the ESPN public API, currently supporting functions and type mappings for the "/{sport}/{league}/scoreboard" and "/{sport}/{league}/summary?event={eventid}" endpoints. Use this library to easily consume data from the ESPN API in your Typescript projects

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

To set up and run this project locally, follow these steps:

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

Once you have successfully installed and set up your project, you can use it by importing the required functions and types. For example:

```javascript
import { Scoreboard, Summary, Enums, Types } from '@mikelaferriere/espn-api'

const league = Enums.League.NFL
const scoreboards = await Scoreboard.fetch(league)
```

## Releasing

Releases are automated - no need to manually run `npx changeset` before committing:

- **Automatic patch release (default):** the `Auto patch changeset` workflow detects any PR that changes files under `lib/` and adds a patch changeset to that PR (committed by `github-actions[bot]`). Merging the PR triggers the `Trigger release` workflow on `main`, which bumps the version, publishes to npm with provenance, and creates a `v{version}` tag and GitHub Release.
- **Manual trigger (patch/minor/major):** the `Trigger release` workflow can also be run from the GitHub Actions UI (Actions > `Trigger release` > `Run workflow` > `main`), with a `patch`, `minor`, or `major` bump selected. It builds, tests, versions, publishes, and tags.
- **Versioning PRs (optional):** when a changeset lands on `main`, the `Create Versioning PR` workflow opens a `Version Packages` PR as before. Merging it is NOT required - pending changesets are versioned and published automatically on the next push to `main` - so these PRs can simply be closed.
- **Fallback publisher:** on every push to `main`, the `Publish to npm` workflow publishes the version in `package.json` if it is numerically ahead of the version currently on npm (the previous string comparison got `3.10.0` vs `3.9.0` wrong).
- **Docs-only changes** (no `lib/` changes) do not get a changeset and therefore do not trigger a release.

## Contributing

Contributions are always welcome! If you've found a bug, have feature requests, or want to improve something, please submit a pull request or open an issue with a detailed description.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Contact Me

If you have any questions or suggestions regarding this project, feel free to contact me on LinkedIn [here](https://www.linkedin.com/in/michael-laferriere).
