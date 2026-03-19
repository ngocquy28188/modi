import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { chatWithAI } from '@/lib/ai-assistant';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const QUICK_PROMPTS = [
    'Combo phòng ngủ dưới 20 triệu',
    'Nội thất căn hộ studio',
    'Bàn làm việc thông minh',
    'Sofa cho phòng khách 15m²',
];

export default function AiChat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function handleSend(text?: string) {
        const userMsg = (text ?? input).trim();
        if (!userMsg || loading) return;
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
            {/* FAB button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#C49B3D,#8B6D20)' }}
                title="Tư vấn với Mia"
            >
                {open
                    ? <X className="h-6 w-6 text-white" />
                    : <MessageCircle className="h-6 w-6 text-white" />
                }
            </button>

            {/* Chat panel */}
            {open && (
                <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-[#e8d9c4] bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3.5" style={{ background: 'linear-gradient(135deg,#C49B3D,#8B6D20)' }}>
                        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                            <span className="text-lg">👩</span>
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#8B6D20] bg-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-white">Mia — Tư vấn MODI</div>
                            <div className="text-xs text-yellow-100 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
                                Đang online
                            </div>
                        </div>
                        <Sparkles className="h-4 w-4 text-yellow-200 opacity-70" />
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                        {/* Welcome state */}
                        {messages.length === 0 && (
                            <div className="py-4">
                                {/* Mia's greeting bubble */}
                                <div className="flex justify-start mb-3">
                                    <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[#f5f0e8] px-4 py-3 text-sm leading-relaxed text-[#3a2e20]">
                                        Mình là Mia 👋 Bạn đang tìm nội thất cho không gian nào vậy?
                                    </div>
                                </div>
                                {/* Quick prompts */}
                                <div className="flex flex-col gap-1.5 mt-2">
                                    {QUICK_PROMPTS.map(q => (
                                        <button
                                            key={q}
                                            onClick={() => handleSend(q)}
                                            className="text-left rounded-xl border border-[#e8d9c4] bg-white px-3 py-2 text-xs text-[#6b5a44] hover:bg-[#fdf6e8] hover:border-[#C49B3D] transition-colors"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Message list */}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'user' ? (
                                    <div className="max-w-[80%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed text-white"
                                        style={{ background: 'linear-gradient(135deg,#C49B3D,#8B6D20)' }}>
                                        {msg.text}
                                    </div>
                                ) : (
                                    /* AI response rendered as HTML */
                                    <div
                                        className="ai-bubble max-w-[85%] rounded-2xl rounded-bl-sm bg-[#f5f0e8] px-4 py-3 text-sm leading-relaxed text-[#3a2e20]"
                                        dangerouslySetInnerHTML={{ __html: msg.text }}
                                    />
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl rounded-bl-sm bg-[#f5f0e8] px-4 py-3">
                                    <div className="flex gap-1 items-center">
                                        <span className="text-xs text-[#a09080] mr-1">Mia đang nhập</span>
                                        {[0, 150, 300].map(d => (
                                            <span key={d} className="h-1.5 w-1.5 rounded-full bg-[#C49B3D] animate-bounce" style={{ animationDelay: `${d}ms` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-[#f0e8dc] px-3 py-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Nhắn gì đó với Mia..."
                                className="flex-1 rounded-xl border border-[#e8d9c4] bg-[#fafaf7] px-4 py-2.5 text-sm outline-none transition-all focus:border-[#C49B3D] focus:ring-2 focus:ring-[#C49B3D]/15"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={loading || !input.trim()}
                                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white transition-all disabled:opacity-40"
                                style={{ background: 'linear-gradient(135deg,#C49B3D,#8B6D20)' }}
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Global AI bubble styles */}
            <style>{`
                .ai-bubble p { margin-bottom: 0.5em; }
                .ai-bubble p:last-child { margin-bottom: 0; }
                .ai-bubble ul { list-style: disc; padding-left: 1.2em; margin: 0.4em 0; }
                .ai-bubble ol { list-style: decimal; padding-left: 1.2em; margin: 0.4em 0; }
                .ai-bubble li { margin-bottom: 0.25em; }
                .ai-bubble strong { font-weight: 600; color: #8B6D20; }
                .ai-bubble a { color: #C49B3D; text-decoration: underline; }
            `}</style>
        </>
    );
}
