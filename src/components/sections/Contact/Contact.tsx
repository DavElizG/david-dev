import { usePersonalInfo } from '../../../hooks';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import ContactForm from '../../../components/common/ContactForm';

const Contact = () => {
  const { personalInfo, loading } = usePersonalInfo();

  return (
    <section
      id="contact"
      className="py-20"
      style={{ color: 'var(--space-text)' }}
    >
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-3"
          style={{ color: 'var(--space-text)' }}
        >
          Contact
        </h2>
        <p className="text-center text-sm mb-12" style={{ color: 'var(--space-text-dim)' }}>
          Let's work together
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info card */}
          <div
            className="p-8 rounded-xl"
            style={{
              background: 'var(--space-surface)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--space-border)',
            }}
          >
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--space-text)' }}>
              Contact information
            </h3>
            {loading ? (
              <p style={{ color: 'var(--space-text-dim)' }}>Loading...</p>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FaEnvelope className="text-xl mt-1 shrink-0" style={{ color: 'var(--space-accent)' }} />
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--space-text)' }}>Email</h4>
                    <a
                      href={`mailto:${personalInfo?.email}`}
                      className="hover:underline transition-colors"
                      style={{ color: 'var(--space-text-dim)' }}
                    >
                      {personalInfo?.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaPhone className="text-xl mt-1 shrink-0" style={{ color: 'var(--space-accent)' }} />
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--space-text)' }}>Phone</h4>
                    <a
                      href="tel:+50685707955"
                      className="hover:underline transition-colors"
                      style={{ color: 'var(--space-text-dim)' }}
                    >
                      +506 8570 7955
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-xl mt-1 shrink-0" style={{ color: 'var(--space-accent)' }} />
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--space-text)' }}>Location</h4>
                    <p style={{ color: 'var(--space-text-dim)' }}>{personalInfo?.location}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact form */}
          <ContactForm darkMode={true} />
        </div>
      </div>
    </section>
  );
};

export default Contact;