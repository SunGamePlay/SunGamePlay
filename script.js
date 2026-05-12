$(document).ready(function() {
    // --- 0. Hexagon Grid Background ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let hexagons = [];

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

        let startTime = Date.now();

        function drawGrid() {
            ctx.clearRect(0, 0, width, height);

            const elapsed = (Date.now() - startTime) / 1000;
            ctx.strokeStyle = `rgba(243, 243, 243, 1)`;
            ctx.lineWidth = 16;

            const r = 512;
            const h = r * Math.sqrt(3);
            const dy = r * 1.5;
            const dx = h;

            // Slow continuous drift
            const offsetX = -((elapsed * 15) % dx);
            const offsetY = -((elapsed * 10) % (dy * 2));

            // Expand loop bounds slightly to draw off-screen, preventing pop-in during drift
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

        function handleResize() {
            initCanvas();
        }

        window.addEventListener('resize', handleResize);
        initCanvas();
        animate();
    }

    // --- 1. Stat Point Generation ---
    $('.stat-bar').each(function() {
        const value = parseInt($(this).data('value')) || 0;
        const max = 5;
        $(this).empty();
        for (let i = 0; i < max; i++) {
            const point = $('<div class="stat-point"></div>');
            if (i < value) {
                point.addClass('filled');
            }
            $(this).append(point);
        }
    });

    // --- 3. Back to Top Button ---
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });

    $('#back-to-top').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 600);
        return false;
    });

    // --- 4. Read More Toggle (Inline) ---
    $('.read-more-btn').on('click', function() {
        const btn = $(this);
        const detailedDesc = btn.siblings('.detailed-desc');
        
        detailedDesc.slideToggle(300, function() {
            if (detailedDesc.is(':visible')) {
                btn.text('Read Less');
            } else {
                btn.text('Read More');
            }
        });
    });

    // --- 5. Micro-interactions ---
    $('.glass-panel, .skill-tag, .chart-card').on('mouseenter', function() {
        $(this).css('opacity', '1');
    }).on('mouseleave', function() {
        // Return to normal
    });

    // --- 6. Chart Configuration (Moved from index.html) ---
    Chart.defaults.color = '#636e72';
    Chart.defaults.font.family = 'Outfit';

    // SSIM Chart
    if (document.getElementById('ssimChart')) {
        new Chart(document.getElementById('ssimChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Base', 'Opt.'],
                datasets: [{
                    data: [0.179, 0.291],
                    backgroundColor: ['rgba(0,0,0,0.1)', 'rgba(9,132,227,0.8)'],
                    borderRadius: 4, barThickness: 20
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: true, grid: { display: false } } }
            }
        });
    }

    // LPIPS Chart
    if (document.getElementById('lpipsChart')) {
        new Chart(document.getElementById('lpipsChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Base', 'Opt.'],
                datasets: [{
                    data: [0.786, 0.543],
                    backgroundColor: ['rgba(0,0,0,0.1)', 'rgba(214,48,49,0.8)'],
                    borderRadius: 4, barThickness: 20
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: true, grid: { display: false } } }
            }
        });
    }

    // Project Score Donut (NER)
    if (document.getElementById('scoreChart')) {
        new Chart(document.getElementById('scoreChart').getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Score', 'Remaining'],
                datasets: [{
                    data: [92, 8],
                    backgroundColor: ['#00b894', 'rgba(0,0,0,0.05)'],
                    borderWidth: 0, cutout: '75%'
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } }
            }
        });
    }

    // --- 7. AOS Initialization ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
});
