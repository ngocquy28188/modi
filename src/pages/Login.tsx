import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
    const { login, user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            // Redirect will happen in useEffect below after state updates
        } catch (err: any) {
            setError(err.message || 'Đăng nhập thất bại');
            setLoading(false);
        }
    }

    // Redirect after login state settles
    useEffect(() => {
        if (user) {
            navigate(isAdmin ? '/admin' : '/');
        }
    }, [user, isAdmin, navigate]);

    return (
        <div className="flex min-h-[85vh] items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600">
                        <Crown className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-display text-2xl font-bold text-slate-900">Đăng nhập</h1>
                    <p className="mt-1 text-sm text-slate-500">Chào mừng bạn trở lại MODI.vn</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
                            placeholder="you@email.com" />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Mật khẩu</label>
                        <div className="relative">
                            <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
                                placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:opacity-60">
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>

                    <p className="text-center text-sm text-slate-500">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="font-medium text-gold-600 hover:text-gold-700">Đăng ký</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
