/** @type {import('tailwindcss').Config} */
export const content = ["./templates/**/*.html", "./content/**/*.md"];
export const darkMode = 'media';
export const theme = {
  extend: {},
};
export const plugins = [require("@tailwindcss/typography")];
