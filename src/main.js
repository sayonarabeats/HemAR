import * as THREE from 'three';
import * as ZapparThree from '@zappar/zappar-threejs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { StoreLayout } from './storeLayout';
import { translations } from '../assets/i18n/translations.js';
import { LanguageSwitcher } from './languageSwitcher.js';

// Initialize language switcher
const languageSwitcher = new LanguageSwitcher('en');

// DOM elements
const loadingElement = document.getElementById('loading');
const loadingTextElement = document.getElementById('loading-text');
const permissionElement = document.getElementById('permission-request');
const permissionTitleElement = document.getElementById('permission-title');
const permissionTextElement = document.getElementById('permission-text');
const startButtonElement = document.getElementById('start-button');
const placementElement = document.getElementById('placement-ui');
const placementInstructionsElement = document.getElementById('placement-instructions');
const placeButtonElement = document.getElementById('place-button');
const navigationElement = document.getElementById('navigation-ui');
const langEnButton = document.getElementById('lang-en');
const langNlButton = document.getElementById('lang-nl');

// Create additional UI elements
function createAdditionalUI() {
  // Create reset button
  const resetButton = document.createElement('button');
  resetButton.id = 'reset-button';
  resetButton.className = 'control-btn';
  resetButton.innerHTML = translations[currentLanguage].resetButton;
  
  // Create help button
  const helpButton = document.createElement('button');
  helpButton.id = 'help-button';
  helpButton.className = 'control-btn';
  helpButton.innerHTML = translations[currentLanguage].helpButton;
  
  // Create control container
  const controlContainer = document.createElement('div');
  controlContainer.id = 'control-container';
  controlContainer.appendChild(resetButton);
  controlContainer.appendChild(helpButton);
  
  // Create help modal
  const helpModal = document.createElement('div');
  helpModal.id = 'help-modal';
  helpModal.style.display = 'none';
  
  const helpContent = document.createElement('div');
  helpContent.className = 'help-content';
  
  const helpTitle = document.createElement('h2');
  helpTitle.id = 'help-title';
  helpTitle.innerText = translations[currentLanguage].helpTitle;
  
  const helpText = document.createElement('p');
  helpText.id = 'help-text';
  helpText.innerText = translations[currentLanguage].helpText;
  
  const closeButton = document.createElement('button');
  closeButton.id = 'close-button';
  closeButton.innerText = translations[currentLanguage].closeButton;
  
  helpContent.appendChild(helpTitle);
  helpContent.appendChild(helpText);
  helpContent.appendChild(closeButton);
  helpModal.appendChild(helpContent);
  
  // Add to document
  document.body.appendChild(controlContainer);
  document.body.appendChild(helpModal);
  
  // Add event listeners
  resetButton.addEventListener('click', resetPlacement);
  helpButton.addEventListener('click', showHelp);
  closeButton.addEventListener('click', hideHelp);
  
  return {
    resetButton,
    helpButton,
    helpModal,
    helpTitle,
    helpText,
    closeButton
  };
}

// Additional UI elements
let additionalUI;

// Set initial language
document.documentElement.lang = currentLanguage;
updateTranslations();

// Language switcher
langEnButton.addEventListener('click', () => {
  currentLanguage = 'en';
  document.documentElement.lang = currentLanguage;
  langEnButton.classList.add('active');
  langNlButton.classList.remove('active');
  updateTranslations();
});

langNlButton.addEventListener('click', () => {
  currentLanguage = 'nl';
  document.documentElement.lang = currentLanguage;
  langNlButton.classList.add('active');
  langEnButton.classList.remove('active');
  updateTranslations();
});

function updateTranslations() {
  loadingTextElement.innerText = translations[currentLanguage].loading;
  permissionTitleElement.innerText = translations[currentLanguage].permissionTitle;
  permissionTextElement.innerText = translations[currentLanguage].permissionText;
  startButtonElement.innerText = translations[currentLanguage].startButton;
  placementInstructionsElement.innerText = translations[currentLanguage].placementInstructions;
  placeButtonElement.innerText = translations[currentLanguage].placeButton;
  
  // Update additional UI if it exists
  if (additionalUI) {
    additionalUI.resetButton.innerText = translations[currentLanguage].resetButton;
    additionalUI.helpButton.innerText = translations[currentLanguage].helpButton;
    additionalUI.helpTitle.innerText = translations[currentLanguage].helpTitle;
    additionalUI.helpText.innerText = translations[currentLanguage].helpText;
    additionalUI.closeButton.innerText = translations[currentLanguage].closeButton;
  }
  
  // Update destination buttons
  document.querySelectorAll('.destination-btn').forEach(button => {
    const destination = button.dataset.destination;
    const enSpan = button.querySelector('.en');
    const nlSpan = button.querySelector('.nl');
    
    if (enSpan) enSpan.innerText = translations['en'][destination];
    if (nlSpan) nlSpan.innerText = translations['nl'][destination];
  });
}

// Initialize Zappar AR
ZapparThree.glContextSet(ZapparThree.browserIncompatibleUI());

// Setup Three.js scene
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
document.getElementById('zappar-container').appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 10, 0);
scene.add(directionalLight);

// Setup camera
const camera = new ZapparThree.Camera();
ZapparThree.permissionRequestUI().then((granted) => {
  if (granted) {
    camera.start();
    setTimeout(() => {
      loadingElement.style.display = 'none';
      permissionElement.style.display = 'flex';
      
      // Create additional UI elements after permission is granted
      additionalUI = createAdditionalUI();
    }, 1000);
  } else {
    ZapparThree.permissionDeniedUI();
  }
});

scene.background = camera.backgroundTexture;

// Setup renderer
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Instant world tracking for floor placement
const instantTracker = new ZapparThree.InstantWorldTracker();
const instantTrackerGroup = new ZapparThree.InstantWorldAnchorGroup(camera, instantTracker);
scene.add(instantTrackerGroup);

// Create store layout
const storeLayout = new StoreLayout(scene, instantTrackerGroup);
const storeModel = storeLayout.createStore();
let currentDestination = null;
let hasPlaced = false;

// UI event listeners
startButtonElement.addEventListener('click', () => {
  permissionElement.style.display = 'none';
  placementElement.style.display = 'flex';
});

placeButtonElement.addEventListener('click', () => {
  hasPlaced = true;
  storeModel.visible = true;
  placementElement.style.display = 'none';
  navigationElement.style.display = 'flex';
  document.getElementById('control-container').style.display = 'flex';
});

// Reset placement function
function resetPlacement() {
  hasPlaced = false;
  storeModel.visible = false;
  navigationElement.style.display = 'none';
  document.getElementById('control-container').style.display = 'none';
  placementElement.style.display = 'flex';
  
  // Hide all navigation arrows
  Object.values(storeLayout.navigationArrows).forEach(arrow => {
    if (arrow) arrow.visible = false;
  });
  
  currentDestination = null;
}

// Help modal functions
function showHelp() {
  document.getElementById('help-modal').style.display = 'flex';
}

function hideHelp() {
  document.getElementById('help-modal').style.display = 'none';
}

// Navigation destination buttons
document.querySelectorAll('.destination-btn').forEach(button => {
  button.addEventListener('click', () => {
    const destination = button.dataset.destination;
    
    // Show navigation arrows for selected destination
    storeLayout.showNavigationTo(destination);
    currentDestination = destination;
    
    // Highlight the active button
    document.querySelectorAll('.destination-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
  });
});

// Animation loop
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  
  // Update camera
  camera.updateFrame(renderer);
  
  // Update instant tracker
  if (!hasPlaced) {
    instantTracker.setAnchorPoseFromCameraOffset(0, 0, -5);
  }
  
  // Update navigation arrows animation
  if (hasPlaced && currentDestination) {
    storeLayout.updateNavigationArrows(time);
  }
  
  // Render the scene
  renderer.render(scene, camera);
}

// Start animation loop
animate();

animate();
