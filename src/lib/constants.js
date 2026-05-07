export const STAGES = ['CAD', 'Cutting', 'Stitching', 'Washing', 'QC', 'Shipped'];

export const STAGE_NEXT = {
  CAD: 'Cutting',
  Cutting: 'Stitching',
  Stitching: 'Washing',
  Washing: 'QC',
  QC: 'Shipped',
  Shipped: null,
};

export const STAGE_COLOR = {
  CAD: '#C89A00',
  Cutting: '#0A7A8F',
  Stitching: '#1A7A40',
  Washing: '#5A30A0',
  QC: '#A01020',
  Shipped: '#0A7055',
};

export const BADGE_STYLE = {
  CAD:       { background: '#FFF8DC', color: '#92700A' },
  Cutting:   { background: '#DCF0F5', color: '#0A6070' },
  Stitching: { background: '#DCF5E8', color: '#0A5A28' },
  Washing:   { background: '#EEE8FF', color: '#4A20A0' },
  QC:        { background: '#FFE8EA', color: '#900818' },
  Shipped:   { background: '#DCFAF0', color: '#085A40' },
};

// Authorization map:
// stages = which stages this user can PUSH forward
// canCreate = can create new samples
export const USER_ROLES = {
  'cad.gmts@aaatextiles.in':      { stages: ['CAD'],                    canCreate: false },
  'qc@aaatextiles.in':            { stages: ['Cutting', 'Stitching'],   canCreate: false },
  'prabhu.aaatextiles@gmail.com': { stages: ['Washing'],                canCreate: false },
  'merchant1@aaatextiles.in':     { stages: ['QC', 'Shipped'],          canCreate: true  },
  'merchant2@aaatextiles.in':     { stages: ['QC', 'Shipped'],          canCreate: true  },
  'merchant3@aaatextiles.in':     { stages: ['QC', 'Shipped'],          canCreate: true  },
  'merchant@aaatextiles.in':      { stages: ['QC', 'Shipped'],          canCreate: true  },
  'murugesh.k@aaatextiles.in':    { stages: ['CAD','Cutting','Stitching','Washing','QC','Shipped'], canCreate: true, admin: true },
};
