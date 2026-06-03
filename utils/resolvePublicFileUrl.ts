/** Public base for uploaded files (no trailing slash). */
function getPublicFileBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_FILE_STORAGE_ENDPOINT?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const api = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") ?? "";
  if (api.endsWith("/e-commerce")) {
    return api.replace(/\/e-commerce$/, "/files");
  }
  if (api) return `${api}/files`;

  return "https://api.nirvana.style/files";
}

/**
 * Rewrites dev-only localhost file URLs to the public files endpoint.
 * Admin always refetches from the API; Next.js pages can ship stale URLs from an old build.
 */
export function resolvePublicFileUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("/")) return url;

  const isLocalFileUrl =
    /^https?:\/\/localhost(:\d+)?\/files\//i.test(url) ||
    /^https?:\/\/127\.0\.0\.1(:\d+)?\/files\//i.test(url);

  if (!isLocalFileUrl) return url;

  const key = url.replace(/^.*\/files\//, "");
  return `${getPublicFileBase()}/${key}`;
}
