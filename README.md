# GitGivers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Japanese](https://img.shields.io/badge/lang-Japanese-red.svg)](README.ja.md)

**GitGivers** is a mutual contribution platform for Open Source Software. It gamifies the OSS experience by allowing developers to "barter" their skills: help others to earn Karma, and use that Karma to get help on your own projects.

> "Your project isn't moving because you aren't helping someone else's project."

[日本語のREADMEはこちら](README.ja.md)

</div>

3. **Earn Karma**: Your contribution is verified, and you earn your first Karma points.
4. **Register Your Project**: Use your Karma to list your own repository and attract contributors.

> *Note: While we start as a Web Platform, a CLI tool for terminal-based interaction is planned for the future.*

## Directory Structure

- **`src/`**: Next.js App Router application (Frontend & API).
- **`prisma/`**: Database schema and migrations.
- **`public/`**: Static assets.

## Prerequisites

- Node.js 18+
- Docker (for Supabase Local)
- Supabase CLI (Installed automatically via npm)

## Development (Run Locally)

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/yamadarikuto/git-karma.git
   cd git-karma
   npm install
   ```


2. Set up the environment:
   ```bash
   cp .env.example .env.local
   # 1. Edit .env.local:
   #    - Set AUTH_SECRET (auto-generated or use provided script)
   #    - Set AUTH_GITHUB_ID & AUTH_GITHUB_SECRET (from your GitHub App)
   ```

3. Start the database:
   ```bash
   # Note: 'npm run dev' automatically starts Supabase if not running
   # But for the first time, or to apply schema:
   npm run supa:start
   npm run migrate:local
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

### Project Documentation
- **[System Architecture](docs/architecture/02-system-architecture.md)**: Overview of the tech stack and structure.
- **[Database Schema](docs/architecture/03-database-design.md)**: ER diagram and model details.
- **[Core Logic](docs/architecture/04-core-logic.md)**: The math behind Karma.
- **[Grand Roadmap](docs/planning/01-grand-roadmap.md)**: Future plans.
- **[Coding Standards](docs/guidelines/01-coding-standards.md)**: Code style and principles.
- **[Workflow](docs/guidelines/02-workflow-protocols.md)**: Git and PR etiquette.
- **[AI Guidelines](docs/guidelines/03-ai-collaboration.md)**: Policy on using AI tools.
- **[Changelog](CHANGELOG.md)**: Version history.

### Community Health
- **[Security Policy](.github/SECURITY.md)**: Vulnerability reporting.
- **[Support](.github/SUPPORT.md)**: Where to find help.
- **[Code of Conduct](.github/CODE_OF_CONDUCT.md)**: Community standards.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
