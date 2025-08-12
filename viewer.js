// Global variables
let viewer = null;
let currentScene = '1';
let isAutoRotating = false;

/**
 * Initialize the panorama viewer when the document is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initPanorama();
    setupEventListeners();
});

/**
 * Initialize the Pannellum panorama viewer
 */
function initPanorama() {
    // Initialize the panorama viewer
    viewer = pannellum.viewer('panorama', {
        type: 'equirectangular',
        panorama: '/panorama-images/1.jpg',
        autoLoad: true,
        compass: true,
        autoRotate: 0,
        showFullscreenCtrl: false,
        showZoomCtrl: true,
        mouseZoom: true,
        draggable: true
    });
    
    // Highlight the active scene button
    highlightActiveButton(currentScene);
}

/**
 * Set up event listeners for controls
 */
function setupEventListeners() {
    // Scene selection dropdown
    const sceneSelect = document.getElementById('scene-select');
    sceneSelect.addEventListener('change', function() {
        loadScene(this.value);
    });
    
    // Scene buttons
    const sceneButtons = document.querySelectorAll('.scene-btn');
    sceneButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sceneId = this.getAttribute('data-scene');
            loadScene(sceneId);
        });
    });
    
    // Auto-rotate button
    const autoRotateBtn = document.getElementById('autorotate-btn');
    autoRotateBtn.addEventListener('click', toggleAutoRotate);
    
    // Fullscreen button
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    fullscreenBtn.addEventListener('click', toggleFullscreen);
}

/**
 * Load a new panorama scene
 */
function loadScene(sceneId) {
    if (sceneId === currentScene) return;
    
    // Load the new panorama
    viewer.destroy();
    viewer = pannellum.viewer('panorama', {
        type: 'equirectangular',
        panorama: `/panorama-images/${sceneId}.jpg`,
        autoLoad: true,
        compass: true,
        autoRotate: isAutoRotating ? 2 : 0,
        showFullscreenCtrl: false,
        showZoomCtrl: true,
        mouseZoom: true,
        draggable: true
    });
    
    // Update current scene
    currentScene = sceneId;
    
    // Update dropdown value
    const sceneSelect = document.getElementById('scene-select');
    sceneSelect.value = sceneId;
    
    // Highlight active button
    highlightActiveButton(sceneId);
}

/**
 * Highlight the active scene button
 */
function highlightActiveButton(sceneId) {
    const buttons = document.querySelectorAll('.scene-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-scene') === sceneId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Toggle auto-rotation
 */
function toggleAutoRotate() {
    isAutoRotating = !isAutoRotating;
    
    // Set rotation speed (degrees per second)
    const rotationSpeed = isAutoRotating ? 2 : 0;
    viewer.setAutoRotate(rotationSpeed);
    
    // Update button appearance
    const autoRotateBtn = document.getElementById('autorotate-btn');
    if (isAutoRotating) {
        autoRotateBtn.textContent = 'Stop Rotation';
        autoRotateBtn.classList.remove('btn-info');
        autoRotateBtn.classList.add('btn-warning');
    } else {
        autoRotateBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Auto Rotate';
        autoRotateBtn.classList.remove('btn-warning');
        autoRotateBtn.classList.add('btn-info');
    }
}

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    viewer.toggleFullscreen();
}
