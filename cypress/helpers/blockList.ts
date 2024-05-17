export function blockRequests() {
    const urlsToBlock = [
      'https://*.doubleclick.net/**',
      '**/*.svg',
      '**/*gpt.js',
      '**/*adsbygoogle.js',
      'https://pagead2.googlesyndication.com/**'
    ];
  
    urlsToBlock.forEach(url => {
      cy.intercept(url, (req) => {
        req.destroy();
      });
    });
  }