import { Star } from 'lucide-react';

const MOCK = [
    { id: '1', user: 'Nguyễn Minh Anh', product: 'Combo SAKURA', rating: 5, comment: 'Chất lượng tuyệt vời, lắp ráp rất dễ. Rất hài lòng!', date: '2026-03-18' },
    { id: '2', user: 'Trần Văn Bình', product: 'Sofa LUNA', rating: 4, comment: 'Sofa đẹp, đệm êm. Giao hàng nhanh, đóng gói cẩn thận.', date: '2026-03-16' },
    { id: '3', user: 'Lê Thị Cẩm', product: 'Giường KARA', rating: 5, comment: 'Combo tiết kiệm hơn mua lẻ nhiều. Sẽ giới thiệu bạn bè.', date: '2026-03-15' },
];

export default function AdminReviews() {
    return (
        <div>
            <h1 className="text-display text-2xl font-bold text-slate-900 mb-6">Đánh giá</h1>
            <div className="space-y-4">
                {MOCK.map(r => (
                    <div key={r.id} className="rounded-2xl border border-slate-100 bg-white p-5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-100 text-xs font-bold text-gold-700">{r.user.charAt(0)}</div>
                                <div>
                                    <div className="text-sm font-medium text-slate-900">{r.user}</div>
                                    <div className="text-xs text-slate-400">{r.product} · {new Date(r.date).toLocaleDateString('vi-VN')}</div>
                                </div>
                            </div>
                            <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}</div>
                        </div>
                        <p className="text-sm text-slate-600">{r.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
