
export enum CyclePhase {
  MENSTRUAL = 'MENSTRUAL',
  FOLLICULAR = 'FOLLICULAR',
  OVULATION = 'OVULATION',
  LUTEAL = 'LUTEAL'
}

export interface UserCycleData {
  lastStartDate: string;
  cycleLength: number;
}

export interface PhaseInfo {
  name: string;
  hormoneStatus: string;
  dietFocus: string;
  exerciseAdvice: string;
  mindset: string;
  color: string;
  description: string;
}

export interface CoachPlan {
  summary: string;
  dietPlan: {
    carbs: string;
    protein: string;
    fats: string;
    keyFoods: string[];
  };
  exercisePlan: {
    type: string;
    intensity: string;
    schedule: string[];
  };
  hormoneContext: string;
}
