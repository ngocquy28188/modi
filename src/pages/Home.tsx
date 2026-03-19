import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ChevronDown, Star, ShoppingCart, Check, Crown, Truck, Shield, Headphones, Bed, Sofa, Building2, Lightbulb, Package } from 'lucide-react';
import { pb, Collections } from '@/lib/pocketbase';
import { ProductCategoryLabels, ProductStatusLabels, MaterialTypeLabels, formatPrice } from '@/types/furniture';
import type { ProductCategory, Product } from '@/types/furniture';
import { useCart } from '@/hooks/useCart';

/* ──── Mock data for demo ──── */
const MOCK_PRODUCTS: Product[] = [
    {
        id: 'p1', name: 'Giường Ngủ Module KARA', slug: 'giuong-ngu-kara', category: 'BEDROOM', material: 'MDF',
        dimensions: '2000 × 1600 × 350mm', price: 8500000, salePrice: 6990000, images: [],
        description: 'Giường ngủ module thiết kế tối giản, tháo lắp dễ dàng. Gỗ MDF chống ẩm, phù hợp mọi không gian.', features: ['Tháo lắp 15 phút', 'Gỗ MDF chống ẩm', 'Ngăn kéo tích hợp'], status: 'IN_STOCK', rating: 4.8, reviewCount: 124, colors: ['Trắng', 'Vân Sồi', 'Đen'], sku: 'MODI-BD-001', created: '', updated: '',
    },
    {
        id: 'p2', name: 'Tủ Quần Áo MIKA 3 Cánh', slug: 'tu-quan-ao-mika', category: 'BEDROOM', material: 'MFC',
        dimensions: '1800 × 600 × 2000mm', price: 12900000, salePrice: 9990000, images: [],
        description: 'Tủ quần áo 3 cánh module, thiết kế nhiều ngăn thông minh, lắp ráp nhanh không cần thợ.', features: ['3 cánh mở', '6 ngăn + 2 thanh treo', 'Module mở rộng'], status: 'IN_STOCK', rating: 4.7, reviewCount: 89, colors: ['Trắng', 'Vân Sồi'], sku: 'MODI-WD-001', created: '', updated: '',
    },
    {
        id: 'p3', name: 'Sofa Module LUNA L-Shape', slug: 'sofa-luna-l', category: 'LIVING_ROOM', material: 'FABRIC',
        dimensions: '2600 × 1700 × 850mm', price: 18500000, salePrice: 14900000, images: [],
        description: 'Sofa góc L module, đệm bọc vải cao cấp, khung gỗ chắc chắn. Có thể tách rời thành 2 ghế đơn.', features: ['Tách rời linh hoạt', 'Vải chống bám bẩn', 'Đệm mút D40'], status: 'IN_STOCK', rating: 4.9, reviewCount: 67, colors: ['Xám Đậm', 'Be', 'Xanh Navy'], sku: 'MODI-SF-001', created: '', updated: '',
    },
    {
        id: 'p4', name: 'Kệ TV Module ZENITH', slug: 'ke-tv-zenith', category: 'LIVING_ROOM', material: 'MDF',
        dimensions: '1600 × 400 × 500mm', price: 5900000, images: [],
        description: 'Kệ TV treo tường module, thiết kế Scandinavian hiện đại, đi cáp gọn gàng.', features: ['Treo tường/đặt sàn', 'Giấu dây điện', 'Chịu tải 80kg'], status: 'IN_STOCK', rating: 4.6, reviewCount: 45, colors: ['Trắng-Sồi', 'Đen-Walnut'], sku: 'MODI-TV-001', created: '', updated: '',
    },
    {
        id: 'p5', name: 'Combo Phòng Ngủ SAKURA', slug: 'combo-phong-ngu-sakura', category: 'COMBO', material: 'MDF',
        dimensions: 'Giường + Tủ + Bàn + Tab', price: 35000000, salePrice: 24900000, images: [],
        description: 'Combo 4 món cho phòng ngủ hoàn chỉnh: Giường 1m6, Tủ 3 cánh, Bàn trang điểm, 2 Tab đầu giường. Tiết kiệm 30%.', features: ['4 món đồng bộ', 'Tiết kiệm 30%', 'Tặng lắp đặt'], status: 'IN_STOCK', rating: 4.9, reviewCount: 203, colors: ['Trắng', 'Vân Sồi'], sku: 'MODI-CB-001', created: '', updated: '',
    },
    {
        id: 'p6', name: 'Bàn Làm Việc Thông Minh FLEXI', slug: 'ban-flexi', category: 'SMART', material: 'MIXED',
        dimensions: '1200 × 600 × 750mm', price: 7900000, salePrice: 5990000, images: [],
        description: 'Bàn làm việc thông minh FLEXI, điều chỉnh chiều cao điện, mặt bàn chống trầy, tích hợp sạc không dây.', features: ['Nâng hạ điện', 'Sạc không dây', 'Nhớ 3 vị trí'], status: 'PRE_ORDER', rating: 4.8, reviewCount: 52, colors: ['Trắng', 'Đen'], sku: 'MODI-DK-001', created: '', updated: '',
    },
    {
        id: 'p7', name: 'Combo Căn Hộ Studio URBAN', slug: 'combo-studio-urban', category: 'APARTMENT', material: 'MFC',
        dimensions: 'Full nội thất 25-35m²', price: 65000000, salePrice: 49900000, images: [],
        description: 'Gói nội thất trọn bộ cho căn hộ studio 25-35m²: Giường, tủ, bàn ăn, kệ bếp, kệ TV, sofa nhỏ. Thiết kế tối ưu diện tích.', features: ['Trọn bộ 8 món', 'Tối ưu 25-35m²', 'Tặng thiết kế 3D'], status: 'IN_STOCK', rating: 4.7, reviewCount: 31, colors: ['Tone Trắng-Sồi', 'Tone Xám-Walnut'], sku: 'MODI-APT-001', created: '', updated: '',
    },
    {
        id: 'p8', name: 'Giá Sách Module HEXA', slug: 'gia-sach-hexa', category: 'SMART', material: 'MDF',
        dimensions: '400 × 350 × 400mm (mỗi ô)', price: 890000, images: [],
        description: 'Giá sách dạng ô lục giác module, ghép tùy ý theo tường. Gỗ MDF phủ Melamine, chịu tải 15kg/ô.', features: ['Ghép tùy ý', 'Nhiều màu', 'Nam châm kết nối'], status: 'IN_STOCK', rating: 4.5, reviewCount: 178, colors: ['Trắng', 'Hồng', 'Xanh Mint', 'Vân Gỗ'], sku: 'MODI-SH-001', created: '', updated: '',
    },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    BEDROOM: <Bed className="h-6 w-6" />,
    LIVING_ROOM: <Sofa className="h-6 w-6" />,
    APARTMENT: <Building2 className="h-6 w-6" />,
    SMART: <Lightbulb className="h-6 w-6" />,
    COMBO: <Package className="h-6 w-6" />,
};

export default function Home() {
    const { addToCart } = useCart();
    const [addedId, setAddedId] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

    function handleAddToCart(e: React.MouseEvent, productId: string) {
        e.preventDefault();
        e.stopPropagation();
        addToCart(productId, 1);
        setAddedId(productId);
        setTimeout(() => setAddedId(null), 1500);
    }

    // Try to load from PocketBase, fallback to mock
    useEffect(() => {
        (async () => {
            try {
                const res = await pb.collection(Collections.PRODUCTS).getList(1, 50, { sort: '-created' });
                if (res.items.length > 0) {
                    setProducts(res.items as unknown as Product[]);
                }
            } catch {
                // Keep mock data
            }
        })();
    }, []);

    const { cat } = useParams<{ cat: string }>();
    const categoryFilter = cat as ProductCategory | undefined;
    const displayProducts = categoryFilter ? products.filter(p => p.category === categoryFilter) : products;

    return (
        <div className="min-h-screen">

            {/* ═══ HERO ═══ */}
            <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 bg-[#FFFDF5]">
                {/* Decorative elements */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(var(--color-gold-400) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold-400) 1px, transparent 1px)`,
                        backgroundSize: '80px 80px',
                    }}
                />
                <div className="absolute left-0 top-16 h-full w-px bg-gradient-to-b from-gold-400/40 via-gold-400/10 to-transparent" />
                <div className="absolute right-0 top-16 h-full w-px bg-gradient-to-b from-gold-400/40 via-gold-400/10 to-transparent" />

                {/* Hero content */}
                <div className="relative z-10 mx-auto max-w-4xl text-center">
                    {/* Label */}
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-4 py-2 text-xs font-medium tracking-wide text-gold-700">
                        <Crown className="h-3.5 w-3.5" />
                        NỘI THẤT MODULE & SMART FURNITURE
                    </div>

                    {/* Headline */}
                    <h1 className="text-display text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                        Thiết kế thông minh
                        <br />
                        <span className="bg-gradient-to-r from-gold-500 to-gold-700 bg-clip-text text-transparent">Giá vừa tầm</span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
                        Nội thất module tháo lắp linh hoạt — Combo phòng ngủ từ{' '}
                        <span className="font-semibold text-gold-600">15 triệu</span>, căn hộ dịch vụ từ{' '}
                        <span className="font-semibold text-gold-600">49 triệu</span>. Giao lắp toàn quốc.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <Link
                            to="/category/COMBO"
                            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-gold-500/20 transition-all hover:shadow-xl hover:shadow-gold-500/30 hover:scale-[1.02]"
                        >
                            Xem Combo Tiết Kiệm
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <a
                            href="https://zalo.me/0123456789"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-700 transition-all hover:border-gold-300 hover:bg-gold-50"
                        >
                            <Headphones className="h-4 w-4 text-gold-500" />
                            Tư vấn miễn phí
                        </a>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 flex flex-col items-center gap-1 text-slate-400">
                    <span className="text-xs tracking-wider">KHÁM PHÁ</span>
                    <ChevronDown className="h-4 w-4 animate-bounce" />
                </div>
            </section>

            {/* ═══ TRUST BAR ═══ */}
            <section className="border-y border-gold-100 bg-white">
                <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
                    {[
                        { label: 'Sản phẩm', value: products.length + '+', icon: '🛋️' },
                        { label: 'Combo tiết kiệm', value: '30%', icon: '💰' },
                        { label: 'Bảo hành', value: '5 năm', icon: '🛡️' },
                        { label: 'Giao hàng', value: 'Toàn quốc', icon: '🚚' },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-3 px-4 py-5 sm:px-6 ${i < 3 ? 'border-r border-gold-100' : ''}`}
                        >
                            <span className="text-2xl">{stat.icon}</span>
                            <div>
                                <div className="text-display text-lg font-bold text-slate-900">{stat.value}</div>
                                <div className="text-xs text-slate-500">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ CATEGORY GRID ═══ */}
            <section className="border-b border-gold-100 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-16">
                    <h2 className="text-display mb-2 text-center text-3xl font-bold text-slate-900">Danh mục sản phẩm</h2>
                    <p className="mb-10 text-center text-sm text-slate-500">Nội thất module cho mọi không gian sống</p>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {(['BEDROOM', 'LIVING_ROOM', 'APARTMENT', 'SMART'] as ProductCategory[]).map((cat) => (
                            <Link
                                key={cat}
                                to={`/category/${cat}`}
                                className="group relative overflow-hidden rounded-2xl border border-gold-100 bg-gradient-to-br from-white to-gold-50/50 p-6 transition-all hover:shadow-lg hover:shadow-gold-500/10 hover:border-gold-300 hover:-translate-y-1"
                            >
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold-100 text-gold-600 transition-all group-hover:bg-gold-500 group-hover:text-white">
                                    {CATEGORY_ICONS[cat]}
                                </div>
                                <h3 className="text-display text-lg font-semibold text-slate-900">{ProductCategoryLabels[cat]}</h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    {cat === 'BEDROOM' && 'Giường, tủ, bàn trang điểm...'}
                                    {cat === 'LIVING_ROOM' && 'Sofa, kệ TV, bàn trà...'}
                                    {cat === 'APARTMENT' && 'Trọn bộ nội thất căn hộ'}
                                    {cat === 'SMART' && 'Bàn nâng hạ, kệ module...'}
                                </p>
                                <ArrowRight className="absolute bottom-4 right-4 h-5 w-5 text-gold-300 transition-all group-hover:text-gold-500 group-hover:translate-x-1" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FEATURES ═══ */}
            <section className="border-b border-gold-100 bg-[#FFFDF5]">
                <div className="mx-auto max-w-6xl px-4 py-16">
                    <div className="grid gap-8 sm:grid-cols-3">
                        {[
                            { icon: <Package className="h-6 w-6" />, title: 'Module tháo lắp', desc: 'Lắp ráp trong 15 phút, không cần thợ. Di chuyển, mở rộng dễ dàng.' },
                            { icon: <Truck className="h-6 w-6" />, title: 'Giao lắp toàn quốc', desc: 'Miễn phí giao hàng nội thành. Lắp đặt tận nơi bởi đội ngũ chuyên nghiệp.' },
                            { icon: <Shield className="h-6 w-6" />, title: 'Bảo hành 5 năm', desc: 'Cam kết chất lượng. Đổi trả 30 ngày, bảo hành kết cấu lên đến 5 năm.' },
                        ].map((f, i) => (
                            <div key={i} className="rounded-2xl border border-gold-100 bg-white p-8 transition-all hover:shadow-md hover:shadow-gold-500/5">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-100 to-gold-200 text-gold-700">
                                    {f.icon}
                                </div>
                                <h3 className="text-display mb-2 text-lg font-semibold text-slate-900">{f.title}</h3>
                                <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ PRODUCT GRID ═══ */}
            <section id="products" className="border-b border-gold-100 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-16">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h2 className="text-display text-2xl font-bold text-slate-900 sm:text-3xl">
                                {categoryFilter ? ProductCategoryLabels[categoryFilter] : 'Sản phẩm nổi bật'}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {categoryFilter ? `${displayProducts.length} sản phẩm` : 'Được yêu thích nhất tại MODI'}
                            </p>
                        </div>
                        {categoryFilter && (
                            <Link to="/" className="text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors">
                                Xem tất cả →
                            </Link>
                        )}
                    </div>

                    {displayProducts.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {displayProducts.map((product) => (
                                <Link
                                    to={`/product/${product.id}`}
                                    key={product.id}
                                    className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all hover:shadow-lg hover:shadow-gold-500/10 hover:border-gold-200 hover:-translate-y-1"
                                >
                                    {/* Image */}
                                    {product.images && product.images.length > 0 ? (
                                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                                            <img
                                                src={pb.files.getURL(product as any, product.images[0], { thumb: '400x300' })}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-gold-50 to-gold-100 text-4xl">
                                            {product.category === 'BEDROOM' ? '🛏️' : product.category === 'LIVING_ROOM' ? '🛋️' : product.category === 'APARTMENT' ? '🏢' : product.category === 'SMART' ? '💡' : '📦'}
                                        </div>
                                    )}

                                    {/* Sale badge */}
                                    {product.salePrice && (
                                        <div className="absolute top-3 left-3">
                                            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                                                -{Math.round((1 - product.salePrice / product.price) * 100)}%
                                            </span>
                                        </div>
                                    )}

                                    {/* Status badge */}
                                    {product.status !== 'IN_STOCK' && (
                                        <div className="absolute top-3 right-3">
                                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm ${product.status === 'PRE_ORDER' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                                                {ProductStatusLabels[product.status]}
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-4">
                                        {/* Category tag */}
                                        <span className="mb-2 inline-block rounded-full bg-gold-50 px-2 py-0.5 text-[10px] font-medium text-gold-600">
                                            {ProductCategoryLabels[product.category]}
                                        </span>

                                        {/* Name */}
                                        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-gold-700 transition-colors">
                                            {product.name}
                                        </h3>

                                        {/* Material & Dimensions */}
                                        <div className="mt-1.5 text-xs text-slate-400">
                                            {MaterialTypeLabels[product.material]} · {product.dimensions}
                                        </div>

                                        {/* Rating */}
                                        <div className="mt-2 flex items-center gap-1">
                                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                            <span className="text-xs font-medium text-slate-700">{product.rating}</span>
                                            <span className="text-xs text-slate-400">({product.reviewCount})</span>
                                        </div>

                                        {/* Price */}
                                        <div className="mt-3 flex items-baseline gap-2">
                                            <span className="text-display text-lg font-bold text-slate-900">
                                                {formatPrice(product.salePrice || product.price)}
                                            </span>
                                            {product.salePrice && (
                                                <span className="text-xs text-slate-400 line-through">
                                                    {formatPrice(product.price)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Colors */}
                                        {product.colors && product.colors.length > 0 && (
                                            <div className="mt-2 flex gap-1 text-[10px] text-slate-400">
                                                {product.colors.slice(0, 3).join(' · ')}
                                                {product.colors.length > 3 && ` +${product.colors.length - 3}`}
                                            </div>
                                        )}

                                        {/* Add to cart CTA */}
                                        <button
                                            onClick={(e) => handleAddToCart(e, product.id)}
                                            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${addedId === product.id
                                                ? 'bg-emerald-50 text-emerald-600 scale-95'
                                                : 'bg-gold-500 text-white hover:bg-gold-600'
                                                }`}
                                        >
                                            {addedId === product.id
                                                ? <><Check className="h-4 w-4" /> Đã thêm</>
                                                : <><ShoppingCart className="h-4 w-4" /> Thêm vào giỏ</>
                                            }
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-16 text-center">
                            <Package className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                            <p className="text-sm text-slate-500">Chưa có sản phẩm trong danh mục này</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ═══ COMBO CTA ═══ */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="mx-auto max-w-4xl px-4 py-20 text-center">
                    <span className="mb-4 inline-block text-4xl">✨</span>
                    <h2 className="text-display text-3xl font-bold text-white sm:text-4xl">
                        Combo phòng ngủ từ{' '}
                        <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">15 triệu</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-400">
                        Tiết kiệm đến 30% khi mua combo. Bao gồm giường, tủ, bàn trang điểm và tab đầu giường. Miễn phí vận chuyển & lắp đặt.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-gold-400" /> Tiết kiệm 30%</span>
                        <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-gold-400" /> Miễn phí lắp đặt</span>
                        <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-gold-400" /> Bảo hành 5 năm</span>
                    </div>
                    <Link
                        to="/category/COMBO"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-gold-500/20 transition-all hover:shadow-xl hover:scale-105"
                    >
                        Xem tất cả Combo <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="bg-white border-t border-gold-100 px-4 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-8 sm:grid-cols-3">
                        <div>
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600">
                                    <Crown className="h-4 w-4 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-display text-lg font-bold text-slate-900">MODI<span className="font-light text-gold-500">.vn</span></span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Nội thất module & smart furniture — Thiết kế thông minh, giá vừa tầm.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-3">Danh mục</h4>
                            <div className="space-y-2">
                                {(['BEDROOM', 'LIVING_ROOM', 'APARTMENT', 'SMART', 'COMBO'] as ProductCategory[]).map(c => (
                                    <Link key={c} to={`/category/${c}`} className="block text-sm text-slate-500 hover:text-gold-600 transition-colors">
                                        {ProductCategoryLabels[c]}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-3">Liên hệ</h4>
                            <div className="space-y-2 text-sm text-slate-500">
                                <p>📞 Hotline: 0123.456.789</p>
                                <p>📧 hello@modi.vn</p>
                                <p>📍 TP. Hồ Chí Minh</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                        <p className="text-xs text-slate-400">© 2026 MODI.vn — Nội thất module & smart furniture. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
