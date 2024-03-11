/**
 * /!\ LEGACY /!\ -> New Elementor builder adds a specific class 
 * 
 * Elementor dosen't add a specific css class according to the editor theme used
 * 
 * To detect if we are in dark mode, we will watch if the dark stylesheet is added or
 * removed from the DOM, and add our own class on the body
 */

const initElementor = () => {
  const darkStyleSheet = document.getElementById('e-theme-ui-dark-css');
  const lightStyleSheet = document.getElementById('e-theme-ui-light-css');

  const setMode = theme => {
    // Remove all existing theme classes
    document.body.classList.remove('tf-elementor-theme-light', 'tf-elementor-theme-dark');
  
    // Add the appropriate theme class
    document.body.classList.add(`tf-elementor-theme-${theme}`);
  };

  const checkAndSetMode = () => {
    setMode(darkStyleSheet && darkStyleSheet.media === 'all' ? 'dark' : 'light');
  };

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type !== 'attributes') continue;

      const isDarkMode = darkStyleSheet && darkStyleSheet.media === 'all';
      const isLightMode = lightStyleSheet && lightStyleSheet.media === 'all';

      if (isDarkMode) setMode('dark');
      if (isLightMode) setMode('light');
    }
  });

  // Observe changes to the media attribute of the stylesheets
  observer.observe(darkStyleSheet, { attributes: true, attributeFilter: ['media'] });
  observer.observe(lightStyleSheet, { attributes: true, attributeFilter: ['media'] });

  // Set initial mode
  checkAndSetMode();
};

export { initElementor };