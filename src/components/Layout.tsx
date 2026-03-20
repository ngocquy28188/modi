import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Crown, BookOpen, Shield, Bed, Sofa, Building2, Lightbulb } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import type { ReactNode } from 'react';
import AiChat from './AiChat';

export default function Layout({ children }: { children: ReactNode }) {
    const { user, logout, isAdmin } = useAuth();
    const { totalItems } = useCart();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { to: '/', label: 'Trang chủ', desktop: true },
        { to: '/category/BEDROOM', label: 'Phòng Ngủ', icon: <Bed className="h-4 w-4" />, desktop: false },
        { to: '/category/LIVING_ROOM', label: 'Phòng Khách', icon: <Sofa className="h-4 w-4" />, desktop: false },
        { to: '/category/APARTMENT', label: 'Căn Hộ', icon: <Building2 className="h-4 w-4" />, desktop: false },
        { to: '/category/SMART', label: 'Smart', icon: <Lightbulb className="h-4 w-4" />, desktop: false },
        { to: '/cart', label: 'Giỏ hàng', icon: <ShoppingCart className="h-4 w-4" />, desktop: true },
        { to: '/blog', label: 'Blog', icon: <BookOpen className="h-4 w-4" />, desktop: true },
        ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: <Shield className="h-4 w-4" />, desktop: true }] : []),
    ];

    const isActive = (path: string) => location.pathname === path || location.pathname + location.search === path;

    return (
        <div className="min-h-screen bg-[#FFFDF5]">
            {/* HEADER */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-gold-200/50 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 shadow-sm">
                            <Crown className="h-5 w-5 text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <span className="text-display text-xl font-bold tracking-tight text-slate-900">MODI</span>
                            <span className="text-display text-xl font-light text-gold-500">.vn</span>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden items-center gap-1 md:flex">
                        {navLinks.filter(l => l.desktop).map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-all ${isActive(link.to)
                                    ? 'bg-gold-50 text-gold-700 font-medium'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {link.icon}
                                {link.label}
                                {link.to === '/cart' && totalItems > 0 && (
                                    <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1.5 text-[10px] font-bold text-white">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth area */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-2">
                                <Link to="/" className="hidden items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-slate-500 hover:text-slate-900 md:flex">
                                    <User className="h-4 w-4" />
                                    <span className="max-w-24 truncate">{user.name}</span>
                                </Link>
                                <button onClick={logout} className="rounded-lg p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Đăng xuất">
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all hover:from-gold-400 hover:to-gold-500">
                                Đăng nhập
                            </Link>
                        )}
                        <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-slate-500 md:hidden hover:bg-slate-50">
                            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center gap-2.5 rounded-lg py-3 px-2 text-sm ${isActive(link.to) ? 'text-gold-700 bg-gold-50 font-medium' : 'text-slate-500'
                                    }`}
                            >
                                {link.icon}
                                {link.label}
                                {link.to === '/cart' && totalItems > 0 && (
                                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1.5 text-[10px] font-bold text-white">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </header>

            {/* MAIN */}
            <main className="pt-16">{children}</main>
            <AiChat />
        </div>
    );
}
