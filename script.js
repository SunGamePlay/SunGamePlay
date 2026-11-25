(() => {
  const d = window.RESUME_DATA;
  if (!d) return;
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const ok = x => x && !x.hidden, map = (a, f) => (a || []).map(f).join("");
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`(.+?)`/g, "<code>$1</code>");
  const ic = (c, col) => c ? `<i class="${esc(c)}"${col ? ` style="color:${esc(col)}"` : ""}></i>` : "";
  const ext = (u, h, c = "", t = "") => `<a href="${esc(u)}" target="_blank" rel="noopener" class="${c}" title="${esc(t)}">${h}</a>`;
  const tags = (a, c = "") => a?.length ? `<div class="tags">${map(a, t => `<span class="pill${c}">${esc(t)}</span>`)}</div>` : "";
  const sec = (s, b) => `<section id="${esc(s.id)}"><h2>${ic(s.icon)} ${esc(s.title)}</h2>${b}</section>`;
  const box = (x, b) => `<div class="panel"><h3>${ic(x.icon, x.iconColor)} ${esc(x.title)}</h3>${b}</div>`;

  const metric = m => {
    const hd = `<div class="ch"><span>${esc(m.label)}</span>${m.trend ? ic(`fas fa-arrow-${m.trend}`) : ""}</div>`;
    if (m.type === "bar") {
      const a = m.items || [], max = Math.max(...a.map(i => +i.value || 0), 1e-9);
      return `<div class="card">${hd}<div class="bars">${map(a, (x, i) => {
        const c = x.color || ((x.highlight ?? i === a.length - 1) ? (m.color || "#0984e3") : "");
        return `<div class="brow" title="${esc(x.label)}: ${esc(x.value)}"><span>${esc(x.label)}</span><i style="--w:${((+x.value || 0) / max * 100).toFixed(1)}%${c ? `;--c:${esc(c)}` : ""}"></i><span>${esc(x.value)}</span></div>`;
      })}</div></div>`;
    }
    if (m.type === "donut") {
      const p = Math.min(100, Math.max(0, (+m.value || 0) / (m.max || 100) * 100));
      return `<div class="card">${hd}<div class="donut" style="--p:${p}%;--c:${esc(m.color || "#00b894")}">${esc(m.display ?? `${Math.round(p)}%`)}</div></div>`;
    }
    return `<div class="card">${hd}<div class="stat">${esc(m.value)}</div>${m.sub ? `<div class="sub">${esc(m.sub)}</div>` : ""}</div>`;
  };

  const skills = s => {
    if (!s) return "";
    const l = ok(s.languages) ? box(s.languages, map(s.languages.items, r => `<div class="lang"><span>${esc(r.name)}</span><i class="pts" style="--n:${s.languages.maxLevel || 5};--p:${Math.min(100, (+r.level || 0) / (s.languages.maxLevel || 5) * 100)}%"></i></div>`)) : "";
    const t = ok(s.traits) ? box(s.traits, tags(s.traits.items, " out soft")) : "";
    const c = ok(s.certifications) ? `<div class="panel cert">${ic(s.certifications.icon, s.certifications.iconColor || "#f1c40f")}<div><h3>${esc(s.certifications.title)}</h3>${map(s.certifications.items, x => `<p>${md(x)}</p>`)}</div></div>` : "";
    return sec(s, `<div class="grid">${map((s.categories || []).filter(ok), x => box(x, tags(x.items)))}${l}</div>${t || c ? `<div class="grid dual">${t}${c}</div>` : ""}`);
  };

  const exp = s => {
    const items = (s?.items || []).filter(ok);
    return items.length ? sec(s, map(items, x => {
      const tl = x.titleLink ? ext(x.titleLink.url, ic(x.titleLink.icon || "fas fa-external-link-alt"), "tlink", x.titleLink.title || "") : "";
      const det = x.details?.length ? `<details><summary class="pill out" aria-label="Toggle details"></summary><ul>${map(x.details, (b, i) => `<li style="--i:${i}">${md(b)}</li>`)}</ul></details>` : "";
      const lks = map(x.links, l => ext(l.url, `${ic(l.icon)}${esc(l.label)}`, "pill out alt", l.title || l.label));
      return `<div class="panel exp"><h3>${esc(x.title)}${tl}</h3>${tags(x.tags)}<div class="proj"><div><p>${md(x.shortDesc)}</p>${det || lks ? `<div class="acts">${det}${lks}</div>` : ""}</div>${x.metrics?.length ? `<div class="metrics">${map(x.metrics, metric)}</div>` : ""}</div></div>`;
    })) : "";
  };

  if (d.meta?.title) document.title = d.meta.title;
  if (d.meta?.navLogo) $("#logo").textContent = d.meta.navLogo;
  if (d.meta?.footer) $("#foot").textContent = d.meta.footer;
  $("#links").innerHTML = map(d.nav, n => `<li><a href="${esc(n.href)}">${esc(n.label)}</a></li>`);
  $("#home").innerHTML = `<header><p class="tagline">${esc(d.header?.tagline)}</p><h1>${esc(d.header?.name)}</h1><div class="socials">${map(d.header?.socials, s => `<a href="${esc(s.url)}" aria-label="${esc(s.label)}">${ic(s.icon)}</a>`)}</div></header>${skills(d.skillsSection)}${map([d.internshipsSection, d.projectsSection], exp)}`;

  const setTheme = t => { document.documentElement.dataset.theme = t; localStorage.setItem("theme", t); $("#theme i").className = `fas fa-${t === "dark" ? "sun" : "moon"}`; };
  setTheme(localStorage.getItem("theme") || "light");
  $("#theme").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  $("#top").onclick = () => scrollTo({ top: 0, behavior: "smooth" });

  const secs = $$("section[id]"), navs = $$("#links a");
  const onScroll = () => {
    let active = "#home";
    $("#top").classList.toggle("show", scrollY > 300);
    secs.forEach(s => { if (scrollY >= s.offsetTop - 120) active = `#${s.id}`; });
    navs.forEach(a => a.classList.toggle("on", a.getAttribute("href") === active));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
