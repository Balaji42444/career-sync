import { useState, useEffect } from 'react';
import Header from './Header';
import MessageList from './MessageList';
import Composer from './Composer';
import ProfileModal from './ProfileModal';
import { useAppContext } from '../context/AppContext';
import { X, MessageSquare, Clock } from 'lucide-react';

const Workspace = () => {
  const { messages, sessions, fetchSessions, loadSession, currentSessionId } = useAppContext();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const isEmpty = messages.length === 0;

  useEffect(() => {
    if (isHistoryOpen) {
      fetchSessions();
    }
  }, [isHistoryOpen]);

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-800 font-sans relative">
      
      {/* History Drawer Overlay */}
      {isHistoryOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      {/* History Drawer */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#F7F8FA] border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out ${isHistoryOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Clock size={18} className="text-slate-500" />
            Recent Chats
          </h2>
          <button onClick={() => setIsHistoryOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500">
            <X size={18} />
          </button>
        </div>
        <div className="p-3 overflow-y-auto h-[calc(100vh-60px)]">
          {sessions.length === 0 ? (
            <p className="text-sm text-slate-500 text-center mt-10">No recent chats.</p>
          ) : (
            <div className="space-y-1">
              {sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => {
                    loadSession(session.id);
                    setIsHistoryOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-start gap-3 transition-colors ${currentSessionId === session.id ? 'bg-primary-50 text-primary-900' : 'hover:bg-slate-200 text-slate-700'}`}
                >
                  <MessageSquare size={16} className={`mt-0.5 flex-shrink-0 ${currentSessionId === session.id ? 'text-primary-600' : 'text-slate-400'}`} />
                  <div className="truncate font-medium">{session.title}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col relative w-full h-full bg-white">
        <Header onOpenHistory={() => setIsHistoryOpen(true)} />
        
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-[15vh] relative">
            <h2 className="text-[28px] text-[#1f1f1f] mb-8 font-medium">How can I help you today?</h2>
            <div className="w-full flex justify-center">
              <Composer />
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-[10px] text-[#8e8e8e] opacity-80">
                We are not affiliated with any owners or companies that developed the LLM models provided on this website.
              </p>
            </div>
          </div>
        ) : (
          <>
            <MessageList />
            <Composer />
          </>
        )}
      </div>
      <ProfileModal />
    </div>
  );
};

export default Workspace;
