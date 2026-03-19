import { useState, useEffect } from 'react';
import { pb, Collections } from '@/lib/pocketbase';
import { BookOpen, Calendar, ArrowRight, Crown } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    cover: string;
    created: string;
}

const MOCK_POSTS: BlogPost[] = [
    { id: 'b1', title: '5 Xu Hướng Nội Thất Module 2026', slug: 'xu-huong-2026', content: '', excerpt: 'Khám phá những xu hướng thiết kế nội thất module hot nhất năm 2026 — từ phong cách tối giản Japandi đến smart furniture tích hợp IoT.', cover: '', created: '2026-03-15' },
    { id: 'b2', title: 'Cách Bố Trí Phòng Ngủ Nhỏ 10m² Đẹp & Tiện', slug: 'phong-ngu-nho', content: '', excerpt: 'Hướng dẫn chi tiết cách tối ưu hóa căn phòng ngủ nhỏ với nội thất module — giường, tủ, bàn làm việc vừa vặn trong 10m².', cover: '', created: '2026-03-10' },
    { id: 'b3', title: 'Combo Nội Thất Căn Hộ Dịch Vụ — Đầu Tư Thông Minh', slug: 'combo-can-ho-dv', content: '', excerpt: 'Phân tích chi phí và lợi ích khi đầu tư nội thất module cho căn hộ dịch vụ. ROI, độ bền, bảo trì, và so sánh giải pháp truyền thống.', cover: '', created: '2026-03-05' },
];

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>(MOCK_POSTS);

    useEffect(() => {
        (async () => {
            try {
                const res = await pb.collection(Collections.BLOG).getList(1, 20, { sort: '-created' });
                if (res.items.length > 0) setPosts(res.items as unknown as BlogPost[]);
            } catch { /* mock */ }
        })();
    }, []);

    return (
        <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="mb-10 text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-4 py-2 text-xs font-medium text-gold-700">
                    <BookOpen className="h-3.5 w-3.5" /> MODI Blog
                </div>
                <h1 className="text-display text-3xl font-bold text-slate-900 sm:text-4xl">Mẹo & Xu hướng Nội Thất</h1>
                <p className="mt-2 text-sm text-slate-500">Chia sẻ kiến thức thiết kế, trang trí nhà đẹp</p>
            </div>

            <div className="space-y-6">
                {posts.map(post => (
                    <article key={post.id} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all hover:shadow-md hover:border-gold-200">
                        <div className="flex flex-col sm:flex-row">
                            <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-gold-50 to-gold-100 text-4xl sm:h-auto sm:w-48 flex-shrink-0">
                                📝
                            </div>
                            <div className="flex-1 p-6">
                                <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(post.created).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </div>
                                <h2 className="text-display text-lg font-bold text-slate-900 group-hover:text-gold-700 transition-colors line-clamp-2">{post.title}</h2>
                                <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">{post.excerpt}</p>
                                <button className="mt-3 flex items-center gap-1 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors">
                                    Đọc thêm <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-2xl bg-gradient-to-br from-gold-50 to-gold-100 p-8 text-center border border-gold-200">
                <Crown className="mx-auto mb-3 h-8 w-8 text-gold-500" />
                <h3 className="text-display text-xl font-bold text-slate-900">Nhận tư vấn miễn phí</h3>
                <p className="mt-2 text-sm text-slate-500">Đội ngũ thiết kế MODI sẵn sàng hỗ trợ bạn qua Zalo</p>
                <a href="https://zalo.me/0123456789" target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm font-semibold text-white hover:bg-gold-600 transition-all">
                    Chat Zalo ngay
                </a>
            </div>
        </div>
    );
}
