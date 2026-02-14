
import { CyclePhase } from '../types';

export const calculateCycleDay = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getPhaseForDay = (day: number, cycleLength: number): CyclePhase => {
  const normalizedDay = ((day % cycleLength) + cycleLength) % cycleLength + 1;
  
  const mEnd = Math.max(1, Math.floor(cycleLength * (5/28)));
  const fEnd = Math.max(mEnd + 1, Math.floor(cycleLength * (13/28)));
  const oEnd = Math.max(fEnd + 1, Math.floor(cycleLength * (16/28)));
  
  if (normalizedDay <= mEnd) return CyclePhase.MENSTRUAL;
  if (normalizedDay <= fEnd) return CyclePhase.FOLLICULAR;
  if (normalizedDay <= oEnd) return CyclePhase.OVULATION;
  return CyclePhase.LUTEAL;
};

export const getDetailedCycleInfo = (startDate: string, cycleLength: number, targetDayOffset?: number) => {
  const start = new Date(startDate);
  const now = new Date();
  
  let currentDay: number;
  if (targetDayOffset !== undefined) {
    currentDay = targetDayOffset;
  } else {
    const diffTime = now.getTime() - start.getTime();
    const totalDaysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    currentDay = (totalDaysElapsed % cycleLength) + 1;
  }
  
  const phase = getPhaseForDay(currentDay - 1, cycleLength);
  
  return { currentDay, phase };
};

/**
 * Returns simplified relative levels (0-1) for Estrogen and Progesterone
 */
export const getHormoneLevels = (day: number, cycleLength: number) => {
  const t = (day - 1) / cycleLength; // 0 to 1
  
  // Estrogen: Peaks around ovulation (day 14/28 = 0.5), smaller peak in luteal
  let estrogen = 0;
  if (t < 0.5) {
    estrogen = Math.pow(t * 2, 3); // Slow rise
  } else if (t < 0.6) {
    estrogen = 1 - (t - 0.5) * 5; // Sharp drop after peak
  } else {
    estrogen = 0.5 + 0.3 * Math.sin((t - 0.6) * Math.PI * 2); // Secondary bump
  }

  // Progesterone: Very low until ovulation, then peaks mid-luteal
  let progesterone = 0;
  if (t > 0.5) {
    progesterone = Math.sin((t - 0.5) * Math.PI); // Half-sine peak in second half
  }
  
  return { estrogen, progesterone };
};
