# GEMINI.md

## Project Overview

This is a [TanStack Start](https://tanstack.com/start) project, a full-stack framework for React. It utilizes [TanStack Router](https://tanstack.com/router) for file-based routing, [Vite](https://vitejs.dev/) as a build tool, and [Tailwind CSS](https://tailwindcss.com/) for styling. The project is set up with TypeScript and includes a basic structure for a web application.

The application is a simple "Todo List" application, with the main logic for the application stored in the `src/db` folder. The `src/routes` directory contains the different pages of the application, with `__root.tsx` defining the global layout.

## Building and Running

### Development

To run the development server:

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To build the application for production:

```bash
npm run build
```

The production-ready files will be located in the `dist` directory.

### Serving the Production Build

To serve the production build locally:

```bash
npm run serve
```

### Testing

To run the tests:

```bash
npm run test
```

## Development Conventions

*   **Routing:** The project uses a file-based routing system. New routes can be created by adding files to the `src/routes` directory.
*   **Styling:** Styling is done using Tailwind CSS.
*   **State Management:** The `README.md` provides examples for using TanStack Query and TanStack Store for state management.
*   **Demo Files:** Files prefixed with `demo` in the `src/routes` directory are for demonstration purposes and can be safely removed.
*   **Database:** The project is set up to use RxDB, a reactive, offline-first database for JavaScript applications. The database-related files are in the `src/db` directory.
