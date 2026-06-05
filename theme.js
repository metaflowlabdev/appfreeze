/*
 * Shared theme controller for all Metaflow Lab pages.
 *
 * Default: follow the system (prefers-color-scheme) — no data-theme attribute.
 * Manual override: the toggle sets data-theme="light|dark" and remembers it in
 * localStorage, which wins over the system setting until cleared.
 *
 * A tiny inline guard in <head> applies the stored theme before first paint to
 * avoid a flash; this file injects the toggle button and its styles.
 */
(function () {
  var root = document.documentElement;
  var mq = window.matchMedia("(prefers-color-scheme: light)");

  function effective() {
    var forced = root.getAttribute("data-theme");
    if (forced) return forced;
    return mq.matches ? "light" : "dark";
  }

  var css =
    ".theme-toggle{position:fixed;top:18px;right:18px;z-index:50;" +
    "width:40px;height:40px;border-radius:999px;" +
    "border:1px solid var(--glass-border);" +
    "background:color-mix(in srgb, var(--card) 55%, transparent);" +
    "-webkit-backdrop-filter:blur(18px) saturate(1.6);" +
    "backdrop-filter:blur(18px) saturate(1.6);" +
    "color:var(--text);font-size:18px;line-height:1;cursor:pointer;" +
    "box-shadow:0 6px 20px rgba(0,0,0,.25);transition:transform .15s;}" +
    ".theme-toggle:hover{transform:scale(1.06);}";
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-toggle";
  btn.setAttribute("aria-label", "Switch between light and dark theme");

  function render() {
    // Show the icon for the theme you'd switch TO.
    btn.textContent = effective() === "light" ? "🌙" : "☀️";
  }
  render();

  btn.addEventListener("click", function () {
    var next = effective() === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    render();
  });

  // When no manual choice is stored, keep following the system live.
  mq.addEventListener("change", function () {
    if (!root.getAttribute("data-theme")) render();
  });

  document.body.appendChild(btn);
})();
