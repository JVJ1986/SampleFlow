import React, { useContext } from 'react';
import { AppContext } from '../App';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const { session, page, setPage, activeTab, setActiveTab } = useContext(AppContext);
  const email = session?.user?.email || '';
  const name  = email.split('@')[0].replace(/\./g,' ').replace(/\b\w/g, c=>c.toUpperCase());

  const s = {
    nav:    { background:'#fff', borderBottom:'1px solid #e8e8e8', display:'flex', alignItems:'center', padding:'0 24px', height:52, position:'sticky', top:0, zIndex:50 },
    logo:   { display:'flex', alignItems:'center', gap:8, marginRight:28, flexShrink:0 },
    logoBox:{ width:28, height:28, background:'#111', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:12 },
    links:  { display:'flex', height:'100%' },
    link:   (active) => ({ padding:'0 16px', height:'100%', display:'flex', alignItems:'center', fontSize:13, color: active?'#111':'#999', borderBottom: active?'2px solid #111':'2px solid transparent', cursor:'pointer', fontWeight: active?500:400, whiteSpace:'nowrap' }),
    search: { display:'flex', alignItems:'center', gap:8, border:'1px solid #e8e8e8', borderRadius:8, padding:'6px 12px', background:'#f9f9f9' },
    searchInput: { border:'none', background:'none', outline:'none', fontSize:13, color:'#111', width:140 },
    right:  { display:'flex', alignItems:'center', gap:12, marginLeft:14 },
    userInfo: { textAlign:'right', lineHeight:1.4 },
    avatar: { width:32, height:32, background:'#c0392b', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:600, fontSize:13 },
    signout:{ fontSize:11, color:'#999', cursor:'pointer', display:'block' },
  };

  return (
    <nav style={s.nav}>
      <div style={s.logo}>
        <div style={s.logoBox}>S</div>
        <span style={{ fontWeight:600, fontSize:14 }}>SampleFlow MS</span>
      </div>
      <div style={s.links}>
        {['dashboard','samples','reports'].map(p => (
          <div key={p} style={s.link(page===p)} onClick={()=>setPage(p)}>
            {p.charAt(0).toUpperCase()+p.slice(1)}
          </div>
        ))}
      </div>
      <div style={{ flex:1 }} />
      <div style={s.search}>
        <svg width="14" height="14" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input style={s.searchInput} placeholder="Search..." id="globalSearchInput" />
      </div>
      <div style={s.right}>
        <div style={{ position:'relative', cursor:'pointer', color:'#888', padding:6 }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <div style={{ position:'absolute', top:6, right:6, width:6, height:6, background:'#e74c3c', borderRadius:'50%', border:'1px solid #fff' }} />
        </div>
        <div style={s.userInfo}>
          <strong style={{ display:'block', fontSize:13 }}>{name}</strong>
          <span style={s.signout} onClick={()=>supabase.auth.signOut()}>[→ SIGN OUT]</span>
        </div>
        <div style={s.avatar}>{name.charAt(0)}</div>
      </div>
    </nav>
  );
}
