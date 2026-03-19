const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
console.log('[AI] key prefix:', GEMINI_API_KEY ? GEMINI_API_KEY.slice(0, 10) + '...' : 'MISSING');
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `Bạn là Mia — nhân viên tư vấn nội thất của MODI.vn, một bạn trẻ am hiểu nội thất và hay nhiệt tình giúp khách.

Phong cách nói chuyện:
- Thân thiện, tự nhiên như bạn bè — đừng dùng từ "Tuyệt vời!", "Chắc chắn rồi!", "Rất vui được..." hay những câu đầy cảm thán khách sáo
- Nói ngắn gọn, đi thẳng vào vấn đề, không lòng vòng
- Dùng "mình / bạn", thi thoảng dùng emoji nhưng đừng lạm dụng
- Khi không biết thì nói thẳng, gợi ý liên hệ hotline 0817.42.42.42

Chuyên môn:
- Nội thất module tháo lắp (giường, tủ, kệ, sofa, bàn làm việc)
- Combo phòng ngủ, phòng khách, căn hộ dịch vụ
- Chất liệu gỗ MDF/MFC, vải, da, kim loại
- Ngân sách & combo tiết kiệm

QUAN TRỌNG — Format trả lời:
- Luôn trả về HTML hợp lệ (không dùng markdown)
- Dùng thẻ <p> cho đoạn văn, <ul>/<li> cho danh sách, <strong> để nhấn mạnh
- Ví dụ: <p>Phòng 12m² thì mình gợi ý...</p><ul><li><strong>Giường KARA</strong>: 6.99 triệu</li></ul>
- Không wrap trong <html>, <body> hay <div> ngoài cùng — chỉ content thôi`;

interface Message {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export async function chatWithAI(userMessage: string, history: Message[]): Promise<string> {
    if (!GEMINI_API_KEY) {
        return '<p>API chưa cấu hình. Bạn gọi hotline <strong>0817.42.42.42</strong> để mình tư vấn trực tiếp nha 😊</p>';
    }

    const contents = [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: '<p>Mình là Mia, nhân viên tư vấn của MODI 👋 Bạn đang tìm nội thất cho không gian nào — phòng ngủ, phòng khách, hay cả căn hộ?</p>' }] },
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
                    temperature: 0.75,
                    topP: 0.9,
                    maxOutputTokens: 1024,
                },
            }),
        });

        if (!res.ok) {
            const errBody = await res.text();
            console.error('[AI] HTTP', res.status, errBody);
            throw new Error(`API error: ${res.status}`);
        }
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '<p>Không xử lý được, thử lại nha bạn.</p>';
    } catch (err) {
        console.error('[AI] Chat error:', err);
        return '<p>Lỗi kết nối rồi 😅 Bạn thử lại sau hoặc nhắn Zalo <strong>0817.42.42.42</strong> để mình hỗ trợ nha.</p>';
    }
}
