
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Heart, Activity, Salad, Brain, Calendar, ChevronRight, Loader2, Sparkles, History, RotateCcw } from 'lucide-react';
import { UserCycleData, CyclePhase } from './types';
import { PHASE_METADATA } from './constants';
import { getDetailedCycleInfo } from './utils/cycleLogic';
import { getCoachAdvice } from './services/geminiService';
import CycleCurve from './components/CycleCurve';

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserCycleData | null>(() => {
    const saved = localStorage.getItem('luna_user_data');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Real today's day
  const realTodayDay = useMemo(() => {
    if (!userData) return 1;
    return getDetailedCycleInfo(userData.lastStartDate, userData.cycleLength).currentDay;
  }, [userData]);

  // Preview day state
  const [previewDay, setPreviewDay] = useState<number>(realTodayDay);

  useEffect(() => {
    if (userData) {
      setPreviewDay(realTodayDay);
    }
  }, [realTodayDay, userData]);

  const fetchAdvice = useCallback(async (data: UserCycleData, dayToFetch: number) => {
    setLoading(true);
    setError(null);
    try {
      const { phase } = getDetailedCycleInfo(data.lastStartDate, data.cycleLength, dayToFetch);
      const result = await getCoachAdvice(phase, dayToFetch, data);
      setAdvice(result || "无法生成建议，请稍后再试。");
    } catch (err) {
      setError("AI 连接失败。请检查您的 API 配置。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch for actual today
  useEffect(() => {
    if (userData && !advice) {
      fetchAdvice(userData, realTodayDay);
    }
  }, [userData, realTodayDay, fetchAdvice, advice]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newData: UserCycleData = {
      lastStartDate: formData.get('lastStartDate') as string,
      cycleLength: parseInt(formData.get('cycleLength') as string, 10),
    };
    setUserData(newData);
    localStorage.setItem('luna_user_data', JSON.stringify(newData));
    setAdvice(null);
  };

  const handleReset = () => {
    setUserData(null);
    setAdvice(null);
    localStorage.removeItem('luna_user_data');
  };

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewDay(parseInt(e.target.value, 10));
  };

  const resetToToday = () => {
    setPreviewDay(realTodayDay);
    if (userData) fetchAdvice(userData, realTodayDay);
  };

  const fetchCurrentPreviewAdvice = () => {
    if (userData) fetchAdvice(userData, previewDay);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F9] text-gray-900 pb-20">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-rose-100 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-rose-500 p-2 rounded-xl shadow-lg shadow-rose-200">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-500">
              LunaSync AI
            </h1>
          </div>
          {userData && (
            <div className="flex items-center gap-4">
              <button 
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-rose-500 transition-colors uppercase tracking-widest font-bold"
              >
                重设数据
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {!userData ? (
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-rose-100 border border-rose-50 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-rose-800">开始您的周期同步之旅</h2>
            <p className="text-gray-500 mb-6 text-sm">我们将根据您的生理周期定制运动与饮食方案，助您高效减脂。</p>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  上次月经开始日期
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="date" 
                    name="lastStartDate" 
                    required 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  平均周期长度 (天)
                </label>
                <input 
                  type="number" 
                  name="cycleLength" 
                  defaultValue={28} 
                  min={20} 
                  max={45}
                  required 
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all outline-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                生成我的周期方案 <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Cycle Visualization & Slider */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-rose-100 border border-rose-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-600 flex items-center gap-2">
                  <History className="w-4 h-4" /> 周期阶段预览
                </h3>
                {previewDay !== realTodayDay && (
                  <button 
                    onClick={resetToToday}
                    className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> 返回今日
                  </button>
                )}
              </div>
              
              <CycleCurve currentDay={previewDay} cycleLength={userData.cycleLength} />
              
              <div className="mt-6 px-2">
                <input 
                  type="range" 
                  min="1" 
                  max={userData.cycleLength} 
                  value={previewDay}
                  onChange={handlePreviewChange}
                  className="w-full h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  <span>Day 1</span>
                  <span>Day {Math.floor(userData.cycleLength / 2)}</span>
                  <span>Day {userData.cycleLength}</span>
                </div>
              </div>
            </div>

            {/* Phase Dashboard */}
            {(() => {
              const { phase } = getDetailedCycleInfo(userData.lastStartDate, userData.cycleLength, previewDay);
              const metadata = PHASE_METADATA[phase];
              const isToday = previewDay === realTodayDay;
              
              return (
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-rose-100 border border-rose-50 transition-all duration-500">
                  <div className={`px-8 py-10 ${metadata.color.split(' ')[0]} border-b ${metadata.color.split(' ')[1]} transition-colors duration-500`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/50 ${metadata.color.split(' ')[2]}`}>
                            {isToday ? '今日：' : '预览：'}第 {previewDay} 天
                          </span>
                        </div>
                        <h2 className="text-3xl font-black mb-2">{metadata.name}</h2>
                        <p className="text-lg opacity-80 max-w-xl">{metadata.description}</p>
                      </div>
                      <div className="flex gap-4">
                        <PhaseSummaryCard icon={<Activity />} title="激素" value={metadata.hormoneStatus} />
                        <PhaseSummaryCard icon={<Heart />} title="心态" value={metadata.mindset} />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 p-6 rounded-2xl bg-amber-50 border border-amber-100 hover:shadow-md transition-shadow">
                      <div className="bg-amber-400 p-2 rounded-lg text-white">
                        <Salad className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-900">饮食重点</h4>
                        <p className="text-amber-800/80">{metadata.dietFocus}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-6 rounded-2xl bg-indigo-50 border border-indigo-100 hover:shadow-md transition-shadow">
                      <div className="bg-indigo-400 p-2 rounded-lg text-white">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-indigo-900">运动建议</h4>
                        <p className="text-indigo-800/80">{metadata.exerciseAdvice}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* AI Advice Section */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-rose-100 border border-rose-50">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-rose-100 p-2 rounded-xl text-rose-500">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">深度减脂方案</h3>
                </div>
                {!isTodayAdvice() && (
                  <button 
                    onClick={fetchCurrentPreviewAdvice}
                    disabled={loading}
                    className="text-xs font-bold px-4 py-2 bg-rose-500 text-white rounded-full shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    更新此阶段建议
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
                  <p className="text-gray-500 animate-pulse font-medium">正在分析您的内分泌阶段...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center">
                  {error}
                </div>
              ) : (
                <article className="prose prose-rose max-w-none prose-h1:text-rose-800 prose-h2:text-rose-700 prose-h3:text-rose-600">
                  <div className="whitespace-pre-wrap leading-relaxed text-gray-700 font-normal">
                    {advice}
                  </div>
                </article>
              )}
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-rose-100 px-6 py-3 flex justify-around md:hidden z-20">
        <button className="flex flex-col items-center gap-1 text-rose-500">
          <Activity className="w-6 h-6" />
          <span className="text-[10px] font-bold">周期</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400" onClick={() => !userData && alert('请先设置数据')}>
          <Salad className="w-6 h-6" />
          <span className="text-[10px] font-bold">食谱</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400" onClick={() => !userData && alert('请先设置数据')}>
          <Heart className="w-6 h-6" />
          <span className="text-[10px] font-bold">训练</span>
        </button>
      </nav>
    </div>
  );

  function isTodayAdvice() {
     return previewDay === realTodayDay;
  }
};

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const PhaseSummaryCard: React.FC<SummaryCardProps> = ({ icon, title, value }) => (
  <div className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl min-w-[120px] border border-white/40">
    <div className="flex items-center gap-2 mb-1 text-gray-600">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}
      <span className="text-[10px] font-bold uppercase tracking-widest">{title}</span>
    </div>
    <div className="font-bold text-gray-900 truncate">{value}</div>
  </div>
);

export default App;
