import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON request bodies
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CarbonGuard AI Backend Proxy',
      timestamp: new Date().toISOString(),
    });
  });

  // POST /api/superflow/execute
  // Secure server-side proxy to SuperFlow webhook:
  // Keeps all secrets (SUPERFLOW_API_KEY, LYZR_API_KEY) hidden from browser
  app.post(['/api/superflow/execute', '/api/workflows/execute'], async (req, res) => {
    try {
      const webhookUrl =
        process.env.SUPERFLOW_WEBHOOK_URL ||
        'https://inference.studio.lyzr.ai/api/workflows/execute';

      const apiKey =
        process.env.SUPERFLOW_API_KEY ||
        process.env.LYZR_API_KEY;

      const workflowId =
        process.env.WORKFLOW_ID ||
        process.env.SUPERFLOW_WORKFLOW_ID ||
        req.body?.workflow_id;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (apiKey) {
        headers['x-api-key'] = apiKey;
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      // If workflow_id is defined, attach it to ensure Lyzr routing
      let outboundBody = req.body;
      if (workflowId) {
        outboundBody = {
          workflow_id: workflowId,
          inputs: req.body,
          ...req.body,
        };
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(outboundBody),
      });

      const responseText = await response.text();
      let responseData: any;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { response: responseText };
      }

      return res.status(response.status).json(responseData);
    } catch (err: any) {
      console.error('SuperFlow Webhook Proxy Error:', err);
      return res.status(502).json({
        error: err.message || 'Failed to communicate with SuperFlow webhook',
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CarbonGuard Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
