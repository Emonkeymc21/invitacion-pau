import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function buildPersonalizedPdf(nombre: string) {
  const filePath = path.join(process.cwd(), 'public', 'assets', 'invitacion-base.pdf');
  const original = await fs.readFile(filePath);
  const pdfDoc = await PDFDocument.load(original);
  const page = pdfDoc.getPages()[0];
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Reemplazamos "Querido XXXXX:" por "Querida Ana Paula Rodríguez (Pau):"
  page.drawRectangle({
    x: 95,
    y: 585,
    width: 250,
    height: 25,
    color: rgb(1, 1, 1)
  });

  page.drawText(`Querida ${nombre} (Pau):`, {
    x: 98,
    y: 590,
    size: 11,
    font: boldFont,
    color: rgb(0.44, 0.11, 0.21) // Color borgoña acorde a la web
  });

  return Buffer.from(await pdfDoc.save());
}