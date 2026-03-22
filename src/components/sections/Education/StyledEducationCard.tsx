import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Education } from '../../../types/education.types';

interface StyledEducationCardProps {
  education: Education;
  darkMode: boolean;
  index: number;
}

const StyledEducationCard: React.FC<StyledEducationCardProps> = ({ education, index }) => {
  const accentColors = ['#8b5cf6', '#6366f1', '#a855f7', '#7c3aed', '#818cf8'];
  const accentColor = accentColors[index % accentColors.length];

  return (
    <CardContainer
      $accentColor={accentColor}
      initial={{ opacity: 0, x: 60 }}
      whileInView={{
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: 'easeOut' },
      }}
      viewport={{ once: true, margin: '-80px' }}
    >
      <CardHeader $accentColor={accentColor}>
        <Degree $accentColor={accentColor}>{education.degree}</Degree>
        <Institution>{education.institution}</Institution>
      </CardHeader>

      <CardContent>
        <LocationDateWrapper>
          <Location>
            <LocationIcon />
            {education.location}
          </Location>
          <DateRange $accentColor={accentColor}>
            {education.startDate} - {education.endDate}
          </DateRange>
        </LocationDateWrapper>

        <Description>{education.description}</Description>
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
    left: 0;
    width: 3px;
    height: 100%;
    background: ${p => p.$accentColor};
  }
`;

const CardHeader = styled.div<{ $accentColor: string }>`
  padding: 20px 25px;
  background: var(--space-surface-2);
  border-bottom: 1px solid var(--space-border);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 50%;
    height: 2px;
    background: ${p => p.$accentColor};
  }
`;

const Degree = styled.h3<{ $accentColor: string }>`
  margin: 0 0 8px;
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(90deg, var(--space-accent-2), ${p => p.$accentColor});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Institution = styled.p`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--space-text);
  transition: transform 0.3s ease;

  ${CardContainer}:hover & {
    transform: translateX(4px);
  }
`;

const CardContent = styled.div`
  padding: 20px 25px;
`;

const LocationDateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--space-text-dim);
`;

const LocationIcon = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%236060a0' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
`;

const DateRange = styled.div<{ $accentColor: string }>`
  font-size: 0.85rem;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 20px;
  background: ${p => p.$accentColor}18;
  color: ${p => p.$accentColor};
  border: 1px solid ${p => p.$accentColor}30;
  transition: all 0.3s ease;
  white-space: nowrap;

  ${CardContainer}:hover & {
    background: ${p => p.$accentColor}28;
  }
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--space-text);
  opacity: 0.85;
  padding-left: 10px;
  border-left: 2px dashed var(--space-border);
`;

export default StyledEducationCard;
