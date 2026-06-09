import fs from "fs"
import path from "path"

const src = path.join(process.cwd(), "tmp-splash.html")
const out = path.join(process.cwd(), "public", "splash-animation.html")

const html = fs.readFileSync(src, "utf8")

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/)
const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/)
if (!styleMatch || !bodyMatch) throw new Error("Could not parse splash HTML")

let body = bodyMatch[1]
// Remove demo controls and original script
body = body.replace(/<div class="controls">[\s\S]*?<\/div>\s*/, "")
body = body.replace(/<div class="hint">[\s\S]*?<\/div>\s*/, "")
body = body.replace(/<script>[\s\S]*?<\/script>\s*/g, "")

const splashHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Codinou</title>
<style>
${styleMatch[1]}
  html, body { overflow: hidden; }
</style>
</head>
<body>
${body}
<script>
  const stage = document.getElementById('stage');
  function play(){ stage.classList.remove('play'); void stage.offsetWidth; stage.classList.add('play'); }

  const params = new URLSearchParams(window.location.search);
  const next = params.get('next') || '/';
  const REDIRECT_MS = 5500;

  function finishSplash() {
    try { sessionStorage.setItem('codinou_splash_seen', '1'); } catch (e) {}
    document.cookie = 'codinou_splash_seen=1; path=/; SameSite=Lax';
    window.location.replace(next);
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishSplash();
  } else {
    window.addEventListener('load', play);
    setTimeout(finishSplash, REDIRECT_MS);
  }
</script>
</body>
</html>`

fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, splashHtml)
console.log("Wrote", out, "size", splashHtml.length)
