# Ask Future Me

A personal knowledge base application designed to help you document and organize solutions to problems you've encountered, so your future self doesn't have to solve them twice.

## Overview

Have you ever spent hours debugging an issue, only to face the exact same problem months later and realize you've forgotten the solution? **Ask Future Me** solves this by acting as your personal diary for technical solutions, workarounds, and life hacks.

## Key Features

- **Dashboard Insights**: Visualize your problem-solving activity with beautiful charts, statistics, and a summary of your recent solutions.
- **Rich Solution Logging**: Document problems with comprehensive metadata including:
  - Title and Symptoms/Context
  - Detailed Solution
  - Categories and Tags
  - Difficulty level and Estimated Time Saved
  - Confidence Level and Source links
- **Smart Similarity Detection**: Auto-detects if you're adding a solution that you might have already solved before, preventing duplicate entries.
- **Search & Filter**: Quickly find past solutions using powerful search queries, tag filtering, and category browsing.
- **Review Reminders**: Spaced repetition to remind you to review solutions periodically, ensuring the knowledge sticks.
- **Favorites & Pinning**: Keep your most frequently used or important solutions easily accessible.

## Tech Stack

- **Framework**: React 19 + Vite
- **Routing**: React Router DOM
- **Styling**: Vanilla CSS (CSS Modules)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Markdown Rendering**: React Markdown

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ask-future-me.git
   cd ask-future-me
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Build for Production

To create a production-ready build:

```bash
npm run build
```

This will generate a `dist` folder containing the compiled assets.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you have ideas for improvements or new features.

## License

This project is licensed under the MIT License.
