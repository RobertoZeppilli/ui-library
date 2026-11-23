# Primitive headless: Radix, Base UI, React Aria o niente?

Ricerca per #3 (mappa #2). Dati raccolti il 2026-11-23 da fonti primarie: repo GitHub (`gh api`), registry npm (`npm view`), documentazione ufficiale, bundlephobia.

## Raccomandazione

**Base UI** (`@base-ui/react`). Copre tutti e dieci i componenti v0, è il progetto più attivo dei tre, usa una sola forma di composizione (`render`) ed è da luglio 2026 il default di shadcn/ui, quindi è quello che gli agenti incontrano più spesso. React Aria è l'alternativa se l'accessibilità documentata pesa più di tutto il resto. La decisione finale resta all'utente.

## Confronto

| | Radix Primitives | Base UI | React Aria Components | Da zero |
|---|---|---|---|---|
| Versione attuale | `radix-ui` 1.8.1 | `@base-ui/react` 1.9.0 | `react-aria-components` 1.22.1 | - |
| Copertura v0 (10) | 8/10: manca Button e Input | 10/10 | 9/10 stabili, Toast è `UNSTABLE_Toast` | 10/10, tutto da scrivere |
| A11y dichiarata | WAI-ARIA APG "where possible" | WAI-ARIA APG, test con screen reader | WAI-ARIA APG, "extensively tested" con screen reader e dispositivi | Nessuna garanzia |
| PR mergiate (ultimi 6 mesi) | 148 | 868 | 388 (monorepo con Spectrum) | - |
| Cadenza release | a raffiche | minor mensile | minor mensile | - |
| Composizione | `asChild` | `render` (elemento o funzione) | render props + context/slot | a scelta |
| Supporto agenti | nessuno documentato | `llms.txt`, pagine in Markdown | `llms.txt`, `.md` per pagina, MCP server, Agent Skills | - |
| Peso (min+gzip, bundlephobia) | Dialog 13 kB, Tooltip 19 kB, Select 30 kB (per pacchetto) | 166 kB pacchetto intero, tree-shakable per sottopercorso | 279 kB pacchetto intero, più `react-aria` e `react-stately` | minimo |
| Peer React | 16.8-19 | 17-19 | 16.8-19 | - |
| Dipende da Next | no | no | no (usa `client-only`) | no |

## Dettagli

### Copertura componenti

- **Radix**: la cartella `packages/react` del repo ha `checkbox`, `dialog`, `dropdown-menu`, `select`, `switch`, `tabs`, `toast`, `tooltip`, ma nessun `button` né `input`/`text-field` ([repo](https://github.com/radix-ui/primitives/tree/main/packages/react)). Button e Input andrebbero scritti a mano, con Label e Form separati.
- **Base UI**: 36 componenti, fra cui Button, Input, Field, Select, Checkbox, Switch, Dialog, Menu, Tooltip, Tabs, Toast ([quick start](https://base-ui.com/react/overview/quick-start)).
- **React Aria Components**: oltre 50 componenti, fra cui Button, TextField, Select, Checkbox, Switch, Modal/Dialog, Menu, Tooltip, Tabs. Toast esiste ma è esportato come `UNSTABLE_Toast` ([llms.txt](https://react-aria.adobe.com/llms.txt)).

### Accessibilità

Nessuna delle tre librerie dichiara conformità WCAG 2.2 AA: tutte dichiarano aderenza ai pattern WAI-ARIA APG. Contrasto, indicatori di focus visibili ed etichette restano a carico nostro, e Base UI lo scrive esplicitamente ([Base UI accessibility](https://base-ui.com/react/overview/accessibility)). Quindi i test automatici in CI servono comunque, qualunque sia la scelta.

- **React Aria** ha la reputazione e la documentazione più forti: test estesi su screen reader e dispositivi, internazionalizzazione, gestione di interazioni touch/pen ([home](https://react-aria.adobe.com/)).
- **Base UI**: WAI-ARIA APG, focus gestito, test su browser, piattaforme e screen reader ([accessibility](https://base-ui.com/react/overview/accessibility)).
- **Radix**: "adhere to the WAI-ARIA design patterns where possible" ([introduction](https://www.radix-ui.com/primitives/docs/overview/introduction)). Molti dei commit di ottobre 2026 correggono attributi ARIA (`aria-disabled`, riferimenti rotti in Dialog), e a novembre è aperta la #4302 sul trigger di Select nascosto alle tecnologie assistive.

### Manutenzione (al 2026-11-23)

- **Base UI** (`mui/base-ui`): release v1.5.0 → v1.9.0 una al mese da maggio a ottobre 2026, ultimo push 2026-11-21, 868 PR mergiate dal 2026-05-23. Il vecchio pacchetto `@base-ui-components/react` è fermo a 1.0.0-rc.0: usare `@base-ui/react`.
- **React Aria** (`adobe/react-spectrum`): release mensili (1.20 luglio, 1.21 settembre, 1.22 ottobre), ultimo push 2026-11-22, 388 PR mergiate in sei mesi.
- **Radix** (`radix-ui/primitives`): ultimo commit su main 2026-10-14, 148 PR mergiate in sei mesi. L'attività settimanale degli ultimi sei mesi alterna raffiche (fino a 61 commit) e lunghe pause a zero commit. Nessuna GitHub release, solo pubblicazioni npm. Non è abbandonato ma è il meno attivo dei tre.
- **Segnale dell'ecosistema**: shadcn/ui ha pubblicato a luglio 2026 la voce "Base UI as the Default" e supporta anche React Aria e Radix ([changelog](https://ui.shadcn.com/docs/changelog)). Il corpo della voce non è stato letto, solo il titolo.

### Peso del bundle

Numeri bundlephobia (min+gzip) per il pacchetto intero, quindi non confrontabili alla lettera: Radix è pubblicato per componente, Base UI e React Aria come pacchetto unico con import per sottopercorso e tree-shaking. Per un confronto reale serve una build di prova con gli stessi tre componenti; non l'ho fatta. Ordine di grandezza atteso: Radix ≈ Base UI < React Aria, che porta con sé `react-aria`, `react-stately` e `@internationalized/*`.

### Prevedibilità dell'API per un agente

- **Base UI**: composizione a parti con namespace (`Dialog.Root`, `Dialog.Trigger`, `Dialog.Popup`) e un solo meccanismo per cambiare elemento, la prop `render`, che accetta un elemento (`render={<MyButton />}`) o una funzione `(props, state)`. Le props si uniscono in modo documentato: classi concatenate, handler eseguiti entrambi, ref conservati ([composition](https://base-ui.com/react/handbook/composition)). Lo stato è esposto come attributi `data-*`, comodo con Tailwind 4.
- **Radix**: stessa composizione a parti, ma con `asChild`, che dipende dal figlio unico e implicito ed è un errore frequente (figlio che non inoltra il ref o non spande le props). È comunque il pattern più presente nel codice di addestramento degli agenti, per via di shadcn storico.
- **React Aria**: API ricca ma con un idioma suo: `className` e `children` possono essere funzioni dello stato, componenti collegati via context e `slot`. Più potente, più superficie da imparare. È l'unica con un MCP server ufficiale (`@react-aria/mcp`) e Agent Skills ([AI](https://react-aria.adobe.com/ai)).

### Componenti da zero

Dieci componenti con focus trap, typeahead, posizionamento dei popover, dismiss, annunci live per Toast e navigazione da tastiera, verificati su più screen reader, non stanno in poche ore a settimana. Scartato.

## Cosa resta aperto

- Il peso reale va misurato con una build di prova (Dialog + Select + Tooltip) per Base UI e React Aria.
- Se si sceglie Base UI, il wrapper della libreria dovrebbe esporre `render` così com'è, senza introdurre `asChild`: una sola forma da documentare per gli agenti.
