import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Education } from '../../../types/education.types';

interface StyledEducationCardProps {
  education: Education;
  darkMode: boolean;
  index: number;
}

const StyledEducationCard: React.FC<StyledEducationCardProps> = ({ education, darkMode, index }) => {
  // Colores alternados para cada card
  const accentColors = ['#4F46E5', '#7C3AED', '#2563EB', '#8B5CF6', '#3B82F6'];
  const accentColor = accentColors[index % accentColors.length];
  
  return (
    <CardContainer 
      $darkMode={darkMode} 
      $accentColor={accentColor}
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" }
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <CardHeader $accentColor={accentColor} $darkMode={darkMode}>
        <Degree>{education.degree}</Degree>
        <Institution>{education.institution}</Institution>
      </CardHeader>
      
      <CardContent $darkMode={darkMode}>
        <LocationDateWrapper>
          <Location $darkMode={darkMode}>
            <LocationIcon $darkMode={darkMode} />
            {education.location}
          </Location>
          <DateRange $accentColor={accentColor} $darkMode={darkMode}>
            {education.startDate} - {education.endDate}
          </DateRange>
        </LocationDateWrapper>
        
        <Description $darkMode={darkMode}>{education.description}</Description>
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
    left: 0;
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
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 50%;
    height: 3px;
    background: ${props => props.$accentColor};
  }
`;

const Degree = styled.h3`
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #3B82F6, #4F46E5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const Institution = styled.p`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  transition: transform 0.3s ease;

  ${CardContainer}:hover & {
    transform: translateX(5px);
  }
`;

const CardContent = styled.div<{ $darkMode: boolean }>`
  padding: 20px 25px;
  background: ${props => props.$darkMode ? '#252525' : '#FFFFFF'};
`;

const LocationDateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
`;

const Location = styled.div<{ $darkMode: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: ${props => props.$darkMode ? '#B0B0B0' : '#666666'};
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

const DateRange = styled.div<{ $accentColor: string; $darkMode: boolean }>`
  font-size: 0.9rem;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 12px;
  background: ${props => props.$accentColor}20;
  color: ${props => props.$accentColor};
  transition: background 0.3s ease, transform 0.3s ease;

  ${CardContainer}:hover & {
    background: ${props => props.$accentColor}30;
    transform: scale(1.05);
  }
`;

const Description = styled.p<{ $darkMode: boolean }>`
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: ${props => props.$darkMode ? '#E0E0E0' : '#333333'};
  position: relative;
  padding-left: 10px;
  border-left: 2px dashed #5a5a5a30;
`;

export default StyledEducationCard;