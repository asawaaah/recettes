import React from 'react';
import ContactForm from '../components/blocks/ContactForm';
import SEO from '../components/common/SEO';

const Contact = () => {
  return (
    <>
      <SEO 
        title="Contact"
        description="Contactez-nous pour toute question ou suggestion"
        keywords="contact, support, message, aide"
      />
      <ContactForm />
    </>
  );
};

export default Contact; 