import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', passwordConfirm: '' });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function update(key: string, value: string) {
        setForm(prev => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (form.password !== form.passwordConfirm) { setError('Mật khẩu không khớp'); return; }
        if (form.password.length < 8) { setError('Mật khẩu tối thiểu 8 ký tự'); return; }
        setLoading(true);
        try {
            await register(form);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[85vh] items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600">
                        <Crown className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-display text-2xl font-bold text-slate-900">Tạo tài khoản</h1>
                    <p className="mt-1 text-sm text-slate-500">Tham gia MODI.vn để nhận ưu đãi đặc biệt</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Họ tên</label>
                        <input type="text" required value={form.name} onChange={e => update('name', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
                            placeholder="Nguyễn Văn A" />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                        <input type="email" required value={form.email} onChange={e => update('email', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
                            placeholder="you@email.com" />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Số điện thoại</label>
                        <input type="tel" required value={form.phone} onChange={e => update('phone', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
                            placeholder="0912 345 678" />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Mật khẩu</label>
                        <div className="relative">
                            <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={e => update('password', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
                                placeholder="Tối thiểu 8 ký tự" />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Xác nhận mật khẩu</label>
                        <input type="password" required value={form.passwordConfirm} onChange={e => update('passwordConfirm', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
                            placeholder="Nhập lại mật khẩu" />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:opacity-60">
                        {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                    </button>

                    <p className="text-center text-sm text-slate-500">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="font-medium text-gold-600 hover:text-gold-700">Đăng nhập</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
