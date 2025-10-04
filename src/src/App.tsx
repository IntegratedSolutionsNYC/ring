
import { useState } from 'react';
import ProvisionForm from './components/ProvisionForm';
import { createUA } from './jssip';
import { initPlugins } from './plugins';


import { useEffect, useRef } from 'react';

function PhoneUI({ ua, phone }: { ua: any; phone: any }) {
  const [callState, setCallState] = useState<any>({ status: 'idle' });
  const [dialTo, setDialTo] = useState('');
  const dialInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ua) return;
    ua.onCallState(setCallState);
    setCallState({ status: ua.isRegistered() ? 'idle' : 'not-registered' });
    // Focus dial input on load
    if (dialInputRef.current) dialInputRef.current.focus();
  }, [ua]);

  const handleDial = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (dialTo) ua.call(`sip:${dialTo}@${phone.server.replace(/^wss?:\/\//, '')}`);
  };
  const handleAnswer = () => ua.answer();
  const handleHangup = () => ua.hangup();

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #0001', background: '#fff' }}>
      <h2>Phone: {phone.extension}</h2>
      <div>Status: {ua.isRegistered() ? 'Registered' : 'Not Registered'}</div>
      <div>Call State: {callState.status}</div>

      {callState.status === 'idle' || callState.status === 'not-registered' || callState.status === 'registrationFailed' ? (
        <form onSubmit={handleDial} style={{ marginTop: 24 }}>
          <input
            ref={dialInputRef}
            placeholder="Enter extension or SIP URI"
            value={dialTo}
            onChange={e => setDialTo(e.target.value)}
            style={{ width: '100%', marginBottom: 12 }}
            disabled={!ua.isRegistered()}
          />
          <button type="submit" style={{ width: '100%' }} disabled={!ua.isRegistered() || !dialTo}>Call</button>
        </form>
      ) : null}

      {callState.status === 'incoming' && (
        <div style={{ marginTop: 24 }}>
          <div>Incoming call...</div>
          <button onClick={handleAnswer} style={{ marginRight: 8 }}>Answer</button>
          <button onClick={handleHangup}>Reject</button>
        </div>
      )}

      {(callState.status === 'calling' || callState.status === 'in-call') && (
        <div style={{ marginTop: 24 }}>
          <div>{callState.status === 'calling' ? 'Calling...' : 'In Call'}</div>
          <button onClick={handleHangup} style={{ marginTop: 12 }}>Hang Up</button>
        </div>
      )}

      {callState.status === 'registrationFailed' && (
        <div style={{ color: 'red', marginTop: 12 }}>Registration failed: {callState.error}</div>
      )}
    </div>
  );
}

function App() {

  const [phone, setPhone] = useState<any>(null);
  const [ua, setUA] = useState<any>(null);

  const handleProvisioned = (phone: any) => {
    const ua = createUA(phone);
    ua.start();
    setUA(ua);
    setPhone(phone);
    initPlugins(ua);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #fff 100%)' }}>
      {!phone ? <ProvisionForm onProvisioned={handleProvisioned} /> : <PhoneUI ua={ua} phone={phone} />}
    </div>
  );
}

export default App;
