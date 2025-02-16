import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image }) => {
  return (
    <Helmet>
      {/* Titre de base */}
      <title>{title ? `${title} | Mon Site` : 'Mon Site'}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Meta tags Open Graph pour les réseaux sociaux */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      
      {/* Meta tags Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO; 