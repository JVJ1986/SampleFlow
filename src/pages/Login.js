import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) setError(error.message);
    setLoading(false);
  }

  const s = {
    wrap:   { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f4f5f7' },
    card:   { background:'#fff', border:'1px solid #e5e5e5', borderRadius:14, padding:'44px 40px', width:390, maxWidth:'95vw', boxShadow:'0 4px 24px rgba(0,0,0,.06)' },
    logo:   { display:'flex', alignItems:'center', gap:10, marginBottom:32 },
    logoBox:{ width:36, height:36, background:'#111', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:15 },
    h2:     { fontSize:21, fontWeight:600, marginBottom:4 },
    sub:    { fontSize:13, color:'#888', marginBottom:26 },
    label:  { display:'block', fontSize:12, fontWeight:500, color:'#555', marginBottom:5 },
    input:  { width:'100%', padding:'10px 13px', border:'1px solid #e0e0e0', borderRadius:8, fontSize:13, outline:'none', color:'#111', marginBottom:16 },
    err:    { background:'#fff0f0', color:'#c0392b', fontSize:12, padding:'8px 12px', borderRadius:7, marginBottom:14 },
    btn:    { width:'100%', padding:11, background:'#111', color:'#fff', border:'none', borderRadius:9, fontSize:14, fontWeight:500, cursor:'pointer', marginTop:4 },
    note:   { background:'#f0f6ff', border:'1px solid #dbeafe', borderRadius:8, padding:'10px 14px', fontSize:11, color:'#1d4ed8', marginTop:16, lineHeight:1.8 },
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.logo}>
          <div style={s.logoBox}>S</div>
          <span style={{ fontWeight:600, fontSize:17 }}>SampleFlow MS</span>
        </div>
        <h2 style={s.h2}>Sign in</h2>
        <p style={s.sub}>AAA Textiles — Sample Management System</p>
        {error && <div style={s.err}>{error}</div>}
        <form onSubmit={handleLogin}>
          <label style={s.label}>Work email</label>
          <input style={s.input} type="email" placeholder="you@aaatextiles.in" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" />
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <div style={s.note}>
          <strong style={{ display:'block', marginBottom:4, fontSize:12 }}>Authorized accounts</strong>
          cad.gmts@aaatextiles.in<br/>
          qc@aaatextiles.in<br/>
          prabhu.aaatextiles@gmail.com<br/>
          merchant1/2/3/merchant@aaatextiles.in<br/>
          murugesh.k@aaatextiles.in (Admin)
        </div>
      </div>
    </div>
  );
}
