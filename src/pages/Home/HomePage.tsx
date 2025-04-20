import { Hero, Projects, Contact, Skills } from '../../components/sections';

const HomePage = () => {
  return (
    <main>
      <Hero />
      
      {/* Sección de tecnologías */}
      <Skills />
      
      {/* Sección de proyectos destacados */}
      <Projects featured={true} />
      
      {/* Sección de contacto */}
      <Contact />
    </main>
  );
};

export default HomePage;