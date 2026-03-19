import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { chatWithAI } from '@/lib/ai-assistant';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export default function AiChat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function handleSend() {
        if (!input.trim() || loading) return;
        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        const history = messages.map(m => ({
            role: m.role as 'user' | 'model',
            parts: [{ text: m.text }],
        }));

        const response = await chatWithAI(userMsg, history);
        setMessages(prev => [...prev, { role: 'model', text: response }]);
        setLoading(false);
    }

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
                title="Tư vấn AI"
            >
                {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </button>

            {/* Chat panel */}
            {open && (
                <div className="fixed bottom-24 right-6 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-gold-200 bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center gap-3 bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-3.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                            <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-white">Tư vấn MODI</div>
                            <div className="text-xs text-gold-100">AI hỗ trợ 24/7</div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                        {messages.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-3xl mb-2">🏠</div>
                                <p className="text-sm text-slate-500">Xin chào! Bạn cần tư vấn nội thất gì?</p>
                                <div className="mt-3 flex flex-wrap justify-center gap-2">
                                    {['Combo phòng ngủ', 'Căn hộ dịch vụ', 'Smart furniture'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => { setInput(s); }}
                                            className="rounded-full border border-gold-200 px-3 py-1 text-xs text-gold-700 hover:bg-gold-50 transition-colors"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-gold-500 text-white rounded-br-md'
                                    : 'bg-slate-100 text-slate-700 rounded-bl-md'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-slate-100 px-3 py-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Hỏi về nội thất..."
                                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 text-white transition-all hover:bg-gold-600 disabled:opacity-40"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
