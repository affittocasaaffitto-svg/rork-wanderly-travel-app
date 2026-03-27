export function redirectSystemPath({ path }: { path: string }) {
  if (path.startsWith("/")) {
    return path;
  }
  return "/";
}
