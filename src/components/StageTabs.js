import React, { useContext } from 'react';
import { AppContext } from '../App';
import { STAGES } from '../lib/constants';

export default function StageTabs() {
  const { activeTab, setActiveTab, setPage } = useContext(AppContext);

  function handleTab(s) {
    setActiveTab(s);
    setPage('samples');
  }

  const s = {
    bar: { background:'#fff', borderBottom:'1px solid #e8e8e8', padding:'0 24px', display:'flex', gap:8, alignItems:'center', height:46, overflowX:'auto' },
    btn: (active) => ({
      padding:'5px 16px', borderRadius:99, border:'1px solid', fontSize:12, fontWeight:500,
      cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, transition:'all .15s',
      background: active?'#111':'#fff', color: active?'#fff':'#777',
      borderColor: active?'#111':'#e0e0e0',
    }),
  };

  return (
    <div style={s.bar}>
      {['ALL', ...STAGES].map(tab => (
        <button key={tab} style={s.btn(activeTab===tab)} onClick={()=>handleTab(tab)}>
          {tab === 'ALL' ? 'ALL SAMPLES' : tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
