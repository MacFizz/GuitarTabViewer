(function () {
    'use strict';

    var file   = window.GUITARTAB_FILE;
    var apiUrl = window.GUITARTAB_APIURL;

    if (!file) { showError('No file specified.'); return; }

    var elTab     = document.getElementById('alphaTab');
    var elLoading = document.getElementById('loading');
    var elError   = document.getElementById('errorOverlay');
    var elErrMsg  = document.getElementById('errorMsg');
    var btnPlay   = document.getElementById('btnPlay');
    var btnStop   = document.getElementById('btnStop');
    var selTrack  = document.getElementById('selTrack');
    var selZoom   = document.getElementById('selZoom');
    var barWrap   = document.getElementById('progressBar');
    var barFill   = document.getElementById('progressFill');
    var timeEl    = document.getElementById('timeDisplay');

    var api = null, playing = false, totalMs = 0;

    function init() {
        try {
            api = new alphaTab.AlphaTabApi(elTab, {
                core: { 
                    engine: 'html5', 
                    logLevel: 0,
                    useWorkers: true 
                },
                display: {
                    scale: 0.8,
                    stretchForce: 0.8,
                    layoutMode: 'page',
                    resources: {
                        copyrightFont: '10px Arial',
                        titleFont: 'bold 14px Arial',
                        subTitleFont: '11px Arial',
                        wordsFont: '10px Arial'
                    }
                },
                player: {
                    enablePlayer: true,
                    enableCursor: true,
                    enableUserInteraction: true,
                    scrollMode: 'continuous',
                    soundFont: OC.generateUrl('/apps/guitartabviewer/soundfont')
                }
            });
        } catch (e) { 
            showError('alphaTab init failed: ' + e.message); 
            return; 
        }

        api.renderStarted.on(function () { 
            elLoading.style.display = 'flex'; 
        });
        
        api.renderFinished.on(function () { 
            elLoading.style.display = 'none'; 
            enableUI(); 
        });
        
        api.scoreLoaded.on(buildTracks);
        api.error.on(function (e) { 
            showError(String(e.message || e)); 
        });

        api.playerStateChanged.on(function (e) {
            playing = e.state === 1;
            btnPlay.textContent = playing ? '⏸ Pause' : '▶ Play';
        });
        
        api.playerPositionChanged.on(function (e) {
            totalMs = e.endTime || totalMs;
            if (totalMs > 0) {
                var percent = (e.currentTime / totalMs) * 100;
                barFill.style.width = percent + '%';
                timeEl.textContent = fmt(e.currentTime) + ' / ' + fmt(totalMs);
            }
        });

        var url = apiUrl + '?path=' + encodeURIComponent(file);
        api.load(url, [0]);
    }

    function buildTracks(score) {
        selTrack.innerHTML = '';
        score.tracks.forEach(function (t, i) {
            var o = document.createElement('option');
            o.value = i;
            o.textContent = (i + 1) + '. ' + (t.name || 'Track ' + (i + 1));
            selTrack.appendChild(o);
        });
        selTrack.disabled = score.tracks.length <= 1;
    }

    function enableUI() {
        btnPlay.disabled = false;
        btnStop.disabled = false;
        selTrack.disabled = selTrack.options.length <= 1;
    }

    function fmt(ms) {
        var s = Math.floor(ms / 1000);
        return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
    }

    function showError(msg) {
        elLoading.style.display = 'none';
        elError.style.display   = 'flex';
        elErrMsg.textContent    = '⚠ ' + msg;
    }

    // Event listeners
    btnPlay.addEventListener('click', function () { 
        if (!api) return;
        if (playing) {
            api.pause();
        } else {
            api.play();
        }
    });
    
    btnStop.addEventListener('click', function () {
        if (!api) return;
        api.stop();
        barFill.style.width = '0%';
        timeEl.textContent  = '0:00 / ' + fmt(totalMs);
    });
    
    selTrack.addEventListener('change', function () {
        if (!api || !api.score) return;
        var idx = parseInt(this.value, 10);
        api.renderTracks([api.score.tracks[idx]]);
    });
    
    
    // Clic sur la barre de progression
    
    // Slider de zoom avec conversion : 100% affiché = 0.8 scale réel
    var zoomSlider = document.getElementById('zoomSlider');
    var zoomValue = document.getElementById('zoomValue');
    if (zoomSlider && zoomValue) {
        zoomSlider.addEventListener('input', function () {
            if (!api) return;
            var displayPercent = parseInt(this.value, 10);
            var realScale = (displayPercent / 100) * 0.8;  // 100% affiché = 0.8 réel
            
            zoomValue.textContent = displayPercent + '%';
            api.settings.display.scale = realScale;
            api.updateSettings();
            api.render();
        });
    }
    barWrap.addEventListener('click', function (e) {
        if (!api || !totalMs || totalMs === 0) return;
        var rect = barWrap.getBoundingClientRect();
        var ratio = (e.clientX - rect.left) / rect.width;
        var targetMs = Math.floor(ratio * totalMs);
        api.timePosition = targetMs;
    });

    // Bouton fermer
    var btnClose = document.getElementById('btnClose');
    if (btnClose) {
        btnClose.addEventListener('click', function() {
            // Si on est dans une iframe, envoyer un message au parent
            if (window.parent !== window) {
                window.parent.postMessage('guitartab:close', '*');
            } else {
                // Sinon navigation classique
                window.location.href = OC.generateUrl('/apps/files');
            }
        });
    }

    init();
}());


