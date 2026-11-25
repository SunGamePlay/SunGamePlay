$(document).ready(function () {
    const data = window.RESUME_DATA;
    if (!data) {
        console.error("RESUME_DATA not found. Make sure resume-data.js is loaded before script.js.");
        return;
    }

    // --- Helpers ---
    function escapeHtml(str) {
        return String(str ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    // Converts **bold** and `code` inside safely escaped text
    function formatRichText(str) {
        return escapeHtml(str)
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/`(.+?)`/g, "<code>$1</code>");
    }

    // Collects all dynamic chart specs during render so theme toggles can re-render them
    const chartSpecs = [];
    let chartInstances = [];
    let chartCounter = 0;

    function renderMetricCard(metric) {
        if (metric.type === "bar") {
            const canvasId = `dynamic-chart-${++chartCounter}`;
            chartSpecs.push({ canvasId, spec: metric });

            const arrowHtml = metric.trend === "up"
                ? `<i class="fas fa-arrow-up metric-arrow" aria-hidden="true"></i>`
                : metric.trend === "down"
                    ? `<i class="fas fa-arrow-down metric-arrow" aria-hidden="true"></i>`
                    : "";

            return `
                <div class="chart-card">
                    <div class="chart-header"><span>${escapeHtml(metric.label)}</span>${arrowHtml}</div>
                    <div style="height: 100px; width: 100%;"><canvas id="${canvasId}"></canvas></div>
                </div>
            `;
        }

        if (metric.type === "donut") {
            const canvasId = `dynamic-chart-${++chartCounter}`;
            chartSpecs.push({ canvasId, spec: metric });

            const maxVal = metric.max || 100;
            const displayText = metric.display !== undefined
                ? metric.display
                : `${Math.round((metric.value / maxVal) * 100)}%`;

            return `
                <div class="chart-card">
                    <div class="chart-header"><span>${escapeHtml(metric.label)}</span></div>
                    <div style="position: relative; height: 100px; width: 100px;">
                        <canvas id="${canvasId}"></canvas>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; color: var(--text-main);">${escapeHtml(displayText)}</div>
                    </div>
                </div>
            `;
        }

        // Default: stat card
        const subHtml = metric.sub
            ? `<div class="stat-sub">${escapeHtml(metric.sub)}</div>`
            : "";

        return `
            <div class="chart-card">
                <div class="chart-header"><span>${escapeHtml(metric.label)}</span></div>
                <div class="big-stat">${escapeHtml(metric.value)}</div>
                ${subHtml}
            </div>
        `;
    }

    function renderExperienceCard(item) {
        if (item.hidden) return "";

        const titleLinkHtml = item.titleLink
            ? ` <a href="${escapeHtml(item.titleLink.url)}" target="_blank" rel="noopener noreferrer" class="project-title-link" title="${escapeHtml(item.titleLink.title || "")}"><i class="${escapeHtml(item.titleLink.icon || "fas fa-external-link-alt")}"></i></a>`
            : "";

        const tagsHtml = (item.tags && item.tags.length)
            ? `<div class="project-tags">${item.tags.map(tag => `<span class="skill-tag">${escapeHtml(tag)}</span>`).join("")}</div>`
            : "";

        const detailsHtml = (item.details && item.details.length)
            ? `
                <div class="detailed-desc" style="display: none;">
                    <ul>
                        ${item.details.map(bullet => `<li>${formatRichText(bullet)}</li>`).join("")}
                    </ul>
                </div>
            `
            : "";

        const linksHtml = (item.links && item.links.length)
            ? item.links.map(link => `
                <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="${escapeHtml(link.title || link.label)}">
                    ${link.icon ? `<i class="${escapeHtml(link.icon)}"></i> ` : ""}${escapeHtml(link.label)}
                </a>
            `).join("")
            : "";

        const metricsHtml = (item.metrics && item.metrics.length)
            ? `<div class="metric-wrapper">${item.metrics.map(renderMetricCard).join("")}</div>`
            : "";

        return `
            <div class="glass-panel" style="margin-bottom: 2rem;" data-aos="fade-up">
                <h3>${escapeHtml(item.title)}${titleLinkHtml}</h3>
                ${tagsHtml}
                <div class="project-grid">
                    <div>
                        <p class="short-desc">${formatRichText(item.shortDesc)}</p>
                        ${detailsHtml}
                        ${linksHtml}
                    </div>
                    ${metricsHtml}
                </div>
            </div>
        `;
    }

    function renderSkillsSection(section) {
        if (!section) return "";

        const visibleCategories = (section.categories || []).filter(cat => !cat.hidden);
        const categoryCardsHtml = visibleCategories.map((cat, idx) => {
            const delay = (idx + 1) * 100;
            const iconStyle = cat.iconColor ? ` style="color: ${escapeHtml(cat.iconColor)};"` : "";
            const tagsHtml = (cat.items || []).map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join("\n");

            return `
                <div class="glass-panel" data-aos="fade-up" data-aos-delay="${delay}">
                    <h3><i class="${escapeHtml(cat.icon)}"${iconStyle} aria-hidden="true"></i> ${escapeHtml(cat.title)}</h3>
                    <div>
                        ${tagsHtml}
                    </div>
                </div>
            `;
        }).join("");

        let languagesCardHtml = "";
        if (section.languages && !section.languages.hidden) {
            const lang = section.languages;
            const langDelay = (visibleCategories.length + 1) * 100;
            const maxLevel = lang.maxLevel || 5;
            const langIconStyle = lang.iconColor ? ` style="color: ${escapeHtml(lang.iconColor)};"` : "";
            const rowsHtml = (lang.items || []).map(row => `
                <div class="lang-row">
                    <span>${escapeHtml(row.name)}</span>
                    <div class="stat-bar" data-value="${Number(row.level) || 0}" data-max="${Number(maxLevel)}"></div>
                </div>
            `).join("");

            languagesCardHtml = `
                <div class="glass-panel" data-aos="fade-up" data-aos-delay="${langDelay}">
                    <h3><i class="${escapeHtml(lang.icon)}"${langIconStyle} aria-hidden="true"></i> ${escapeHtml(lang.title)}</h3>
                    ${rowsHtml}
                </div>
            `;
        }

        let dualRowHtml = "";
        const hasTraits = section.traits && !section.traits.hidden;
        const hasCerts = section.certifications && !section.certifications.hidden;

        if (hasTraits || hasCerts) {
            const traitsHtml = hasTraits ? (() => {
                const t = section.traits;
                const iconStyle = t.iconColor ? ` style="color: ${escapeHtml(t.iconColor)};"` : "";
                const tags = (t.items || []).map(item => `<span class="skill-tag tag-soft">${escapeHtml(item)}</span>`).join("\n");
                return `
                    <div class="glass-panel" style="justify-content: center;" data-aos="zoom-in" data-aos-delay="500">
                        <h3><i class="${escapeHtml(t.icon)}"${iconStyle} aria-hidden="true"></i> ${escapeHtml(t.title)}</h3>
                        <div style="text-align: center;">
                            ${tags}
                        </div>
                    </div>
                `;
            })() : "";

            const certsHtml = hasCerts ? (() => {
                const c = section.certifications;
                const iconColor = c.iconColor || "var(--accent-yellow)";
                const itemsHtml = (c.items || []).map(cert =>
                    `<p style="margin:0; font-size: 0.9rem; color: var(--text-main);">${formatRichText(cert)}</p>`
                ).join("");
                return `
                    <div class="glass-panel" style="flex-direction: row; align-items: center; gap: 1rem;" data-aos="zoom-in" data-aos-delay="600">
                        <i class="${escapeHtml(c.icon)}" style="font-size: 2.5rem; color: ${escapeHtml(iconColor)};" aria-hidden="true"></i>
                        <div>
                            <h3 style="margin-bottom: 0.2rem;">${escapeHtml(c.title)}</h3>
                            ${itemsHtml}
                        </div>
                    </div>
                `;
            })() : "";

            dualRowHtml = `
                <div class="skills-grid skills-grid-dual" style="margin-bottom: 4rem;">
                    ${traitsHtml}
                    ${certsHtml}
                </div>
            `;
        }

        return `
            <section id="${escapeHtml(section.id)}" data-aos="fade-up">
                <h2><i class="${escapeHtml(section.icon)}" style="font-size: 0.8em; margin-right: 10px;" aria-hidden="true"></i> ${escapeHtml(section.title)}</h2>
                <div class="skills-grid">
                    ${categoryCardsHtml}
                    ${languagesCardHtml}
                </div>
                ${dualRowHtml}
            </section>
        `;
    }

    function renderExperienceSection(section) {
        if (!section) return "";
        const visibleItems = (section.items || []).filter(item => !item.hidden);
        if (!visibleItems.length) return "";

        return `
            <section id="${escapeHtml(section.id)}" data-aos="fade-up">
                <h2><i class="${escapeHtml(section.icon)}" style="font-size: 0.8em; margin-right: 10px;" aria-hidden="true"></i> ${escapeHtml(section.title)}</h2>
                ${visibleItems.map(renderExperienceCard).join("")}
            </section>
        `;
    }

    // --- Render Page from RESUME_DATA ---
    if (data.meta?.title) {
        document.title = data.meta.title;
    }

    if (data.meta?.navLogo) {
        $("#nav-logo").text(data.meta.navLogo);
    }

    if (data.nav && data.nav.length) {
        const navHtml = data.nav.map(link =>
            `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`
        ).join("");
        $("#nav-links").html(navHtml);
    }

    const socialsHtml = (data.header?.socials || []).map(social =>
        `<a href="${escapeHtml(social.url)}" aria-label="${escapeHtml(social.label)}"><i class="${escapeHtml(social.icon)}"></i></a>`
    ).join("");

    const headerHtml = `
        <header data-aos="fade-down">
            <p class="tagline">${escapeHtml(data.header?.tagline || "")}</p>
            <h1>${escapeHtml(data.header?.name || "")}</h1>
            <div class="social-links">
                ${socialsHtml}
            </div>
        </header>
    `;

    $("#home").html([
        headerHtml,
        renderSkillsSection(data.skillsSection),
        renderExperienceSection(data.internshipsSection),
        renderExperienceSection(data.projectsSection)
    ].join(""));

    if (data.meta?.footer) {
        $("#site-footer").text(data.meta.footer);
    }

    // --- 0. Hexagon Grid Background ---
    const canvas = document.getElementById("bg-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let width, height;

        function initCanvas() {
            const dpr = window.devicePixelRatio || 1;
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        }

        function drawHexagon(x, y, r) {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i + (Math.PI / 6);
                const px = x + r * Math.cos(angle);
                const py = y + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
        }

        const startTime = Date.now();

        function drawGrid() {
            ctx.clearRect(0, 0, width, height);

            const elapsed = (Date.now() - startTime) / 1000;
            const isDark = document.documentElement.getAttribute("data-theme") === "dark";
            ctx.strokeStyle = isDark ? "rgba(17, 17, 17, 1)" : "rgba(243, 243, 243, 1)";
            ctx.lineWidth = 16;

            const r = 512;
            const h = r * Math.sqrt(3);
            const dy = r * 1.5;
            const dx = h;

            const offsetX = -((elapsed * 15) % dx);
            const offsetY = -((elapsed * 10) % (dy * 2));

            for (let y = -dy * 2; y < height + dy * 2; y += dy) {
                const isEven = Math.round(y / dy) % 2 === 0;
                for (let x = -dx * 2; x < width + dx * 2; x += dx) {
                    const xPos = isEven ? x : x + dx / 2;
                    drawHexagon(xPos + offsetX, y + offsetY, r);
                }
            }
        }

        function animate() {
            drawGrid();
            requestAnimationFrame(animate);
        }

        window.addEventListener("resize", initCanvas);
        initCanvas();
        animate();
    }

    // --- 1. Stat Point Generation ---
    $(".stat-bar").each(function () {
        const value = parseInt($(this).data("value"), 10) || 0;
        const max = parseInt($(this).data("max"), 10) || 5;
        $(this).empty();
        for (let i = 0; i < max; i++) {
            const point = $('<div class="stat-point"></div>');
            if (i < value) {
                point.addClass("filled");
            }
            $(this).append(point);
        }
    });

    // --- 2. Back to Top Button, Scroll Progress & Scrollspy ---
    $(window).scroll(function () {
        const scrollTop = $(this).scrollTop();
        const docHeight = $(document).height();
        const winHeight = $(window).height();
        const scrollable = Math.max(docHeight - winHeight, 1);
        const scrollPercent = (scrollTop / scrollable) * 100;

        $("#scroll-bar").css("width", scrollPercent + "%");

        if (scrollTop > 300) {
            $("#back-to-top").fadeIn();
        } else {
            $("#back-to-top").fadeOut();
        }

        $("section, header").each(function () {
            const id = $(this).attr("id");
            if (!id) return;

            const offset = $(this).offset().top - 100;
            const height = $(this).outerHeight();

            if (scrollTop >= offset && scrollTop < offset + height) {
                $(".nav-links a").removeClass("active");
                $(`.nav-links a[href="#${id}"]`).addClass("active");
            }
        });
    });

    $("#back-to-top").on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });

    // --- 3. Mobile Menu Toggle ---
    $(".nav-toggle").on("click", function () {
        $(".nav-links").toggleClass("active");
        $(this).find("i").toggleClass("fa-bars fa-times");
    });

    $(".nav-links").on("click", "a", function () {
        $(".nav-links").removeClass("active");
        $(".nav-toggle i").removeClass("fa-times").addClass("fa-bars");
    });

    // --- 4. Theme Toggle ---
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (currentTheme === "dark") {
        $("#theme-toggle i").removeClass("fa-moon").addClass("fa-sun");
    }

    $("#theme-toggle").on("click", function () {
        const theme = document.documentElement.getAttribute("data-theme");
        if (theme === "light") {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            $(this).find("i").removeClass("fa-moon").addClass("fa-sun");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
            $(this).find("i").removeClass("fa-sun").addClass("fa-moon");
        }
        initCharts();
    });

    // --- 5. Read More Toggle ---
    $(".detailed-desc").each(function () {
        const $this = $(this);
        const $btn = $('<button class="read-more-btn">Read More</button>');
        $this.after($btn);

        $btn.on("click", function () {
            $this.slideToggle(300, function () {
                if ($this.is(":visible")) {
                    $btn.text("Read Less");
                    $this.find("li").each(function (i) {
                        const li = $(this);
                        setTimeout(() => {
                            li.addClass("reveal");
                        }, i * 100);
                    });
                } else {
                    $btn.text("Read More");
                    $this.find("li").removeClass("reveal");
                }
            });
        });
    });

    // --- 6. Dynamic Chart Configuration ---
    function initCharts() {
        chartInstances.forEach(chart => chart.destroy());
        chartInstances = [];

        if (typeof Chart === "undefined") return;

        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const textColor = isDark ? "#8b949e" : "#636e72";
        const mutedBg = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
        const donutTrackBg = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";

        Chart.defaults.color = textColor;
        Chart.defaults.font.family = "Outfit";

        chartSpecs.forEach(({ canvasId, spec }) => {
            const el = document.getElementById(canvasId);
            if (!el) return;

            if (spec.type === "bar") {
                const items = spec.items || [];
                const accentColor = spec.color || "rgba(9,132,227,0.8)";
                const colors = items.map((item, idx) => {
                    if (item.color) return item.color;
                    if (item.highlight !== undefined) return item.highlight ? accentColor : mutedBg;
                    return idx === items.length - 1 ? accentColor : mutedBg;
                });

                const instance = new Chart(el.getContext("2d"), {
                    type: "bar",
                    data: {
                        labels: items.map(item => item.label),
                        datasets: [{
                            data: items.map(item => item.value),
                            backgroundColor: colors,
                            borderRadius: 4,
                            barThickness: 20
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: "y",
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { display: false },
                            y: { display: true, grid: { display: false }, ticks: { color: textColor } }
                        }
                    }
                });
                chartInstances.push(instance);
            } else if (spec.type === "donut") {
                const maxVal = spec.max || 100;
                const val = Number(spec.value) || 0;
                const remaining = Math.max(maxVal - val, 0);

                const instance = new Chart(el.getContext("2d"), {
                    type: "doughnut",
                    data: {
                        labels: ["Score", "Remaining"],
                        datasets: [{
                            data: [val, remaining],
                            backgroundColor: [spec.color || "#00b894", donutTrackBg],
                            borderWidth: 0,
                            cutout: "75%"
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false }
                        }
                    }
                });
                chartInstances.push(instance);
            }
        });
    }

    initCharts();

    // --- 7. AOS Initialization ---
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
});
