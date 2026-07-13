let docxArrayBuffer = null;

function substituirCampos(template, campos) {
    let resultado = template;
    for (const [chave, valor] of Object.entries(campos)) {
        resultado = resultado.replaceAll(`{{${chave}}}`, valor);
    }
    return resultado;
}

async function gerarZip(linhas, template) {
    const zip = new JSZip();

    linhas.forEach((linha, index) => {
        const [nome, cpf, processo] = linha.split('|').map(v => v.trim());
        const campos = { nome, cpf, processo };
        const documento = substituirCampos(template, campos);
        const nomeArquivo = `documento_${index + 1}.txt`;
        zip.file(nomeArquivo, documento);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mala-direta.zip';
    link.click();
    URL.revokeObjectURL(url);
}

async function gerarZipDocx(linhas, arrayBuffer) {
    const zipSaida = new JSZip();

    linhas.forEach((linha, index) => {
        const [nome, cpf, processo] = linha.split('|').map(v => v.trim());
        const campos = { nome, cpf, processo };

        const zip = new PizZip(arrayBuffer);
        const doc = new window.docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            syntax: {
                allowUnopenedTag: true,
                allowUnclosedTag: true
            }
        });

        doc.render(campos);
        const blob = doc.getZip().generate({ type: 'blob' });
        zipSaida.file(`documento_${index + 1}.docx`, blob);
    });

    const blob = await zipSaida.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mala-direta.zip';
    link.click();
    URL.revokeObjectURL(url);
}

document.getElementById('docxInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        docxArrayBuffer = event.target.result;
        const zip = new PizZip(docxArrayBuffer);
        const doc = new window.docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            syntax: {
                allowUnopenedTag: true,
                allowUnclosedTag: true
            }
        });

        const conteudo = doc.getFullText();
        console.log('Arquivo .docx carregado. Conteúdo:', conteudo);
        alert('Arquivo .docx carregado com sucesso. Preencha a lista de valores e clique em "Gerar arquivos".');
    };
    reader.readAsArrayBuffer(file);
});

document.getElementById('mailForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const values = document.getElementById('values').value;
    const linhas = values.trim().split('\n').filter(linha => linha.trim() !== '');

    if (linhas.length === 0) {
        alert('Adicione pelo menos uma linha de valores');
        return;
    }

    if (docxArrayBuffer) {
        gerarZipDocx(linhas, docxArrayBuffer);
    } else {
        const template = document.getElementById('template').value;
        gerarZip(linhas, template);
    }
});
