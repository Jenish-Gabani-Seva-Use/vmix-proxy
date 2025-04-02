import fetch from 'node-fetch';

export default async (req, res) => {
  const { functionName, input, overlay } = req.query;

  if (!functionName || !input || !overlay) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
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
};