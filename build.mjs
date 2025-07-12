import {
  readFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  copyFileSync,
  writeFileSync,
  statSync,
} from "fs";
import { join, basename, extname, dirname } from "path";
import { parse } from "marked";
import matter from "gray-matter";

const inputDir = "content";
const outputDir = "dist";
const templateDir = "templates";
const assetSrc = "assets";
const assetDest = join(outputDir, "assets");

const baseTemplate = readFileSync(join(templateDir, "base.html"), "utf-8");
const defaultTemplate = baseTemplate.replace(
  "<!--BODY-->",
  readFileSync(join(templateDir, "default.html"), "utf-8"),
);

// Ensure output folder exists
if (!existsSync(outputDir)) mkdirSync(outputDir);

// Copy static assets
if (existsSync(assetSrc)) {
  if (!existsSync(assetDest)) mkdirSync(assetDest, { recursive: true });
  readdirSync(assetSrc).forEach((file) => {
    copyFileSync(join(assetSrc, file), join(assetDest, file));
  });
  console.log("Copied assets/");
}

function getAllFiles(dir, baseDir = dir) {
  let results = [];
  const list = readdirSync(dir);
  list.forEach((file) => {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, baseDir));
    } else {
      const normalize = (p) => p.replace(/\\/g, "/");
      const relativePath = normalize(fullPath).replace(
        normalize(baseDir) + "/",
        "",
      );
      results.push(relativePath);
    }
  });

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
