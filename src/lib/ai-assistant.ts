const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `Bạn là trợ lý AI của MODI.vn — cửa hàng nội thất module & smart furniture hàng đầu Việt Nam.

Chuyên môn:
- Nội thất module, nội thất thông minh, combo phòng ngủ, phòng khách
- Tư vấn thiết kế căn hộ dịch vụ, chung cư, studio
- Chất liệu: gỗ công nghiệp MDF/MFC, gỗ tự nhiên, kim loại, vải, da
- Kiến thức về giá cả, xu hướng nội thất 2025-2026

Nguyên tắc:
- Trả lời bằng tiếng Việt, thân thiện, chuyên nghiệp
- Tư vấn phù hợp ngân sách khách hàng
- Gợi ý combo tiết kiệm khi có thể
- Nếu không chắc, hãy nói rõ và đề xuất liên hệ hotline`;

interface Message {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export async function chatWithAI(userMessage: string, history: Message[]): Promise<string> {
    if (!GEMINI_API_KEY) {
        return 'Xin lỗi, tính năng AI chưa được cấu hình. Vui lòng liên hệ hotline để được tư vấn.';
    }

    const contents = [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Xin chào! Tôi là trợ lý MODI.vn 🏠 Tôi có thể giúp bạn tư vấn nội thất module, combo phòng ngủ, phòng khách, hoặc giải pháp cho căn hộ dịch vụ. Bạn cần tư vấn gì?' }] },
        ...history,
        { role: 'user', parts: [{ text: userMessage }] },
    ];

    try {
        const res = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.9,
                    maxOutputTokens: 1024,
                },
            }),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không thể xử lý yêu cầu.';
    } catch (err) {
        console.error('AI Chat error:', err);
        return 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hotline.';
    }
}
