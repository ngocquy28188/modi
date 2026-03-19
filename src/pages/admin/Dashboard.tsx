import { Crown, Package, ShoppingCart, Users, Star, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/types/furniture';

export default function AdminDashboard() {
    const stats = [
        { label: 'Doanh thu tháng', value: formatPrice(185000000), icon: <TrendingUp className="h-5 w-5" />, color: 'from-gold-400 to-gold-600' },
        { label: 'Đơn hàng', value: '47', icon: <ShoppingCart className="h-5 w-5" />, color: 'from-blue-400 to-blue-600' },
        { label: 'Sản phẩm', value: '128', icon: <Package className="h-5 w-5" />, color: 'from-emerald-400 to-emerald-600' },
        { label: 'Khách hàng', value: '1,240', icon: <Users className="h-5 w-5" />, color: 'from-purple-400 to-purple-600' },
    ];

    return (
        <div>
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600">
                    <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-display text-2xl font-bold text-slate-900">MODI Admin</h1>
                    <p className="text-sm text-slate-500">Quản lý cửa hàng nội thất module</p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s, i) => (
                    <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5">
                        <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white`}>
                            {s.icon}
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                        <div className="text-xs text-slate-500">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white p-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Đơn hàng gần đây</h3>
                    <div className="space-y-3 text-sm text-slate-500">
                        <div className="flex justify-between"><span>ORD-047 · Combo SAKURA</span><span className="text-gold-600 font-medium">24.9tr</span></div>
                        <div className="flex justify-between"><span>ORD-046 · Sofa LUNA</span><span className="text-gold-600 font-medium">14.9tr</span></div>
                        <div className="flex justify-between"><span>ORD-045 · Giường KARA × 2</span><span className="text-gold-600 font-medium">13.98tr</span></div>
                    </div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Đánh giá mới</h3>
                    <div className="space-y-3 text-sm text-slate-500">
                        <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><span>5.0 — "Chất lượng tuyệt vời, lắp ráp dễ"</span></div>
                        <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><span>4.5 — "Giao hàng nhanh, đóng gói cẩn thận"</span></div>
                        <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><span>5.0 — "Combo tiết kiệm hơn mua lẻ nhiều"</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
