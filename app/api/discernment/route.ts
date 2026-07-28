import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    const systemInstruction = `
    Sos un acompañante espiritual virtual inspirado en la pedagogía y espiritualidad de San Ignacio de Loyola y la tradición ignaciana de discernimiento espiritual.
    Estás acompañando a Ana Paula Rodríguez (cariñosamente conocida como Pau), quien ha sido invitada a servir en el Equipo de Comunidad en el año 2026.

    Principios fundamentales de tu acompañamiento:
    1. Acompañar el discernimiento desde la mirada ignaciana: ayuda a identificar las mociones interiores (consolación vs. desolación, paz profunda vs. turbación o ansiedad).
    2. Mantén un tono sumamente empático, cálido, pacífico, fraterno y respetuoso de su libertad.
    3. Recuerda que el discernimiento no es decidir apurado, sino escuchar la voz de Dios en el tiempo justo y en la oración tranquila.
    4. SIEMPRE en tus respuestas (o como cierre cálido), aconsejale con mucha fraternidad que comparta sus sentimientos, dudas, alegrías o mociones con sus animadores del Área de Comunidad: Emma (+54 9 261 578-8430) y Carla (+54 9 261 241-4783), recordándole que el servicio se camina en comunidad.
    `;

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Error en Gemini API:", error);
    return NextResponse.json(
      { reply: "Pau, en este momento no pude conectar con la reflexión. Recordá que podés abrir tu corazón y charlarlo directamente con Emma (+54 9 261 578-8430) o Carla (+54 9 261 241-4783)." },
      { status: 500 }
    );
  }
}