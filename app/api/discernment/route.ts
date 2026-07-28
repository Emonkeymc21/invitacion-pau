import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { reply: "Pau, en este momento no pudimos activar el espacio de discernimiento. Recordá que podés charlarlo directamente con Emma (+54 9 261 578-8430) o Carla (+54 9 261 241-4783)." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const userMessage = body.message || "Hola";

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Lista de modelos ordenados por disponibilidad/cuota
    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-2.0-flash'];
    let text = '';
    let lastError = null;

    const systemInstruction = `
    Sos un acompañante espiritual virtual inspirado en la pedagogía y espiritualidad de San Ignacio de Loyola.
    Estás acompañando a Ana Paula Rodríguez (Pau), quien ha sido invitada a servir en el Equipo de Comunidad en 2026.
    Acompáñala con empatía, calidez, franqueza y paz. 
    Aconséjale siempre con mucha fraternidad que comparta sus sentimientos y dudas con sus animadores del Área de Comunidad: Emma (+54 9 261 578-8430) y Carla (+54 9 261 241-4783).
    `;

    const prompt = `${systemInstruction}\n\nConsulta o inquietud de Pau:\n"${userMessage}"`;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
        if (text) break;
      } catch (err) {
        lastError = err;
        console.warn(`Fallo con el modelo ${modelName}, intentando siguiente...`);
      }
    }

    if (!text) {
      throw lastError || new Error("No se pudo obtener respuesta de ningún modelo.");
    }

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Error final en Gemini Route:", error);
    return NextResponse.json(
      { 
        reply: "Pau, el espacio de reflexión está en una pausa momentánea. Podés abrir tu corazón y charlarlo directamente con tus animadores: Emma (+54 9 261 578-8430) o Carla (+54 9 261 241-4783) 💕." 
      },
      { status: 200 }
    );
  }
}