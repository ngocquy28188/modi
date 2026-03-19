import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Check, Star, ArrowLeft, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import { pb, Collections } from '@/lib/pocketbase';
import { ProductCategoryLabels, MaterialTypeLabels, ProductStatusLabels, formatPrice } from '@/types/furniture';
import type { Product } from '@/types/furniture';
import { useCart } from '@/hooks/useCart';

const MOCK_PRODUCT: Product = {
    id: 'p1', name: 'Giường Ngủ Module KARA', slug: 'giuong-ngu-kara', category: 'BEDROOM', material: 'MDF',
    dimensions: '2000 × 1600 × 350mm', price: 8500000, salePrice: 6990000, images: [],
    description: 'Giường ngủ module thiết kế tối giản Scandinavian, khung gỗ MDF chống ẩm cao cấp. Hệ thống tháo lắp thông minh cho phép lắp ráp chỉ trong 15 phút mà không cần thợ. Tích hợp 2 ngăn kéo lớn ở phần đầu giường để tối ưu không gian lưu trữ. Phù hợp mọi phong cách phòng ngủ hiện đại.',
    features: ['Tháo lắp 15 phút không cần thợ', 'Gỗ MDF chống ẩm E1', '2 ngăn kéo tích hợp', 'Chịu tải đến 300kg', 'Đầu giường bọc nỉ mềm', 'Kích thước đệm: 1m6 × 2m'],
    status: 'IN_STOCK', rating: 4.8, reviewCount: 124, colors: ['Trắng', 'Vân Sồi', 'Đen'], sku: 'MODI-BD-001', created: '', updated: '',
};

export default function ItemDetail() {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const record = await pb.collection(Collections.PRODUCTS).getOne(id!);
                setProduct(record as unknown as Product);
            } catch {
                setProduct({ ...MOCK_PRODUCT, id: id || 'p1' });
            }
        })();
    }, [id]);

    if (!product) return <div className="flex h-[80vh] items-center justify-center text-slate-400">Đang tải...</div>;

    function handleAddToCart() {
        addToCart(product!.id, quantity, selectedColor);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }

    const discountPercent = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
                <Link to="/" className="hover:text-gold-600 transition-colors">Trang chủ</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link to={`/category/${product.category}`} className="hover:text-gold-600 transition-colors">
                    {ProductCategoryLabels[product.category]}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-slate-700">{product.name}</span>
            </div>

            <div className="grid gap-10 lg:grid-cols-2">
                {/* Image */}
                <div>
                    {product.images && product.images.length > 0 ? (
                        <div className="aspect-square overflow-hidden rounded-2xl bg-slate-50">
                            <img src={pb.files.getURL(product as any, product.images[0])} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                    ) : (
                        <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-gold-50 to-gold-100 text-8xl">
                            {product.category === 'BEDROOM' ? '🛏️' : product.category === 'LIVING_ROOM' ? '🛋️' : '📦'}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <span className="mb-2 inline-block rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-600">
                        {ProductCategoryLabels[product.category]}
                    </span>

                    <h1 className="text-display text-3xl font-bold text-slate-900 lg:text-4xl">{product.name}</h1>

                    {/* Rating */}
                    <div className="mt-3 flex items-center gap-2">
                        <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{product.rating}</span>
                        <span className="text-sm text-slate-400">({product.reviewCount} đánh giá)</span>
                    </div>

                    {/* Price */}
                    <div className="mt-6 flex items-baseline gap-3">
                        <span className="text-display text-4xl font-bold text-gold-600">
                            {formatPrice(product.salePrice || product.price)}
                        </span>
                        {product.salePrice && (
                            <>
                                <span className="text-xl text-slate-300 line-through">{formatPrice(product.price)}</span>
                                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600">-{discountPercent}%</span>
                            </>
                        )}
                    </div>

                    {/* Status */}
                    <div className="mt-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${product.status === 'IN_STOCK' ? 'bg-emerald-50 text-emerald-600' : product.status === 'PRE_ORDER' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${product.status === 'IN_STOCK' ? 'bg-emerald-500' : product.status === 'PRE_ORDER' ? 'bg-amber-500' : 'bg-red-500'}`} />
                            {ProductStatusLabels[product.status]}
                        </span>
                    </div>

                    {/* Info chips */}
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="rounded-lg border border-slate-200 px-3 py-1.5">{MaterialTypeLabels[product.material]}</span>
                        <span className="rounded-lg border border-slate-200 px-3 py-1.5">{product.dimensions}</span>
                        <span className="rounded-lg border border-slate-200 px-3 py-1.5">SKU: {product.sku}</span>
                    </div>

                    {/* Colors */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="mt-6">
                            <label className="mb-2 block text-sm font-medium text-slate-700">Màu sắc</label>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`rounded-lg border px-4 py-2 text-sm transition-all ${selectedColor === color
                                            ? 'border-gold-400 bg-gold-50 text-gold-700 font-medium'
                                            : 'border-slate-200 text-slate-600 hover:border-gold-200'
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity + Add to cart */}
                    <div className="mt-6 flex items-center gap-4">
                        <div className="flex items-center rounded-xl border border-slate-200">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-slate-400 hover:text-slate-700 transition-colors">−</button>
                            <span className="w-10 text-center text-sm font-medium text-slate-900">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-slate-400 hover:text-slate-700 transition-colors">+</button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all ${added
                                ? 'bg-emerald-500 text-white scale-95'
                                : 'bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:shadow-lg hover:shadow-gold-500/20'
                                }`}
                        >
                            {added ? <><Check className="h-4 w-4" /> Đã thêm vào giỏ</> : <><ShoppingCart className="h-4 w-4" /> Thêm vào giỏ hàng</>}
                        </button>
                    </div>

                    {/* Trust signals */}
                    <div className="mt-6 grid grid-cols-3 gap-3">
                        {[
                            { icon: <Truck className="h-4 w-4" />, label: 'Miễn phí giao hàng' },
                            { icon: <Shield className="h-4 w-4" />, label: 'Bảo hành 5 năm' },
                            { icon: <RotateCcw className="h-4 w-4" />, label: 'Đổi trả 30 ngày' },
                        ].map((t, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 rounded-xl border border-slate-100 py-3 text-center">
                                <span className="text-gold-500">{t.icon}</span>
                                <span className="text-[10px] text-slate-500">{t.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Description + Features */}
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white p-8">
                    <h2 className="text-display text-xl font-bold text-slate-900 mb-4">Mô tả sản phẩm</h2>
                    <p className="text-sm leading-relaxed text-slate-600">{product.description}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-8">
                    <h2 className="text-display text-xl font-bold text-slate-900 mb-4">Đặc điểm nổi bật</h2>
                    <ul className="space-y-3">
                        {product.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Back link */}
            <div className="mt-8">
                <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-gold-600 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại trang chủ
                </Link>
            </div>
        </div>
    );
}
