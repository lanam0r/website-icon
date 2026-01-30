/** @type {import('next').NextConfig} */
const repo = "website-icon";
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  trailingSlash: true,
};
