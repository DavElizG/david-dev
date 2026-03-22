import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Experience } from '../../../types/experience.types';

interface StyledExperienceCardProps {
  experience: Experience;
  darkMode: boolean;
  index: number;
}

const StyledExperienceCard: React.FC<StyledExperienceCardProps> = ({ experience, index }) => {
  const accentColors = ['#4a9eff', '#6366f1', '#38bdf8', '#8b5cf6', '#06b6d4'];
  const accentColor = accentColors[index % accentColors.length];

  return (
    <CardContainer
      $accentColor={accentColor}
      initial={{ opacity: 0, x: -60 }}
      whileInView={{
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: 'easeOut' },
      }}
      viewport={{ once: true, margin: '-80px' }}
    >
      <CardHeader $accentColor={accentColor}>
        <TitleWrapper>
          <Role $accentColor={accentColor}>{experience.role}</Role>
          <Company>{experience.company}</Company>
        </TitleWrapper>
        <DateBadge $accentColor={accentColor}>
          {experience.startDate} - {experience.endDate}
        </DateBadge>
      </CardHeader>

      <CardContent>
        <Location>
          <LocationIcon />
          {experience.location}
        </Location>

        <Description>{experience.description}</Description>

        {experience.technologies && experience.technologies.length > 0 && (
          <TechSection>
            <TechTitle>Technologies</TechTitle>
            <TechList>
              {experience.technologies.map((tech, idx) => (
                <TechBadge
                  key={idx}
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

const CardContainer = styled(motion.div)<{ $accentColor: string }>`
  position: relative;
  background: var(--space-surface);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px ${p => p.$accentColor}30;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px ${p => p.$accentColor}60;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 3px;
    height: 100%;
    background: ${p => p.$accentColor};
  }
`;

const CardHeader = styled.div<{ $accentColor: string }>`
  padding: 20px 25px;
  background: var(--space-surface-2);
  border-bottom: 1px solid var(--space-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;

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
    height: 2px;
    background: ${p => p.$accentColor};
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Role = styled.h3<{ $accentColor: string }>`
  margin: 0 0 8px;
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(90deg, var(--space-accent), ${p => p.$accentColor});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Company = styled.p`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--space-text);
  transition: transform 0.3s ease;

  ${CardContainer}:hover & {
    transform: translateX(4px);
  }
`;

const DateBadge = styled.div<{ $accentColor: string }>`
  font-size: 0.85rem;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 20px;
  background: ${p => p.$accentColor}18;
  color: ${p => p.$accentColor};
  border: 1px solid ${p => p.$accentColor}30;
  transition: all 0.3s ease;
  display: inline-block;
  white-space: nowrap;

  ${CardContainer}:hover & {
    background: ${p => p.$accentColor}28;
  }
`;

const CardContent = styled.div`
  padding: 20px 25px;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--space-text-dim);
  margin-bottom: 15px;
`;

const LocationIcon = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%236060a0' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
`;

const Description = styled.p`
  margin: 0 0 20px 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--space-text);
  opacity: 0.85;
  padding-left: 10px;
  border-left: 2px dashed var(--space-border);
`;

const TechSection = styled.div`
  margin-top: 15px;
`;

const TechTitle = styled.h4`
  font-size: 0.95rem;
  margin: 0 0 10px;
  color: var(--space-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
`;

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TechBadge = styled.span<{ $accentColor: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.82rem;
  background: var(--space-surface-2);
  color: var(--space-text);
  border: 1px solid ${p => p.$accentColor}30;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeIn 0.5s forwards;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  ${CardContainer}:hover & {
    background: ${p => p.$accentColor}12;
    border-color: ${p => p.$accentColor}50;
  }
`;

export default StyledExperienceCard;
