const themeScript = `
  let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let storedTheme = localStorage.getItem('tellefolio-theme');
  
  if (storedTheme === '"dark"' || (storedTheme === '"system"' && isDarkMode)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
`

export default themeScript;
