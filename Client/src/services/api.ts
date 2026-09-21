import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/resume/upload`, formData);
    return response.data;
  },
  
  analyzeResume: async (resumeText: string) => {
    const response = await axios.post(`${API_URL}/resume/analyze`, { resume_text: resumeText });
    return response.data;
  },
  
  matchJob: async (resumeText: string, jobDescription: string) => {
    const response = await axios.post(`${API_URL}/jobs/match`, { 
      resume_text: resumeText,
      job_description: jobDescription
    });
    return response.data;
  },
  
  interviewChat: async (interviewType: string, difficulty: string, messages: any[], sessionId?: string) => {
    const response = await axios.post(`${API_URL}/interview/chat`, {
      interview_type: interviewType,
      difficulty,
      messages,
      session_id: sessionId
    });
    return response.data;
  },
  
  generalChat: async (messages: any[], sessionId?: string) => {
    const response = await axios.post(`${API_URL}/chat`, { messages, session_id: sessionId });
    return response.data;
  },

  getSessions: async () => {
    const response = await axios.get(`${API_URL}/sessions`);
    return response.data;
  },

  getSession: async (sessionId: string) => {
    const response = await axios.get(`${API_URL}/sessions/${sessionId}`);
    return response.data;
  }
};
