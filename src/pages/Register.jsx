import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  RiLockPasswordLine,
  RiUserLine,
  RiMailLine,
  RiEyeLine,
  RiEyeOffLine,
  RiQuillPenLine,
  RiShieldCheckLine,
} from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm]     = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.username.trim())              { toast.error('Username is required');            return false; }
    if (form.username.length < 3)           { toast.error('Username must be ≥ 3 characters'); return false; }
    if (!form.email.trim())                 { toast.error('Email is required');               return false; }
    if (!/\S+@\S+\.\S+/.test(form.email))  { toast.error('Enter a valid email address');     return false; }
    if (form.password.length < 8)           { toast.error('Password must be ≥ 8 characters'); return false; }
    if (form.password !== form.confirm)     { toast.error('Passwords do not match');          return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const toastId = toast.loading('Creating your account…');
    try {
      await register({ username: form.username, email: form.email, password: form.password });
      toast.success('Account created! Please log in. 🎉', { id: toastId, duration: 4000 });
      navigate('/login');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        'Registration failed. Please try again.';
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  /* Password strength */
  const strength = (() => {
    const pw = form.password;
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8)                   s++;
    if (/[A-Z]/.test(pw))                 s++;
    if (/[0-9]/.test(pw))                 s++;
    if (/[^A-Za-z0-9]/.test(pw))          s++;
    return s;
  })();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strength];

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-20">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96
                      bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="glass p-8 md:p-10 animate-slide-up">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 shadow-glow mb-4">
              <RiQuillPenLine className="text-white text-2xl" />
            </span>
            <h1 className="font-display text-3xl font-bold text-white">Join InkWave</h1>
            <p className="text-gray-400 text-sm mt-1">Create your account and start writing</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4" id="register-form">
            {/* Username */}
            <div>
              <label htmlFor="register-username" className="block text-sm font-medium text-gray-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="register-username"
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  autoComplete="username"
                  required
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  autoComplete="email"
                  required
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="register-password"
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
                  autoComplete="new-password"
                  required
                  className="form-input pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPw ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              </div>
              {/* Strength meter */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColor : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">{strengthLabel}</p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="register-confirm" className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <RiShieldCheckLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="register-confirm"
                  type={showPw ? 'text' : 'password'}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  required
                  className={`form-input pl-10 ${
                    form.confirm && form.confirm !== form.password
                      ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
                      : ''
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              id="register-submit-btn"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="divider my-6" />

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
