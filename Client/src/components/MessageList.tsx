import { useEffect, useRef } from 'react';
import { User, FileText, CheckCircle2, AlertTriangle, Lightbulb, MessageSquare, Sparkles } from 'lucide-react';
import { useAppContext, type Message } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ResumeAnalysisCard = ({ data }: { data: any }) => {
  return (
    <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-3 mb-4">
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <p className="text-slate-400 font-medium uppercase tracking-wider text-xs mb-1">Resume Score</p>
          <div className="text-4xl font-bold text-primary-600">{data.score}<span className="text-xl text-slate-300">/100</span></div>
        </div>
        <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h4 className="text-sm font-semibold text-slate-700 mb-1">Professional Summary</h4>
          <p className="text-sm text-slate-600 italic">"{data.professional_summary}"</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <h4 className="text-sm font-bold flex items-center gap-2 text-emerald-700"><CheckCircle2 size={16} /> Strengths</h4>
          <ul className="space-y-2">
            {data.strengths?.map((s: string, i: number) => <li key={i} className="text-xs text-slate-600 flex gap-2"><span className="text-emerald-500">•</span>{s}</li>)}
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-bold flex items-center gap-2 text-amber-700"><AlertTriangle size={16} /> Missing</h4>
          <ul className="space-y-2">
            {data.missing_skills?.map((s: string, i: number) => <li key={i} className="text-xs text-slate-600 flex gap-2"><span className="text-amber-500">•</span>{s}</li>)}
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-bold flex items-center gap-2 text-blue-700"><Lightbulb size={16} /> Improve</h4>
          <ul className="space-y-2">
            {data.recommendations?.map((s: string, i: number) => <li key={i} className="text-xs text-slate-600 flex gap-2"><span className="text-blue-500">•</span>{s}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

const JobAnalysisCard = ({ data }: { data: any }) => {
  return (
    <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-3 mb-4">
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <p className="text-slate-400 font-medium uppercase tracking-wider text-xs mb-1">Match Score</p>
          <div className="text-4xl font-bold text-primary-600">{data.match_score}%</div>
        </div>
        <div>
          <p className="text-slate-400 font-medium uppercase tracking-wider text-xs mb-1">Recommendation</p>
          <div className={`text-xl font-bold ${data.final_recommendation === 'Strong Match' ? 'text-emerald-600' : data.final_recommendation === 'Moderate Match' ? 'text-amber-600' : 'text-red-600'}`}>
            {data.final_recommendation}
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-bold flex items-center gap-2 text-emerald-700 mb-2"><CheckCircle2 size={16} /> Matching Skills</h4>
          <ul className="space-y-1">{data.matching_skills?.map((s: string, i: number) => <li key={i} className="text-xs text-slate-600 flex gap-2"><span className="text-emerald-500">•</span>{s}</li>)}</ul>
        </div>
        <div>
          <h4 className="text-sm font-bold flex items-center gap-2 text-amber-700 mb-2"><AlertTriangle size={16} /> Missing Skills</h4>
          <ul className="space-y-1">{data.missing_skills?.map((s: string, i: number) => <li key={i} className="text-xs text-slate-600 flex gap-2"><span className="text-amber-500">•</span>{s}</li>)}</ul>
        </div>
        <div>
          <h4 className="text-sm font-bold flex items-center gap-2 text-blue-700 mb-2"><Lightbulb size={16} /> Recommendations</h4>
          <ul className="space-y-1">{data.recommendations?.map((s: string, i: number) => <li key={i} className="text-xs text-slate-600 flex gap-2"><span className="text-blue-500">•</span>{s}</li>)}</ul>
        </div>
        <div>
          <h4 className="text-sm font-bold flex items-center gap-2 text-purple-700 mb-2"><MessageSquare size={16} /> Interview Topics</h4>
          <ul className="space-y-1">{data.interview_topics?.map((s: string, i: number) => <li key={i} className="text-xs text-slate-600 flex gap-2"><span className="text-purple-500">•</span>{s}</li>)}</ul>
        </div>
      </div>
    </div>
  );
};

const MessageList = () => {
  const { messages, isLoading } = useAppContext();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
      <div className="max-w-4xl mx-auto space-y-8">
        {messages.map((msg: Message) => (
          <div key={msg.id} className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
              {msg.role === 'user' ? (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                  <User size={16} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-blue-500 shadow-sm flex items-center justify-center">
                  <Sparkles size={16} className="fill-blue-500" />
                </div>
              )}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-primary-50 px-5 py-3.5 rounded-2xl rounded-tr-sm text-slate-800 shadow-sm border border-primary-100' : 'text-slate-800'}`}>
              
              {/* If it's a resume upload notification */}
              {msg.type === 'resume_upload' && (
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{msg.content.replace('Uploaded: ', '')}</p>
                    <p className="text-xs text-slate-500">PDF Document</p>
                  </div>
                </div>
              )}

              {/* Standard text content with markdown */}
              {(() => {
                if ((msg.type && msg.type !== 'text') && msg.role !== 'assistant') return null;
                if (!msg.content) return null;
                
                let displayContent = msg.content;
                let thinkContent = null;
                
                if (msg.role === 'assistant' && displayContent.includes('<think>')) {
                  const match = displayContent.match(/<think>([\s\S]*?)<\/think>/);
                  if (match) {
                    thinkContent = match[1].trim();
                    displayContent = displayContent.replace(/<think>[\s\S]*?<\/think>/, '').trim();
                  } else {
                    thinkContent = displayContent.split('<think>')[1]?.trim() || '';
                    displayContent = '';
                  }
                }

                return (
                  <div className="flex flex-col gap-3">
                    {thinkContent && (
                      <details className="group border border-slate-200 bg-slate-50/50 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors select-none">
                          <span className="text-xs transition-transform duration-200 group-open:rotate-90">▶</span>
                          <span className="flex items-center gap-2">
                            <Lightbulb size={16} className="text-amber-500" />
                            Thought Process
                          </span>
                        </summary>
                        <div className="px-4 pb-4 pt-1 text-[13px] text-slate-500 whitespace-pre-wrap border-t border-slate-100 bg-slate-50">
                          {thinkContent}
                        </div>
                      </details>
                    )}
                    
                    {displayContent && (
                      <div className="prose prose-sm max-w-none prose-slate">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({node, inline, className, children, ...props}: any) {
                              const match = /language-(\w+)/.exec(className || '')
                              return !inline && match ? (
                                <SyntaxHighlighter {...props} children={String(children).replace(/\n$/, '')} style={prism} language={match[1]} PreTag="div" />
                              ) : (
                                <code {...props} className={`${className} bg-slate-100 px-1.5 py-0.5 rounded text-primary-700`}>{children}</code>
                              )
                            }
                          }}
                        >
                          {displayContent}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Specific Mode Result Cards */}
              {msg.type === 'resume_analysis' && msg.data && <ResumeAnalysisCard data={msg.data} />}
              {msg.type === 'job_analysis' && msg.data && <JobAnalysisCard data={msg.data} />}
              
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-5 animate-pulse">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-blue-500 shadow-sm flex items-center justify-center">
                <Sparkles size={16} className="fill-blue-500" />
              </div>
            </div>
            <div className="flex flex-col gap-2 max-w-[85%]">
              <div className="flex items-center gap-2 text-slate-500 bg-slate-50/80 px-4 py-2.5 rounded-xl border border-slate-200">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm font-medium ml-1">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default MessageList;
