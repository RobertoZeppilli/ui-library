# DX per agenti: cosa aiuta davvero un LLM a usare una libreria

Ricerca per #6 (mappa #2). Data: 2026-11-23. Fonti primarie lette in questa data; ogni affermazione ha la sua fonte.

## Domanda

Quali formati aiutano davvero un agente (Claude Code / tai) a usare bene una libreria di componenti in un progetto nuovo: AGENTS.md generato da una CLI, llms.txt / llms-full.txt, documentazione dai tipi TypeScript, server MCP, esempi d'uso? Cosa fanno Astryx, shadcn e altri? Qual è il formato minimo, generabile, mantenibile con poche ore a settimana?

## Risposta breve

L'unico dato misurato che esiste (Vercel/Next.js, vendor-reported) dice che **contesto sempre presente** batte il recupero on demand: un indice compatto in `AGENTS.md` che punta a documentazione Markdown **versionata e installata col pacchetto** ha portato i task al 100%, contro 53% senza docs e al massimo 79% con una skill. Next.js e Astryx convergono sullo stesso schema: un **blocco gestito** (con marcatori) in `AGENTS.md`/`CLAUDE.md`, breve, che dice le 3-4 regole che evitano gli errori più comuni e indica dove leggere il resto. MCP, skill e formati "dense" sono strati sopra, utili per casi specifici, non il minimo.

## Cosa fanno gli altri

### Next.js (Vercel)

- Da 16.2 la documentazione Markdown versionata è nel pacchetto: `node_modules/next/dist/docs/`, con la stessa struttura del sito; aggiornare Next aggiorna i docs. [Next.js, AI agents guide](https://nextjs.org/docs/app/guides/ai-agents)
- Da 16.3 `create-next-app` (e `next dev` quando rileva un agente) scrive in `AGENTS.md` un blocco tra `<!-- BEGIN:nextjs-agent-rules -->` e `<!-- END:... -->`, di poche righe: "This version has breaking changes [...] Read the relevant guide in `node_modules/next/dist/docs/` [...] before writing any code." Aggiorna solo il contenuto tra i marcatori. [stessa fonte]
- Docs anche in rete: ogni pagina ha una versione `.md`, più `/docs/llms.txt` e `/docs/llms-full.txt`, "so agents that already read `llms.txt` for other tools can discover the Next.js docs the same way". È un canale secondario per agenti che non leggono `node_modules`. [stessa fonte]
- Le skill servono ai workflow (migrazioni, ottimizzazioni), non alla conoscenza: "Framework knowledge comes from the bundled docs, not from Skills." [stessa fonte]
- Le eval (27 gen 2026): baseline 53%, skill di default 53%, skill con istruzioni esplicite 79%, indice in `AGENTS.md` 100%. L'indice era ~8KB (compresso da ~40KB), una riga per cartella di docs con l'elenco dei file, più la riga "Prefer retrieval-led reasoning over pre-training-led reasoning". Il motivo principale del fallimento delle skill: l'agente spesso non le carica. Ai maintainer consigliano di "provide an `AGENTS.md` snippet that users can add to their projects". [Vercel blog](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)
- Limite: eval di Vercel, su un solo framework, su API non presenti nei dati di training. Il risultato è coerente con il resto, non è una prova generale.

### Astryx (Meta)

- `astryx init` scrive, senza prompt, un blocco gestito ("cheat sheet") in `AGENTS.md`, una copia nel `CLAUDE.md` esistente (perché Claude Code non segue l'import da una sottocartella) e un import `@./AGENTS.md` in `GEMINI.md`. Il blocco è generato "from actual command metadata" e porta la versione, così `astryx upgrade` sa se è vecchio. [`packages/cli/foundation/agent-docs/agent-docs.mjs`](https://github.com/facebook/astryx/blob/main/packages/cli/foundation/agent-docs/agent-docs.mjs), [`packages/cli/api/init/init.doc.mjs`](https://github.com/facebook/astryx/blob/main/packages/cli/api/init/init.doc.mjs)
- Contenuto del blocco (stessa fonte, `generateCompressedIndex`): versione e numero di componenti; **SETUP** con gli import CSS obbligatori ("without these, components render unstyled"); workflow; **RULES** brevi (niente `<div>` per il layout, solo token e niente hex/px, temi solo via tema); una riga **SELF-CHECK** ("re-read the file; replace any [...] raw `<div>` [...] hardcoded `#hex/px` with the component or a token"); poi i comandi per leggere il resto (`search`, `docs <topic>`, `component <Name>`). Le integrazioni hanno un tetto di righe (`MAX_PROJECT_AGENT_DOC_LINES`).
- Dato interno citato nel codice: con le sole regole, sulle UI complesse resta CSS grezzo nell'11-13% delle esecuzioni; la riga di self-check lo riduce di circa 4 volte "at negligible token cost". È un commento nel sorgente, non un'eval pubblicata. [stessa fonte, commento sopra `selfCheckFix`]
- La documentazione per agenti sta nella CLI: `astryx component <Name>`, `docs <topic>`, `search`, ognuno con `--json`, e `--dense` (= `--lang dense`) per testo compresso. [`packages/cli/README.md`](https://github.com/facebook/astryx/blob/main/packages/cli/README.md)
- `--dense` non è generato: ogni componente ha una "traduzione" `docsDense` scritta a parte nel suo `.doc.mjs`, con lo stesso contenuto in meno token. È lavoro manuale per componente. [`.claude/skills/dense-compression-protocol.md`](https://github.com/facebook/astryx/blob/main/.claude/skills/dense-compression-protocol.md)
- MCP: `astryx mcp` espone i comandi della CLI come tool, ma la spec dice che "an agent that can run commands uses the CLI itself" e il server è presentato "only for AI tools that cannot". Il README lo descrive allo stesso modo. [`docs/specs/AST-121-mcp-server/spec.md`](https://github.com/facebook/astryx/blob/main/docs/specs/AST-121-mcp-server/spec.md)
- Il loro `llms.txt` è corto e rimanda alla CLI: "Instead of crawling these pages, use the CLI". [`apps/docsite/src/app/llms.txt/route.ts`](https://github.com/facebook/astryx/blob/main/apps/docsite/src/app/llms.txt/route.ts)

### shadcn/ui

- `llms.txt` sul sito, 111 link per sezione, senza versioni `.md` linkate. [ui.shadcn.com/llms.txt](https://ui.shadcn.com/llms.txt)
- Skill ufficiale (`npx skills add shadcn/ui`): si attiva se c'è `components.json`, esegue `shadcn info --json` per iniettare il contesto del progetto, impone regole di composizione e fa usare `shadcn docs` / `shadcn search` / MCP prima di scrivere codice. [ui.shadcn.com/docs/skills](https://ui.shadcn.com/docs/skills.md)
- Server MCP per cercare e installare componenti dai registry. [llms.txt, sezione MCP Server](https://ui.shadcn.com/llms.txt)
- Il modello è diverso dal nostro: shadcn copia il codice nel progetto, quindi l'agente vede il sorgente; per un pacchetto npm il sorgente non è lì, ci sono solo i `.d.ts` e ciò che pubblichiamo.

## I formati, uno per uno

| Formato | Cosa dicono le fonti | Costo per noi | Per la v0 |
|---|---|---|---|
| Blocco in `AGENTS.md` (snippet) | Il formato misurato migliore (Vercel); usato da Next.js e Astryx | Basso: ~20-30 righe scritte a mano, aggiornate quando cambia una regola | **Sì** |
| Docs Markdown nel pacchetto (`node_modules/<pkg>/docs/`) | Schema di Next.js 16.2+; versionate gratis con npm | Medio: si generano da tipi + esempi; vanno tenute in sync dal build | **Sì**, generate |
| `.d.ts` con TSDoc | Nessuna fonte specifica; è ciò che l'agente trova comunque leggendo `node_modules` | Quasi zero: escono dal build | **Sì**, già incluso |
| Esempi d'uso | Astryx e shadcn mettono esempi in ogni doc di componente | Basso se gli esempi sono gli stessi file di story/test | **Sì**, dentro le docs |
| `llms.txt` / `llms-full.txt` | Spec llmstxt.org: H1 obbligatorio, blockquote, liste di link; `llms-full.txt` **non è nella spec**, è una convenzione (Next.js la usa). La spec non dice quali agenti lo leggano. [llmstxt.org](https://llmstxt.org/) | Basso se c'è un sito: si genera dalle stesse docs | Solo se si fa un sito docs |
| Skill | Per workflow, non conoscenza (Next.js, Vercel); spesso non caricata | Medio | No in v0 |
| Server MCP | Astryx lo riserva agli agenti senza shell; Claude Code e tai hanno la shell | Alto: un servizio da mantenere | No (già in roadmap) |
| Output `--dense` | Traduzioni manuali per componente | Alto | No |
| CLI `init` che scrive il blocco | Astryx e Next.js lo fanno; evita il copia-incolla e si aggiorna da sola | Medio: logica dei marcatori, file da toccare, casi limite (il file di Astryx è oltre 1000 righe) | Dopo la v0; in v0 basta lo snippet nel README |

## Come Claude Code legge questi file

Da [code.claude.com/docs/en/memory](https://code.claude.com/docs/en/memory):

- Legge `AGENTS.md` nativamente (da v2.1.277), ma **solo se non c'è un `CLAUDE.md`** nella cartella di lavoro o sopra; se c'è, legge solo `CLAUDE.md`, a meno che lo importi con `@AGENTS.md` o che l'utente cambi l'impostazione. Per questo Astryx scrive il blocco in entrambi. Questo repo usa già il pattern `CLAUDE.md` → `@AGENTS.md`.
- Dimensione: "target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence."
- Import `@path` ricorsivi fino a quattro livelli.
- I `CLAUDE.md`/`AGENTS.md` nelle sottocartelle si caricano on demand quando Claude legge un file lì. La pagina **non dice** se questo vale anche dentro `node_modules`. Non è verificato, quindi meglio non pubblicare nel pacchetto un file chiamato `AGENTS.md` o `CLAUDE.md` contando che venga caricato (o temendo che lo sia): le docs del pacchetto vanno in una cartella `docs/` con un indice neutro, e il blocco nel progetto le indica.

`AGENTS.md` è uno standard aperto sotto la Linux Foundation, letto da Codex, Cursor, Copilot, Gemini CLI e altri; la regola è "the closest AGENTS.md to the edited file wins". Non dice nulla sui pacchetti che lo pubblicano per chi li usa. [agents.md](https://agents.md/)

## Raccomandazione (da decidere)

Il minimo che conviene alla v0, in ordine:

1. **Docs Markdown nel pacchetto npm**, in `docs/` (una pagina per componente: import, props con tipi e default, varianti, note a11y e tastiera, 1-2 esempi), più un `docs/index.md` con una riga per componente. Si **generano dal build** a partire dai tipi TypeScript, dai commenti TSDoc e dagli esempi già scritti per story o test, così non si mantengono a mano. Lo strumento di estrazione si sceglie nel ticket di implementazione.
2. **Uno snippet `AGENTS.md` di 20-30 righe** nel README, da copiare nel progetto, tra marcatori `<!-- BEGIN:<pkg> -->` / `<!-- END:<pkg> -->` e con la versione: import CSS obbligatori, come si sceglie il tema, 3-5 regole contro gli errori tipici (ad esempio: niente colori o spaziature hard-coded, solo token; usa i componenti di layout invece di `<div>`), una riga di self-check come quella di Astryx e il puntatore `node_modules/<pkg>/docs/index.md` con "leggi la pagina del componente prima di usarlo". Nei progetti con `CLAUDE.md` va importato con `@AGENTS.md`.
3. **TSDoc sulle props pubbliche**: serve sia al punto 1 sia all'agente che apre i `.d.ts`.

Da rimandare: CLI `init` che scrive lo snippet (quando copiarlo a mano diventa una seccatura), `llms.txt` (solo se nasce un sito docs; si genera dalle stesse pagine, `llms-full.txt` compreso), skill per workflow, MCP, formato dense.

Per tarare lo snippet basta una mini-eval: 3-4 task tipici dati a tai in un progetto vuoto, con e senza snippet, contando gli errori ricorrenti (CSS grezzo, import mancanti, props inventate).

## Punti aperti

- Se Claude Code carichi on demand un `AGENTS.md` dentro `node_modules/<pkg>/` quando legge un file lì: la documentazione non lo dice, va provato.
- Il nome del pacchetto e quindi il percorso in `node_modules` dipendono dalla decisione sul nome.
- Se si sceglie Storybook per i test a11y, gli esempi delle story possono essere la fonte degli esempi nelle docs: dipende da quel ticket.
