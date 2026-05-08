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
  const [session, setSession]       = useState(null);
  const [userRole, setUserRole]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState('dashboard');
  const [activeTab, setActiveTab]   = useState('ALL');
  const [toast, setToast]           = useState('');
  const [samples, setSamples]       = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) {
        setUserRole(USER_ROLES[session.user.email.toLowerCase()] || null);
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.email) {
        setUserRole(USER_ROLES[session.user.email.toLowerCase()] || null);
      } else {
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
    const { data, error } = await supabase
      .from('samples')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setSamples(data);
  }

  async function fetchActivity() {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (!error && data) setActivityLog(data);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7' }}>
      <div style={{ fontSize: 14, color: '#888' }}>Loading SampleFlow MS...</div>
    </div>
  );

  if (!session) return <Login onLogin={(s) => setSession(s)} />;

  if (!userRole) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7', gap: 12 }}>
      <div style={{ fontSize: 16, fontWeight: 600 }}>Access Denied</div>
      <div style={{ fontSize: 13, color: '#888' }}>Your email is not authorized for SampleFlow MS.</div>
      <button onClick={() => supabase.auth.signOut()} style={{ marginTop: 8, padding: '8px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Sign Out</button>
    </div>
  );

  const ctx = { session, userRole, samples, setSamples, activityLog, setActivityLog, fetchSamples, fetchActivity, showToast, page, setPage, activeTab, setActiveTab };

  return (
    <AppContext.Provider value={ctx}>
      <Navbar />
      <StageTabs />
      <div style={{ padding: '20px 24px', minHeight: 'calc(100vh - 98px)' }}>
        {page === 'dashboard' && <Dashboard />}
        {page === 'samples'   && <Samples />}
        {page === 'reports'   && <Reports />}
      </div>
      <Toast message={toast} />
    </AppContext.Provider>
  );
}
