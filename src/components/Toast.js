import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position:'fixed', bottom:24, right:24, background:'#111', color:'#fff',
      padding:'11px 20px', borderRadius:9, fontSize:13, zIndex:999,
      boxShadow:'0 4px 16px rgba(0,0,0,.2)', maxWidth:300,
      animation: 'fadeIn .2s ease',
    }}>
      {message}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
