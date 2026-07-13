import { useState } from 'react'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import TemplateInput from './TemplateInput'
import ValuesInput from './ValuesInput'
import ValuesTable from './ValuesTable'
import DocxInput from './DocxInput'
import ExcelInput from './ExcelInput'
import GenerateButton from './GenerateButton'
import FeedbackModal from './FeedbackModal'
import ProgressBar from './ProgressBar'
import { gerarZip, gerarZipDocx, gerarZipPdf, gerarZipBoth, extrairCampos } from '../lib/gerador'

export default function ToolSection() {
  const [template, setTemplate] = useState('')
  const [values, setValues] = useState('')
  const [docxArrayBuffer, setDocxArrayBuffer] = useState<ArrayBuffer | null>(null)
  const [campos, setCampos] = useState<string[]>([])
  const [valoresTabela, setValoresTabela] = useState<Record<string, string>[]>([])
  const [formato, setFormato] = useState<'docx' | 'pdf' | 'ambos'>('docx')
  const [showFeedback, setShowFeedback] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDocxLoaded = (arrayBuffer: ArrayBuffer) => {
    setDocxArrayBuffer(arrayBuffer)

    try {
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        syntax: {
          allowUnopenedTag: true,
          allowUnclosedTag: true
        }
      });

      const conteudo = doc.getFullText();
      const camposExtraidos = extrairCampos(conteudo);
      setCampos(camposExtraidos);
    } catch (error) {
      console.error('Erro ao ler .docx:', error);
      alert('Erro ao ler o arquivo .docx');
    }
  }

  const handleGenerate = async () => {
    try {
      setShowProgress(true)
      setProgress(0)

      if (docxArrayBuffer) {
        if (valoresTabela.length === 0 || Object.keys(valoresTabela[0]).length === 0) {
          alert('Preencha pelo menos uma linha de valores')
          setShowProgress(false)
          return
        }

        if (formato === 'docx') {
          await gerarZipDocx(valoresTabela, docxArrayBuffer, setProgress)
        } else if (formato === 'pdf') {
          await gerarZipPdf(valoresTabela, docxArrayBuffer, setProgress)
        } else if (formato === 'ambos') {
          await gerarZipBoth(valoresTabela, docxArrayBuffer, setProgress)
        }
        setShowProgress(false)
        setShowFeedback(true)
        return
      }

      const linhas = values.trim().split('\n').filter(linha => linha.trim() !== '')

      if (linhas.length === 0) {
        alert('Adicione pelo menos uma linha de valores')
        setShowProgress(false)
        return
      }

      if (template.trim() === '') {
        alert('Adicione um template')
        setShowProgress(false)
        return
      }

      await gerarZip(linhas, template, setProgress)
      setShowProgress(false)
      setShowFeedback(true)
    } catch (error) {
      console.error('Erro ao gerar arquivos:', error)
      alert('Erro ao gerar arquivos. Tente novamente.')
      setShowProgress(false)
    }
  }

  return (
    <section className="bg-bg transition-colors duration-200 py-12 md:py-8 px-6">
      <ProgressBar progress={progress} isVisible={showProgress} message="Gerando arquivos..." />
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
      <div className="max-w-800px mx-auto">
        <form onSubmit={(e) => { e.preventDefault(); handleGenerate() }} className="space-y-6">
          {/* 1. Modo de entrada */}
          <div className="card-section p-6 transition-colors duration-200">
            <h2 className="text-18px font-600 text-fg mb-4">1. Escolha o template</h2>
            <div className="space-y-4">
              <DocxInput onFileLoaded={handleDocxLoaded} campos={campos} />

              {!docxArrayBuffer && (
                <div className="text-center py-4 border-t border-border">
                  <p className="text-12px text-muted mb-4">ou</p>
                  <TemplateInput value={template} onChange={setTemplate} disabled={!!docxArrayBuffer} />
                </div>
              )}
            </div>
          </div>

          {/* 2. Valores */}
          {(template || docxArrayBuffer) && (
            <div className="card-section p-6 transition-colors duration-200">
              <h2 className="text-18px font-600 text-fg mb-4">2. Preencha os valores</h2>

              {campos.length > 0 && (
                <div className="mb-4 p-3 bg-input rounded-sm border border-border">
                  <p className="text-12px font-500 text-muted mb-2">Campos detectados:</p>
                  <div className="flex flex-wrap gap-2">
                    {campos.map((campo) => (
                      <span key={campo} className="px-3 py-1 bg-fg text-card-bg rounded-sm text-12px font-500">
                        {campo}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {campos.length === 0 ? (
                <ValuesInput value={values} onChange={setValues} />
              ) : (
                <>
                  <ValuesTable campos={campos} onChange={setValoresTabela} initialData={valoresTabela} />
                  <div className="mt-6 pt-6 border-t border-border">
                    <ExcelInput onDataLoaded={setValoresTabela} campos={campos} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* 3. Formato */}
          {(template || docxArrayBuffer) && (
            <div className="card-section p-6 transition-colors duration-200">
              <h2 className="text-18px font-600 text-fg mb-4">3. Formato de saída</h2>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="docx"
                    checked={formato === 'docx'}
                    onChange={(e) => setFormato(e.target.value as 'docx' | 'pdf' | 'ambos')}
                    className="w-4 h-4 text-fg"
                  />
                  <span className="ml-3 text-14px font-400 text-fg">DOCX</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="pdf"
                    checked={formato === 'pdf'}
                    onChange={(e) => setFormato(e.target.value as 'docx' | 'pdf' | 'ambos')}
                    className="w-4 h-4 text-fg"
                  />
                  <span className="ml-3 text-14px font-400 text-fg">PDF</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="ambos"
                    checked={formato === 'ambos'}
                    onChange={(e) => setFormato(e.target.value as 'docx' | 'pdf' | 'ambos')}
                    className="w-4 h-4 text-fg"
                  />
                  <span className="ml-3 text-14px font-400 text-fg">DOCX + PDF</span>
                </label>
              </div>
            </div>
          )}

          {/* Botão */}
          {(template || docxArrayBuffer) && (
            <GenerateButton onClick={handleGenerate} />
          )}
        </form>
      </div>
    </section>
  )
}
