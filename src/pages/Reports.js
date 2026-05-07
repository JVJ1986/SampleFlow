import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { STAGES, STAGE_COLOR, STAGE_NEXT, BADGE_STYLE } from '../lib/constants';

export default function Reports() {
  const { samples } = useContext(AppContext);
  const [activeReport, setActiveReport] = useState(null);

  const counts = {};
  STAGES.forEach(s => { counts[s] = samples.filter(x=>x.stage===s).length; });
  const total = samples.length;

  function exportCSV(type) {
    let headers = [], rows = [];
    if (type === 'stage') {
      headers = ['Stage','Count','Percentage'];
      STAGES.forEach(s => { const c=counts[s]; rows.push([s, c, total?Math.round((c/total)*100)+'%':'0%']); });
    } else if (type === 'buyer') {
      headers = ['Buyer','Total Samples','Stages'];
      const buyers = [...new Set(samples.map(s=>s.buyer))];
      buyers.forEach(b => { const bs=samples.filter(s=>s.buyer===b); rows.push([b, bs.length, [...new Set(bs.map(s=>s.stage))].join(' | ')]); });
    } else {
      headers = ['Sample ID','Buyer','Brand','Sample Type','Garment Type','Stage','Notes','Created At'];
      samples.forEach(s => rows.push([s.sample_id, s.buyer, s.brand||'', s.sample_type, s.garment_type, s.stage, s.notes||'', new Date(s.created_at).toLocaleDateString()]));
    }
    const csv = [headers, ...rows].map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv'}));
    a.download = `sampleflow_${type}_report.csv`;
    a.click();
  }

  const s = {
    grid:     { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14, marginBottom:20 },
    rcard:    { background:'#fff', border:'1px solid #ebebeb', borderRadius:12, padding:'18px 20px', cursor:'pointer', transition:'box-shadow .15s' },
    twrap:    { background:'#fff', border:'1px solid #ebebeb', borderRadius:12, overflow:'hidden', marginBottom:16 },
    theader:  { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 18px', borderBottom:'1px solid #f2f2f2' },
    expbtn:   { padding:'7px 14px', background:'#111', color:'#fff', border:'none', borderRadius:7, fontSize:12, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:6 },
    th:       { padding:'10px 14px', textAlign:'left', fontSize:10, fontWeight:600, color:'#bbb', letterSpacing:'.07em', textTransform:'uppercase', borderBottom:'1px solid #f2f2f2' },
    td:       { padding:'12px 14px', borderBottom:'1px solid #f7f7f7', fontSize:13 },
    badge:    (stage) => ({ display:'inline-block', padding:'3px 10px', borderRadius:6, fontSize:11, fontWeight:600, ...BADGE_STYLE[stage] }),
  };

  const reports = [
    { key:'stage',    title:'Stage-wise Summary',  desc:'Count of samples at each production stage',  icon:'⬛', iconBg:'#f0f0f0' },
    { key:'buyer',    title:'Buyer-wise Report',    desc:'Samples grouped by buyer / brand',            icon:'👤', iconBg:'#EEF6FF' },
    { key:'pipeline', title:'Pipeline Flow',        desc:'Full sample movement across all stages',      icon:'📈', iconBg:'#F0FFF4' },
    { key:'all',      title:'Full Sample List',     desc:'Export all sample records as CSV',            icon:'📄', iconBg:'#FFF8E8' },
  ];

  return (
    <div>
      <div style={{ fontSize:18, fontWeight:600, marginBottom:20 }}>Reports</div>
      <div style={s.grid}>
        {reports.map(r => (
          <div key={r.key} style={s.rcard}
            onClick={()=>setActiveReport(activeReport===r.key?null:r.key)}
            onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,.08)'; e.currentTarget.style.borderColor='#ccc'; }}
            onMouseLeave={e=>{ e.currentTarget.style.boxShadow=''; e.currentTarget.style.borderColor='#ebebeb'; }}>
            <div style={{ width:38, height:38, borderRadius:9, background:r.iconBg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, fontSize:18 }}>{r.icon}</div>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>{r.title}</div>
            <div style={{ fontSize:12, color:'#888' }}>{r.desc}</div>
          </div>
        ))}
      </div>

      {activeReport === 'stage' && (
        <div style={s.twrap}>
          <div style={s.theader}>
            <h3 style={{ fontSize:14, fontWeight:600 }}>Stage-wise Summary</h3>
            <button style={s.expbtn} onClick={()=>exportCSV('stage')}>↓ Export CSV</button>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr><th style={s.th}>Stage</th><th style={s.th}>Count</th><th style={s.th}>% of Total</th><th style={s.th}>Progress</th></tr></thead>
            <tbody>
              {STAGES.map(st => {
                const pct = total ? Math.round((counts[st]/total)*100) : 0;
                return (
                  <tr key={st}>
                    <td style={s.td}><span style={s.badge(st)}>{st}</span></td>
                    <td style={{ ...s.td, fontWeight:600 }}>{counts[st]||0}</td>
                    <td style={s.td}>{pct}%</td>
                    <td style={s.td}>
                      <div style={{ background:'#f0f0f0', borderRadius:99, height:6, width:140, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:pct+'%', background:STAGE_COLOR[st], borderRadius:99 }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeReport === 'buyer' && (
        <div style={s.twrap}>
          <div style={s.theader}>
            <h3 style={{ fontSize:14, fontWeight:600 }}>Buyer-wise Report</h3>
            <button style={s.expbtn} onClick={()=>exportCSV('buyer')}>↓ Export CSV</button>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr><th style={s.th}>Buyer</th><th style={s.th}>Total Samples</th><th style={s.th}>Stages Active</th></tr></thead>
            <tbody>
              {[...new Set(samples.map(s=>s.buyer))].map(buyer => {
                const bs = samples.filter(s=>s.buyer===buyer);
                const stgs = [...new Set(bs.map(s=>s.stage))];
                return (
                  <tr key={buyer}>
                    <td style={{ ...s.td, fontWeight:600 }}>{buyer}</td>
                    <td style={s.td}>{bs.length}</td>
                    <td style={s.td}>{stgs.map(st=><span key={st} style={{ ...s.badge(st), marginRight:4 }}>{st}</span>)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeReport === 'pipeline' && (
        <div style={s.twrap}>
          <div style={s.theader}>
            <h3 style={{ fontSize:14, fontWeight:600 }}>Pipeline Flow</h3>
            <button style={s.expbtn} onClick={()=>exportCSV('all')}>↓ Export CSV</button>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr><th style={s.th}>Sample ID</th><th style={s.th}>Buyer</th><th style={s.th}>Brand</th><th style={s.th}>Garment</th><th style={s.th}>Current Stage</th><th style={s.th}>Next Stage</th></tr></thead>
            <tbody>
              {samples.map(sm => (
                <tr key={sm.id}>
                  <td style={{ ...s.td, color:'#666', fontWeight:500 }}>{sm.sample_id}</td>
                  <td style={{ ...s.td, fontWeight:600 }}>{sm.buyer}</td>
                  <td style={s.td}>{sm.brand}</td>
                  <td style={s.td}>{sm.garment_type}</td>
                  <td style={s.td}><span style={s.badge(sm.stage)}>{sm.stage}</span></td>
                  <td style={{ ...s.td, color:'#888' }}>{STAGE_NEXT[sm.stage]||'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeReport === 'all' && (
        <div style={s.twrap}>
          <div style={s.theader}>
            <h3 style={{ fontSize:14, fontWeight:600 }}>Full Sample List</h3>
            <button style={s.expbtn} onClick={()=>exportCSV('all')}>↓ Export CSV</button>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr><th style={s.th}>ID</th><th style={s.th}>Buyer</th><th style={s.th}>Brand</th><th style={s.th}>Type</th><th style={s.th}>Garment</th><th style={s.th}>Stage</th><th style={s.th}>Notes</th></tr></thead>
            <tbody>
              {samples.map(sm => (
                <tr key={sm.id}>
                  <td style={{ ...s.td, color:'#666', fontWeight:500, fontSize:12 }}>{sm.sample_id}</td>
                  <td style={{ ...s.td, fontWeight:600 }}>{sm.buyer}</td>
                  <td style={s.td}>{sm.brand}</td>
                  <td style={s.td}>{sm.sample_type}</td>
                  <td style={s.td}>{sm.garment_type}</td>
                  <td style={s.td}><span style={s.badge(sm.stage)}>{sm.stage}</span></td>
                  <td style={{ ...s.td, color:'#888', fontSize:12 }}>{sm.notes||'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
