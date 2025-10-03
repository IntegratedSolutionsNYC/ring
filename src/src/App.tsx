
import { useState } from 'react';
import ProvisionForm from './components/ProvisionForm';
import { createUA } from './jssip';
import { initPlugins } from './plugins';

function PhoneUI({ ua, phone }: { ua: any; phone: any }) {
  // Placeholder for call/messaging UI
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #0001', background: '#fff' }}>
      <h2>Phone: {phone.extension}</h2>
      <div>Status: {ua.isRegistered() ? 'Registered' : 'Not Registered'}</div>
      {/* Add call/messaging UI here */}
      <div style={{ marginTop: 24, color: '#888' }}>UI coming soon...</div>
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
