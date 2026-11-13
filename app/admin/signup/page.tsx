'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, MailCheck, ShieldCheck, KeyRound } from 'lucide-react';

export default function AdminSignup() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const fillSampleInvite = () => {
    setName('Alex Rivera');
    setEmail('director@restora.com');
    setInviteCode('RESTORA-VIP-2026');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="auth-page">
      <a className="auth-back" href="/admin/login">
        <ArrowLeft size={16} /> Back to sign in
      </a>

      <div className="auth-card">
        <a className="auth-brand" href="/">
          <span className="brand-mark">r</span>
          <span>
            restora<span className="brand-period">.</span>
          </span>
        </a>

        <span className="auth-kicker">INVITATION ONLY</span>
        <h1>Create access.</h1>
        <p className="auth-sub">
          Admin access is restricted to licensed portfolio managers and authorized estate directors.
        </p>

        {!submitted && (
          <div className="demo-credentials-box">
            <div className="demo-credentials-header">
              <KeyRound size={14} className="demo-icon" />
              <span>Workspace Invitation Sample</span>
            </div>
            <div className="demo-creds-details">
              <span>Code:</span> <code>RESTORA-VIP-2026</code>
            </div>
            <button type="button" onClick={fillSampleInvite} className="demo-fill-btn">
              Auto-fill sample invite
            </button>
          </div>
        )}

        {submitted ? (
          <div className="auth-success">
            <MailCheck size={36} className="success-icon" />
            <strong>Invitation request registered</strong>
            <span>
              We have received your verification request for <code>{email}</code>. An authorized administrator will activate your clearance within 24 hours.
            </span>
            <a href="/admin/login" className="button button-dark" style={{ marginTop: '16px' }}>
              Return to Login <ArrowUpRight size={15} />
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              name="name"
              autoComplete="name"
              placeholder="e.g. Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="signup-email">Work email</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="invite">Invitation code</label>
            <input
              id="invite"
              name="invite"
              autoComplete="off"
              placeholder="e.g. RESTORA-VIP-2026"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />

            <button className="auth-submit" type="submit">
              <span>Submit clearance request</span>
              <ArrowUpRight size={17} />
            </button>
          </form>
        )}

        <p className="auth-switch">
          Already have an active account? <a href="/admin/login">Sign in</a>
        </p>
      </div>

      <p className="auth-foot">RESTORA ADMIN · SECURE VERIFIED CLEARANCE</p>
    </main>
  );
}
