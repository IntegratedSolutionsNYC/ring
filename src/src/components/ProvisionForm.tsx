import React, { useState } from 'react';

interface Props {
  onProvisioned: (phone: any) => void;
}

export default function ProvisionForm({ onProvisioned }: Props) {
  const [server, setServer] = useState('');
  const [extension, setExtension] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ server, extension, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Provisioning failed');
      onProvisioned(data.phone);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '2rem auto', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #0001', background: '#fff' }}>
      <h2>Provision Phone</h2>
      <input placeholder="SIP WebSocket Server" value={server} onChange={e => setServer(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
      <input placeholder="Extension" value={extension} onChange={e => setExtension(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
      <button type="submit" disabled={loading} style={{ width: '100%', padding: 8, borderRadius: 4, background: '#007bff', color: '#fff', border: 'none' }}>{loading ? 'Provisioning...' : 'Provision'}</button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
}
