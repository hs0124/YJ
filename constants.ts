
import { CyclePhase, PhaseInfo } from './types';

export const PHASE_METADATA: Record<CyclePhase, PhaseInfo> = {
  [CyclePhase.MENSTRUAL]: {
    name: '月经期 (Menstrual Phase)',
    hormoneStatus: '激素水平最低',
    dietFocus: '补铁、温热饮食',
    exerciseAdvice: '伸展、慢走',
    mindset: '允许身体休息',
    color: 'bg-rose-100 border-rose-400 text-rose-700',
    description: '子宫内膜脱落，能量处于低谷，宜静养。'
  },
  [CyclePhase.FOLLICULAR]: {
    name: '卵泡期 (Follicular Phase)',
    hormoneStatus: '雌激素上升',
    dietFocus: '增加优质碳水',
    exerciseAdvice: '高强度训练 (HIIT)',
    mindset: '精力充沛，适合冲刺',
    color: 'bg-emerald-100 border-emerald-400 text-emerald-700',
    description: '身体恢复活力，代谢效率高，是减脂的“黄金周”。'
  },
  [CyclePhase.OVULATION]: {
    name: '排卵期 (Ovulation Phase)',
    hormoneStatus: '雌激素达峰',
    dietFocus: '控糖、高纤维',
    exerciseAdvice: '力量训练',
    mindset: '代谢稍升，食欲增加',
    color: 'bg-amber-100 border-amber-400 text-amber-700',
    description: '由于雌激素处于最高点，力量感最强，需严格控制胰岛素波动。'
  },
  [CyclePhase.LUTEAL]: {
    name: '黄体期 (Luteal Phase)',
    hormoneStatus: '孕激素主导',
    dietFocus: '拒绝甜食、低盐',
    exerciseAdvice: '中低强度有氧/普拉提',
    mindset: '预防水肿，对抗PMS',
    color: 'bg-indigo-100 border-indigo-400 text-indigo-700',
    description: '核心体温上升，基础代谢略微提高，但容易产生焦虑和暴食欲望。'
  }
};
