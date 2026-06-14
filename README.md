# Resume Review + Job Match Copilot

A Vercel-ready Next.js + TypeScript application that helps users upload a resume, paste a job description, and receive an AI-assisted fit analysis.

## Features
- Resume PDF upload
- Job description input
- Keyword and skill gap analysis
- Match score and strengths summary
- Bullet rewrite suggestions
- Cohere-powered analysis with fallback scoring

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- Cohere API
- Vercel

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file:
   ```bash
   COHERE_API_KEY=your_cohere_api_key
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`

## Deploying to Vercel
1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add the following environment variable in the Vercel dashboard:
   - `COHERE_API_KEY`
4. Deploy the project.

## Notes
- If `COHERE_API_KEY` is missing, the app falls back to built-in keyword scoring.
- The app is designed to be simple, recruiter-friendly, and easy to extend.
