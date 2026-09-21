import React, { createContext, useState, useContext, type ReactNode } from 'react';
import { api } from '../services/api';

export type Mode = 'chat' | 'resume' | 'jobs' | 'interview';

export interface UserProfile {
  name: string;
  targetRole: string;
  experience: string;
  skills: string;
  goal: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'resume_analysis' | 'job_analysis' | 'interview_eval' | 'resume_upload';
  data?: any;
}

export interface SessionInfo {
  id: string;
  title: string;
  created_at: string;
}

export interface AppState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  resumeText: string;
  setResumeText: (text: string) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  clearAll: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
  sessions: SessionInfo[];
  setSessions: React.Dispatch<React.SetStateAction<SessionInfo[]>>;
  loadSession: (id: string) => Promise<void>;
  fetchSessions: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<Mode>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Session State
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Balaji',
    targetRole: 'Data Analyst',
    experience: 'Student / Fresher',
    skills: 'Python, SQL, Java, Excel, AWS',
    goal: 'Placement preparation'
  });

  const fetchSessions = async () => {
    try {
      const data = await api.getSessions();
      setSessions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadSession = async (id: string) => {
    try {
      const data = await api.getSession(id);
      setMessages(data.messages);
      setCurrentSessionId(data.session.id);
    } catch (e) {
      console.error(e);
    }
  };

  const clearAll = () => {
    setMessages([]);
    setResumeText('');
    setJobDescription('');
    setCurrentSessionId(null);
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        messages,
        setMessages,
        resumeText,
        setResumeText,
        jobDescription,
        setJobDescription,
        profile,
        setProfile,
        isSettingsOpen,
        setIsSettingsOpen,
        clearAll,
        isLoading,
        setIsLoading,
        currentSessionId,
        setCurrentSessionId,
        sessions,
        setSessions,
        loadSession,
        fetchSessions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
