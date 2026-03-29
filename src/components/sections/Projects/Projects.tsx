import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub, FaExternalLinkAlt, FaServer, FaLock } from 'react-icons/fa';
import { getTechIcon } from '../../../utils/iconUtils';
import { useProjects } from '../../../hooks';
import { useLanguage } from '../../../context';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

interface ProjectsProps {
  featured?: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ featured = false }) => {
  const { projects, loading, error } = useProjects();
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  const displayedProjects = featured
    ? projects?.filter(project => project.featured).slice(0, 6)
    : projects;

  useEffect(() => {
    if (!displayedProjects?.length || loading) return;

    // Clean up any previous GSAP context
    if (ctxRef.current) {
      ctxRef.current.revert();
      ctxRef.current = null;
    }

    // Small delay to ensure DOM is rendered
    const timer = setTimeout(() => {
      if (!sectionRef.current) return;

      ctxRef.current = gsap.context(() => {
        const slides = gsap.utils.toArray<HTMLElement>('.project-slide');

        slides.forEach((slide) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: slide,
              start: '30% 60%',
            },
          });

          tl.from(slide.querySelectorAll('.project-slide__title'), {
            ease: 'power4',
            y: '+=5vh',
            opacity: 0,
            duration: 2,
          })
            .from(
              slide.querySelectorAll('.project-slide__desc'),
              {
                x: 80,
                y: 40,
                opacity: 0,
                duration: 1.8,
                ease: 'power4',
              },
              0.4
            )
            .from(
              slide.querySelectorAll('.project-slide__techs'),
              {
                y: 30,
                opacity: 0,
                duration: 1.4,
                ease: 'power4',
              },
              0.5
            )
            .from(
              slide.querySelectorAll('.project-slide__links'),
              {
                x: -60,
                y: 40,
                opacity: 0,
                duration: 1.6,
                ease: 'power4',
              },
              0.4
            )
            .from(
              slide.querySelectorAll('.project-slide__scroll-indicator'),
              {
                y: 100,
                duration: 2.5,
                ease: 'power4',
              },
              0.5
            );
        });

        // Parallax effect on images
        slides.forEach((slide) => {
          const imageWrap = slide.querySelector('.project-slide__image-wrap');
          if (imageWrap) {
            gsap.fromTo(
              imageWrap,
              { y: '-30vh' },
              {
                y: '30vh',
                scrollTrigger: {
                  trigger: slide,
                  scrub: true,
                  start: 'top bottom',
                },
                ease: 'none',
              }
            );
          }
        });
      }, sectionRef);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, [displayedProjects, loading]);

  return (
    <div ref={sectionRef} id="projects" className="project-slides-container">
      {/* Section header */}
      <div className="project-slides__header">
        <h2 className="project-slides__heading">
          {featured ? t.projects.featuredHeading : t.projects.heading}
        </h2>
        <p className="project-slides__subheading">{t.projects.subheading}</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
            style={{ borderColor: 'var(--space-accent)' }}
          />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
          <p style={{ color: 'var(--space-accent-2)' }}>Error: {error}</p>
        </div>
      ) : (
        displayedProjects?.map((project, index) => (
          <section
            key={project.id_project}
            className={`project-slide project-slide--${index}`}
          >
            {/* Column 1 — Content */}
            <div className="project-slide__col project-slide__col--content">
              <div className={`project-slide__content project-slide__content--${index}`}>
                <h2 className="project-slide__title">
                  <span className="project-slide__title-inner">{project.title}</span>
                  <br />
                  <span className="project-slide__title-inner project-slide__title-num">
                    No. {index + 1}
                  </span>
                </h2>

                <div className="project-slide__details">
                  <p className="project-slide__desc">{project.description}</p>

                  <div className="project-slide__techs">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="project-slide__tech-tag">
                        {getTechIcon(tech, true, 16)}
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>

                  <div className="project-slide__links">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-slide__link"
                    >
                      <FaGithub />
                      <span>{t.projects.repository}</span>
                      <div className="project-slide__link-line" />
                    </a>

                    {project.backendRepo && (
                      <a
                        href={project.backendRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-slide__link"
                      >
                        <FaServer />
                        <span>{t.projects.backend}</span>
                        <div className="project-slide__link-line" />
                      </a>
                    )}

                    {project.isPrivate ? (
                      <span className="project-slide__link project-slide__link--disabled">
                        <FaLock />
                        <span>{t.projects.private}</span>
                      </span>
                    ) : (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-slide__link"
                      >
                        <FaExternalLinkAlt />
                        <span>{t.projects.liveDemo}</span>
                        <div className="project-slide__link-line" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Scroll indicator between slides */}
              {index < (displayedProjects?.length ?? 0) - 1 && (
                <div className="project-slide__scroll-indicator">
                  <div className="project-slide__scroll-line" />
                </div>
              )}
            </div>

            {/* Column 2 — Image with parallax */}
            <div className="project-slide__col project-slide__col--image">
              <div className="project-slide__image-wrap">
                {project.image ? (
                  <img
                    className="project-slide__img"
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="project-slide__img-placeholder" />
                )}
              </div>
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default Projects;