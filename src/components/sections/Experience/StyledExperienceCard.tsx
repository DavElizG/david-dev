import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Experience } from '../../../types/experience.types';

interface StyledExperienceCardProps {
  experience: Experience;
  darkMode: boolean;
  index: number;
}

const StyledExperienceCard: React.FC<StyledExperienceCardProps> = ({ experience, darkMode, index }) => {
  // Colores alternados para cada card
  const accentColors = ['#10B981', '#059669', '#047857', '#34D399', '#6EE7B7'];
  const accentColor = accentColors[index % accentColors.length];
  
  return (
    <CardContainer 
      $darkMode={darkMode} 
      $accentColor={accentColor}
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" }
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <CardHeader $accentColor={accentColor} $darkMode={darkMode}>
        <TitleWrapper>
          <Role>{experience.role}</Role>
          <Company>{experience.company}</Company>
        </TitleWrapper>
        <DateBadge $accentColor={accentColor} $darkMode={darkMode}>
          {experience.startDate} - {experience.endDate}
        </DateBadge>
      </CardHeader>
      
      <CardContent $darkMode={darkMode}>
        <Location $darkMode={darkMode}>
          <LocationIcon $darkMode={darkMode} />
          {experience.location}
        </Location>
        
        <Description $darkMode={darkMode}>{experience.description}</Description>
        
        {experience.technologies && experience.technologies.length > 0 && (
          <TechSection>
            <TechTitle $darkMode={darkMode}>Tecnologías</TechTitle>
            <TechList>
              {experience.technologies.map((tech, idx) => (
                <TechBadge 
                  key={idx} 
                  $darkMode={darkMode} 
                  $accentColor={accentColor}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {tech}
                </TechBadge>
              ))}
            </TechList>
          </TechSection>
        )}
      </CardContent>
    </CardContainer>
  );
};

// Estilos con Styled Components
const CardContainer = styled(motion.div)<{ $darkMode: boolean; $accentColor: string }>`
  position: relative;
  background: ${props => props.$darkMode ? '#1E1E1E' : '#FFFFFF'};
  border-radius: 16px;
  box-shadow: ${props => props.$darkMode 
    ? `0 10px 20px rgba(0,0,0,0.3), 0 0 0 1px ${props.$accentColor}40` 
    : `0 10px 30px rgba(0,0,0,0.1), 0 0 0 1px ${props.$accentColor}40`};
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform-origin: center bottom;

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: ${props => props.$darkMode 
      ? `0 15px 30px rgba(0,0,0,0.4), 0 0 0 2px ${props.$accentColor}70` 
      : `0 20px 40px rgba(0,0,0,0.15), 0 0 0 2px ${props.$accentColor}70`};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.$accentColor};
  }
`;

const CardHeader = styled.div<{ $accentColor: string; $darkMode: boolean }>`
  padding: 20px 25px;
  background: ${props => props.$darkMode 
    ? `linear-gradient(135deg, #242424, #303030)` 
    : `linear-gradient(135deg, #FFFFFF, #F8F8F8)`};
  position: relative;
  border-bottom: 1px solid ${props => props.$darkMode ? '#3A3A3A' : '#EAEAEA'};
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    right: 0;
    width: 50%;
    height: 3px;
    background: ${props => props.$accentColor};
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Role = styled.h3`
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #10B981, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const Company = styled.p`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  transition: transform 0.3s ease;

  ${CardContainer}:hover & {
    transform: translateX(5px);
  }
`;

const DateBadge = styled.div<{ $accentColor: string; $darkMode: boolean }>`
  font-size: 0.9rem;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 20px;
  background: ${props => props.$accentColor}20;
  color: ${props => props.$accentColor};
  transition: all 0.3s ease;
  display: inline-block;

  ${CardContainer}:hover & {
    background: ${props => props.$accentColor}30;
    transform: scale(1.05);
  }
`;

const CardContent = styled.div<{ $darkMode: boolean }>`
  padding: 20px 25px;
  background: ${props => props.$darkMode ? '#252525' : '#FFFFFF'};
`;

const Location = styled.div<{ $darkMode: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: ${props => props.$darkMode ? '#B0B0B0' : '#666666'};
  margin-bottom: 15px;
`;

const LocationIcon = styled.span<{ $darkMode: boolean }>`
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: ${props => props.$darkMode 
    ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23B0B0B0' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")` 
    : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23666666' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")`};
  background-repeat: no-repeat;
  background-size: contain;
`;

const Description = styled.p<{ $darkMode: boolean }>`
  margin: 0 0 20px 0;
  font-size: 1rem;
  line-height: 1.6;
  color: ${props => props.$darkMode ? '#E0E0E0' : '#333333'};
  position: relative;
  padding-left: 10px;
  border-left: 2px dashed #5a5a5a30;
`;

const TechSection = styled.div`
  margin-top: 15px;
`;

const TechTitle = styled.h4<{ $darkMode: boolean }>`
  font-size: 1.1rem;
  margin: 0 0 12px;
  color: ${props => props.$darkMode ? '#FFFFFF' : '#111111'};
`;

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TechBadge = styled.span<{ $darkMode: boolean; $accentColor: string }>`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  background: ${props => props.$darkMode ? '#333333' : '#F3F4F6'};
  color: ${props => props.$darkMode ? '#E0E0E0' : '#333333'};
  border: 1px solid ${props => props.$accentColor}40;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeIn 0.5s forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${CardContainer}:hover & {
    background: ${props => props.$accentColor}15;
    border-color: ${props => props.$accentColor}60;
    transform: scale(1.05);
  }
`;

export default StyledExperienceCard;