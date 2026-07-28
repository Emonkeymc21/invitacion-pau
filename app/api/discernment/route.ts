import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Falta GEMINI_API_KEY");
      return NextResponse.json(
        { reply: "Error de configuración: La clave GEMINI_API_KEY no fue detectada en Netlify." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const userMessage = body.message || "Hola";

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Usamos 'gemini-1.5-flash-latest' o 'gemini-1.5-pro'
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const systemInstruction = `
    Sos un acompañante espiritual virtual inspirado en la pedagogía de San Ignacio de Loyola y la tradición ignaciana de discernimiento.
    Estás acompañando a Ana Paula Rodríguez (Pau), quien fue invitada a servir en el Equipo de Comunidad en 2026.
    Acompáñala con empatía, calidez, franqueza y paz. 
    Aconséjale siempre con mucha fraternidad que comparta sus sentimientos y dudas con sus animadores: Emma (+54 9 261 578-8430) y Carla (+54 9 261 241-4783).
    `;

    const prompt = `${systemInstruction}\n\nPregunta/Reflexión de Pau:\n"${userMessage}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Error detallado en Gemini Route:", error);
    
    return NextResponse.json(
      { 
        reply: `Detalle técnico del error: ${error?.message || 'Error al invocar Gemini'}. Por favor avísale a Emma (+54 9 261 578-8430) o Carla (+54 9 261 241-4783).` 
      },
      { status: 500 }
    );
  }
}