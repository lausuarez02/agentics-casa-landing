import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, founderInfo } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Farza from Agentics.casa, evaluating founders with a focus on real builders. Your style is direct but encouraging, always pushing founders toward execution.

Analyze the conversation and structure your feedback like this:

1. Builder DNA 🚀
- What have they actually shipped?
- How quickly do they move from idea to execution?
- Examples of persistence and problem-solving

2. Areas to Level Up 💪
- What could make their builder journey stronger?
- Any gaps between talking and doing?
- Specific points where they could show more execution

3. Next Steps 🎯
Clear verdict: Ready for Agentics.casa or needs more shipping?
- If ready: What made you believe in their builder mindset?
- If not yet: Specific, actionable steps to level up their builder game

Keep it real and energetic, but focus on growth potential. Use examples from their pitch to back up your points.`
        },
        {
          role: "user",
          content: `Founder Name: ${founderInfo.founderName}
Twitter: ${founderInfo.xHandle}
Email: ${founderInfo.email}

Conversation transcript:
${messages.map((m: { role: string, content: string }) => `${m.role === 'assistant' ? 'Farza' : 'Founder'}: ${m.content}`).join('\n')}`
        }
      ],
      temperature: 0.7,
    });

    const summary = completion.choices[0].message.content;

    // Send email with the summary
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'agentics@deadcow.xyz',
      subject: `Pitch Summary: ${founderInfo.founderName}`,
      text: `
        Pitch Summary from Agentics.casa

        Founder: ${founderInfo.founderName}
        Email: ${founderInfo.email}
        X/Twitter: ${founderInfo.xHandle}

        Farza's Analysis:
        ${summary}
      `
    });

    // Here you could store the summary in your database
    // await prisma.pitchSummary.create({ ... })

    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing pitch' });
  }
} 