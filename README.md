# Homepage

Personal homepage that converts Markdown files to HTML. This repository contains the source code and build scripts, which automatically deploy the generated site to alexander-brady.github.io via GitHub Actions.

Built with a minimal tech stack focused on simplicity and portability: using [Node.js](https://nodejs.org/en) for the build process, [Tailwind CSS](https://tailwindcss.com/) for styling, and [GitHub Actions](https://github.com/features/actions) + [Pages](https://pages.github.com/) for deployment.

**Table of Contents:**
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Updating Content](#updating-content)
- [Content License](#content-license)

## Getting Started

**Requirements:**
- [Node.js](https://nodejs.org/en) (v16 or higher)

**To build this project, run:**

```bash
npm install
npm run build
```
The build process includes [Tailwind's purge](https://v3.tailwindcss.com/docs/optimizing-for-production/) to remove unused styles and [Prettier](https://prettier.io/) for consistent formatting. Both run automatically via `npm run build`.

**To serve the project, run:**
```bash
npm run serve
```

The site will be built into the `dist/` folder. Use a static server to preview it locally.

## Deployment

This project uses [GitHub Actions](https://github.com/features/actions) to automatically build and deploy the site to [GitHub Pages](https://pages.github.com/) on every push to the main branch. To deploy to a different repository, update the `external_repository` field in `.github/workflows/deploy.yml`. Ensure a `PERSONAL_TOKEN` secret with appropriate permissions is set in your repository settings.

## Updating Content

To update your homepage content, edit or add Markdown files in the `content/` directory. During the build process, these files are converted to HTML and styled using Tailwind. The output mirrors the folder structure of `content/`, with each Markdown file generating a corresponding page.

You can include front matter in each file to define metadata such as the page title, description and layout (optional).


**Custom Layouts**

To use a custom layout, create or modify a template in `src/templates/`. By default, pages use `default.html`, which is injected into the `<!--BODY-->` placeholder of the base layout `base.html`. The base template defines shared structure like the header, footer, and meta tags. Within the selected template, page content is inserted at the `<!--CONTENT-->` placeholder.

To specify a custom template, add a template field in the front matter of your Markdown file:

```md
---
title: My Page Title
description: A brief description of my page.
template: custom-template
---
# Hello World
This is my page content.
```

**Assets**

Place any static assets (images, stylesheets, etc.) in the `assets/` directory. These will be copied to the `dist/` folder during the build process. 

**Root Files**
To include files that should be served at the root of the site (like `robots.txt` or `favicon.ico`), place them in the `root/` directory. These files will be copied directly to the output directory during the build process.

## Content License 

All files in the `content/`, `root/` and `assets/` directories — including personal text, images, documents and likeness — are © Alexander Brady, and licensed under the [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) license.

You may share them with attribution, but not use them commercially or modify them.

All source code outside these directories is licensed under the MIT License.