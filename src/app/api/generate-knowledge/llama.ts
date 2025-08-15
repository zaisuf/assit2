// llama-3.1-8b-instant integration using Groq API

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY environment variable is not set');
}

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';

// Helper to slugify a string for fallback id
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

// Helper to guess intent from text
function guessIntent(text: string) {
  const t = text.toLowerCase();
  if (t.includes('shipping')) return 'shipping_details';
  if (t.includes('return')) return 'return_details';
  if (t.includes('exchange')) return 'exchange_policy';
  if (t.includes('refund')) return 'refund_details';
  if (t.includes('order')) return 'order_info';
  if (t.includes('size')) return 'sizing_details';
  if (t.includes('payment')) return 'payment_options';
  if (t.includes('warranty')) return 'warranty_info';
  if (t.includes('quality')) return 'quality_guarantee';
  if (t.includes('product')) return 'product_details';
  if (t.includes('support') || t.includes('help')) return 'support_info';
  if (t.includes('discount')) return 'discount_info';
  if (t.includes('gift')) return 'gift_card_info';
  if (t.includes('loyalty')) return 'loyalty_rewards';
  if (t.includes('app')) return 'mobile_app';
  if (t.includes('store')) return 'offline_stores';
  if (t.includes('track')) return 'tracking_info';
  if (t.includes('care')) return 'care_instructions';
  if (t.includes('eco') || t.includes('sustainab')) return 'eco_friendly';
  if (t.includes('bulk')) return 'bulk_purchase';
  if (t.includes('student')) return 'student_offer';
  if (t.includes('cash on delivery') || t.includes('cod')) return 'cash_on_delivery';
  if (t.includes('cancel')) return 'order_cancellation';
  if (t.includes('page') || t.includes('collection')) return 'page_link';
  if (t.includes('fashion') || t.includes('assistant')) return 'chatbot_info';
  return 'general_info';
}

export async function llamaGenerateKnowledge(sentence: string, url?: string) {
  if (!GROQ_API_KEY) throw new Error('Missing GROQ_API_KEY');

  // Stronger prompt with more examples and explicit instructions
  const prompt = `Given this sentence from a fashion e-commerce website:\n"${sentence}"\nReturn a JSON object with three fields:\n- "id": a unique, meaningful identifier (kebab-case, max 40 chars, no spaces, no special chars, e.g. 'product-urban-street-jacket', 'shipping-policy', 'return-policy', 'customer-support', etc.)\n- "intent": a relevant intent label (e.g. 'product_details', 'shipping_details', 'return_details', 'support_info', etc.)\n- "text": the original or improved sentence.\n\nExamples:\n{\n  "id": "shipping-policy",\n  "intent": "shipping_details",\n  "text": "We provide worldwide shipping with tracking. Free shipping on orders over ₹999. Standard delivery takes 3-5 business days within India and 7-14 days internationally. Express shipping options available."\n}\n{\n  "id": "product-urban-street-jacket",\n  "intent": "product_details",\n  "text": "Urban Street Jacket: A stylish jacket designed for urban environments, offering both comfort and fashion. Available in sizes S, M, L, XL. Price: ₹4,999."\n}\n{\n  "id": "customer-support",\n  "intent": "support_info",\n  "text": "24/7 customer support via WhatsApp, email (support@hasutara.com), and phone (1800-XXX-XXXX). Live chat available 10 AM to 8 PM IST."\n}\n\nReturn only the JSON object. Do not include any explanation or extra text.`;

  let tries = 0;
  let lastJson: any = null;
  let lastContent = '';
  while (tries < 2) {
    const body = {
      model: 'llama-3-8b-instant',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for fashion e-commerce knowledge extraction.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 256,
      temperature: 0.2
    };

    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`Groq API error: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    lastContent = content;
    try {
      const json = JSON.parse(content);
      // If id and intent are both non-empty, accept
      if (json.id && json.intent) return json;
      lastJson = json;
    } catch (e) {
      // Parsing failed, try again
    }
    tries++;
  }

  // Fallback: generate id/intent from text/url if LLM fails
  let fallbackId = '';
  if (lastJson && lastJson.text) {
    fallbackId = slugify(lastJson.text);
  } else if (sentence) {
    fallbackId = slugify(sentence);
  } else if (url) {
    fallbackId = slugify(url.split('/').pop() || url);
  } else {
    fallbackId = 'unknown';
  }
  let fallbackIntent = '';
  if (lastJson && lastJson.text) {
    fallbackIntent = guessIntent(lastJson.text);
  } else if (sentence) {
    fallbackIntent = guessIntent(sentence);
  } else {
    fallbackIntent = 'general_info';
  }
  return {
    id: fallbackId,
    intent: fallbackIntent,
    text: (lastJson && lastJson.text) || sentence || '',
  };
}
