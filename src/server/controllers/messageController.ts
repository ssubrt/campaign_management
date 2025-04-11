
import { Request, Response } from 'express';
import axios from 'axios';

// OpenAI API key should come from environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Generate personalized message using OpenAI
export const generatePersonalizedMessage = async (req: Request, res: Response) => {
  try {
    const { name, job_title, company, location, summary } = req.body;
    
    // Validate input
    if (!name || !job_title || !company) {
      return res.status(400).json({ message: 'Name, job title, and company are required' });
    }
    
    // If no API key, return a mock response for testing
    if (!OPENAI_API_KEY) {
      console.warn('No OpenAI API key found. Using mock response.');
      
      const mockMessage = `Hi ${name},\n\nI noticed you're a ${job_title} at ${company} based in ${location}. Your experience with ${summary?.split(' ').slice(0, 3).join(' ')}... is impressive!\n\nI'm reaching out because our platform CampaignCraft can help streamline your outreach efforts and increase response rates. Would you be open to a quick 15-minute chat this week to discuss how we might be able to support your work?\n\nLooking forward to connecting,\nThe CampaignCraft Team`;
      
      return res.status(200).json({ message: mockMessage });
    }
    
    // Create prompt for OpenAI
    const prompt = `Write a personalized LinkedIn outreach message to a person with the following profile:
    - Name: ${name}
    - Job Title: ${job_title}
    - Company: ${company}
    - Location: ${location || 'Unknown'}
    - Profile Summary: ${summary || 'Not provided'}
    
    The message should be professional, friendly, and mention how our campaign management software can help with their outreach efforts. The message should be 3-4 short paragraphs and not exceed 150 words. Do not use emojis.`;
    
    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that writes personalized outreach messages for LinkedIn. Keep your responses concise, professional, and friendly.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 250
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    
    const generatedMessage = response.data.choices[0].message.content.trim();
    
    res.status(200).json({ message: generatedMessage });
  } catch (error) {
    console.error('Error generating personalized message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
