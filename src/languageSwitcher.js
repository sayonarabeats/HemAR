// Language switcher class for Hema AR Navigation
export class LanguageSwitcher {
  constructor(initialLanguage = 'en') {
    this.currentLanguage = initialLanguage;
    this.observers = [];
    
    // Set initial HTML lang attribute
    document.documentElement.lang = this.currentLanguage;
    
    // Find language buttons
    this.langEnButton = document.getElementById('lang-en');
    this.langNlButton = document.getElementById('lang-nl');
    
    // Add event listeners
    if (this.langEnButton && this.langNlButton) {
      this.langEnButton.addEventListener('click', () => this.setLanguage('en'));
      this.langNlButton.addEventListener('click', () => this.setLanguage('nl'));
      
      // Set initial active state
      this.updateButtonStates();
    }
  }
  
  // Set the current language and notify observers
  setLanguage(lang) {
    if (lang !== this.currentLanguage && (lang === 'en' || lang === 'nl')) {
      this.currentLanguage = lang;
      document.documentElement.lang = lang;
      this.updateButtonStates();
      this.notifyObservers();
    }
  }
  
  // Get the current language
  getLanguage() {
    return this.currentLanguage;
  }
  
  // Update button active states
  updateButtonStates() {
    if (this.langEnButton && this.langNlButton) {
      if (this.currentLanguage === 'en') {
        this.langEnButton.classList.add('active');
        this.langNlButton.classList.remove('active');
      } else {
        this.langEnButton.classList.remove('active');
        this.langNlButton.classList.add('active');
      }
    }
  }
  
  // Add an observer to be notified of language changes
  addObserver(observer) {
    if (typeof observer === 'function' && !this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }
  
  // Remove an observer
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }
  
  // Notify all observers of language change
  notifyObservers() {
    this.observers.forEach(observer => observer(this.currentLanguage));
  }
  
  // Helper method to translate a specific key
  translate(key) {
    try {
      // Split the key by dots to access nested properties
      const keys = key.split('.');
      let result = translations[this.currentLanguage];
      
      for (const k of keys) {
        result = result[k];
        if (result === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
      }
      
      return result;
    } catch (error) {
      console.error(`Error translating key: ${key}`, error);
      return key;
    }
  }
  
  // Update all translatable elements in the DOM
  updateDOMTranslations() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.translate(key);
    });
    
    // Update elements with data-i18n-placeholder attribute (for inputs)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.translate(key);
    });
    
    // Update elements with data-i18n-title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.translate(key);
    });
  }
}
