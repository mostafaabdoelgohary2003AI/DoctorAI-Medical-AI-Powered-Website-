import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { analyzeChatbot } from '../store/slices/diagnosticsSlice';
import { Send, Bot, User, Loader } from 'lucide-react';

const ChatbotAssistant: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { language } = useSelector((state: RootState) => state.ui);
  const { isAnalyzing, currentResult, error } = useSelector((state: RootState) => state.diagnostics);
  const [messages, setMessages] = useState<Array<{
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
  }>>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentResult && currentResult.diagnosisType === 'chat') {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          content: currentResult.result.condition,
          timestamp: new Date(currentResult.timestamp),
        },
      ]);
    }
  }, [currentResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      type: 'user' as const,
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    dispatch(analyzeChatbot(userMessage.content));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="bg-white dark:bg-neutral-800 p-4 border-b border-neutral-200 dark:border-neutral-700">
        <h1 className="text-2xl font-bold">
          {language === 'en' ? 'Medical Chat Assistant' : 'مساعد الدردشة الطبي'}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          {language === 'en'
            ? 'Ask about your health concerns or palm plant issues.'
            : 'اسأل عن مخاوفك الصحية أو مشاكل نبات النخيل.'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.type === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
              ${message.type === 'user'
                ? 'bg-primary-100 dark:bg-primary-900/30'
                : 'bg-secondary-100 dark:bg-secondary-900/30'}`}
            >
              {message.type === 'user'
                ? <User className="w-5 h-5 text-primary-500" />
                : <Bot className="w-5 h-5 text-secondary-500" />}
            </div>

            <div className={`max-w-[80%] rounded-lg p-3 
              ${message.type === 'user'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100'}`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {isAnalyzing && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-secondary-500" />
            </div>
            <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-3">
              <Loader className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-secondary-500" />
            </div>
            <div className="bg-error-50 dark:bg-error-900/20 rounded-lg p-3 text-error-600 dark:text-error-300">
              {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'en'
              ? 'Type your message...'
              : 'اكتب رسالتك...'}
            className="flex-1 form-input"
            disabled={isAnalyzing}
            aria-label={language === 'en' ? 'Chat input' : 'إدخال الدردشة'}
          />
          <button
            type="submit"
            disabled={isAnalyzing || !input.trim()}
            className="btn btn-primary"
            aria-label={language === 'en' ? 'Send message' : 'إرسال الرسالة'}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotAssistant;