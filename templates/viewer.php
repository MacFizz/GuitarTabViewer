<?php
/** @var array $_ */
script('guitartabviewer', 'alphatab');
script('guitartabviewer', 'viewer');
style('guitartabviewer', 'viewer');

$filePath = $_['file'] ?? '';
$urlGen = \OC::$server->getURLGenerator();
?>
<div id="app">
    <div class="toolbar">
        <span class="title">🎸 Guitar Tab Viewer</span>
        <button id="btnPlay" class="btn btn-play" disabled>▶ Play</button>
        <button id="btnStop" class="btn" disabled>⏹</button>
        <select id="selTrack" disabled><option>Loading…</option></select>
        
        <div class="zoom-control">
            <label for="zoomSlider">Zoom: <span id="zoomValue">100%</span></label>
            <input type="range" id="zoomSlider" min="30" max="250" step="10" value="100">
        </div>
        
        <button id="btnClose" class="btn btn-close" title="Fermer">✕</button>
    </div>

    <div class="viewer-wrap">
        <div id="loading" class="overlay">
            <div class="spinner"></div>
            <p>Loading tab file…</p>
        </div>
        <div id="errorOverlay" class="overlay" style="display:none;">
            <div class="error-box" id="errorMsg"></div>
        </div>
        <div id="alphaTab"></div>
    </div>

    <div class="progress-wrap">
        <div class="progress-bar" id="progressBar">
            <div class="progress-fill" id="progressFill"></div>
        </div>
        <span class="time" id="timeDisplay">0:00 / 0:00</span>
    </div>
</div>

<script <?php print_unescaped($_['cspNonce'] ? 'nonce="' . $_['cspNonce'] . '"' : ''); ?>>
    window.GUITARTAB_FILE   = <?php echo json_encode($filePath); ?>;
    window.GUITARTAB_APIURL = <?php echo json_encode($urlGen->linkToRoute('guitartabviewer.viewer.getFile')); ?>;
</script>
