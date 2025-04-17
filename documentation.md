# Hema Store AR Navigation Prototype
## User Documentation

### Overview
This AR experience provides an interactive route guide through a Hema retail store. It highlights key departments including the checkout (Kassa), special offers (Aanbiedingen), and smoked sausage (Rookworst) sections. The experience is available in both Dutch and English.

### Requirements
- A smartphone with a web browser (Chrome, Safari, Firefox, or Edge)
- Camera permissions enabled
- A flat surface to place the virtual store

### How to Access
1. Scan the QR code provided
2. Allow camera permissions when prompted
3. Follow the on-screen instructions

### Using the AR Experience

#### Step 1: Language Selection
- Choose your preferred language (English or Dutch) by tapping the language buttons
- The default language is English

#### Step 2: Start the Experience
- Tap the "Start Experience" button to begin
- Allow camera permissions if prompted

#### Step 3: Place the Store
- Point your camera at a flat surface (floor or table)
- When ready, tap the "Place Store" button
- The virtual Hema store will appear on the surface

#### Step 4: Navigate to Departments
- Select a destination from the top menu:
  - Checkout / Kassa
  - Special Offers / Aanbiedingen
  - Smoked Sausage / Rookworst
- Follow the red arrows on the floor to reach your destination
- The selected department will be highlighted

#### Additional Controls
- **Reset Placement**: Tap this button to reposition the store
- **Help**: Tap this button to view instructions

### Troubleshooting
- **Camera not working**: Ensure camera permissions are granted in your browser settings
- **AR not tracking well**: Make sure you're in a well-lit area with sufficient texture on the floor
- **Performance issues**: Close other apps running in the background

### Technical Notes
- This prototype is built using Zappar WebAR SDK and Three.js
- The store layout is generic and can be updated when the actual layout is finalized
- The experience works best on modern smartphones with AR capabilities

### Contact
For technical support or questions about this AR experience, please contact the development team.

---

## Developer Documentation

### Project Structure
```
hema_ar_project/
├── assets/
│   ├── images/
│   │   └── hema-logo.png
│   ├── i18n/
│   │   └── translations.js
│   └── models/
├── src/
│   ├── index.html
│   ├── style.css
│   ├── main.js
│   ├── storeLayout.js
│   ├── languageSwitcher.js
│   └── test.js
├── package.json
└── webpack.config.js
```

### Key Components

#### 1. Main Application (main.js)
The entry point that initializes the AR experience, sets up the Three.js scene, and handles user interactions.

#### 2. Store Layout (storeLayout.js)
Responsible for creating and managing the 3D store model, including:
- Floor, walls, and ceiling
- Department areas (Checkout, Special Offers, Smoked Sausage)
- Navigation arrows
- Hema branding elements

#### 3. Language Switcher (languageSwitcher.js)
Handles multilingual support with:
- Language switching between English and Dutch
- Observer pattern for notifying components of language changes
- Helper methods for translating UI elements

#### 4. Translations (translations.js)
Contains all text content in both English and Dutch.

#### 5. Test Script (test.js)
Provides functions to test various aspects of the application:
- Language switching
- AR placement
- Navigation functionality
- Help modal
- Reset functionality

### Technologies Used
- **Zappar WebAR SDK**: For AR camera tracking and placement
- **Three.js**: For 3D rendering
- **Webpack**: For bundling and development server
- **HTML/CSS/JavaScript**: For UI and interaction

### Customization

#### Updating Store Layout
To modify the store layout, edit the `storeLayout.js` file:
- Adjust department positions in the `addDepartments()` method
- Modify navigation arrows in the `createNavigationArrows()` method

#### Adding Languages
To add a new language:
1. Add translations to the `translations.js` file
2. Update the language switcher UI in `index.html`
3. Add language handling in `languageSwitcher.js`

#### Changing Branding
To update branding elements:
- Replace `hema-logo.png` in the assets/images directory
- Update color variables in `style.css` (--hema-red, --hema-blue)

### Building and Deployment
1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Build for production: `npm run build`
4. Deploy the contents of the `dist` directory to a web server

### Future Improvements
- Add more departments and navigation paths
- Implement distance indicators
- Add product information popups
- Optimize 3D models for better performance
- Add analytics to track user interactions
