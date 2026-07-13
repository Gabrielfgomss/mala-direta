import { VercelRequest, VercelResponse } from '@vercel/node';
import { exec } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const docxBuffer = req.body as Buffer;

    if (!docxBuffer || docxBuffer.length === 0) {
      return res.status(400).json({ error: 'DOCX file is required' });
    }

    const tmpId = randomBytes(8).toString('hex');
    const inputFile = join('/tmp', `input-${tmpId}.docx`);
    const outputFile = join('/tmp', `output-${tmpId}.pdf`);

    writeFileSync(inputFile, docxBuffer);

    await new Promise((resolve, reject) => {
      exec(
        `libreoffice --headless --convert-to pdf --outdir /tmp "${inputFile}"`,
        { timeout: 30000 },
        (error, stdout, stderr) => {
          if (error) {
            reject(new Error(`LibreOffice error: ${stderr}`));
          } else {
            resolve(stdout);
          }
        }
      );
    });

    const pdfBuffer = readFileSync(outputFile);

    unlinkSync(inputFile);
    unlinkSync(outputFile);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="documento.pdf"');

    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('Conversion error:', error);
    return res.status(500).json({ error: 'Failed to convert DOCX to PDF' });
  }
}
