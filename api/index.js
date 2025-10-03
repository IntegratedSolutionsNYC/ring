// Minimal Express backend for provisioning
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Provisioning endpoint
app.post('/provision', (req, res) => {
  const { server, extension, password } = req.body;
  if (!server || !extension || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // Simulate login and return phone config (in real use, validate with SIP server)
  res.json({
    phone: {
      server,
      extension,
      password,
      status: 'logged_in',
      // Add more fields as needed
    }
  });
});

app.listen(PORT, () => {
  console.log(`Provisioning API running on port ${PORT}`);
});
