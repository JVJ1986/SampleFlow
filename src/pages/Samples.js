import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { STAGE_NEXT, BADGE_STYLE } from '../lib/constants';
import { supabase } from '../lib/supabase';
import SampleModal from '../components/SampleModal';

export default function Samples() {
  const { samples, fetchSamples, fetchActivity, userRole, session, activeTab, showToast } = useContext(AppContext);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editData, setEditData]     = useState(null);
  const [search, setSearch]         = useState('');
  const [pushing, setPushing]       = useState(null);

  const q = search.toLowerCase();
  const rows = samples.filter(s => {
    const sm = activeTab === 'ALL' || s.stage === activeTab;
    const tm = !q || [s.sample_id, s.buyer, s.brand, s.sample_type, s.garment_type, s.stage].some(v=>(v||'').toLowerCase().includes(q));
    return sm && tm;
  });

  async function handlePush(sample) {
    if (!userRole?.stages?.includes(sample.stage)) { showToast('⛔ Not authorized for this stage'); return; }
    const next = STAGE_NEXT[sample.stage];
    if (!next) return;
    setPushing(sample.id);
    const { error } = await supabase.from('samples').update({ stage: next }).eq('id', sample.id);
    if (!error) {
      await supabase.from('activity_log').insert({
        sample_id: sample.id,
        message: `${sample.sample_id} moved from ${sample.stage} to ${next}`,
        from_stage: sample.stage,
        to_stage: next,
        done_by: session.user.email,
      });
      await fetchSamples();
      await fetchActivity();
      showToast(`✓ ${sample.sample_id} → ${next}`);
    } else {
      showToast('Error pushing stage: ' + error.message);
    }
    setPushing(null);
  }

  async function handleDelete(sample) {
    if (!window.confirm(`Delete sample ${sample.sample_id}?`)) return;
    const { error } = await supabase.from('samples').delete().eq('id', sample.id);
    if (!error) { await fetchSamples(); showToast('Sample deleted'); }
    else showToast('Error: ' + error.message);
  }

  async function handleSave(form, isEdit) {
    if (isEdit) {
      const { error } = await supabase.from('samples').update({
        buyer: form.buyer, brand: form.brand, sample_type: form.sample_type,
        garment_type: form.garment_type, stage: form.stage, notes: form.notes,
      }).eq('sample_id', form.sample_id);
      if (!error) { await fetchSamples(); showToast('Sample updated'); }
      else showToast('Error: ' + error.message);
    } else {
      const { error } = await supabase.from('samples').insert({
        sample_id: form.sample_id, buyer: form.buyer, brand: form.brand,
        sample_type: form.sample_type, garment_type: form.garment_type,
        stage: form.stage, notes: form.notes, created_by: session.user.email,
      });
      if (!error) {
        await supabase.from('activity_log').insert({ message: `${form.sample_id} created at ${form.stage}`, to_stage: form.stage, done_by: session.user.email });
        await fetchSamples(); await fetchActivity();
        showToast('Sample created');
      } else showToast('Error: ' + error.message);
    }
  }

  const s = {
    toolbar: { display:'flex', alignItems:'center', gap:12, marginBottom:14, flexWrap:'wrap' },
    filter:  { flex:1, minWidth:160, display:'flex', alignItems:'center', gap:8, border:'1px solid #e5e5e5', borderRadius:8, padding:'8px 13px', background:'#fff' },
    input:   { border:'none', outline:'none', fontSize:13, color:'#111', flex:1, background:'transparent' },
    createBtn:{ padding:'9px 16px', background:'#111', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:6, flexShrink:0 },
    card:    { background:'#fff', border:'1px solid #ebebeb', borderRadius:12, overflow:'hidden' },
    th:      { padding:'10px 14px', textAlign:'left', fontSize:10, fontWeight:600, color:'#bbb', letterSpacing:'.07em', textTransform:'uppercase', whiteSpace:'nowrap', borderBottom:'1px solid #f2f2f2' },
    td:      { padding:'12px 14px', borderBottom:'1px solid #f7f7f7', color:'#222', verticalAlign:'middle' },
    badge:   (stage) => ({ display:'inline-block', padding:'3px 10px', borderRadius:6, fontSize:11, fontWeight:600, ...BADGE_STYLE[stage] }),
    pushEnabled: { padding:'5px 13px', borderRadius:6, fontSize:10, fontWeight:700, letterSpacing:'.05em', whiteSpace:'nowrap', border:'1px solid #F5C842', background:'#FFF3DC', color:'#92700A', cursor:'pointer' },
    pushDisabled:{ padding:'5px 13px', borderRadius:6, fontSize:10, fontWeight:500, background:'#f5f5f5', color:'#ccc', border:'1px dashed #e0e0e0', cursor:'not-allowed', pointerEvents:'none' },
    iconBtn: { background:'none', border:'none', cursor:'pointer', padding:'4px 6px', borderRadius:6, color:'#ccc', display:'inline-flex', alignItems:'center' },
  };

  return (
    <div>
      <div style={s.toolbar}>
        <div style={s.filter}>
          <svg width="14" height="14" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input style={s.input} placeholder="Filter style name or code..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        {userRole?.canCreate && (
          <button style={s.createBtn} onClick={()=>{ setEditData(null); setModalOpen(true); }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            Create New Sample
          </button>
        )}
      </div>

      <div style={s.card}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr>
              {['Sample ID','Buyer','Brand','Sample Type','Garment Type','Stage','Action'].map((h,i) => (
                <th key={h} style={{ ...s.th, textAlign: i===6?'right':'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign:'center', padding:44, color:'#bbb', fontSize:13 }}>No samples found.</td></tr>
            ) : rows.map(sample => {
              const next     = STAGE_NEXT[sample.stage];
              const canPush  = userRole?.stages?.includes(sample.stage) && !!next;
              const canEdit  = userRole?.admin || userRole?.stages?.includes(sample.stage);
              const isLoading= pushing === sample.id;
              return (
                <tr key={sample.id} style={{ cursor:'default' }}
                  onMouseEnter={e=>{ Array.from(e.currentTarget.cells).forEach(c=>c.style.background='#fafafa'); }}
                  onMouseLeave={e=>{ Array.from(e.currentTarget.cells).forEach(c=>c.style.background=''); }}>
                  <td style={{ ...s.td, color:'#666', fontWeight:500, fontSize:12 }}>{sample.sample_id}</td>
                  <td style={{ ...s.td, fontWeight:600 }}>{sample.buyer}</td>
                  <td style={s.td}>{sample.brand}</td>
                  <td style={s.td}>{sample.sample_type}</td>
                  <td style={s.td}>{sample.garment_type}</td>
                  <td style={s.td}><span style={s.badge(sample.stage)}>{sample.stage}</span></td>
                  <td style={{ ...s.td, textAlign:'right' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:4, justifyContent:'flex-end' }}>
                      {next ? (
                        <button
                          style={canPush ? s.pushEnabled : s.pushDisabled}
                          onClick={canPush ? ()=>handlePush(sample) : undefined}
                          disabled={isLoading}>
                          {isLoading ? '...' : (canPush ? `PUSH TO ${next.toUpperCase()}` : `Push to ${next}`)}
                        </button>
                      ) : (
                        <span style={{ fontSize:11, color:'#aaa', fontWeight:600 }}>SHIPPED ✓</span>
                      )}
                      {canEdit && <>
                        <button style={s.iconBtn} onClick={()=>{ setEditData(sample); setModalOpen(true); }} title="Edit"
                          onMouseEnter={e=>{ e.currentTarget.style.background='#f0f0f0'; e.currentTarget.style.color='#555'; }}
                          onMouseLeave={e=>{ e.currentTarget.style.background=''; e.currentTarget.style.color='#ccc'; }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button style={{ ...s.iconBtn, color:'#e57373' }} onClick={()=>handleDelete(sample)} title="Delete"
                          onMouseEnter={e=>{ e.currentTarget.style.background='#f0f0f0'; }}
                          onMouseLeave={e=>{ e.currentTarget.style.background=''; }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        </button>
                      </>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <SampleModal open={modalOpen} onClose={()=>setModalOpen(false)} onSave={handleSave} editData={editData} />
    </div>
  );
}
