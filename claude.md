# Projeto: Mala Direta Web 📨

## 🎯 O que é

Ferramenta web para **geração em lote de documentos personalizados**.

O usuário define um **template** com campos marcados (ex: `{{cpf}}`), cola uma **lista de valores**, e a ferramenta gera **um arquivo para cada valor**.

Inspiração de UX: **ilovepdf** — simples, visual, uma ferramenta por vez.

🏛️ **Caso de uso real:** escritórios de advocacia que repetem o mesmo documento mudando só um dado (CPF, nome, número de processo).

---

## 🧱 Princípio de arquitetura

**Roda 100% no navegador. Sem servidor próprio.**

O computador do usuário faz o trabalho pesado. Isso significa:
- ✅ Deploy gratuito e simples
- ✅ Sem custo de infra
- ✅ Dados do usuário não saem da máquina dele (bom para o contexto jurídico)

---

## 📍 Fase atual: **Fase 1**

HTML puro + JavaScript. **Sem framework ainda.**

Objetivo: gerar um `.zip` com um `.txt` para cada valor de uma lista, a partir de um template com `{{campo}}`.

### Stack desta fase
- 🌐 HTML + JavaScript vanilla
- 📦 **JSZip** (gera o arquivo `.zip` no browser)

### ✅ Critério de conclusão da Fase 1
> Gerar um `.zip` com **5 arquivos** em **menos de 10 segundos**, a partir de uma lista de valores e um template com `{{campo}}`.

Quando isso funcionar, a Fase 1 está **terminada**. Não adiciono nada além disso aqui.

---

## 🗺️ Fases seguintes (NÃO começar antes de terminar a atual)

- 🟡 **Fase 2** — suporte a `.docx` (com `docxtemplater` + `pizzip`)
- 🔵 **Fase 3** — UI estilo ilovepdf (React + Tailwind) e deploy no Vercel
- ⚪ **Depois** — segunda ferramenta, domínio próprio, monetização

> ⚠️ Se eu começar a falar dessas fases antes de fechar a atual, **me traga de volta para a Fase 1.**

---

## 📁 Estrutura inicial esperada

```
mala-direta/
├── index.html
├── app.js
└── README.md
```

Simples de propósito. A Fase 1 não precisa de mais que isso.
