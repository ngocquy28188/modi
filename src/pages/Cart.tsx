import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Crown } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/types/furniture';

const MOCK_PRICES: Record<string, { name: string; price: number }> = {
    p1: { name: 'Giường Ngủ Module KARA', price: 6990000 },
    p2: { name: 'Tủ Quần Áo MIKA 3 Cánh', price: 9990000 },
    p3: { name: 'Sofa Module LUNA L-Shape', price: 14900000 },
    p4: { name: 'Kệ TV Module ZENITH', price: 5900000 },
    p5: { name: 'Combo Phòng Ngủ SAKURA', price: 24900000 },
    p6: { name: 'Bàn Làm Việc Thông Minh FLEXI', price: 5990000 },
    p7: { name: 'Combo Căn Hộ Studio URBAN', price: 49900000 },
    p8: { name: 'Giá Sách Module HEXA', price: 890000 },
};

export default function Cart() {
    const { items, updateQuantity, removeFromCart, clearCart } = useCart();

    const cartDetails = items.map(item => {
        const info = MOCK_PRICES[item.productId] || { name: `Sản phẩm #${item.productId}`, price: 0 };
        return { ...item, name: info.name, unitPrice: info.price, total: info.price * item.quantity };
    });

    const subtotal = cartDetails.reduce((sum, i) => sum + i.total, 0);
    const shippingFee = subtotal >= 10_000_000 ? 0 : 500000;
    const grandTotal = subtotal + shippingFee;

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-slate-200" />
                <h2 className="text-display text-2xl font-bold text-slate-900 mb-2">Giỏ hàng trống</h2>
                <p className="text-sm text-slate-500 mb-6">Hãy khám phá các sản phẩm nội thất module tại MODI.vn</p>
                <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm font-semibold text-white hover:bg-gold-600 transition-all">
                    <Crown className="h-4 w-4" /> Mua sắm ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-display text-2xl font-bold text-slate-900">Giỏ hàng ({items.length})</h1>
                <button onClick={clearCart} className="text-sm text-slate-400 hover:text-red-500 transition-colors">Xóa tất cả</button>
            </div>

            <div className="space-y-4">
                {cartDetails.map(item => (
                    <div key={item.productId} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gold-50 text-3xl flex-shrink-0">🛋️</div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 truncate">{item.name}</h3>
                            {item.color && <span className="text-xs text-slate-400">Màu: {item.color}</span>}
                            <div className="mt-1 text-sm font-medium text-gold-600">{formatPrice(item.unitPrice)}</div>
                        </div>
                        <div className="flex items-center gap-1 rounded-lg border border-slate-200">
                            <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 text-slate-400 hover:text-slate-700"><Minus className="h-3.5 w-3.5" /></button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 text-slate-400 hover:text-slate-700"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-slate-900">{formatPrice(item.total)}</div>
                        </div>
                        <button onClick={() => removeFromCart(item.productId)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-6">
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-slate-600"><span>Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
                    <div className="flex justify-between text-slate-600">
                        <span>Phí vận chuyển</span>
                        <span>{shippingFee === 0 ? <span className="text-emerald-600 font-medium">Miễn phí</span> : formatPrice(shippingFee)}</span>
                    </div>
                    {shippingFee > 0 && <p className="text-[11px] text-slate-400">Miễn phí vận chuyển cho đơn từ 10 triệu</p>}
                    <div className="flex justify-between border-t border-gold-200 pt-3 text-lg font-bold text-slate-900">
                        <span>Tổng cộng</span><span className="text-gold-600">{formatPrice(grandTotal)}</span>
                    </div>
                </div>
                <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 py-4 text-sm font-bold text-white shadow-lg shadow-gold-500/20 transition-all hover:shadow-xl">
                    Đặt hàng
                </button>
            </div>

            <Link to="/" className="mt-6 flex items-center gap-2 text-sm text-slate-400 hover:text-gold-600 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Tiếp tục mua sắm
            </Link>
        </div>
    );
}
