# 📨 Mala Direta

Ferramenta web para gerar documentos personalizados em lote, direto no seu navegador.

Defina um **template** com campos (ex: `{{cpf}}`), cole uma **lista de valores**, e gere um **`.zip` com um arquivo para cada linha**.

Sem servidor. Dados não saem da sua máquina.

---

## Como usar

1. **Template** — cole o texto com campos marcados: `{{nome}}`, `{{cpf}}`, `{{processo}}`
2. **Valores** — cole uma lista (um por linha, campos separados por `|`)
3. **Gerar** — clique no botão e baixe o `.zip`

---

## Stack

- 🌐 HTML + JavaScript vanilla
- 📦 JSZip (gera `.zip` no navegador)
- ✅ Fase 1 — texto puro (`.txt`)
