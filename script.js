$(document).ready(function() {
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
