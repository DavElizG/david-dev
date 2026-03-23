/**
 * Contact.tsx — Bar-curtain reveal (CodePen elegantseagulls/wvMgXxN)
 *
 * Single set of 100 bars (50vw wide) that slide right on scroll,
 * rotating 45° mid-travel. Two ghost labels split into "blocks".
 * Content layer sits behind the bars and is revealed as they move.
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePersonalInfo } from '../../../hooks';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import ContactForm from '../../common/ContactForm';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const BAR_COUNT = 100;

const Contact = () => {
  const { personalInfo, loading } = usePersonalInfo();
  const sectionRef = useRef<HTMLElement>(null);
  const ctxRef     = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    let cancelled = false;

    const setup = () => {
      ctxRef.current?.revert();
      if (cancelled || !sectionRef.current) return;

      ctxRef.current = gsap.context(() => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              scrub:   0.5,
              pin:     true,
              start:   'top top',
              end:     '+=150%',
            },
          })
          .to('.contact-bar', {
            force3D:  true,
            duration: 1,
            xPercent: 100,
            ease:     'power1.inOut',
            stagger:  { amount: 1 },
          })
          .to('.contact-bar', {
            ease:     'power1.out',
            duration: 1,
            rotation: '45deg',
          }, 0)
          .to('.contact-bar', {
            ease:     'power1.in',
            duration: 1,
            rotation: '0deg',
          }, 1);
      }, sectionRef);
    };

    const timer = setTimeout(() => {
      if (!cancelled) { ScrollTrigger.refresh(); setup(); }
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, []);

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      {/* Bars — white, slide right on scroll */}
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <div key={i} className="contact-bar" />
      ))}

      {/* Content — behind bars */}
      <div className="contact-content">
        <div className="contact-panel contact-panel--info">
          <span className="contact-panel__tag">Hablemos</span>
          <h2 className="contact-panel__title">Contacto</h2>
          <p className="contact-panel__sub">
            Disponible para proyectos freelance y oportunidades laborales.
          </p>
          {!loading && personalInfo && (
            <div className="contact-info-list">
              <a href={`mailto:${personalInfo.email}`} className="contact-info-item">
                <FaEnvelope />
                <span>{personalInfo.email}</span>
              </a>
              <a href="tel:+50685707955" className="contact-info-item">
                <FaPhone />
                <span>+506 8570 7955</span>
              </a>
              <div className="contact-info-item">
                <FaMapMarkerAlt />
                <span>{personalInfo.location}</span>
              </div>
            </div>
          )}
        </div>

        <div className="contact-panel contact-panel--form">
          <ContactForm darkMode={true} />
        </div>
      </div>
    </section>
  );
};

export default Contact;