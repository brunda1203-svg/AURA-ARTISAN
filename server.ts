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
function getIntelligentStoreFallback(prompt: string): string {
  const p = prompt.toLowerCase();
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
  return "Welcome to Aura Artisan Decor & Gifts Concierge! I can assist you with custom pipe cleaner flower bouquets, satin ribbon selections, birthday cards, luxury hampers, order tracking (#AG-94812), or loyalty rewards. How may I delight you today?";
}

// Chat API Route
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      const fallbackReply = getIntelligentStoreFallback(message);
      return res.json({ reply: fallbackReply, source: 'knowledge-base' });
    }

    const systemInstruction = `You are "Aura", the luxury customer service concierge and gift advisor for "Aura Artisan Decor & Gifts".
Your brand specializes in:
- Everlasting handcrafted pipe cleaner flower bouquets (tulips, sunflowers, peonies, lilies of the valley) tied with double-faced satin ribbons (lavender, blush pink, golden honey).
- Botanical 3D pop-up floral birthday cards and pressed wildflower deckle-edge cards with wax seals.
- Curated luxury birthday hampers and grand celebratory hampers with scented candles, keepsakes, and treats.
- Handcrafted decorative home items: botanical glass cloches, carved alabaster vessels, brass celestial mobiles, and memory chests.
Tone: Warm, elegant, courteous, highly helpful, and reassuring.
Guidelines:
1. Help customers choose the perfect decorative gift based on occasion (Birthday, Housewarming, Wedding, Anniversary, Appreciation).
2. Answer questions about gift packaging: choice of lustrous satin ribbons or plush velvet ribbons, scalloped floristry wrap or luxury rigid gift boxes, and complimentary wax-sealed calligraphy message cards.
3. Inform users they can track live shipments (e.g. sample tracking #AG-94812) in real-time in their personalized customer dashboard.
4. Assist with loyalty rewards: Aura Rewards members earn 10 points per $1; mention active promo codes like 'GIFT15' (15% off) or 'HANDCRAFT25' ($25 off).
5. Explain secure checkout and 2FA/MFA account protection (SMS OTP or Authenticator app).
6. Return policy: 30-day satisfaction guarantee with immediate complimentary replacement for any shipping damages.
Keep responses concise, conversational, and beautifully formatted with bullet points if recommending items.`;

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
          temperature: 0.7,
        },
      });

      const reply = response.text || getIntelligentStoreFallback(message);
      return res.json({ reply, source: 'gemini' });
    } catch (genError) {
      console.warn('Gemini generateContent fallback:', genError);
      const fallbackReply = getIntelligentStoreFallback(message);
      return res.json({ reply: fallbackReply, source: 'knowledge-base' });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
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
