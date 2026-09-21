import React, { useState, useRef } from 'react';
import { Plus, Mic, Loader2, CornerDownLeft, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import ModeSelector from './ModeSelector';

const Composer = () => {
  const { mode, messages, setMessages, resumeText, setResumeText, jobDescription, isLoading, setIsLoading, currentSessionId, setCurrentSessionId } = useAppContext();
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const suggestions = {
    chat: ['Improve my resume', 'Find missing skills', 'Start mock interview', 'Create career roadmap'],
    resume: ['Analyze Resume', 'Check ATS score', 'Rewrite professional summary'],
    jobs: ['Analyze Match', 'What are the missing skills?', 'Interview prep for this job'],
    interview: ['Start Interview (Python)', 'Start Interview (SQL)', 'General HR Interview']
  };

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim() && mode !== 'resume') return;
    
    // Resume specific handling (uploading) handled via attach button
    if (mode === 'resume' && text === 'Analyze Resume') {
      if (!resumeText) {
        toast.error('Please attach a resume first.');
        return;
      }
      executeResumeAnalysis();
      return;
    }
    
    if (mode === 'jobs' && text === 'Analyze Match') {
      if (!resumeText) {
        toast.error('Please upload your resume in Resume Analyzer mode first.');
        return;
      }
      if (!jobDescription) {
        toast.error('Please provide a job description.');
        // In a real flow, we'd prompt the user in chat to paste the JD
        return;
      }
      executeJobMatch();
      return;
    }

    // Default chat behavior
    const newUserMsg = { id: Date.now().toString(), role: 'user' as const, content: text };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      if (mode === 'interview') {
        const data = await api.interviewChat('General', 'Medium', newMessages); // Simplified for UI
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant' as const, content: data.response }]);
      } else {
        // general chat
        const result = await api.generalChat(newMessages, currentSessionId || undefined);
        setCurrentSessionId(result.session_id);
        
        const assistantMsg = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: result.response,
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      toast.error('Failed to get a response.');
      setMessages(messages); // revert
    } finally {
      setIsLoading(false);
    }
  };

  const executeResumeAnalysis = async () => {
    const msgId = Date.now().toString();
    setMessages(prev => [...prev, { id: msgId, role: 'user', content: 'Please analyze my uploaded resume.' }]);
    setIsLoading(true);
    try {
      const data = await api.analyzeResume(resumeText);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: 'Here is the analysis of your resume.',
        type: 'resume_analysis',
        data: data 
      }]);
      toast.success('Resume analyzed successfully!');
    } catch (err) {
      toast.error('Failed to analyze resume.');
    } finally {
      setIsLoading(false);
    }
  };

  const executeJobMatch = async () => {
    const msgId = Date.now().toString();
    setMessages(prev => [...prev, { id: msgId, role: 'user', content: 'Compare my resume against the provided job description.' }]);
    setIsLoading(true);
    try {
      const data = await api.matchJob(resumeText, jobDescription);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: 'Here is how well you match the job description.',
        type: 'job_analysis',
        data: data 
      }]);
      toast.success('Job match completed!');
    } catch (err) {
      toast.error('Failed to analyze job match.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const data = await api.uploadResume(file);
      setResumeText(data.text);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'user', 
        content: `Uploaded: ${file.name}`,
        type: 'resume_upload' 
      }]);
      toast.success('Resume extracted!');
    } catch (err) {
      toast.error('Failed to extract resume.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className={`w-full mx-auto px-4 ${isEmpty ? 'max-w-[800px]' : 'max-w-4xl pb-6 pt-2'}`}>
      
      {!isEmpty && (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-3 scrollbar-hide">
          {suggestions[mode]?.map((sug, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(sug)}
              className="whitespace-nowrap flex items-center gap-2 px-4 py-1.5 bg-white border border-[#e3e3e3] rounded-full text-[13px] font-medium text-[#444746] hover:bg-[#f0f4f9] transition-colors"
            >
              <Sparkles size={14} />
              {sug}
            </button>
          ))}
        </div>
      )}
      
      <div className={`relative bg-white rounded-[32px] border border-[#e3e3e3] flex items-center focus-within:shadow-md transition-all ${isEmpty ? 'p-2' : 'p-1.5'}`}>
        
        {/* Left Icons */}
        <div className="flex items-center gap-1 text-[#444746] pl-2">
          <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.txt" onChange={handleFileUpload} />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-[#f0f4f9] hover:text-[#1f1f1f] rounded-full transition-colors" 
            title="Attach File"
          >
            <Plus size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Typing Area */}
        <textarea
          className="flex-1 bg-transparent px-3 py-3 text-[#1f1f1f] placeholder-[#444746] border-0 border-transparent outline-none focus:outline-none focus:ring-0 focus:border-transparent resize-none max-h-[200px] text-[15px]"
          placeholder="Type a message..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          style={{ minHeight: '52px' }}
        />
        
        {/* Right Icons */}
        <div className="flex items-center gap-0.5 pr-2 text-[#444746]">
          <ModeSelector />
          <button className="p-2 hover:bg-[#f0f4f9] hover:text-[#1f1f1f] rounded-full transition-colors">
            <Mic size={22} strokeWidth={1.5} />
          </button>
          
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || (!inputValue.trim() && mode !== 'resume')}
            className={`p-2.5 ml-1 rounded-full flex items-center justify-center transition-all ${
              inputValue.trim() && !isLoading ? 'bg-[#1f1f1f] text-white' : 'bg-[#e3e3e3] text-white'
            }`}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <CornerDownLeft size={18} strokeWidth={2.5} />}
          </button>
        </div>

      </div>

      {isEmpty && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {suggestions[mode]?.map((sug, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(sug)}
              className="px-4 py-2 bg-white border border-[#e3e3e3] rounded-full text-[13px] font-medium text-[#444746] hover:bg-[#f0f4f9] transition-colors flex items-center gap-2"
            >
              <Sparkles size={14} />
              {sug}
            </button>
          ))}
        </div>
      )}

      {!isEmpty && (
        <div className="text-center mt-3">
          <p className="text-[11px] text-slate-400">Alex can make mistakes. Consider verifying important information.</p>
        </div>
      )}
    </div>
  );
};

export default Composer;
