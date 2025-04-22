import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogType?: string;
  ogUrl?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Jose Guadamuz | Desarrollador Web',
  description = 'Portafolio de Jose David Guadamuz, desarrollador web con experiencia en React, TypeScript, .NET y más tecnologías.',
  keywords = 'desarrollador web, frontend, backend, React, TypeScript, .NET, Jose Guadamuz, programador',
  author = 'Jose David Guadamuz',
  ogType = 'website',
  ogUrl = 'https://daveliz.me',
  ogImage = '/assets/JDSnoppyLogo-BD0TpMFU.webp',
  ogTitle,
  ogDescription,
}) => {
  const metaTitle = title;
  const metaOgTitle = ogTitle || title;
  const metaOgDescription = ogDescription || description;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Open Graph meta tags for social sharing */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={metaOgTitle} />
      <meta property="og:description" content={metaOgDescription} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaOgTitle} />
      <meta name="twitter:description" content={metaOgDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional meta tags for SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Spanish" />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={ogUrl} />
    </Helmet>
  );
};

export default SEO;