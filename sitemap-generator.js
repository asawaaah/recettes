const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');

// Définissez vos routes
const routes = [
  { url: '/', changefreq: 'daily', priority: 1 },
  { url: '/products', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.5 },
];

// Créez le sitemap
const sitemapStream = new SitemapStream({ hostname: 'https://votresite.com' });

// Ajoutez les routes au sitemap
routes.forEach(route => {
  sitemapStream.write(route);
});

// Terminez le stream
sitemapStream.end();

// Générez le fichier XML
streamToPromise(sitemapStream)
  .then(data => {
    fs.writeFileSync('./public/sitemap.xml', data.toString());
    console.log('Sitemap generated successfully!');
  })
  .catch(err => {
    console.error('Error generating sitemap:', err);
  }); 