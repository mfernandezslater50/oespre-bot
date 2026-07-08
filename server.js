/**
 * OESPRE 2.0 — Proxy del Asistente IA  (versión sin dependencias)
 *
 * Recibe preguntas desde la app OESPRE y las responde usando Claude (Haiku 4.5),
 * con el manual de usuario como base de conocimiento.
 *
 * Usa SOLO módulos nativos de Node (http, https, fs) → corre en Node 16+ y en
 * CentOS 7 sin necesidad de `npm install`. La API key vive solo aquí.
 *
 * Variables de entorno:
 *   ANTHROPIC_API_KEY       — tu clave de Anthropic (sk-ant-...)   [OBLIGATORIA]
 *   OESPRE_ASSISTANT_TOKEN  — secreto compartido opcional (déjalo vacío para probar)
 *   PORT                    — puerto de escucha (por defecto 8787)
 *
 * Arrancar:  ANTHROPIC_API_KEY=sk-ant-xxx PORT=8787 node server.js
 */
'use strict';
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8787;
const API_KEY = process.env.ANTHROPIC_API_KEY || '';
const SHARED_TOKEN = process.env.OESPRE_ASSISTANT_TOKEN || '';
const MODEL = 'claude-haiku-4-5';

if (!API_KEY) {
  console.error('[asistente] FALTA ANTHROPIC_API_KEY. Arranca con: ANTHROPIC_API_KEY=sk-ant-xxx node server.js');
  process.exit(1);
}

const KNOWLEDGE_BASE = fs.readFileSync(path.join(__dirname, 'knowledge-base.md'), 'utf8');

const SYSTEM_PROMPT = `Eres el asistente de ayuda de OESPRE 2.0, un sistema de presupuestación de obras de construcción. Tu única función es responder preguntas sobre cómo usar OESPRE, basándote exclusivamente en el manual que aparece a continuación.

Reglas:
- Responde siempre en español, de forma clara y concisa.
- Usa solo la información del manual. Si la respuesta no está en el manual, dilo honestamente y sugiere contactar a soporte@oespre.cl. No inventes funciones que no existen.
- Da instrucciones paso a paso cuando el usuario pregunte "cómo" hacer algo.
- Si la pregunta no tiene relación con OESPRE, indica amablemente que solo puedes ayudar con el uso del sistema OESPRE.
- Sé breve: la mayoría de las respuestas deben caber en uno o dos párrafos cortos.

=== MANUAL DE USUARIO OESPRE 2.0 ===

${KNOWLEDGE_BASE}

=== FIN DEL MANUAL ===`;

// ── Rate limiting simple en memoria (por IP) ──────────────────────────────────
const RATE_WINDOW_MS = 60000, RATE_MAX = 20;
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const e = hits.get(ip) || { count: 0, reset: now + RATE_WINDOW_MS };
  if (now > e.reset) { e.count = 0; e.reset = now + RATE_WINDOW_MS; }
  e.count += 1; hits.set(ip, e);
  return e.count > RATE_MAX;
}

// ── Llamada a la API de Anthropic vía https nativo ────────────────────────────
function askClaude(messages) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages,
    });
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(payload),
      },
    }, (r) => {
      let data = '';
      r.on('data', c => data += c);
      r.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (r.statusCode !== 200) return reject(new Error(j?.error?.message || 'Error de la API'));
          const reply = (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
          resolve(reply || 'No pude generar una respuesta.');
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(25000, () => { req.destroy(new Error('timeout')); });
    req.write(payload);
    req.end();
  });
}

// ── Servidor HTTP nativo ──────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-oespre-token');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  const send = (code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };

  if (req.method === 'GET' && (req.url === '/' || req.url === '/health')) {
    return send(200, { ok: true, service: 'oespre-assistant', model: MODEL });
  }

  if (req.method === 'POST' && (req.url === '/chat' || req.url === '/')) {
    if (SHARED_TOKEN && req.headers['x-oespre-token'] !== SHARED_TOKEN) return send(401, { error: 'No autorizado' });
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'x';
    if (rateLimited(ip)) return send(429, { error: 'Demasiadas consultas. Espera un momento e intenta de nuevo.' });

    let body = '';
    req.on('data', c => { body += c; if (body.length > 262144) req.destroy(); });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const incoming = Array.isArray(parsed.messages) ? parsed.messages : [];
        const messages = incoming
          .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
          .slice(-12)
          .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));
        if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
          return send(400, { error: 'Falta la pregunta del usuario.' });
        }
        const reply = await askClaude(messages);
        send(200, { reply });
      } catch (e) {
        console.error('[asistente] error:', e.message);
        send(500, { error: 'No fue posible procesar la consulta en este momento.' });
      }
    });
    return;
  }

  send(404, { error: 'Ruta no encontrada' });
});

server.listen(PORT, () => {
  console.log(`[asistente] OESPRE Assistant escuchando en puerto ${PORT} (modelo: ${MODEL})`);
});
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  
  // Aquí responde leyendo knowledge-base.md
  const respuesta = Recibí: ${message}. El bot está conectado y leyendo el manual.;
  
  res.json({ reply: respuesta });
});
