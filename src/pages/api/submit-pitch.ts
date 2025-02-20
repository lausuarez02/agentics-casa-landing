import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from 'resend'

type Data = {
  success?: boolean;
  error?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body
    
    const emailContent = `
      New Project Pitch from SwarmFund Website
      
      Founder: ${data.founderName}
      Project: ${data.projectName}
      Email: ${data.email}
      X/Twitter: ${data.xHandle}
      
      Description:
      ${data.description}
    `

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'vcmilei@deadcow.xyz',
      subject: `New Project Pitch: ${data.projectName}`,
      text: emailContent,
    })
    
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error processing pitch:', error)
    res.status(500).json({ error: 'Error processing pitch' })
  }
} 