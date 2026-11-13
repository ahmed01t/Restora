'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, LockKeyhole, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const params = useSearchParams();
  const router = useRouter();
  const urlError = params.get('error');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(urlError);
  const [loading, setLoading] = useState(false);

 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to authenticate. Please check credentials.');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('An unexpected network error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <a className="auth-back" href="/">
        <ArrowLeft size={16} /> Back to Restora
      </a>

      <div className="auth-card">
        <a className="auth-brand" href="/">
          <span className="brand-mark">r</span>
          <span>
            restora<span className="brand-period">.</span>
          </span>
        </a>

        <span className="auth-kicker">ADMIN WORKSPACE</span>
        <h1>Welcome back.</h1>
        <p className="auth-sub">Sign in to manage your luxury properties, clients, and inquiries.</p>

        {/* Demo Credentials Quick-Fill Pill */}
        <div className="demo-credentials-box">
          {/* <div className="demo-credentials-header">
            <Sparkles size={14} className="demo-icon" />
            <span>Workspace Demo Credentials</span>
          </div> */}
          {/* <div className="demo-creds-details">
            <code>admin@restora.com</code>
            <span>/</span>
          </div> */}
          {/* <button type="button" onClick={fillDemo} className="demo-fill-btn">
            Auto-fill credentials
          </button> */}
        </div>

        {error && (
          <div className="auth-error-banner" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Work email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="admin@restora.com"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-submit" type="submit" disabled={loading}>
            <span>{loading ? 'Authenticating...' : 'Sign in to Workspace'}</span>
            <ArrowUpRight size={17} />
          </button>
        </form>

        <div className="auth-secure">
          <LockKeyhole size={14} /> Secure session with encrypted cookie verification
        </div>

        <p className="auth-switch">
          Have an invitation code? <a href="/admin/signup">Request admin access</a>
        </p>
      </div>

      <p className="auth-foot">RESTORA ADMIN · EDITORIAL REAL ESTATE MANAGEMENT</p>
    </main>
  );
}
