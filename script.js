$(document).ready(function() {
    // --- 0. Hexagon Grid Background ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
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

        let startTime = Date.now();

        function drawGrid() {
            ctx.clearRect(0, 0, width, height);

            const elapsed = (Date.now() - startTime) / 1000;
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            ctx.strokeStyle = isDark ? `rgba(17, 17, 17, 1)` : `rgba(243, 243, 243, 1)`;
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

    // --- 3. Back to Top Button & Scroll Progress & Scrollspy ---
    $(window).scroll(function() {
        const scrollTop = $(this).scrollTop();
        const docHeight = $(document).height();
        const winHeight = $(window).height();
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        
        $('#scroll-bar').css('width', scrollPercent + '%');

        if (scrollTop > 300) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }

        // Scrollspy Logic
        $('section, header').each(function() {
            const id = $(this).attr('id');
            if (!id) return;
            
            const offset = $(this).offset().top - 100;
            const height = $(this).outerHeight();
            
            if (scrollTop >= offset && scrollTop < offset + height) {
                $('.nav-links a').removeClass('active');
                $(`.nav-links a[href="#${id}"]`).addClass('active');
            }
        });
    });

    $('#back-to-top').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 600);
        return false;
    });

    // --- 3.1 Mobile Menu Toggle ---
    $('.nav-toggle').on('click', function() {
        $('.nav-links').toggleClass('active');
        $(this).find('i').toggleClass('fa-bars fa-times');
    });

    $('.nav-links a').on('click', function() {
        $('.nav-links').removeClass('active');
        $('.nav-toggle i').removeClass('fa-times').addClass('fa-bars');
    });

    // --- 3.2 Theme Toggle ---
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        $('#theme-toggle i').removeClass('fa-moon').addClass('fa-sun');
    }

    $('#theme-toggle').on('click', function() {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            $(this).find('i').removeClass('fa-moon').addClass('fa-sun');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            $(this).find('i').removeClass('fa-sun').addClass('fa-moon');
        }
        initCharts();
    });

    // --- 4. Read More Toggle (Dynamic Injection) ---
    $('.detailed-desc').each(function() {
        const $this = $(this);
        const $btn = $('<button class="read-more-btn">Read More</button>');
        
        // Insert button after the detailed description
        $this.after($btn);

        $btn.on('click', function() {
            $this.slideToggle(300, function() {
                if ($this.is(':visible')) {
                    $btn.text('Read Less');
                    // Staggered reveal for list items
                    $this.find('li').each(function(i) {
                        const li = $(this);
                        setTimeout(() => {
                            li.addClass('reveal');
                        }, i * 100);
                    });
                } else {
                    $btn.text('Read More');
                    $this.find('li').removeClass('reveal');
                }
            });
        });
    });

    // --- 5. Micro-interactions ---
    $('.glass-panel, .skill-tag, .chart-card').on('mouseenter', function() {
        $(this).css('opacity', '1');
    }).on('mouseleave', function() {
        // Return to normal
    });

    // --- 6. Chart Configuration (Moved from index.html) ---
    let ssimChart, lpipsChart, scoreChart;

    function initCharts() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#8b949e' : '#636e72';
        const mutedBg = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        Chart.defaults.color = textColor;
        Chart.defaults.font.family = 'Outfit';

        // SSIM Chart
        if (document.getElementById('ssimChart')) {
            if (ssimChart) ssimChart.destroy();
            ssimChart = new Chart(document.getElementById('ssimChart').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Base', 'Opt.'],
                    datasets: [{
                        data: [0.179, 0.291],
                        backgroundColor: [mutedBg, 'rgba(9,132,227,0.8)'],
                        borderRadius: 4, barThickness: 20
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: { 
                        x: { display: false }, 
                        y: { display: true, grid: { display: false }, ticks: { color: textColor } } 
                    }
                }
            });
        }

        // LPIPS Chart
        if (document.getElementById('lpipsChart')) {
            if (lpipsChart) lpipsChart.destroy();
            lpipsChart = new Chart(document.getElementById('lpipsChart').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Base', 'Opt.'],
                    datasets: [{
                        data: [0.786, 0.543],
                        backgroundColor: [mutedBg, 'rgba(214,48,49,0.8)'],
                        borderRadius: 4, barThickness: 20
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: { 
                        x: { display: false }, 
                        y: { display: true, grid: { display: false }, ticks: { color: textColor } } 
                    }
                }
            });
        }

        // Project Score Donut (NER)
        if (document.getElementById('scoreChart')) {
            if (scoreChart) scoreChart.destroy();
            scoreChart = new Chart(document.getElementById('scoreChart').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Score', 'Remaining'],
                    datasets: [{
                        data: [92, 8],
                        backgroundColor: ['#00b894', isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'],
                        borderWidth: 0, cutout: '75%'
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: false } }
                }
            });
        }
    }

    initCharts();

    // --- 7. AOS Initialization ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
});
