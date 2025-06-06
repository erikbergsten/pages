import yaml from "js-yaml";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { RenderPlugin } from "@11ty/eleventy";
export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy("site/assets")
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  eleventyConfig.addPlugin(RenderPlugin);
}
