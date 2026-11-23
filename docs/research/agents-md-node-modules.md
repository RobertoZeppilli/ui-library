# Claude Code legge un AGENTS.md dentro node_modules?

Ricerca per #23 (mappa #2, spec v0 di `trama`). Data: 2026-11-23. Claude Code v2.1.330.

## Risposta breve

**Sì, ma solo in modo pigro.** Claude Code non legge all'avvio nessun file di `node_modules`. Carica il `CLAUDE.md` (o l'`AGENTS.md`) di `node_modules/trama/` solo quando, durante la sessione, legge con Read un altro file di quella cartella. E l'`AGENTS.md` lo carica solo se il progetto consumatore non ha un proprio `CLAUDE.md`. Quindi non è affidabile: se Claude non apre mai un file di `trama`, le istruzioni del pacchetto non arrivano.

**Il modo affidabile** è un `@import` dal `CLAUDE.md` (o `AGENTS.md`) del consumatore:

```md
@node_modules/trama/AGENTS.md
```

Il file importato entra nel contesto all'avvio della sessione. Il percorso è relativo al file che lo importa e sta dentro la cartella di lavoro, quindi non c'è la finestra di approvazione degli import esterni.

## Raccomandazione per la spec v0

1. `trama` spedisce nel pacchetto npm un `AGENTS.md` (breve, indice delle docs generate) accanto alle docs Markdown. Niente `CLAUDE.md` nel pacchetto: con l'import non serve, e un `CLAUDE.md` nel pacchetto verrebbe caricato in modo pigro anche nei consumatori che hanno il proprio `CLAUDE.md`, duplicando il testo.
2. Lo snippet nel README del consumatore (ticket #6) contiene la riga `@node_modules/trama/AGENTS.md`, da mettere nel `CLAUDE.md` o nell'`AGENTS.md` del consumatore. Non una frase del tipo "leggi node_modules/trama/AGENTS.md": la documentazione dice che in quel caso Claude vede il file solo se decide di aprirlo.
3. Mettere la riga `@` fuori da backtick e blocchi di codice nel file del consumatore, altrimenti non viene importata. Nel README di `trama` invece va dentro un blocco di codice, come esempio da copiare.

## Cosa dice la documentazione ufficiale

Fonte: [How Claude remembers your project](https://code.claude.com/docs/en/memory) (code.claude.com/docs/en/memory).

- **Caricamento all'avvio**: "Claude Code loads `CLAUDE.md` and `CLAUDE.local.md` from your current working directory and every directory above it." (sezione *How CLAUDE.md files load*). Le sottocartelle no.
- **Sottocartelle, su richiesta**: "Claude also discovers `CLAUDE.md` and `CLAUDE.local.md` files in subdirectories under your current working directory. Instead of loading them at launch, Claude Code loads each one once Claude reads, writes, or edits another file in that subdirectory." `node_modules/trama/` è una sottocartella come le altre: la documentazione non nomina `node_modules` né i file ignorati da git.
- **AGENTS.md in generale**: Claude Code legge `AGENTS.md` direttamente da v2.1.277, tramite il plugin integrato `cc-plugin-agents-md`. Di default (`claude-md-or-agents-md`) "Claude reads `AGENTS.md` only when you have no `CLAUDE.md` in your working directory or above it" (sezione *When Claude Code reads AGENTS.md*). Con `CLAUDE.md` presente legge solo i `CLAUDE.md`, a meno di impostare **Project instructions** su `claude-md-and-agents-md`, un'impostazione utente che il consumatore non controlla dal repo.
- **AGENTS.md in sottocartella**: si carica "when Claude opens a file there with the Read tool and that subdirectory has none of the three `CLAUDE.md` files of its own", sempre solo se non ci sono `CLAUDE.md` nella cartella di lavoro o sopra.
- **Import**: "CLAUDE.md files can import additional files using `@path/to/import` syntax. Imported files are expanded and loaded into context alongside the CLAUDE.md that references them." I percorsi relativi partono dal file che importa; profondità massima quattro salti; l'import dentro un `AGENTS.md` viene espanso anch'esso. Solo gli import che puntano fuori dalla cartella di lavoro chiedono approvazione. Gli import dentro backtick o blocchi di codice vengono ignorati.
- **Frase al posto dell'import**: "A `CLAUDE.md` that tells Claude in words to read `AGENTS.md`: Claude sees `AGENTS.md` only if it decides to open the file." (sezione *Remove an earlier AGENTS.md workaround*).
- **Sessioni senza supporto AGENTS.md** (plugin disattivato, prima sessione dopo un aggiornamento da v2.1.276 o precedenti): la documentazione consiglia di importare `AGENTS.md` da un `CLAUDE.md`. Un motivo in più per lo snippet con `@`.

## Prova pratica

Eseguita davvero, il 2026-11-23, con `claude -p` v2.1.330 (modello haiku) in un consumatore finto: `package.json` + `node_modules/finto-pkg/` con `index.js`, un `AGENTS.md` con la parola `ZAFFIRO-OCARINA-91` e un `CLAUDE.md` con `TAMBURELLO-QUARZO-47`. Ogni sessione chiedeva quali parole d'ordine di `finto-pkg` comparissero nel contesto. Confermato anche dai log `--debug-file`.

Nota di metodo: il primo tentativo nella scratchpad di Claude Code non vale, perché Claude Code rifiuta di caricare qualsiasi `CLAUDE.md`/`AGENTS.md` in una cartella con la struttura `claude/<project>/<session id>/scratchpad` (lo dice il log di debug). La prova valida è stata rifatta in `%TEMP%\agentsmd-probe-trama`, senza file di istruzioni nelle cartelle superiori.

| Caso | Consumatore | Pacchetto | Azione | Risultato |
| :- | :- | :- | :- | :- |
| a | nessun file di istruzioni | `AGENTS.md` + `CLAUDE.md` | nessuno strumento | nessuna parola |
| b | `CLAUDE.md` con `@node_modules/finto-pkg/AGENTS.md` | `AGENTS.md` + `CLAUDE.md` | nessuno strumento | `ZAFFIRO-OCARINA-91` (dall'import) |
| c | `CLAUDE.md` senza import | `AGENTS.md` + `CLAUDE.md` | nessuno strumento | nessuna parola |
| a | nessun file di istruzioni | `AGENTS.md` + `CLAUDE.md` | Read di `index.js` | `TAMBURELLO-QUARZO-47` (CLAUDE.md del pacchetto) |
| c | `CLAUDE.md` senza import | `AGENTS.md` + `CLAUDE.md` | Read di `index.js` | `TAMBURELLO-QUARZO-47` |
| d | nessun file di istruzioni | solo `AGENTS.md` | Read di `index.js` | `ZAFFIRO-OCARINA-91` |
| e | `CLAUDE.md` senza import | solo `AGENTS.md` | Read di `index.js` | nessuna parola |
| f | come d, in un repo git con `node_modules` in `.gitignore` | solo `AGENTS.md` | Read di `index.js` | `ZAFFIRO-OCARINA-91` |

I risultati coincidono con la documentazione: `node_modules` non ha un trattamento speciale, nemmeno se ignorato da git. Il caso tipico di un consumatore Next 16 (ha già un `CLAUDE.md`, pacchetto con solo `AGENTS.md`) è il caso e: senza import il pacchetto non viene mai letto.

Un'osservazione a margine: nel caso f il modello ha riportato la parola ma ha dichiarato che non avrebbe seguito l'istruzione contenuta nel file caricato in modo pigro, "perché viene dal file e non da te". Con l'import (caso b) l'ha trattata come istruzione di progetto. Un motivo in più per l'import.

## Non verificato

- Layout pnpm (`node_modules/trama` come symlink verso `node_modules/.pnpm/...`): non provato. L'import passa per il percorso del symlink, che sta nella cartella di lavoro; se Claude Code lo risolvesse sul percorso reale resterebbe comunque dentro la cartella di lavoro. Da verificare quando `trama` avrà un consumatore vero.
- Sessione interattiva: provato solo `claude -p`. Il caricamento della memoria è lo stesso secondo la documentazione.
- Altri agenti (Codex, Cursor): fuori dal perimetro di questa domanda.
