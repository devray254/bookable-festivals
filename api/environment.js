
// This file doesn't require PHP execution
// Just returns basic information about the environment

(function() {
  // Return basic information about the browser environment
  const info = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    windowLocation: window.location.href,
    timestamp: new Date().toISOString(),
    message: "This JavaScript file is being executed correctly"
  };
  
  // Write directly to the document
  document.write(JSON.stringify(info, null, 2));
})();
