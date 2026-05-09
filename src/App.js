import React, { useState, useEffect, createContext } from 'react';
import { supabase } from './lib/supabase';
import { USER_ROLES } from './lib/constants';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Samples from './pages/Samples';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import StageTabs from './components/StageTabs';
import Toast from './components/Toast';

export const AppContext = createContext(null);

export default function App() {
  const [session, setSession]         = useState(null);
  const [userRole, setUserRole]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState('dashboard');
  const [activeTab, setActiveTab]     = useState('ALL');
  const [toast, setToast]             = useState('');
  const [samples, setSamples]         = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        const role = USER_ROLES[session.user.email?.toLowerCase()];
        setUserRole(role || null);
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        const role = USER_ROLES[session.user.email?.toLowerCase()];
        setUserRole(role || null);
      } else {
        setSession(null);
        setUserRole(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    fetchSamples();
    fetchActivity();
  }, [session]);

  async function fetchSamples() {
    try {
      const { data, error } = await supabase
        .from('samples')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setSamples(data);
    } catch (e) {
      console.log('fetchSamples error:', e);
    }
  }

  async function fetchActivity() {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error && data) setActivityLog(data);
    } catch (e) {
      console.log('fetchActivity error:', e);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function handleLogin(newSession) {
    setSession(newSession);
    const email = newSession?.user?.email?.toLowerCase();
    const role = USER_ROLES[email];
    setUserRole(role || { stages: [], canCreate: false });
  }

  function handleSignOut() {
    supabase.auth.signOut().catch(() => {});
    setSession(null);
    setUserRole(null);
    setSamples([]);
    setActivityLog([]);
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f4f5f7' }}>
      <div style={{ fontSize:14, color:'#888' }}>Loading SampleFlow MS...</div>
    </div>
  );

  if (!session) return <Login onLogin={handleLogin} />;

  if (!userRole) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f4f5f7', gap:12 }}>
      <div style={{ fontSize:16, fontWeight:600 }}>Access Denied</div>
      <div style={{ fontSize:13, color:'#888' }}>Your email is not authorized for SampleFlow MS.</div>
      <button onClick={handleSignOut} style={{ marginTop:8, padding:'8px 20px', background:'#111', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:13 }}>Sign Out</button>
    </div>
  );

  const ctx = {
    session, userRole, samples, setSamples,
    activityLog, setActivityLog,
    fetchSamples, fetchActivity, showToast,
    page, setPage, activeTab, setActiveTab,
    handleSignOut,
  };

  return (
    <AppContext.Provider value={ctx}>
      <Navbar />
      <StageTabs />
      <div style={{ padding:'20px 24px', minHeight:'calc(100vh - 98px)' }}>
        {page === 'dashboard' && <Dashboard />}
        {page === 'samples'   && <Samples />}
        {page === 'reports'   && <Reports />}
      </div>
      <Toast message={toast} />
    </AppContext.Provider>
  );
}
