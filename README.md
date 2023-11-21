# ESPN-API

A Typescript Wrapper Over the ESPN Public API

**Description:**

This project provides a Typescript wrapper around the ESPN public API, currently supporting functions and type mappings for the "/{sport}/{league}/scoreboard" and "/{sport}/{league}/summary?event={eventid}" endpoints. Use this library to easily consume data from the ESPN API in your Typescript projects.

**Features:**

- Supports multiple sports and leagues.
- Provides easy access to scoreboards and summaries via the ESPN API.
- Comes with well-documented functions and types for better understanding and development experience.

## Technologies Used

- **Typescript**: The primary language used for developing this wrapper.
- **ESPN API**: The public API used as the data source.

## Documentation

To view the documentation for this project, visit the project documentation site hosted on GitHub Pages [here](https://mikelaferriere.github.io/espn-api).

## Setup & Installation

To set up and run this project locally, follow these steps:

### Clone the repository using HTTPS:

```bash
  git clone https://github.com/@mikelaferriere/espn-api.git
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
Once you have successfully installed and set up the project, you can use it by importing the required functions and types. For example:

```javascript
  import { Scoreboard, Summary, Enums, Types } from '@mikelaferriere/espn-api';

  const league = Enums.League.NFL;
  const scoreboards = await Scoreboard.fetch(league);
```

## Contributing
Contributions are always welcome! If you've found a bug, have feature requests, or want to improve something, please submit a pull request or open an issue with a detailed description.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.

## Contact Me
If you have any questions or suggestions regarding this project, feel free to contact me on LinkedIn [here](https://www.linkedin.com/in/michael-laferriere).