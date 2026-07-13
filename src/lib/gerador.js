import JSZip from 'jszip';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import mammoth from 'mammoth';
// @ts-ignore
import html2pdf from 'html2pdf.js';
function substituirCampos(template, campos) {
    let resultado = template;
    for (const [chave, valor] of Object.entries(campos)) {
        resultado = resultado.replaceAll(`{{${chave}}}`, valor);
    }
    return resultado;
}
async function gerarZip(linhas, template, onProgress) {
    const zip = new JSZip();
    linhas.forEach((linha, index) => {
        const [nome, cpf, processo] = linha.split('|').map(v => v.trim());
        const campos = { nome, cpf, processo };
        const documento = substituirCampos(template, campos);
        const nomeArquivo = `documento_${index + 1}.txt`;
        zip.file(nomeArquivo, documento);
        if (onProgress) {
            const progress = Math.round(((index + 1) / linhas.length) * 100);
            onProgress(progress);
        }
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mala-direta.zip';
    link.click();
    URL.revokeObjectURL(url);
}
function extrairCampos(texto) {
    const regex = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
    const campos = new Set();
    let match;
    while ((match = regex.exec(texto)) !== null) {
        campos.add(match[1]);
    }
    return Array.from(campos);
}
async function gerarZipDocx(linhas, arrayBuffer, onProgress) {
    const zipSaida = new JSZip();
    linhas.forEach((linha, index) => {
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            delimiters: {
                start: '{{',
                end: '}}'
            },
            nullGetter: () => '',
            syntax: {
                allowUnopenedTag: true,
                allowUnclosedTag: true
            }
        });
        doc.render(linha);
        const docZip = doc.getZip();
        const blob = docZip.generate({ type: 'blob' });
        zipSaida.file(`documento_${index + 1}.docx`, blob);
        if (onProgress) {
            const progress = Math.round(((index + 1) / linhas.length) * 100);
            onProgress(progress);
        }
    });
    const blob = await zipSaida.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mala-direta.zip';
    link.click();
    URL.revokeObjectURL(url);
}
async function gerarZipPdf(linhas, arrayBuffer, onProgress) {
    const zipSaida = new JSZip();
    for (let index = 0; index < linhas.length; index++) {
        const linha = linhas[index];
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            delimiters: {
                start: '{{',
                end: '}}'
            },
            nullGetter: () => '',
            syntax: {
                allowUnopenedTag: true,
                allowUnclosedTag: true
            }
        });
        doc.render(linha);
        const docxBlob = doc.getZip().generate({ type: 'blob' });
        // Converter DOCX para HTML usando Mammoth
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer: await docxBlob.arrayBuffer() });
        const html = htmlResult.value;
        // Converter HTML para PDF usando html2pdf
        const element = document.createElement('div');
        element.innerHTML = html;
        element.style.padding = '20px';
        element.style.fontFamily = 'Arial, sans-serif';
        const opt = {
            margin: 10,
            filename: `documento_${index + 1}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };
        const pdfDoc = await html2pdf().set(opt).from(element).outputPdf('blob');
        zipSaida.file(`documento_${index + 1}.pdf`, pdfDoc);
        if (onProgress) {
            const progress = Math.round(((index + 1) / linhas.length) * 100);
            onProgress(progress);
        }
    }
    const blob = await zipSaida.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mala-direta.zip';
    link.click();
    URL.revokeObjectURL(url);
}
async function gerarZipBoth(linhas, arrayBuffer, onProgress) {
    const zipSaida = new JSZip();
    for (let index = 0; index < linhas.length; index++) {
        const linha = linhas[index];
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            delimiters: {
                start: '{{',
                end: '}}'
            },
            nullGetter: () => '',
            syntax: {
                allowUnopenedTag: true,
                allowUnclosedTag: true
            }
        });
        doc.render(linha);
        // Adicionar DOCX
        const docxBlob = doc.getZip().generate({ type: 'blob' });
        zipSaida.file(`documento_${index + 1}.docx`, docxBlob);
        // Converter DOCX para PDF
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer: await docxBlob.arrayBuffer() });
        const html = htmlResult.value;
        const element = document.createElement('div');
        element.innerHTML = html;
        element.style.padding = '20px';
        element.style.fontFamily = 'Arial, sans-serif';
        const opt = {
            margin: 10,
            filename: `documento_${index + 1}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };
        const pdfDoc = await html2pdf().set(opt).from(element).outputPdf('blob');
        zipSaida.file(`documento_${index + 1}.pdf`, pdfDoc);
        if (onProgress) {
            const progress = Math.round(((index + 1) / linhas.length) * 100);
            onProgress(progress);
        }
    }
    const blob = await zipSaida.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mala-direta.zip';
    link.click();
    URL.revokeObjectURL(url);
}
async function gerarPdfComFallback(linhas, arrayBuffer, onProgress) {
    const zipSaida = new JSZip();
    for (let index = 0; index < linhas.length; index++) {
        const linha = linhas[index];
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            delimiters: {
                start: '{{',
                end: '}}'
            },
            nullGetter: () => '',
            syntax: {
                allowUnopenedTag: true,
                allowUnclosedTag: true
            }
        });
        doc.render(linha);
        const docxBlob = doc.getZip().generate({ type: 'blob' });
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer: await docxBlob.arrayBuffer() });
        const html = htmlResult.value;
        const element = document.createElement('div');
        element.innerHTML = html;
        element.style.padding = '20px';
        element.style.fontFamily = 'Arial, sans-serif';
        const opt = {
            margin: 10,
            filename: `documento_${index + 1}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };
        const pdfDoc = await html2pdf().set(opt).from(element).outputPdf('blob');
        zipSaida.file(`documento_${index + 1}.pdf`, pdfDoc);
        if (onProgress) {
            const progress = Math.round(((index + 1) / linhas.length) * 100);
            onProgress(progress);
        }
    }
    const blob = await zipSaida.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mala-direta.zip';
    link.click();
    URL.revokeObjectURL(url);
}
export { substituirCampos, gerarZip, gerarZipDocx, gerarZipPdf, gerarZipBoth, gerarPdfComFallback, extrairCampos };
