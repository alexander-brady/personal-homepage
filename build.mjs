import {
  cpSync,
  readFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "fs";
import { join, basename, extname, dirname, relative } from "path";
import { parse } from "marked";
import matter from "gray-matter";

const inputDir = "content";
const outputDir = "dist";
const templateDir = "templates";
const rootDir = "root";

const baseTemplate = readFileSync(join(templateDir, "base.html"), "utf-8");
const defaultTemplate = baseTemplate.replace(
  "<!--BODY-->",
  readFileSync(join(templateDir, "default.html"), "utf-8"),
);

// Copy static root files
cpSync(rootDir, outputDir, { recursive: true });

const toPosixPath = (p) => p.replaceAll("\\", "/");

function getAllFiles(dir, baseDir = dir) {
  const results = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      results.push(toPosixPath(relative(baseDir, fullPath)));
    }
  }

  return results;
}

// Process all markdown files
getAllFiles(inputDir).forEach((file) => {
  if (file.endsWith(".md")) {
    const name = basename(file, ".md");
    const markdown = readFileSync(join(inputDir, file), "utf-8");

    const { data, content } = matter(markdown);
    let htmlContent = parse(content);

    // If custom template is specified, use it; otherwise, use default
    let layout = defaultTemplate;
    if (data.template) {
      const templatePath = join(templateDir, `${data.template}.html`);
      if (existsSync(templatePath)) {
        layout = baseTemplate.replace(
          "<!--BODY-->",
          readFileSync(templatePath, "utf-8"),
        );
      } else {
        console.error(
          `Template ${data.template} not found, using default template.`,
        );
      }
    }

    if (!layout.includes("<!--CONTENT-->")) {
      console.error(
        `Template ${data.template || "default"} does not contain <!--CONTENT--> placeholder.`,
      );
    }

    if (data.title) {
      if (layout.includes("<title>")) {
        layout = layout.replace(
          /<title>.*<\/title>/,
          `<title>${data.title}</title>`,
        );
      } else {
        layout = layout.replace(/<head>/, `<head><title>${data.title}</title>`);
      }
    }

    if (data.description) {
      if (layout.includes('<meta name="description"')) {
        layout = layout.replace(
          /<meta name="description" content=".*">/,
          `<meta name="description" content="${data.description}">`,
        );
      } else {
        layout = layout.replace(
          /<head>/,
          `<head><meta name="description" content="${data.description}">`,
        );
      }
    }

    const finalHtml = layout.replace("<!--CONTENT-->", htmlContent);
    const outputFilePath = join(
      outputDir,
      file.replace(extname(file), ".html"),
    );
    mkdirSync(dirname(outputFilePath), { recursive: true });
    writeFileSync(outputFilePath, finalHtml);
    console.log(`Built: ${name}.html`);
  }
});
