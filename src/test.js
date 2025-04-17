// Test script for Hema AR Navigation Prototype
// This script helps test various aspects of the application

// Function to test language switching
function testLanguageSwitching() {
  console.log('Testing language switching...');
  
  // Test initial language
  const initialLang = document.documentElement.lang;
  console.log(`Initial language: ${initialLang}`);
  
  // Test switching to Dutch
  const nlButton = document.getElementById('lang-nl');
  if (nlButton) {
    console.log('Clicking Dutch language button');
    nlButton.click();
    console.log(`Language after clicking NL: ${document.documentElement.lang}`);
    
    // Check if UI elements are updated
    const startButton = document.getElementById('start-button');
    console.log(`Start button text: ${startButton.innerText}`);
    
    // Should be "Start Ervaring" in Dutch
    if (startButton.innerText === 'Start Ervaring') {
      console.log('✓ Language switching to Dutch works correctly');
    } else {
      console.error('✗ Language switching to Dutch failed');
    }
  }
  
  // Test switching back to English
  const enButton = document.getElementById('lang-en');
  if (enButton) {
    console.log('Clicking English language button');
    enButton.click();
    console.log(`Language after clicking EN: ${document.documentElement.lang}`);
    
    // Check if UI elements are updated
    const startButton = document.getElementById('start-button');
    console.log(`Start button text: ${startButton.innerText}`);
    
    // Should be "Start Experience" in English
    if (startButton.innerText === 'Start Experience') {
      console.log('✓ Language switching to English works correctly');
    } else {
      console.error('✗ Language switching to English failed');
    }
  }
}

// Function to test AR placement
function testARPlacement() {
  console.log('Testing AR placement...');
  
  // Start the experience
  const startButton = document.getElementById('start-button');
  if (startButton) {
    console.log('Clicking start button');
    startButton.click();
    
    // Check if placement UI is shown
    const placementUI = document.getElementById('placement-ui');
    if (placementUI && placementUI.style.display === 'flex') {
      console.log('✓ Placement UI is shown correctly');
    } else {
      console.error('✗ Placement UI is not shown');
    }
    
    // Test placing the store
    const placeButton = document.getElementById('place-button');
    if (placeButton) {
      console.log('Clicking place button');
      placeButton.click();
      
      // Check if navigation UI is shown
      const navigationUI = document.getElementById('navigation-ui');
      if (navigationUI && navigationUI.style.display === 'flex') {
        console.log('✓ Navigation UI is shown correctly after placement');
      } else {
        console.error('✗ Navigation UI is not shown after placement');
      }
      
      // Check if control container is shown
      const controlContainer = document.getElementById('control-container');
      if (controlContainer && controlContainer.style.display === 'flex') {
        console.log('✓ Control container is shown correctly after placement');
      } else {
        console.error('✗ Control container is not shown after placement');
      }
    }
  }
}

// Function to test navigation
function testNavigation() {
  console.log('Testing navigation functionality...');
  
  // Test clicking on each destination button
  const destinations = ['checkout', 'offers', 'sausage'];
  
  destinations.forEach(dest => {
    const button = document.querySelector(`.destination-btn[data-destination="${dest}"]`);
    if (button) {
      console.log(`Clicking ${dest} button`);
      button.click();
      
      // Check if button is highlighted
      if (button.classList.contains('active')) {
        console.log(`✓ ${dest} button is highlighted correctly`);
      } else {
        console.error(`✗ ${dest} button is not highlighted`);
      }
      
      // We can't programmatically check if arrows are visible in this test script
      // as it would require access to Three.js scene objects
      console.log(`Navigation arrows for ${dest} should now be visible`);
    }
  });
}

// Function to test help modal
function testHelpModal() {
  console.log('Testing help modal...');
  
  // Test opening help modal
  const helpButton = document.getElementById('help-button');
  if (helpButton) {
    console.log('Clicking help button');
    helpButton.click();
    
    // Check if help modal is shown
    const helpModal = document.getElementById('help-modal');
    if (helpModal && helpModal.style.display === 'flex') {
      console.log('✓ Help modal is shown correctly');
    } else {
      console.error('✗ Help modal is not shown');
    }
    
    // Test closing help modal
    const closeButton = document.getElementById('close-button');
    if (closeButton) {
      console.log('Clicking close button');
      closeButton.click();
      
      // Check if help modal is hidden
      if (helpModal && helpModal.style.display === 'none') {
        console.log('✓ Help modal is closed correctly');
      } else {
        console.error('✗ Help modal is not closed');
      }
    }
  }
}

// Function to test reset functionality
function testReset() {
  console.log('Testing reset functionality...');
  
  // Test reset button
  const resetButton = document.getElementById('reset-button');
  if (resetButton) {
    console.log('Clicking reset button');
    resetButton.click();
    
    // Check if placement UI is shown again
    const placementUI = document.getElementById('placement-ui');
    if (placementUI && placementUI.style.display === 'flex') {
      console.log('✓ Reset functionality works correctly');
    } else {
      console.error('✗ Reset functionality failed');
    }
    
    // Check if navigation UI is hidden
    const navigationUI = document.getElementById('navigation-ui');
    if (navigationUI && navigationUI.style.display === 'none') {
      console.log('✓ Navigation UI is hidden correctly after reset');
    } else {
      console.error('✗ Navigation UI is not hidden after reset');
    }
  }
}

// Function to run all tests
function runAllTests() {
  console.log('Starting tests for Hema AR Navigation Prototype');
  console.log('=============================================');
  
  // Wait for the app to initialize
  setTimeout(() => {
    testLanguageSwitching();
    console.log('---------------------------------------------');
    
    // Only run these tests if camera permissions are granted
    // In a real testing environment, these would be run with mock camera data
    console.log('Note: AR placement, navigation, help modal, and reset tests require camera permissions');
    console.log('These tests should be run manually on a device with camera access');
    
    console.log('=============================================');
    console.log('Tests completed');
  }, 2000);
}

// Instructions for using this test script
console.log(`
HEMA AR NAVIGATION PROTOTYPE - TEST SCRIPT
==========================================
This script helps test various aspects of the application.

To use this script:
1. Open the browser console (F12 or right-click > Inspect > Console)
2. Copy and paste the following line to run all tests:
   runAllTests();

For individual tests, you can run:
- testLanguageSwitching();
- testARPlacement();
- testNavigation();
- testHelpModal();
- testReset();

Note: AR placement, navigation, help modal, and reset tests 
require camera permissions and should be run manually on 
a device with camera access.
`);
