import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Crown, CheckCircle, Phone, MapPin, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/types/furniture';
import { pb, Collections } from '@/lib/pocketbase';

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
    const [step, setStep] = useState<'cart' | 'checkout' | 'done'>('cart');
    const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', notes: '', payment: 'COD' });
    const [placing, setPlacing] = useState(false);
    const [orderId, setOrderId] = useState('');

    const cartDetails = items.map(item => {
        const info = MOCK_PRICES[item.productId] || { name: `Sản phẩm #${item.productId}`, price: 0 };
        return { ...item, name: info.name, unitPrice: info.price, total: info.price * item.quantity };
    });

    const subtotal = cartDetails.reduce((sum, i) => sum + i.total, 0);
    const shippingFee = subtotal >= 10_000_000 ? 0 : 500000;
    const grandTotal = subtotal + shippingFee;

    async function placeOrder() {
        if (!form.name || !form.phone || !form.address) return;
        setPlacing(true);
        try {
            const record = await pb.collection(Collections.ORDERS).create({
                customerName: form.name,
                phone: form.phone,
                email: form.email,
                shippingAddress: form.address,
                notes: form.notes,
                paymentMethod: form.payment,
                totalAmount: grandTotal,
                shippingFee,
                status: 'PENDING',
                items: cartDetails.map(i => ({
                    productId: i.productId,
                    name: i.name,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice,
                    color: i.color,
                })),
            });
            setOrderId(record.id);
            clearCart();
            setStep('done');
        } catch (e: any) {
            alert('Lỗi đặt hàng: ' + e.message);
        }
        setPlacing(false);
    }

    /* ── Empty ── */
    if (items.length === 0 && step !== 'done') {
        return (
            <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-[#E8D9C4]" />
                <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-[#1a1612] mb-2">Giỏ hàng trống</h2>
                <p className="text-sm text-[#8a7a68] mb-6">Hãy khám phá các sản phẩm nội thất module tại MODI.vn</p>
                <Link to="/" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg,#C49B3D,#8B6D20)' }}>
                    <Crown className="h-4 w-4" /> Mua sắm ngay
                </Link>
            </div>
        );
    }

    /* ── Done ── */
    if (step === 'done') {
        return (
            <div className="mx-auto max-w-xl px-4 py-20 text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
                <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-[#1a1612] mb-2">Đặt hàng thành công!</h2>
                <p className="text-sm text-[#8a7a68] mb-2">Mã đơn hàng của bạn: <strong className="text-[#C49B3D]">{orderId.slice(0, 8).toUpperCase()}</strong></p>
                <p className="text-sm text-[#8a7a68] mb-8">
                    MODI sẽ liên hệ xác nhận đơn qua số <strong>{form.phone}</strong> trong vòng 30 phút.<br />
                    Cảm ơn bạn đã tin tưởng MODI! 🎉
                </p>
                <Link to="/" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg,#C49B3D,#8B6D20)' }}>
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            {/* Steps indicator */}
            <div className="mb-8 flex items-center justify-center gap-4">
                {[{ label: 'Giỏ hàng', key: 'cart' }, { label: 'Thanh toán', key: 'checkout' }].map((s, i) => (
                    <div key={s.key} className="flex items-center gap-2">
                        {i > 0 && <div className={`h-px w-12 ${step === 'checkout' ? 'bg-[#C49B3D]' : 'bg-[#E8D9C4]'}`} />}
                        <div className={`flex items-center gap-2 text-sm font-semibold ${step === s.key ? 'text-[#C49B3D]' : 'text-[#a09080]'}`}>
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${step === s.key ? 'text-white' : 'text-[#a09080] border border-[#E8D9C4]'}`}
                                style={step === s.key ? { background: 'linear-gradient(135deg,#C49B3D,#8B6D20)' } : {}}>
                                {i + 1}
                            </div>
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>

            {step === 'cart' ? (
                <>
                    <div className="mb-6 flex items-center justify-between">
                        <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-[#1a1612]">
                            Giỏ hàng ({items.length})
                        </h1>
                        <button onClick={clearCart} className="text-sm text-[#a09080] hover:text-red-500 transition-colors">Xóa tất cả</button>
                    </div>

                    <div className="space-y-3">
                        {cartDetails.map(item => (
                            <div key={item.productId} className="flex items-center gap-4 rounded-2xl border border-[#E8D9C4] bg-white p-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl text-3xl flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg,#f5ede2,#ede0cc)' }}>🛋️</div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-[#1a1612] truncate">{item.name}</h3>
                                    {item.color && <span className="text-xs text-[#a09080]">Màu: {item.color}</span>}
                                    <div className="mt-1 text-sm font-semibold text-[#C49B3D]">{formatPrice(item.unitPrice)}</div>
                                </div>
                                <div className="flex items-center gap-1 rounded-xl border border-[#E8D9C4]">
                                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 text-[#a09080] hover:text-[#1a1612]"><Minus className="h-3.5 w-3.5" /></button>
                                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 text-[#a09080] hover:text-[#1a1612]"><Plus className="h-3.5 w-3.5" /></button>
                                </div>
                                <div style={{ fontFamily: 'var(--font-display)' }} className="text-sm font-bold text-[#1a1612] w-24 text-right">{formatPrice(item.total)}</div>
                                <button onClick={() => removeFromCart(item.productId)} className="p-2 text-[#c4b09a] hover:text-red-500 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="mt-6 rounded-2xl border border-[#E8D9C4] bg-white p-6">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-[#6b5a44]"><span>Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
                            <div className="flex justify-between text-[#6b5a44]">
                                <span>Phí vận chuyển</span>
                                <span>{shippingFee === 0 ? <span className="text-emerald-600 font-semibold">Miễn phí</span> : formatPrice(shippingFee)}</span>
                            </div>
                            {shippingFee > 0 && <p className="text-[11px] text-[#a09080]">Miễn phí vận chuyển cho đơn từ 10 triệu</p>}
                            <div className="flex justify-between border-t border-[#f0e8dc] pt-3 text-lg font-bold text-[#1a1612]">
                                <span>Tổng cộng</span>
                                <span style={{ fontFamily: 'var(--font-display)', color: '#C49B3D' }}>{formatPrice(grandTotal)}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setStep('checkout')}
                            className="mt-5 w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg,#C49B3D,#8B6D20)' }}>
                            Tiến hành đặt hàng →
                        </button>
                    </div>

                    <Link to="/" className="mt-5 flex items-center gap-2 text-sm text-[#a09080] hover:text-[#C49B3D] transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Tiếp tục mua sắm
                    </Link>
                </>
            ) : (
                /* ── Checkout form ── */
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Form */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold text-[#1a1612]">Thông tin giao hàng</h2>

                        <div className="rounded-2xl border border-[#E8D9C4] bg-white p-5 space-y-4">
                            <div>
                                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">
                                    <User className="h-3 w-3" /> Họ tên *
                                </label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D]"
                                    placeholder="Nguyễn Văn A" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">
                                        <Phone className="h-3 w-3" /> Số điện thoại *
                                    </label>
                                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D]"
                                        placeholder="0912 345 678" />
                                </div>
                                <div>
                                    <label className="mb-1.5 text-xs font-semibold text-[#6b5a44] uppercase tracking-wider block">Email</label>
                                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D]"
                                        placeholder="email@domain.com" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">
                                    <MapPin className="h-3 w-3" /> Địa chỉ giao hàng *
                                </label>
                                <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={2}
                                    className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D] resize-none"
                                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành..." />
                            </div>
                            <div>
                                <label className="mb-1.5 text-xs font-semibold text-[#6b5a44] uppercase tracking-wider block">Ghi chú đơn hàng</label>
                                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                                    className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D] resize-none"
                                    placeholder="Ghi chú thêm nếu có (tầng, giờ giao, yêu cầu đặc biệt...)" />
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="rounded-2xl border border-[#E8D9C4] bg-white p-5">
                            <h3 className="mb-3 text-sm font-semibold text-[#1a1612]">Phương thức thanh toán</h3>
                            {[
                                { value: 'COD', label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
                                { value: 'BANK_TRANSFER', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
                            ].map(opt => (
                                <label key={opt.value} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 mb-2 transition-colors ${form.payment === opt.value ? 'border-[#C49B3D] bg-[#FDF6E8]' : 'border-[#E8D9C4]'}`}>
                                    <input type="radio" name="payment" value={opt.value} checked={form.payment === opt.value}
                                        onChange={e => setForm(f => ({ ...f, payment: e.target.value }))} className="accent-[#C49B3D]" />
                                    <span className="text-base">{opt.icon}</span>
                                    <span className="text-sm font-medium text-[#1a1612]">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Order summary sidebar */}
                    <div>
                        <div className="sticky top-4 rounded-2xl border border-[#E8D9C4] bg-white p-5 space-y-4">
                            <h3 className="font-semibold text-[#1a1612] text-sm">Tóm tắt đơn hàng</h3>
                            <div className="space-y-2">
                                {cartDetails.map(i => (
                                    <div key={i.productId} className="flex justify-between text-xs">
                                        <span className="text-[#6b5a44] truncate mr-2">{i.name} ×{i.quantity}</span>
                                        <span className="font-medium text-[#1a1612] flex-shrink-0">{formatPrice(i.total)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-[#f0e8dc] pt-3 space-y-2 text-sm">
                                <div className="flex justify-between text-[#6b5a44]"><span>Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
                                <div className="flex justify-between text-[#6b5a44]">
                                    <span>Vận chuyển</span>
                                    <span>{shippingFee === 0 ? <span className="text-emerald-600">Miễn phí</span> : formatPrice(shippingFee)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-[#1a1612] border-t border-[#f0e8dc] pt-2">
                                    <span>Tổng</span>
                                    <span style={{ fontFamily: 'var(--font-display)', color: '#C49B3D' }}>{formatPrice(grandTotal)}</span>
                                </div>
                            </div>
                            <button onClick={placeOrder} disabled={placing || !form.name || !form.phone || !form.address}
                                className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all disabled:opacity-50"
                                style={{ background: 'linear-gradient(135deg,#C49B3D,#8B6D20)' }}>
                                {placing ? 'Đang đặt...' : 'Xác nhận đặt hàng'}
                            </button>
                            <button onClick={() => setStep('cart')} className="w-full text-center text-sm text-[#a09080] hover:text-[#C49B3D]">
                                ← Quay lại giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
