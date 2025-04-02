const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

// Proxy endpoint for vMix API
app.get('/api/vmix', async (req, res) => {
  const { functionName, input, overlay } = req.query;

  if (!functionName || !input || !overlay) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    // Forward request to local vMix API
    const response = await fetch(
      `http://192.168.1.3:8088/api/?Function=OverlayInput${overlay}${functionName}&Input=${input}`
    );
    
    if (!response.ok) throw new Error("vMix API request failed");
    
    const text = await response.text();
    res.status(200).send(text);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to connect to vMix" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));