import JSZip from 'jszip';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

function substituirCampos(template: string, campos: Record<string, string>): string {
    let resultado = template;
    for (const [chave, valor] of Object.entries(campos)) {
        resultado = resultado.replaceAll(`{{${chave}}}`, valor);
    }
    return resultado;
}

// Preenche o template .docx com os valores de uma linha e devolve o .docx como Blob.
function renderizarDocx(arrayBuffer: ArrayBuffer, linha: Record<string, string>): Blob {
    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: '{{', end: '}}' },
        nullGetter: () => '',
        syntax: {
            allowUnopenedTag: true,
            allowUnclosedTag: true
        }
    });

    doc.render(linha);
    return doc.getZip().generate({ type: 'blob' });
}

// Converte um .docx (Blob) em PDF chamando a Vercel Function (LibreOffice headless).
async function converterDocxParaPdf(docxBlob: Blob): Promise<Blob> {
    const response = await fetch('/api/convert-docx-to-pdf', {
        method: 'POST',
        body: await docxBlob.arrayBuffer(),
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
    });

    if (!response.ok) {
        throw new Error(`Falha ao converter para PDF: ${response.statusText}`);
    }

    return response.blob();
}

// Dispara o download de um Blob ZIP no navegador.
async function baixarZip(zip: JSZip): Promise<void> {
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mala-direta.zip';
    link.click();
    URL.revokeObjectURL(url);
}

async function gerarZip(linhas: string[], template: string, onProgress?: (progress: number) => void): Promise<void> {
    const zip = new JSZip();

    linhas.forEach((linha, index) => {
        const [nome, cpf, processo] = linha.split('|').map(v => v.trim());
        const campos = { nome, cpf, processo };
        const documento = substituirCampos(template, campos);
        zip.file(`documento_${index + 1}.txt`, documento);

        if (onProgress) {
            onProgress(Math.round(((index + 1) / linhas.length) * 100));
        }
    });

    await baixarZip(zip);
}

function extrairCampos(texto: string): string[] {
    const regex = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
    const campos = new Set<string>();
    let match;

    while ((match = regex.exec(texto)) !== null) {
        campos.add(match[1]);
    }

    return Array.from(campos);
}

async function gerarZipDocx(
    linhas: Record<string, string>[],
    arrayBuffer: ArrayBuffer,
    onProgress?: (progress: number) => void
): Promise<void> {
    const zipSaida = new JSZip();

    linhas.forEach((linha, index) => {
        zipSaida.file(`documento_${index + 1}.docx`, renderizarDocx(arrayBuffer, linha));

        if (onProgress) {
            onProgress(Math.round(((index + 1) / linhas.length) * 100));
        }
    });

    await baixarZip(zipSaida);
}

async function gerarZipPdf(
    linhas: Record<string, string>[],
    arrayBuffer: ArrayBuffer,
    onProgress?: (progress: number) => void
): Promise<void> {
    const zipSaida = new JSZip();

    for (let index = 0; index < linhas.length; index++) {
        const docxBlob = renderizarDocx(arrayBuffer, linhas[index]);
        const pdfBlob = await converterDocxParaPdf(docxBlob);
        zipSaida.file(`documento_${index + 1}.pdf`, pdfBlob);

        if (onProgress) {
            onProgress(Math.round(((index + 1) / linhas.length) * 100));
        }
    }

    await baixarZip(zipSaida);
}

async function gerarZipBoth(
    linhas: Record<string, string>[],
    arrayBuffer: ArrayBuffer,
    onProgress?: (progress: number) => void
): Promise<void> {
    const zipSaida = new JSZip();

    for (let index = 0; index < linhas.length; index++) {
        const docxBlob = renderizarDocx(arrayBuffer, linhas[index]);
        zipSaida.file(`documento_${index + 1}.docx`, docxBlob);

        const pdfBlob = await converterDocxParaPdf(docxBlob);
        zipSaida.file(`documento_${index + 1}.pdf`, pdfBlob);

        if (onProgress) {
            onProgress(Math.round(((index + 1) / linhas.length) * 100));
        }
    }

    await baixarZip(zipSaida);
}

export { substituirCampos, gerarZip, gerarZipDocx, gerarZipPdf, gerarZipBoth, extrairCampos }
