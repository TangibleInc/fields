/**
 * /!\ LEGACY /!\ -> New Elementor builder adds a specific class 
 * 
 * Elementor dosen't add a specific css class according to the editor theme used
 * 
 * To detect if we are in dark mode, we will watch if the dark stylesheet is added or
 * removed from the DOM, and add our own class on the body
 */
const initElementor = () => {
  
  const styleSheetName = 'elementor-editor-dark-mode-css'
  const observer = new MutationObserver(mutations => {

    for (const mutation of mutations) {

      if( mutation.type !== 'childList' ) continue;

      const toDarkMode = mutation.addedNodes.length === 1 && mutation.addedNodes[0].id === styleSheetName
      const toLightMode = mutation.removedNodes.length === 1 && mutation.removedNodes[0].id === styleSheetName

      if( toDarkMode ) setMode('dark')
      if( toLightMode ) setMode('light')
    }
  })
  
  observer.observe(document.body, { childList: true })
  setMode(document.getElementById(styleSheetName) ? 'dark' : 'light')
}

const setMode = theme => {
  if( theme === 'dark' ) {
    document.body.classList.remove('tf-elementor-theme-light')
    document.body.classList.add('tf-elementor-theme-dark')
  }
  else if( theme === 'light' ) {
    document.body.classList.remove('tf-elementor-theme-dark')
    document.body.classList.add('tf-elementor-theme-light')
  }
}

export { initElementor }
