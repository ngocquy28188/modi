import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight, ChevronDown, Star, ShoppingCart, Check,
  Crown, Truck, Shield, Headphones,
  Package, Quote, Zap,
} from 'lucide-react';
import { pb, Collections } from '@/lib/pocketbase';
import {
  ProductCategoryLabels, ProductStatusLabels, MaterialTypeLabels, formatPrice,
} from '@/types/furniture';
import type { ProductCategory, Product } from '@/types/furniture';
import { useCart } from '@/hooks/useCart';

/* ──── Mock data ──── */
const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Giường Ngủ Module KARA', slug: 'giuong-ngu-kara', category: 'BEDROOM', material: 'MDF', dimensions: '2000 × 1600 × 350mm', price: 8500000, salePrice: 6990000, images: [], description: 'Giường ngủ module thiết kế tối giản, tháo lắp dễ dàng.', features: ['Tháo lắp 15 phút', 'Gỗ MDF chống ẩm', 'Ngăn kéo tích hợp'], status: 'IN_STOCK', rating: 4.8, reviewCount: 124, colors: ['Trắng', 'Vân Sồi', 'Đen'], sku: 'MODI-BD-001', created: '', updated: '' },
  { id: 'p2', name: 'Tủ Quần Áo MIKA 3 Cánh', slug: 'tu-quan-ao-mika', category: 'BEDROOM', material: 'MFC', dimensions: '1800 × 600 × 2000mm', price: 12900000, salePrice: 9990000, images: [], description: 'Tủ quần áo 3 cánh module, thiết kế nhiều ngăn thông minh.', features: ['3 cánh mở', '6 ngăn + 2 thanh treo', 'Module mở rộng'], status: 'IN_STOCK', rating: 4.7, reviewCount: 89, colors: ['Trắng', 'Vân Sồi'], sku: 'MODI-WD-001', created: '', updated: '' },
  { id: 'p3', name: 'Sofa Module LUNA L-Shape', slug: 'sofa-luna-l', category: 'LIVING_ROOM', material: 'FABRIC', dimensions: '2600 × 1700 × 850mm', price: 18500000, salePrice: 14900000, images: [], description: 'Sofa góc L module, đệm bọc vải cao cấp, khung gỗ chắc chắn.', features: ['Tách rời linh hoạt', 'Vải chống bám bẩn', 'Đệm mút D40'], status: 'IN_STOCK', rating: 4.9, reviewCount: 67, colors: ['Xám Đậm', 'Be', 'Xanh Navy'], sku: 'MODI-SF-001', created: '', updated: '' },
  { id: 'p4', name: 'Kệ TV Module ZENITH', slug: 'ke-tv-zenith', category: 'LIVING_ROOM', material: 'MDF', dimensions: '1600 × 400 × 500mm', price: 5900000, images: [], description: 'Kệ TV treo tường module, thiết kế Scandinavian hiện đại.', features: ['Treo tường/đặt sàn', 'Giấu dây điện', 'Chịu tải 80kg'], status: 'IN_STOCK', rating: 4.6, reviewCount: 45, colors: ['Trắng-Sồi', 'Đen-Walnut'], sku: 'MODI-TV-001', created: '', updated: '' },
  { id: 'p5', name: 'Combo Phòng Ngủ SAKURA', slug: 'combo-phong-ngu-sakura', category: 'COMBO', material: 'MDF', dimensions: 'Giường + Tủ + Bàn + Tab', price: 35000000, salePrice: 24900000, images: [], description: 'Combo 4 món cho phòng ngủ hoàn chỉnh. Tiết kiệm 30%.', features: ['4 món đồng bộ', 'Tiết kiệm 30%', 'Tặng lắp đặt'], status: 'IN_STOCK', rating: 4.9, reviewCount: 203, colors: ['Trắng', 'Vân Sồi'], sku: 'MODI-CB-001', created: '', updated: '' },
  { id: 'p6', name: 'Bàn Làm Việc Thông Minh FLEXI', slug: 'ban-flexi', category: 'SMART', material: 'MIXED', dimensions: '1200 × 600 × 750mm', price: 7900000, salePrice: 5990000, images: [], description: 'Bàn làm việc nâng hạ điện, tích hợp sạc không dây.', features: ['Nâng hạ điện', 'Sạc không dây', 'Nhớ 3 vị trí'], status: 'PRE_ORDER', rating: 4.8, reviewCount: 52, colors: ['Trắng', 'Đen'], sku: 'MODI-DK-001', created: '', updated: '' },
  { id: 'p7', name: 'Combo Căn Hộ Studio URBAN', slug: 'combo-studio-urban', category: 'APARTMENT', material: 'MFC', dimensions: 'Full nội thất 25-35m²', price: 65000000, salePrice: 49900000, images: [], description: 'Gói nội thất trọn bộ cho căn hộ studio 25-35m². Tặng thiết kế 3D.', features: ['Trọn bộ 8 món', 'Tối ưu 25-35m²', 'Tặng thiết kế 3D'], status: 'IN_STOCK', rating: 4.7, reviewCount: 31, colors: ['Tone Trắng-Sồi', 'Tone Xám-Walnut'], sku: 'MODI-APT-001', created: '', updated: '' },
  { id: 'p8', name: 'Giá Sách Module HEXA', slug: 'gia-sach-hexa', category: 'SMART', material: 'MDF', dimensions: '400 × 350 × 400mm (mỗi ô)', price: 890000, images: [], description: 'Giá sách dạng ô lục giác module, ghép tùy ý theo tường.', features: ['Ghép tùy ý', 'Nhiều màu', 'Nam châm kết nối'], status: 'IN_STOCK', rating: 4.5, reviewCount: 178, colors: ['Trắng', 'Hồng', 'Xanh Mint', 'Vân Gỗ'], sku: 'MODI-SH-001', created: '', updated: '' },
];

const CAT_BG: Record<string, string> = {
  BEDROOM: 'from-[#e8ddd1] to-[#c9b99f]',
  LIVING_ROOM: 'from-[#d9e0d8] to-[#b0bfad]',
  APARTMENT: 'from-[#dce0e8] to-[#a8b4c8]',
  SMART: 'from-[#e8e4d8] to-[#c4bda6]',
  COMBO: 'from-[#e8dacf] to-[#c9a88f]',
};

const CAT_EMOJI: Record<string, string> = {
  BEDROOM: '🛏️', LIVING_ROOM: '🛋️', APARTMENT: '🏢', SMART: '💡', COMBO: '📦',
};

const TESTIMONIALS = [
  { name: 'Nguyễn Thanh Hằng', role: 'Chủ căn hộ Studio Q7', text: 'MODI giúp mình hoàn thiện căn hộ 28m² chỉ trong 2 tuần. Đội lắp đặt rất chuyên nghiệp, nội thất đẹp hơn tưởng tượng!', stars: 5 },
  { name: 'Trần Minh Khoa', role: 'Kỹ sư, Q. Bình Thạnh', text: 'Mình rất thích concept module — có thể mở rộng tủ khi cần. Chất lượng gỗ tốt, giá hợp lý so với thị trường.', stars: 5 },
  { name: 'Lê Thu Trang', role: 'Nhà thiết kế nội thất', text: 'Tôi hay đề xuất MODI cho khách hàng trẻ vì chi phí tối ưu mà vẫn đẹp. Dịch vụ hậu mãi 5 năm là điểm cộng lớn.', stars: 5 },
];

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  function handleAddToCart(e: React.MouseEvent, productId: string) {
    e.preventDefault(); e.stopPropagation();
    addToCart(productId, 1);
    setAddedId(productId);
    setTimeout(() => setAddedId(null), 1500);
  }

  function handleBuyNow(e: React.MouseEvent, productId: string) {
    e.preventDefault(); e.stopPropagation();
    addToCart(productId, 1);
    navigate('/cart');
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await pb.collection(Collections.PRODUCTS).getList(1, 50, { sort: '-created' });
        if (res.items.length > 0) setProducts(res.items as unknown as Product[]);
      } catch { /* keep mock */ }
    })();
  }, []);

  const { cat } = useParams<{ cat: string }>();
  const categoryFilter = cat as ProductCategory | undefined;
  const displayProducts = categoryFilter
    ? products.filter(p => p.category === categoryFilter)
    : products;

  /* ── Color tokens ── */
  const gold = '#C49B3D';
  const goldDark = '#8B6D20';
  const cream = '#FAFAF7';
  const dark = '#1a1612';
  const border = '#E8D9C4';

  return (
    <div style={{ minHeight: '100vh', background: cream }}>

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: 'min(calc(100vh - 64px), 600px)',
        background: 'linear-gradient(135deg,#f5ede2 0%,#faf6ef 50%,#ede8e0 100%)',
        overflow: 'hidden', padding: '60px 16px 40px',
      }}>
        {/* Grid texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.035, pointerEvents: 'none',
          backgroundImage: `linear-gradient(${gold} 1px,transparent 1px),linear-gradient(90deg,${gold} 1px,transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: '-8rem', top: '50%', transform: 'translateY(-50%)', width: 560, height: 560, borderRadius: '50%', border: `1px solid ${gold}18`, pointerEvents: 'none', display: 'none' }} className="xl:!block" />
        <div style={{ position: 'absolute', right: '-5rem', top: '50%', transform: 'translateY(-50%)', width: 380, height: 380, borderRadius: '50%', border: `1px solid ${gold}22`, pointerEvents: 'none', display: 'none' }} className="xl:!block" />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 820, textAlign: 'center' }}>
          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span style={{ height: 1, width: 40, background: gold, display: 'block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', color: goldDark, textTransform: 'uppercase' }}>
              Nội Thất Module &amp; Smart Furniture
            </span>
            <span style={{ height: 1, width: 40, background: gold, display: 'block' }} />
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem,6vw,5.5rem)',
            fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.01em', color: dark,
          }}>
            Không gian sống<br />
            <em style={{ color: gold, fontStyle: 'italic' }}>tinh tế</em>
            {' '}— Giá vừa tầm
          </h1>

          <p style={{ marginTop: 20, fontSize: 17, lineHeight: 1.7, color: '#5c5448', maxWidth: 520, margin: '20px auto 0' }}>
            Nội thất module tháo lắp linh hoạt. Combo phòng ngủ từ{' '}
            <strong style={{ color: goldDark }}>15 triệu</strong>,
            {' '}căn hộ dịch vụ từ{' '}
            <strong style={{ color: goldDark }}>49 triệu</strong>.
            Giao lắp toàn quốc.
          </p>

          {/* CTAs */}
          <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link
              to="/category/COMBO"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                borderRadius: 999, background: dark, padding: '14px 28px',
                fontSize: 14, fontWeight: 600, color: 'white', letterSpacing: '0.02em',
                textDecoration: 'none', transition: 'background .2s,transform .2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = gold; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = dark; }}
            >
              Xem Combo Tiết Kiệm <ArrowRight size={16} />
            </Link>
            <a
              href="https://zalo.me/0123456789"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                borderRadius: 999, border: `1.5px solid ${gold}80`, background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)', padding: '13.5px 28px',
                fontSize: 14, fontWeight: 500, color: dark, textDecoration: 'none',
              }}
            >
              <Headphones size={16} style={{ color: gold }} />
              Tư vấn miễn phí
            </a>
          </div>

          {/* Trust pills */}
          <div style={{ marginTop: 40, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {['✓ Bảo hành 5 năm', '✓ Lắp đặt tận nơi', '✓ Đổi trả 30 ngày', '✓ 500+ khách hàng'].map(t => (
              <span key={t} style={{
                borderRadius: 999, background: 'rgba(255,255,255,0.7)', border: `1px solid ${border}`,
                padding: '5px 14px', fontSize: 12, color: '#6b5a44',
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#a09080' }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Khám phá</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST BAR
      ═══════════════════════════════════════════════════ */}
      <section style={{ borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}
          className="grid grid-cols-2 sm:grid-cols-4">
          {[
            { icon: '🛋️', value: products.length + '+', label: 'Sản phẩm' },
            { icon: '💰', value: '30%', label: 'Tiết kiệm khi mua combo' },
            { icon: '🛡️', value: '5 năm', label: 'Bảo hành kết cấu' },
            { icon: '🚚', value: 'Toàn quốc', label: 'Giao & lắp đặt' },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '20px 24px',
              borderRight: i < 3 ? `1px solid ${border}` : 'none',
            }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: dark }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#8a7a68' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CATEGORY SHOWCASE
      ═══════════════════════════════════════════════════ */}
      <section style={{ padding: '48px 16px', background: cream }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', marginBottom: 8 }}>Danh Mục</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 600, color: dark }}>
                Không gian của bạn
              </h2>
            </div>
            <Link to="/" style={{ fontSize: 14, color: gold, textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              Tất cả <ArrowRight size={14} />
            </Link>
          </div>

          {/* 4-column grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(['BEDROOM', 'LIVING_ROOM', 'COMBO', 'SMART'] as ProductCategory[]).map((c) => (
              <Link
                key={c}
                to={`/category/${c}`}
                style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', display: 'block', textDecoration: 'none', aspectRatio: '3/4' }}
                className={`bg-gradient-to-br ${CAT_BG[c]} group`}
              >
                {/* Big emoji art */}
                <span style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 72, opacity: 0.22, userSelect: 'none', transition: 'all .4s',
                }} className="group-hover:opacity-40 group-hover:scale-110">
                  {CAT_EMOJI[c]}
                </span>
                {/* Overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.60) 0%,rgba(0,0,0,.05) 60%,transparent 100%)' }} />
                {/* Text */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 16px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'white', lineHeight: 1.3 }}>
                    {ProductCategoryLabels[c]}
                  </h3>
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>
                    Khám phá <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Wide banner — APARTMENT */}
          <Link
            to="/category/APARTMENT"
            style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', display: 'block', textDecoration: 'none', marginTop: 16, minHeight: 200 }}
            className={`bg-gradient-to-r ${CAT_BG['APARTMENT']} group`}
          >
            <span style={{ position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)', fontSize: 96, opacity: 0.15, userSelect: 'none', transition: 'all .4s' }}
              className="group-hover:opacity-25 group-hover:scale-110">🏢</span>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(0,0,0,.65) 0%,rgba(0,0,0,.15) 70%,transparent 100%)' }} />
            <div style={{ position: 'relative', padding: '40px 36px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#f0d080', textTransform: 'uppercase', marginBottom: 8 }}>Gói trọn bộ</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: 'white' }}>
                Nội Thất Căn Hộ Dịch Vụ
              </h3>
              <p style={{ marginTop: 8, fontSize: 14, color: 'rgba(255,255,255,.75)', maxWidth: 440 }}>
                Trọn bộ nội thất từ 25–60m². Thiết kế 3D miễn phí. Lắp đặt trong 3 ngày.
              </p>
              <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#f0d080' }}>
                Xem gói căn hộ <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY MODI
      ═══════════════════════════════════════════════════ */}
      <section style={{ borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, background: 'white', padding: '48px 16px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', alignItems: 'center' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Copy */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', marginBottom: 12 }}>Vì sao chọn MODI</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,2.5vw,2.5rem)', fontWeight: 600, lineHeight: 1.25, color: dark }}>
              Thiết kế thông minh<br /><em>cho người Việt hiện đại</em>
            </h2>
            <p style={{ marginTop: 20, fontSize: 15, lineHeight: 1.75, color: '#5c5448' }}>
              MODI ra đời từ một bài toán đơn giản: nội thất Việt còn quá đắt hoặc quá xấu.
              Chúng tôi xây dựng hệ thống module tháo lắp linh hoạt — đẹp như showroom, giá
              phù hợp túi tiền, lắp đặt không cần thợ chuyên nghiệp.
            </p>
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { Icon: Package, title: 'Module tháo lắp dễ dàng', desc: 'Lắp ráp trong 15 phút, không cần kinh nghiệm. Di chuyển, mở rộng bất kỳ lúc nào.' },
                { Icon: Truck, title: 'Giao & lắp đặt tận nơi', desc: 'Miễn phí nội thành. Đội thợ chuyên nghiệp lắp đặt, dọn dẹp sau khi hoàn tất.' },
                { Icon: Shield, title: 'Bảo hành 5 năm', desc: 'Đổi trả 30 ngày, bảo hành kết cấu 5 năm. Không kèm điều kiện phức tạp.' },
              ].map(({ Icon, title, desc }, i) => (
                <div key={i} style={{ display: 'flex', gap: 16 }}>
                  <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: '#FDF6E8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                    <Icon size={18} color={gold} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: dark }}>{title}</div>
                    <div style={{ marginTop: 3, fontSize: 13, lineHeight: 1.65, color: '#7a6a58' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/category/COMBO" style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: gold, textDecoration: 'none' }}>
              Xem tất cả sản phẩm <ArrowRight size={14} />
            </Link>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { val: '500+', label: 'Khách hàng hài lòng', bg: 'linear-gradient(135deg,#f5ede2,#ede0cc)', emoji: '😊' },
              { val: '30%', label: 'Tiết kiệm khi mua combo', bg: 'linear-gradient(135deg,#e8f0e8,#d4e4d4)', emoji: '💰' },
              { val: '3 ngày', label: 'Lắp đặt căn hộ trọn gói', bg: 'linear-gradient(135deg,#e4eaf4,#ccd8ec)', emoji: '⚡' },
              { val: '5 năm', label: 'Bảo hành kết cấu', bg: 'linear-gradient(135deg,#f0ece4,#e4dcd0)', emoji: '🛡️' },
            ].map((s, i) => (
              <div key={i} style={{ borderRadius: 16, background: s.bg, padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 28 }}>{s.emoji}</span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: dark }}>{s.val}</div>
                <div style={{ fontSize: 12, color: '#6b5a44', lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PRODUCT GRID
      ═══════════════════════════════════════════════════ */}
      <section id="products" style={{ padding: '48px 16px', background: cream }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', marginBottom: 8 }}>Sản Phẩm</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 600, color: dark }}>
                {categoryFilter ? ProductCategoryLabels[categoryFilter] : 'Được yêu thích nhất'}
              </h2>
              <p style={{ marginTop: 4, fontSize: 13, color: '#8a7a68' }}>
                {categoryFilter ? `${displayProducts.length} sản phẩm` : 'Lựa chọn hàng đầu tại MODI.vn'}
              </p>
            </div>
            {categoryFilter && (
              <Link to="/" style={{ fontSize: 14, color: gold, textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                Tất cả <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {displayProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayProducts.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  style={{ borderRadius: 16, border: `1px solid ${border}`, background: 'white', overflow: 'hidden', display: 'flex', flexDirection: 'column', textDecoration: 'none', transition: 'box-shadow .25s,transform .25s' }}
                  className="group hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Image */}
                  <div style={{ position: 'relative' }}>
                    {product.images?.length > 0 ? (
                      <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                        <img src={pb.files.getURL(product as any, product.images[0], { thumb: '400x300' })} alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }}
                          className="group-hover:scale-105" />
                      </div>
                    ) : (
                      <div style={{ aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        className={`bg-gradient-to-br ${CAT_BG[product.category] || 'from-[#f0e8dc] to-[#ddd0bf]'}`}>
                        <span style={{ fontSize: 52, opacity: 0.45, transition: 'all .4s', userSelect: 'none' }}
                          className="group-hover:scale-110 group-hover:opacity-65">
                          {CAT_EMOJI[product.category] || '🪑'}
                        </span>
                      </div>
                    )}

                    {/* Badges */}
                    {product.salePrice && (
                      <span style={{ position: 'absolute', top: 10, left: 10, borderRadius: 999, background: gold, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: 'white' }}>
                        -{Math.round((1 - product.salePrice / product.price) * 100)}%
                      </span>
                    )}
                    {product.status !== 'IN_STOCK' && (
                      <span style={{
                        position: 'absolute', top: 10, right: 10, borderRadius: 999, padding: '3px 10px', fontSize: 10, fontWeight: 700,
                        background: product.status === 'PRE_ORDER' ? '#fef3c7' : '#fee2e2',
                        color: product.status === 'PRE_ORDER' ? '#92400e' : '#b91c1c',
                      }}>
                        {ProductStatusLabels[product.status]}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: gold, textTransform: 'uppercase', marginBottom: 6 }}>
                      {ProductCategoryLabels[product.category]}
                    </span>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: dark, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color .2s' }}
                      className="group-hover:text-[#C49B3D]">
                      {product.name}
                    </h3>
                    <div style={{ marginTop: 4, fontSize: 11, color: '#a09080' }}>
                      {MaterialTypeLabels[product.material]} · {product.dimensions}
                    </div>

                    {/* Stars */}
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 2 }}>
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} size={12}
                          style={{ fill: si < Math.round(product.rating || 0) ? '#fbbf24' : 'none', color: si < Math.round(product.rating || 0) ? '#fbbf24' : '#e2e8f0' }} />
                      ))}
                      <span style={{ marginLeft: 4, fontSize: 11, color: '#8a7a68' }}>({product.reviewCount})</span>
                    </div>

                    <div style={{ flex: 1 }} />

                    {/* Price */}
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: dark }}>
                        {formatPrice(product.salePrice || product.price)}
                      </span>
                      {product.salePrice && (
                        <span style={{ fontSize: 12, color: '#a09080', textDecoration: 'line-through' }}>
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    {/* Colors */}
                    {product.colors?.length > 0 && (
                      <div style={{ marginTop: 4, fontSize: 11, color: '#a09080' }}>
                        {product.colors.slice(0, 3).join(' · ')}{product.colors.length > 3 && ` +${product.colors.length - 3}`}
                      </div>
                    )}

                    {/* Action buttons — Thêm vào giỏ + Mua ngay */}
                    <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <button
                        onClick={(e) => handleAddToCart(e, product.id)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          borderRadius: 10, padding: '9px 0', fontSize: 12.5, fontWeight: 500,
                          border: `1.5px solid ${addedId === product.id ? '#10b981' : border}`,
                          background: addedId === product.id ? '#ecfdf5' : 'white',
                          color: addedId === product.id ? '#059669' : '#5c5448',
                          cursor: 'pointer', transition: 'all .2s',
                        }}
                      >
                        {addedId === product.id
                          ? <><Check size={13} /> Đã thêm</>
                          : <><ShoppingCart size={13} /> Giỏ hàng</>
                        }
                      </button>
                      <button
                        onClick={(e) => handleBuyNow(e, product.id)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          borderRadius: 10, padding: '9px 0', fontSize: 12.5, fontWeight: 600,
                          background: dark, color: 'white',
                          border: 'none', cursor: 'pointer', transition: 'background .2s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = gold; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = dark; }}
                      >
                        <Zap size={13} /> Mua ngay
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ borderRadius: 16, border: `1px solid ${border}`, background: 'white', padding: '64px 24px', textAlign: 'center' }}>
              <Package size={40} style={{ margin: '0 auto 12px', color: '#c4b09a' }} />
              <p style={{ fontSize: 14, color: '#8a7a68' }}>Chưa có sản phẩm trong danh mục này</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          COMBO CTA
      ═══════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', background: dark, padding: '60px 16px' }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none',
          backgroundImage: `radial-gradient(${gold} 1px,transparent 1px)`,
          backgroundSize: '28px 28px',
        }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom,${gold},${goldDark},transparent)` }} />

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: 36 }}>✨</span>
          <h2 style={{ fontFamily: 'var(--font-display)', marginTop: 12, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 600, color: 'white' }}>
            Combo phòng ngủ từ{' '}
            <em style={{ color: '#D4A853' }}>15 triệu</em>
          </h2>
          <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,.6)', maxWidth: 500, margin: '16px auto 0' }}>
            Tiết kiệm đến 30% khi mua combo. Bao gồm giường, tủ, bàn trang điểm và tab đầu giường.
            Miễn phí vận chuyển &amp; lắp đặt.
          </p>
          <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
            {['Tiết kiệm 30%', 'Miễn phí lắp đặt', 'Bảo hành 5 năm'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,.5)' }}>
                <Check size={14} style={{ color: '#D4A853' }} /> {t}
              </span>
            ))}
          </div>
          <Link
            to="/category/COMBO"
            style={{
              marginTop: 36, display: 'inline-flex', alignItems: 'center', gap: 8,
              borderRadius: 999, border: `1.5px solid ${gold}`, padding: '14px 28px',
              fontSize: 14, fontWeight: 700, color: '#D4A853', textDecoration: 'none',
              transition: 'all .2s',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = gold; el.style.color = 'white'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#D4A853'; }}
          >
            Xem tất cả Combo <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════ */}
      <section style={{ padding: '48px 16px', background: cream, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', marginBottom: 10 }}>Khách hàng nói gì</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 600, color: dark }}>
              Hơn 500 gia đình tin tưởng
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ borderRadius: 16, border: `1px solid ${border}`, background: 'white', padding: 24 }}>
                <Quote size={22} style={{ color: '#D4A853', opacity: 0.6, marginBottom: 12 }} />
                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5c5448' }}>"{t.text}"</p>
                <div style={{ marginTop: 12, display: 'flex', gap: 2 }}>
                  {[...Array(t.stars)].map((_, si) => (
                    <Star key={si} size={13} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                  ))}
                </div>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid #f0e8dc` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: dark }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#a09080' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer style={{ background: dark, padding: '48px 16px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${gold},${goldDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Crown size={16} color="white" strokeWidth={2.5} />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'white', fontStyle: 'normal' }}>
                  MODI<span style={{ color: gold, fontWeight: 300 }}>.vn</span>
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.75, maxWidth: 280 }}>
                Nội thất module &amp; smart furniture — Thiết kế thông minh, giá vừa tầm. Giao lắp toàn quốc.
              </p>
              <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
                {['Facebook', 'Zalo', 'YouTube'].map(s => (
                  <span key={s} style={{ borderRadius: 8, border: 'rgba(255,255,255,.12)', borderWidth: 1, borderStyle: 'solid', padding: '6px 12px', fontSize: 12, color: 'rgba(255,255,255,.35)', cursor: 'pointer' }}>{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', marginBottom: 16 }}>Danh mục</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(['BEDROOM', 'LIVING_ROOM', 'APARTMENT', 'SMART', 'COMBO'] as ProductCategory[]).map(c => (
                  <Link key={c} to={`/category/${c}`} style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', textDecoration: 'none' }}>
                    {ProductCategoryLabels[c]}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', marginBottom: 16 }}>Liên hệ</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'rgba(255,255,255,.55)' }}>
                <span>📞 Hotline: 0123.456.789</span>
                <span>📧 hello@modi.vn</span>
                <span>📍 TP. Hồ Chí Minh</span>
                <span style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,.28)', lineHeight: 1.7 }}>T2–T7: 8:00 – 20:00<br />CN: 9:00 – 17:00</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 48, paddingTop: 20, borderTop: 'rgba(255,255,255,.08)', borderTopWidth: 1, borderTopStyle: 'solid', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.25)' }}>© 2026 MODI.vn — All rights reserved.</p>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'rgba(255,255,255,.25)' }}>
              <span>Chính sách bảo mật</span>
              <span>Điều khoản dịch vụ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
