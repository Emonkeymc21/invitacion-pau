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
    
    // Probamos con gemini-2.5-flash o gemini-2.0-flash
    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    } catch {
      model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

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

    // Limpiamos el texto si viene con formateo o prefijos vacíos
    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Error detallado en Gemini Route:", error);
    
    // Si falla gemini-2.5-flash, intentamos con el identificador directo
    try {
      const apiKey = process.env.GEMINI_API_KEY || '';
      const genAI = new GoogleGenerativeAI(apiKey);
      const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      const body = await request.json();
      const userMessage = body.message || "Hola";
      
      const systemInstruction = `
      Sos un acompañante espiritual virtual inspirado en la pedagogía de San Ignacio de Loyola.
      Estás acompañando a Ana Paula Rodríguez (Pau).
      Aconséjale charlar con sus animadores: Emma y Carla.
      `;

      const result = await fallbackModel.generateContent(`${systemInstruction}\n\n"${userMessage}"`);
      const response = await result.response;
      return NextResponse.json({ reply: response.text() });
    } catch (fallbackError: any) {
      return NextResponse.json(
        { 
          reply: `Detalle técnico del error: ${fallbackError?.message || error?.message || 'Error al invocar Gemini'}. Por favor avísale a Emma (+54 9 261 578-8430) o Carla (+54 9 261 241-4783).` 
        },
        { status: 500 }
      );
    }
  }
}