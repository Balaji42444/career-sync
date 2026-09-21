import { ChevronDown, Sparkles, Menu } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header = ({ onOpenHistory }: { onOpenHistory?: () => void }) => {
  const { clearAll } = useAppContext();
  
  return (
    <div className="h-16 bg-white flex items-center justify-between px-6 sticky top-0 z-10 flex-shrink-0">
      <div className="flex items-center gap-3">
        {onOpenHistory && (
          <button onClick={onOpenHistory} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <Menu size={20} />
          </button>
        )}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={clearAll}
          title="New Chat"
        >
          <Sparkles className="text-blue-500 fill-blue-500" size={20} />
          <h1 className="text-[17px] font-semibold text-[#1f1f1f] flex items-center gap-0.5">
            Career Sync Pro <ChevronDown size={18} className="text-slate-400 ml-1" strokeWidth={2.5} />
          </h1>
        </div>
      </div>
      
    </div>
  );
};

export default Header;
