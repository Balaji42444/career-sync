import { useState, useRef, useEffect } from 'react';
import { MessageSquare, FileText, Briefcase, Mic, ChevronDown, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ModeSelector = () => {
  const { mode, setMode } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const modes = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, desc: 'Talk to Alex about anything' },
    { id: 'resume', label: 'Resume Analyzer', icon: FileText, desc: 'Get AI feedback on your CV' },
    { id: 'jobs', label: 'Job Matcher', icon: Briefcase, desc: 'Compare CV to Job Description' },
    { id: 'interview', label: 'Mock Interview', icon: Mic, desc: 'Practice with AI Interviewer' },
  ] as const;

  const currentMode = modes.find(m => m.id === mode) || modes[0];
  const CurrentIcon = currentMode.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-20 flex-shrink-0" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 hover:bg-slate-200/60 px-3 py-2 rounded-full transition-all text-slate-600 font-medium text-sm focus:outline-none"
        title={currentMode.label}
      >
        <CurrentIcon size={18} className={isOpen ? 'text-primary-600' : 'text-slate-500'} />
        <span className="hidden sm:inline">{currentMode.label}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden py-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="px-4 py-1.5 border-b border-slate-50 mb-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Select Mode</p>
          </div>
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 transition-colors ${isActive ? 'bg-primary-50/50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon size={16} />
                  </div>
                  <div className="text-left">
                    <div className={`text-xs font-semibold ${isActive ? 'text-primary-900' : 'text-slate-700'}`}>{m.label}</div>
                    <div className="text-[10px] text-slate-500">{m.desc}</div>
                  </div>
                </div>
                {isActive && <Check size={14} className="text-primary-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ModeSelector;
