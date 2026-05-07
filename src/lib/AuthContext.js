import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Role-based authorization map
export const ROLE_PERMISSIONS = {
  'cad.gmts@aaatextiles.in':       { stages: ['CAD'],                                               canCreate: false },
  'qc@aaatextiles.in':             { stages: ['Cutting', 'Stitching'],                              canCreate: false },
  'prabhu.aaatextiles@gmail.com':  { stages: ['Washing'],                                           canCreate: false },
  'merchant1@aaatextiles.in':      { stages: ['QC', 'Shipped'],                                     canCreate: true  },
  'merchant2@aaatextiles.in':      { stages: ['QC', 'Shipped'],                                     canCreate: true  },
  'merchant3@aaatextiles.in':      { stages: ['QC', 'Shipped'],                                     canCreate: true  },
  'merchant@aaatextiles.in':       { stages: ['QC', 'Shipped'],                                     canCreate: true  },
  'murugesh.k@aaatextiles.in':     { stages: ['CAD','Cutting','Stitching','Washing','QC','Shipped'], canCreate: true, admin: true },
};

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [perms, setPerms]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setPerms(ROLE_PERMISSIONS[session.user.email] || { stages: [], canCreate: false });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setPerms(ROLE_PERMISSIONS[session.user.email] || { stages: [], canCreate: false });
      } else {
        setUser(null);
        setPerms(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const allowed = Object.keys(ROLE_PERMISSIONS);
    if (!allowed.includes(email.toLowerCase())) {
      return { error: { message: 'This email is not authorized to access SampleFlow MS.' } };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, perms, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
