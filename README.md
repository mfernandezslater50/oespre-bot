# OESPRE 2.0 — Asistente IA (proxy)

Servicio que responde preguntas de uso de OESPRE usando Claude Haiku 4.5, con el
manual como base de conocimiento. La clave de Anthropic vive solo aquí, nunca en
la app del cliente.

## Cómo funciona

```
Widget OESPRE → servidor local (:3001) → ESTE proxy (con la API key) → Claude → respuesta
```

El manual (`knowledge-base.md`) se envía como contexto cacheado, así cada pregunta
cuesta una fracción de centavo (con Haiku 4.5 y prompt caching).

## Requisitos previos

1. Una cuenta en https://console.anthropic.com y una **API key**.
2. Un host con Node 18+ (Render, Railway, Fly.io, un VPS, o junto a `oespre-web`).

## Despliegue

1. Copia esta carpeta `oespre-assistant/` al host.
2. Crea el archivo `.env` a partir de `.env.example` y completa:
   - `ANTHROPIC_API_KEY` — tu clave de Anthropic.
   - `OESPRE_ASSISTANT_TOKEN` — un secreto aleatorio (ej: `openssl rand -hex 24`).
3. Instala e inicia:
   ```bash
   npm install
   npm start
   ```
4. Anota la URL pública del servicio (ej: `https://oespre-assistant.onrender.com`).

## Conectar con OESPRE

En el servidor de OESPRE (`server/index.cjs`) hay dos constantes cerca del
endpoint `/api/assistant/chat`:

```js
const ASSISTANT_PROXY_URL = process.env.OESPRE_ASSISTANT_PROXY_URL || 'https://TU-PROXY.onrender.com/chat';
const ASSISTANT_TOKEN     = process.env.OESPRE_ASSISTANT_TOKEN     || 'el-mismo-secreto-del-proxy';
```

- `ASSISTANT_PROXY_URL`: la URL pública del proxy + `/chat`.
- `ASSISTANT_TOKEN`: el MISMO valor de `OESPRE_ASSISTANT_TOKEN` del proxy.

Edita estos valores (o pásalos como variables de entorno al compilar) y recompila OESPRE.

## Actualizar el manual del bot

Cuando cambie alguna funcionalidad, edita `knowledge-base.md` y reinicia el proxy.
No necesitas recompilar la app de escritorio: la base de conocimiento vive en el proxy.

## Costos

Con Claude Haiku 4.5 + prompt caching, el manual (~6.000 tokens) se cobra a tarifa
de lectura de caché (~0,1×) en cada consulta. Una pregunta típica cuesta del orden
de US$0,001–0,003. El proxy incluye límite de 20 mensajes por minuto por IP para
evitar abusos.
