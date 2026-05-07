import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const STAGES = ['CAD','Cutting','Stitching','Washing','QC','Shipped'];

export const SearchContext = React.createContext({ q: '', setQ: () => {} });
export const StageTabContext = React.createContext({ tab: 'ALL', setTab: () => {} });

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ]     = useState('');
  const [tab, setTab] = useState('ALL');

  const page = location.pathname === '/' ? 'dashboard'
             : location.pathname === '/samples' ? 'samples'
             : 'reports';

  const handleTabClick = (s) => {
    setTab(s);
    if (page !== 'samples') navigate('/samples');
  };

  const handleSearch = (v) => {
    setQ(v);
    if (page !== 'samples') navigate('/samples');
  };

  const name   = user?.user_metadata?.name || user?.email?.split('@')[0] || '?';
  const avatar = name.charAt(0).toUpperCase();

  return (
    <SearchContext.Provider value={{ q, setQ }}>
      <StageTabContext.Provider value={{ tab, setTab }}>
        <nav className="topnav">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <div className="logo-box">S</div>
            <span>SampleFlow MS</span>
          </div>
          <div className="nav-links">
            <span className={`nav-link ${page==='dashboard'?'active':''}`} onClick={() => navigate('/')}>Dashboard</span>
            <span className={`nav-link ${page==='samples'?'active':''}`} onClick={() => navigate('/samples')}>Samples</span>
            <span className={`nav-link ${page==='reports'?'active':''}`} onClick={() => navigate('/reports')}>Reports</span>
          </div>
          <div className="nav-spacer" />
          <div className="nav-search">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Search..."
              value={q}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
          <div className="nav-right">
            <div className="nav-bell">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <div className="bell-dot" />
            </div>
            <div className="nav-user-info">
              <strong>{name}</strong>
              <span onClick={signOut}>[→ SIGN OUT]</span>
            </div>
            <div className="nav-avatar">{avatar}</div>
          </div>
        </nav>

        <div className="stage-bar">
          {['ALL', ...STAGES].map(s => (
            <button
              key={s}
              className={`stage-btn ${tab===s?'active':''}`}
              onClick={() => handleTabClick(s)}
            >
              {s === 'ALL' ? 'ALL SAMPLES' : s.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="main">
          <Outlet />
        </div>
      </StageTabContext.Provider>
    </SearchContext.Provider>
  );
}
