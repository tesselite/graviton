export function onRequest({ request, next }) {
  const url = new URL(request.url);

  // Only handle root
  if (url.pathname !== "/") {
    return next();
  }

  // 1. User preference cookie
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/lang=(en|fr|ja|zh)/);
  if (match) {
    return Response.redirect(`${url.origin}/${match[1]}/`, 302);
  }

  // 2. Accept-Language detection
  const header = request.headers.get("Accept-Language") || "";
  const langs = header.split(",").map(l => l.toLowerCase());

  let lang = "en";
  if (langs.some(l => l.startsWith("fr"))) lang = "fr";
  if (langs.some(l => l.startsWith("ja"))) lang = "ja";
  if (langs.some(l => l.startsWith("zh"))) lang = "zh";

  return Response.redirect(`${url.origin}/${lang}/`, 302);
}
