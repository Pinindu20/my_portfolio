# Pinindu Nuwandhara — Portfolio

A responsive personal developer portfolio built with Next.js and TypeScript. The project gallery contains all 20 supplied projects, with six highlighted first. It uses CSS-built abstract artwork rather than unverified screenshots or deployment claims.

## Run locally

Requirements: Node.js 20.9 or later and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000. To create and run the production build:

```bash
npm run build
npm run start
```

## Deploy

Deploy this folder as a Next.js project to a platform that supports Next.js (for example, Vercel). Connect the repository or upload the project, use `npm install` for dependency installation, and `npm run build` as the build command. Once you have a public domain, add it to the metadata configuration in `app/layout.tsx` if you want absolute canonical and social preview URLs.

## Content updates

- Edit project titles, summaries, technologies, or details in `app/projects.ts`.
- The featured set is selected by project IDs in `app/page.tsx` (`featuredIds`).
- A CV download link is intentionally omitted because no CV file was present in the supplied workspace.
- Projects 18 and 19 have no stack tags because the supplied descriptions did not confirm their technologies. Project technology labels and details are limited to the information supplied in the referenced conversation.

## Accessibility

The layout adapts to narrow screens, includes keyboard-operable navigation and project dialogs, descriptive labels, and a `prefers-reduced-motion` override.
