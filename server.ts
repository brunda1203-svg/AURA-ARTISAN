import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini SDK with recommended telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback intelligent responder for store support if API key is not present or offline
function getIntelligentStoreFallback(prompt: string, knowledgeEntries: any[] = []): string {
  const p = prompt.toLowerCase();

  // Search in dynamically trained website knowledge entries first
  if (Array.isArray(knowledgeEntries) && knowledgeEntries.length > 0) {
    const activeEntries = knowledgeEntries.filter((k) => k.active !== false);
    for (const entry of activeEntries) {
      // Check title match
      if (entry.title && p.includes(entry.title.toLowerCase())) {
        return entry.content;
      }
      // Check keywords match
      if (Array.isArray(entry.keywords)) {
        const hasKeyword = entry.keywords.some((kw: string) => kw && p.includes(kw.toLowerCase()));
        if (hasKeyword) {
          return entry.content;
        }
      }
    }
  }

  if (p.includes('bouquet') || p.includes('pipe cleaner') || p.includes('flower') || p.includes('tulip') || p.includes('sunflower')) {
    return "Our Everlasting Pipe Cleaner Flower Bouquets are sculpted entirely by hand using plush high-density chenille stems! They never wilt, feature realistic petal details, and come wrapped in scalloped floristry paper with cascading double-faced satin ribbons (lavender, blush pink, or golden honey).";
  }
  if (p.includes('birthday') || p.includes('card') || p.includes('hamper')) {
    return "We have wonderful birthday creations! Choose from our 'Grand Birthday Jubilee Hamper' (complete with a pastel pipe cleaner tulip bouquet, birthday candle, gourmet sweets, and satin ribbon), or our 'Botanical 3D Pop-Up Birthday Keepsake Card' featuring gold hot-stamped foil and a real metallic wax seal.";
  }
  if (p.includes('track') || p.includes('shipment') || p.includes('order') || p.includes('where is')) {
    return "You can view and track your shipments directly in your Personalized Dashboard under the 'Live Shipments' tab! Enter order number #AG-94812 or any recent order ID to see real-time transit milestones, carrier updates, and expected delivery dates.";
  }
  if (p.includes('wrap') || p.includes('packaging') || p.includes('box') || p.includes('ribbon') || p.includes('satin')) {
    return "Every Aura Artisan gift arrives in our signature keepsake rigid box or scalloped floristry wrap, hand-tied with your choice of double-faced satin ribbon (lavender, blush pink, golden honey) or velvet ribbon (emerald, champagne, vintage rose), accompanied by a wax-sealed handwritten calligraphy card.";
  }
  if (p.includes('return') || p.includes('refund') || p.includes('damaged') || p.includes('break')) {
    return "We offer a 30-day handcrafted satisfaction guarantee. If any delicate decorative item arrives imperfectly or damaged in transit, we will dispatch an artisan replacement immediately free of charge. Simply contact us with your order number.";
  }
  if (p.includes('discount') || p.includes('promo') || p.includes('coupon') || p.includes('code') || p.includes('voucher') || p.includes('reward')) {
    return "You can use code 'GIFT15' for 15% off your order! Aura Rewards Club members also earn 10 points per dollar spent. Check your Dashboard's 'Loyalty & Rewards' tab to redeem points for $25 and $50 handcrafted gift vouchers.";
  }
  if (p.includes('recommend') || p.includes('housewarming') || p.includes('wedding') || p.includes('anniversary') || p.includes('gift for')) {
    return "For birthdays and celebrations, we highly recommend 'The Grand Birthday Jubilee Hamper' and our 'Everlasting Pastel Tulip Pipe Cleaner Bouquet'. For weddings and housewarmings, explore our 'Celestial Brass Mobile & Prism' and 'Alabaster Keepsake Vessel'!";
  }
  if (p.includes('mfa') || p.includes('security') || p.includes('password') || p.includes('login')) {
    return "Your account is secured with multi-factor authentication (MFA). You can toggle SMS or Authenticator App verification anytime in your Profile Settings > Security tab for complete account protection.";
  }
  return "Welcome to Aura Artisan Decor & Gifts Concierge! I am trained on our complete store catalog, handcrafted pipe cleaner bouquets, satin ribbons, birthday keepsakes, real-time shipment tracking, and customer policies. How may I assist you today?";
}

// Default n8n Webhook URL provided by user
const DEFAULT_N8N_WEBHOOK_URL = 'https://brunda12.app.n8n.cloud/webhook/84980e58-6360-483c-8653-ebe138d55463/chat';

// Helper to extract reply text from various n8n response structures
function extractN8nReply(data: any): string | null {
  if (typeof data === 'string' && data.trim()) return data.trim();
  if (data && typeof data === 'object') {
    if (typeof data.output === 'string') return data.output;
    if (typeof data.text === 'string') return data.text;
    if (typeof data.response === 'string') return data.response;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.reply === 'string') return data.reply;
    if (Array.isArray(data) && data.length > 0) {
      const first = data[0];
      if (typeof first === 'string') return first;
      if (first && typeof first === 'object') {
        return first.output || first.text || first.response || first.message || null;
      }
    }
  }
  return null;
}

// In-memory store training knowledge fallback
let serverTrainedKnowledge: any[] = [];

// n8n Webhook Status Ping Endpoint
app.post('/api/n8n/ping', async (req: Request, res: Response) => {
  const webhookUrl = req.body?.webhookUrl || DEFAULT_N8N_WEBHOOK_URL;
  try {
    const testResp = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Instance-Id': '62510f6075903ef57bbcb956a51584b6260614a1776b4ae0a2c3f1b91bcd577f',
      },
      body: JSON.stringify({
        action: 'ping',
        chatInput: 'ping',
        message: 'ping',
        sessionId: 'ping-test',
      }),
    });

    const status = testResp.status;
    let data: any = null;
    try {
      data = await testResp.json();
    } catch {
      data = await testResp.text();
    }

    if (status === 200) {
      return res.json({
        status: 'active',
        code: 200,
        webhookUrl,
        message: 'n8n webhook is online, active, and responding!',
        sampleResponse: data,
      });
    }

    if (status === 404 && data?.hint) {
      return res.json({
        status: 'inactive',
        code: 404,
        webhookUrl,
        message: 'n8n webhook was reached successfully, but the workflow is inactive.',
        hint: data.hint,
      });
    }

    return res.json({
      status: 'error',
      code: status,
      webhookUrl,
      message: `n8n returned HTTP ${status}`,
      details: data,
    });
  } catch (err: any) {
    return res.status(500).json({
      status: 'unreachable',
      webhookUrl,
      error: err?.message || 'Failed to reach n8n webhook',
    });
  }
});

// Chat API Route with n8n Webhook + trained website knowledge + Gemini
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      message,
      history,
      customKnowledge,
      useN8n = true,
      n8nWebhookUrl = DEFAULT_N8N_WEBHOOK_URL,
      sessionId = 'aura-visitor-session',
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const effectiveKnowledge = (Array.isArray(customKnowledge) && customKnowledge.length > 0)
      ? customKnowledge
      : serverTrainedKnowledge;

    // 1. If n8n integration is requested or default, attempt n8n webhook first
    if (useN8n && n8nWebhookUrl) {
      try {
        const n8nResp = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Instance-Id': '62510f6075903ef57bbcb956a51584b6260614a1776b4ae0a2c3f1b91bcd577f',
          },
          body: JSON.stringify({
            action: 'sendMessage',
            chatInput: message,
            message,
            sessionId,
            history: history || [],
          }),
        });

        if (n8nResp.ok) {
          const n8nData = await n8nResp.json().catch(() => n8nResp.text());
          const n8nText = extractN8nReply(n8nData);
          if (n8nText && n8nText !== 'Error in workflow') {
            return res.json({
              reply: n8nText,
              source: 'n8n',
              n8nStatus: 'connected',
              webhookUrl: n8nWebhookUrl,
            });
          }
          if (n8nText === 'Error in workflow' || n8nData?.message === 'Error in workflow') {
            console.warn('n8n returned internal workflow error, falling back gracefully');
            const fallbackReply = ai
              ? null
              : getIntelligentStoreFallback(message, effectiveKnowledge);

            if (!ai) {
              return res.json({
                reply: fallbackReply,
                source: 'knowledge-base',
                n8nStatus: 'workflow_error',
                n8nHint: 'Workflow reached, but an internal node in your n8n workflow encountered an error (check Executions in n8n Cloud).',
                webhookUrl: n8nWebhookUrl,
              });
            }
          }
        } else if (n8nResp.status === 404) {
          const n8nError = await n8nResp.json().catch(() => ({}));
          console.warn('n8n webhook 404 (workflow inactive):', n8nError);
          // Workflow is not toggled to Active in n8n yet; we gracefully inform or fallback
          const fallbackReply = ai
            ? null
            : getIntelligentStoreFallback(message, effectiveKnowledge);

          if (!ai) {
            return res.json({
              reply: fallbackReply,
              source: 'knowledge-base',
              n8nStatus: 'inactive',
              n8nHint: n8nError?.hint || 'Workflow must be toggled to Active in n8n',
              webhookUrl: n8nWebhookUrl,
            });
          }
        }
      } catch (n8nErr) {
        console.warn('n8n webhook call failed, falling back:', n8nErr);
      }
    }

    // 2. Fallback to Gemini 3.8 Flash with trained website knowledge
    if (!ai) {
      const fallbackReply = getIntelligentStoreFallback(message, effectiveKnowledge);
      return res.json({
        reply: fallbackReply,
        source: 'knowledge-base',
        trainedEntriesCount: effectiveKnowledge.length,
        n8nStatus: useN8n ? 'fallback' : 'disabled',
      });
    }

    // Format knowledge entries into grounding context
    let knowledgeGrounding = '';
    if (Array.isArray(effectiveKnowledge) && effectiveKnowledge.length > 0) {
      const activeItems = effectiveKnowledge.filter((k) => k.active !== false);
      knowledgeGrounding = activeItems
        .map((k, idx) => `[STORE KNOWLEDGE TOPIC #${idx + 1}: ${k.title} (${k.category || 'General'})]\nKeywords: ${(k.keywords || []).join(', ')}\nTrained Store Information: ${k.content}`)
        .join('\n\n');
    }

    const systemInstruction = `You are "Aura", the luxury customer service concierge and gift advisor for "Aura Artisan Decor & Gifts".
Your responses MUST be grounded in and reflect the verified website training data provided below.

=== STORE WEBSITE TRAINED KNOWLEDGE BASE ===
${knowledgeGrounding || 'Default knowledge: Everlasting handcrafted pipe cleaner flower bouquets with satin ribbons, 3D botanical birthday cards, celebration hampers, live shipment tracking (#AG-94812), 30-day guarantee, promo code GIFT15.'}
============================================

Tone: Warm, elegant, courteous, highly helpful, and reassuring.
Guidelines:
1. Always prioritize answers found directly in the trained website knowledge base above.
2. If asked about custom products, pipe cleaner flowers, satin ribbons, birthday hampers, or tracking, answer accurately using the store facts.
3. If asked about coupons, mention 'GIFT15' (15% off) or 'HANDCRAFT25' ($25 off).
4. For tracking inquiries, mention they can track live shipments (e.g., #AG-94812) in real time under the "Live Shipments" tab in their dashboard.
5. Keep responses concise, conversational, and beautifully formatted with bullet points if listing items.`;

    // Format previous turns for context
    let formattedContents = '';
    if (Array.isArray(history) && history.length > 0) {
      formattedContents = history
        .slice(-6)
        .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Customer' : 'Aura'}: ${h.text}`)
        .join('\n');
      formattedContents += `\nCustomer: ${message}`;
    } else {
      formattedContents = `Customer: ${message}`;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      const reply = response.text || getIntelligentStoreFallback(message, effectiveKnowledge);
      return res.json({
        reply,
        source: 'gemini',
        trainedEntriesCount: effectiveKnowledge.length,
        n8nStatus: useN8n ? 'fallback' : 'disabled',
      });
    } catch (genError) {
      console.warn('Gemini generateContent fallback:', genError);
      const fallbackReply = getIntelligentStoreFallback(message, effectiveKnowledge);
      return res.json({
        reply: fallbackReply,
        source: 'knowledge-base',
        trainedEntriesCount: effectiveKnowledge.length,
        n8nStatus: useN8n ? 'fallback' : 'disabled',
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Knowledge API Routes to train and retrieve store data
app.get('/api/knowledge', (_req: Request, res: Response) => {
  res.json({ knowledge: serverTrainedKnowledge });
});

app.post('/api/knowledge/sync', (req: Request, res: Response) => {
  const { entries } = req.body;
  if (Array.isArray(entries)) {
    serverTrainedKnowledge = entries;
    return res.json({ success: true, count: serverTrainedKnowledge.length });
  }
  res.status(400).json({ error: 'Invalid entries array' });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Aura Artisan Gifts API', timestamp: new Date().toISOString() });
});

// Setup Vite or static serving
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
