function toggleTheme() {
  const themeIconToggleSrc = document.getElementById("theme-icon").src;
  let themeIconToggleSrcPath = themeIconToggleSrc.substring(0, themeIconToggleSrc.lastIndexOf('/') + 1);

  if (themeIconToggleSrc.includes('dark')) {
    themeIconToggleSrcPath += 'light.svg';
  } else if (themeIconToggleSrc.includes('light')) {
    themeIconToggleSrcPath += 'dark.svg';
  } else {
    themeIconToggleSrcPath += (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') + '.svg';
  }

  document.getElementById("theme-icon").src = themeIconToggleSrcPath;
}
