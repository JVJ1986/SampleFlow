import React, { useContext } from 'react';
import { AppContext } from '../App';
import { STAGES, STAGE_COLOR, STAGE_NEXT } from '../lib/constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const { samples, activityLog, userRole, setPage, showToast } = useContext(AppContext);

  const counts = {};
  STAGES.forEach(s => { counts[s] = samples.filter(x=>x.stage===s).length; });
  const total   = samples.length;
  const shipped = counts['Shipped'] || 0;
  const inProg  = total - shipped;
  const techPass= counts['QC'] || 0;
  const urgent  = (counts['CAD']||0) + (counts['Cutting']||0);

  const chartData = STAGES.map(s => ({ name:s, count:counts[s]||0, color:STAGE_COLOR[s] }));

  const s = {
    metrics: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 },
    mc:      { background:'#fff', border:'1px solid #ebebeb', borderRadius:12, padding:'18px 20px' },
    mclabel: { fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.07em', color:'#aaa', marginBottom:10 },
    mcrow:   { display:'flex', alignItems:'center', justifyContent:'space-between' },
    mcval:   { fontSize:36, fontWeight:600, color:'#111', lineHeight:1 },
    mcicon:  (bg) => ({ width:36, height:36, borderRadius:8, background:bg, display:'flex', alignItems:'center', justifyContent:'center' }),
    mcsub:   (color) => ({ fontSize:12, marginTop:8, fontWeight:500, color }),
    dashBody:{ display:'grid', gridTemplateColumns:'1fr 280px', gap:16 },
    pipeline:{ background:'#fff', border:'1px solid #ebebeb', borderRadius:12, padding:'20px 22px' },
    actCard: { background:'#111', borderRadius:12, padding:22, display:'flex', flexDirection:'column' },
    acBtn:   (variant) => ({
      width:'100%', padding:'13px 16px', borderRadius:9, fontSize:13, fontWeight:500,
      cursor:'pointer', display:'flex', alignItems:'center', gap:8, border:'none',
      marginBottom:10, background: variant==='white'?'#fff':'#1f1f1f',
      color: variant==='white'?'#111':'#fff',
      border: variant==='dark'?'1px solid #333':'none',
    }),
    bottom:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:16 },
    bcard:   { background:'#fff', border:'1px solid #ebebeb', borderRadius:12, padding:'18px 20px' },
    actItem: { display:'flex', alignItems:'flex-start', gap:10, padding:'7px 0', borderBottom:'1px solid #f5f5f5' },
    ssrow:   { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #f5f5f5' },
  };

  return (
    <div>
      <div style={s.metrics}>
        {[
          { label:'Total Samples', val:total, sub:'+'+Math.max(1,Math.round(total*.12))+' from last week', subColor:'#16a34a', iconBg:'#f0f0f0', iconColor:'#555', icon:<svg width="18" height="18" fill="none" stroke="#555" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
          { label:'In Progress',    val:inProg,   sub:'Action required',         subColor:'#d97706', iconBg:'#FFF8E8', icon:<svg width="18" height="18" fill="none" stroke="#C89A00" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
          { label:'Technical Pass', val:techPass, sub:techPass>0?'Pending QC':'All clear', subColor:'#aaa', iconBg:'#EEF6FF', icon:<svg width="18" height="18" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
          { label:'Urgent Priority',val:urgent,   sub:urgent>0?'Needs attention':'', subColor:'#dc2626', iconBg:'#FFF0F0', icon:<svg width="18" height="18" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
        ].map(m => (
          <div key={m.label} style={s.mc}>
            <div style={s.mclabel}>{m.label}</div>
            <div style={s.mcrow}>
              <div style={s.mcval}>{m.val}</div>
              <div style={s.mcicon(m.iconBg)}>{m.icon}</div>
            </div>
            <div style={s.mcsub(m.subColor)}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={s.dashBody}>
        <div style={s.pipeline}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <div style={{ fontSize:14, fontWeight:600 }}>Production Pipeline</div>
            <div style={{ fontSize:12, color:'#3b82f6', cursor:'pointer', fontWeight:500 }} onClick={()=>setPage('reports')}>View Report</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top:4, right:4, left:-20, bottom:4 }}>
              <XAxis dataKey="name" tick={{ fontSize:11, fill:'#aaa' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#aaa' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize:12, borderRadius:8, border:'1px solid #eee' }} cursor={{ fill:'#f5f5f5' }} />
              <Bar dataKey="count" radius={[6,6,0,0]}>
                {chartData.map((entry,i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={s.actCard}>
          <div style={{ fontSize:15, fontWeight:600, color:'#fff', marginBottom:4 }}>Production Actions</div>
          <div style={{ fontSize:11, color:'#888', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:20 }}>Management Suite</div>
          {userRole?.canCreate && (
            <button style={s.acBtn('white')} onClick={()=>setPage('samples')}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
              New Sample Entry
            </button>
          )}
          <button style={s.acBtn('dark')} onClick={()=>setPage('reports')}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Generate Export
          </button>
        </div>
      </div>

      <div style={s.bottom}>
        <div style={s.bcard}>
          <h3 style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Recent Activity</h3>
          {activityLog.length === 0 && <div style={{ color:'#bbb', fontSize:13 }}>No activity yet.</div>}
          {activityLog.slice(0,6).map((a,i) => (
            <div key={i} style={{ ...s.actItem, borderBottom: i===Math.min(5,activityLog.length-1)?'none':'1px solid #f5f5f5' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:STAGE_COLOR[a.to_stage]||'#aaa', marginTop:4, flexShrink:0 }} />
              <div>
                <div style={{ fontSize:12, color:'#444', lineHeight:1.5 }}><strong style={{ color:'#111', fontWeight:500 }}>{a.message}</strong></div>
                <div style={{ fontSize:11, color:'#bbb', marginTop:1 }}>{new Date(a.created_at).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={s.bcard}>
          <h3 style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Stage Breakdown</h3>
          {STAGES.map((stage,i) => {
            const pct = total ? Math.round((counts[stage]/total)*100) : 0;
            return (
              <div key={stage} style={{ ...s.ssrow, borderBottom: i===STAGES.length-1?'none':'1px solid #f5f5f5' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:STAGE_COLOR[stage] }} />
                  <span style={{ fontSize:13, fontWeight:500, color:'#333' }}>{stage}</span>
                </div>
                <div style={{ flex:1, margin:'0 12px', background:'#f0f0f0', borderRadius:99, height:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:pct+'%', background:STAGE_COLOR[stage], borderRadius:99 }} />
                </div>
                <span style={{ fontSize:13, fontWeight:600 }}>{counts[stage]||0}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
