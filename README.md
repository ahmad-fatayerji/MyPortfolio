# Ahmad FATAYERJI | Portfolio Website

Welcome to my personal portfolio! Built using modern web technologies, this site showcases my projects, skills, and experiences in software development.

## 🛠️ Technologies Used

- **Framework:** [Next.js](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Language:** TypeScript
- **Animations:** Framer Motion
- **Components:** Shadcn/ui
- **Icons:** Lucide React
- **Theming:** Next Themes

## 🚀 Getting Started

Follow these simple steps to run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/ahmad-fatayerji/MyPortfolio.git
cd MyPortfolio
```
### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```
### 3. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

For testing on phones/tablets over your local network, prefer a clean webpack dev server instead of the default Turbopack path:

```bash
npm run dev:clean:lan
```

## 📂 Project Structure

- src/app: Contains page layouts and routes
- src/components: UI components and reusable parts
- src/data: JSON data for projects and career timeline
- src/lib: Utility functions
- src/styles: Global CSS with Tailwind configuration

### Editing Career History

Career entries live in `src/data/experiences.json`. Dates use `YYYY-MM`.
Supported types are `education`, `volunteering`, `internship`, `job`, and
`freelance`. Use `endDate: null` for an ongoing experience, or omit `endDate`
for a single-date entry.

Use `track: "main"` for the primary rail. To add a parallel experience, give
it any other track name. Every non-main track automatically forks from and
merges back into `main`. Lanes, colors, ordering, date labels, and fork/merge
paths are generated automatically.

## 🎨 Features

- Responsive Design: Optimized for desktop, tablet, and mobile devices
- Dynamic Theming: Easily toggle between dark and light modes
- Smooth Animations: Enhanced user experience using Framer Motion
- SEO Friendly: Designed with best practices to improve search visibility
- Easy Project Management: Projects dynamically loaded from JSON files for easy updates

## 🌐 Deployment

This project is deployed using GitHub Actions with automated build and deployment scripts for seamless updates:

- Deployment workflow: deploy.yml
- Hosting: Self-hosted VPS with Apache server

## 📬 Get in Touch

- Email: ahmad.fatayerji2004@gmail.com
- LinkedIn: ahmad-fatayerji
- GitHub: ahmad-fatayerji

Feel free to reach out to discuss potential collaborations or job opportunities!

Happy coding! 🚀
