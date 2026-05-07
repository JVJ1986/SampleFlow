import React, { useState, useEffect } from 'react';

const SAMPLE_TYPES = ['PP Sample','Proto Sample','Fit Sample','Size Set','Salesman Sample','TOP Sample'];
const GARMENT_TYPES = ['Bottom','Top','Dress','Jacket','Shirt','Suit','Other'];
const STAGES = ['CAD','Cutting','Stitching','Washing','QC','Shipped'];

export default function SampleModal({ open, onClose, onSave, editData }) {
  const [form, setForm] = useState({ sample_id:'', buyer:'', brand:'', sample_type:'PP Sample', garment_type:'Bottom', stage:'CAD', notes:'' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({ sample_id:editData.sample_id, buyer:editData.buyer, brand:editData.brand||'', sample_type:editData.sample_type, garment_type:editData.garment_type, stage:editData.stage, notes:editData.notes||'' });
    } else {
      setForm({ sample_id: String(40139470 + Math.floor(Math.random()*1000)), buyer:'', brand:'', sample_type:'PP Sample', garment_type:'Bottom', stage:'CAD', notes:'' });
    }
  }, [editData, open]);

  if (!open) return null;

  const s = {
    overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' },
    modal:   { background:'#fff', borderRadius:14, padding:28, width:490, maxWidth:'95vw', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 12px 48px rgba(0,0,0,.18)' },
    grid:    { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
    label:   { display:'block', fontSize:12, fontWeight:500, color:'#666', marginBottom:5 },
    input:   { width:'100%', padding:'8px 12px', border:'1px solid #e0e0e0', borderRadius:8, fontSize:13, color:'#111', outline:'none' },
    footer:  { display:'flex', justifyContent:'flex-end', gap:10, marginTop:20 },
    cancel:  { padding:'8px 18px', border:'1px solid #e0e0e0', borderRadius:8, background:'#fff', fontSize:13, cursor:'pointer', color:'#666' },
    save:    { padding:'8px 18px', border:'none', borderRadius:8, background:'#111', color:'#fff', fontSize:13, cursor:'pointer', fontWeight:500 },
  };

  function set(k,v) { setForm(f=>({...f,[k]:v})); }

  async function handleSave() {
    if (!form.sample_id || !form.buyer) { alert('Sample ID and Buyer are required.'); return; }
    setSaving(true);
    await onSave(form, !!editData);
    setSaving(false);
    onClose();
  }

  return (
    <div style={s.overlay} onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={s.modal}>
        <h3 style={{ fontSize:16, fontWeight:600, marginBottom:20 }}>{editData ? 'Edit Sample' : 'Create New Sample'}</h3>
        <div style={s.grid}>
          <div>
            <label style={s.label}>Sample ID</label>
            <input style={s.input} value={form.sample_id} onChange={e=>set('sample_id',e.target.value)} readOnly={!!editData} />
          </div>
          <div>
            <label style={s.label}>Buyer</label>
            <input style={s.input} placeholder="e.g. Myntra" value={form.buyer} onChange={e=>set('buyer',e.target.value)} />
          </div>
          <div>
            <label style={s.label}>Brand</label>
            <input style={s.input} placeholder="e.g. Roadster" value={form.brand} onChange={e=>set('brand',e.target.value)} />
          </div>
          <div>
            <label style={s.label}>Sample Type</label>
            <select style={s.input} value={form.sample_type} onChange={e=>set('sample_type',e.target.value)}>
              {SAMPLE_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Garment Type</label>
            <select style={s.input} value={form.garment_type} onChange={e=>set('garment_type',e.target.value)}>
              {GARMENT_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Stage</label>
            <select style={s.input} value={form.stage} onChange={e=>set('stage',e.target.value)}>
              {STAGES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={s.label}>Notes</label>
            <textarea style={{...s.input, resize:'vertical', height:60}} value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Fabric, colorway, remarks..." />
          </div>
        </div>
        <div style={s.footer}>
          <button style={s.cancel} onClick={onClose}>Cancel</button>
          <button style={s.save} onClick={handleSave} disabled={saving}>{saving?'Saving...':'Save Sample'}</button>
        </div>
      </div>
    </div>
  );
}
