# Come si pacchettizza una libreria React + Tailwind 4

Ricerca per #4 (mappa #2). Data: 2026-11-23. Fonti primarie: documentazione ufficiale, manifest e file pubblicati su npm (scaricati con `npm pack`), più due prove locali riproducibili (sezione "Prove").

## Versioni correnti (npm, 2026-11-23)

| Pacchetto | Versione | Nota |
|---|---|---|
| `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/vite` | 4.3.5 | |
| `react` | 19.3.1 | |
| `next` | 16.4.6 | |
| `tsdown` | 0.23.7 | basato su rolldown 1.3.3 |
| `tsup` | 9.0.0 | README: "This project is not actively maintained anymore. Please consider using tsdown instead." |
| `vite` | 8.3.8 | |
| `@astryxdesign/core` | 0.7.17 | |
| `@heroui/react`, `@heroui/styles` | 3.2.8 | |

Fonte: `npm view <pacchetto> version`; README di tsup da `npm view tsup readme`.

## 1. Il consumatore scansiona il pacchetto oppure il pacchetto spedisce CSS compilato?

Le strade sono due.

**A. CSS sorgente + scansione del pacchetto.** Il pacchetto spedisce JS con le classi Tailwind come stringhe e un file CSS *non compilato* che il Tailwind del consumatore elabora.
- Tailwind 4 di default ignora `node_modules`. Per una libreria costruita con Tailwind la docs indica di registrarla esplicitamente con `@source "../node_modules/@acmecorp/ui-lib";` ([Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files)).
- I percorsi di `@source` sono "relative to the stylesheet" (stessa pagina). **Prova 2** qui sotto: se `@source "./dist";` sta dentro il CSS del pacchetto e il consumatore fa solo `@import "pkg/styles.css"`, Tailwind 4.3.5 risolve il percorso rispetto al file del pacchetto e genera le classi usate in `dist/`. Il consumatore scrive due righe e non deve conoscere il percorso dentro `node_modules`.
- HeroUI v3 (`@heroui/styles` 3.2.8) segue una variante di questa strada. Spedisce CSS sorgente con `@apply` e classi semantiche (`.button { @apply relative inline-flex ... }` in `dist/components/button.css`), dichiara `tailwindcss >=4.0.0` come peer, e il suo `dist/index.css` fa `@import "tailwindcss"` per poi aggiungere base, componenti, tema e utility in layer.

**B. CSS già compilato.** Il pacchetto esegue Tailwind (o altro) in fase di build e pubblica un `.css` finale.
- Astryx è in questa categoria, ma non usa Tailwind per i componenti: stila con StyleX (`@stylexjs/stylex` è un peer) e pubblica `dist/astryx.css` già compilato (circa 314 KB in 0.7.17). Tailwind arriva solo come *ponte* opzionale (sezione 2).
- Se la libreria è scritta con utility Tailwind, il CSS compilato si porta dietro la propria copia di utility e preflight. In un consumatore che usa già Tailwind 4 si duplicano regole e bisogna gestire l'ordine dei layer. È un'inferenza dal modello dei layer di Tailwind e dall'ordine di import che Astryx documenta, non un test.

**Per questo progetto:** i consumatori sono progetti Next 16 nuovi con Tailwind 4, quindi A costa meno: niente passo di build CSS e un solo Tailwind nella pagina. B serve solo se un giorno ci saranno consumatori senza Tailwind, che la mappa non prevede.

## 2. Token come `@theme` / variabili CSS e temi multipli

Cosa dice la docs ([Theme variables](https://tailwindcss.com/docs/theme)):
- Le variabili `@theme` nel namespace `--color-*` generano le utility (`bg-*`, `text-*` ...). `--color-*: initial` azzera il namespace.
- Un tema si condivide mettendolo in un file CSS a parte: "publish them to NPM and import them just like any other third-party CSS files".
- `@theme inline` fa sì che l'utility contenga il *valore* (es. `var(--font-inter)`) invece di un riferimento alla variabile di tema. Serve quando la variabile punta a un'altra variabile. Altrimenti `var()` viene risolta dove è definita e non dove la si usa.
- `@theme static` emette tutte le variabili, anche quelle non usate.

Lo schema che usano entrambe le librerie reali per i temi a runtime è un ponte `@theme inline` verso variabili semantiche, i cui valori cambiano per selettore:
- **Astryx** `src/tailwind-theme.css` (283 righe): `@theme reference inline { --color-primary: var(--color-text-primary); --color-surface: var(--color-background-surface); ... }`. Il commento spiega che `reference` evita di emettere le variabili e `inline` mette la variabile di sistema dentro ogni utility, "so theme switching just works". I valori arrivano da un pacchetto per tema (`@astryxdesign/theme-neutral/theme.css`, `theme-stone`, `theme-matcha`, ...) con selettori `[data-astryx-theme="neutral"]`, `[data-astryx-scheme="dark"]` e `@scope`. L'ordine di import documentato nel file: `@layer` esplicito, `tailwindcss/theme.css`, preflight, reset e CSS di Astryx, `theme.css` del tema, `tailwind-theme.css`, `tailwindcss/utilities.css`.
- **HeroUI v3** `dist/themes/shared/theme.css`: `@theme inline { --color-background: var(--background); --color-accent: var(--accent); ... }`, con i valori in `themes/default/variables.css` (`:root`, `:host`, varianti scure). I temi stanno nello *stesso* pacchetto (`exports: "./themes/*.css"`).

**Prova 2** conferma lo schema con Tailwind 4.3.5: `@theme inline { --color-primary: var(--ui-primary); }` nel CSS del pacchetto genera `.bg-primary { background-color: var(--ui-primary); }`. I blocchi `[data-theme="alpha"]` e la variante `.dark` che ridefiniscono `--ui-primary` restano nell'output, quindi cambiare tema non richiede di ricompilare.

`@theme reference` lo usa Astryx, ma non è descritto nella pagina della docs che ho letto. Prima di adottarlo va verificato.

## 3. Strumento di build

- **tsdown** (0.23.7, rolldown). Si definisce "The Elegant Bundler for Libraries". `unbundle: true` produce un file di output per ogni modulo sorgente ([docs unbundle](https://tsdown.dev/options/unbundle)). Genera anche i `.d.ts` (`dts: true`). tsup stesso rimanda a tsdown e ha una [guida di migrazione](https://tsdown.dev/guide/migrate-from-tsup).
- **tsup**: deprecato dal suo README (vedi tabella). Da escludere per un progetto nuovo.
- **Vite library mode** (Vite 8): funziona, ma è pensato per le app. Per le directive richiede di configurare rolldown a mano (sezione 4) e i `.d.ts` richiedono un plugin. Non ho trovato un vantaggio concreto per questo caso.
- Le librerie reali osservate: Astryx produce output non bundlato, un file per componente (`dist/Button/Button.js`). HeroUI fa lo stesso (`dist/components/button/button.js`).

## 4. `"use client"`, ESM-only, tree-shaking

- La docs di Next 16 ("Advice for Library Authors", [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), aggiornata 2026-10-05) dice di aggiungere `"use client"` agli entry point che usano funzioni solo client, così l'utente può importarli da un Server Component senza wrapper. Avverte anche che "some bundlers might strip out" la directive.
- Rolldown ([Directives](https://rolldown.rs/in-depth/directives)) emette una directive top-level solo se il modulo è un entry oppure se `output.preserveModules` è attivo. In alternativa c'è `output.banner`, che però la mette su *tutti* i file e rende client anche i componenti che potrebbero restare server.
- **Prova 1**: tsdown 0.23.7 con `unbundle: true` conserva `"use client";` in testa a `dist/button.js` e non lo aggiunge a `dist/card.js` né a `dist/index.js`. Stampa un warning `MODULE_LEVEL_DIRECTIVE` ("may not be preserved"), ma l'output è corretto. Basta quindi scrivere la directive nei file sorgente dei soli componenti interattivi, senza plugin.
- Riscontro reale: Astryx ha `'use client'` in 504 file di `dist/`, HeroUI in 90, sempre per singolo file.
- **ESM-only**: Astryx core ha `"type": "module"` e il solo `default` ESM negli `exports`. HeroUI React ha solo `import`/`default`. Base UI, Radix e Flowbite spediscono ancora anche CJS, ma per supportare React 16-18. Con consumatori Next 16 e React 19, ESM-only non dà problemi (inferenza: non ho testato un consumatore CJS).
- **Tree-shaking**: output non bundlato più `sideEffects` nel `package.json`. Astryx: `"sideEffects": ["**/*.css", ...]`. HeroUI React: `"sideEffects": false`. Se il pacchetto contiene CSS, `["**/*.css"]` evita che il bundler scarti l'import del CSS.
- **peerDependencies**: Astryx `react`/`react-dom >=19.0.0`. HeroUI aggiunge `tailwindcss >=4.0.0`, che è coerente con la strada A.

## Raccomandazione (decide Roberto)

Pacchetto ESM-only costruito con **tsdown** (`unbundle: true`, `dts: true`). Spedisce:
- `dist/**` JS con le classi Tailwind come stringhe, e `"use client"` scritto solo nei sorgenti dei componenti interattivi;
- un `styles.css` *sorgente* con `@source "./dist";`, il ponte `@theme inline { --color-*: var(--ui-*) }` e i temi come blocchi di variabili sotto `[data-theme="..."]`, chiaro e scuro (o file `themes/<nome>.css`, decisione del ticket "Distribuzione dei temi" della mappa).

`package.json` con `"type": "module"`, `exports` per `.` e `./styles.css` (più `./themes/*.css` se separati), `"sideEffects": ["**/*.css"]`, peer `react`, `react-dom` `^19` e `tailwindcss` `^4`. Nessuna dipendenza da Next.

Il consumatore Next 16 scrive:

```css
@import "tailwindcss";
@import "nome-lib/styles.css";
```

e imposta `data-theme` su `<html>`.

Da tenere in conto:
- Se il consumatore passa `className` ai componenti, le sue utility e quelle della libreria stanno nello stesso layer e vince l'ordine nel CSS generato, non l'ordine nell'attributo. Di solito si risolve con un merge di classi (es. `tailwind-merge`). Rientra nelle convenzioni API, non in questo ticket.
- Il percorso di `@source` in `styles.css` dipende da dove finisce il file rispetto a `dist/`. Va coperto da un test e2e su un consumatore reale (`npm pack` + app Next) prima della 0.1.

## Prove

Eseguite in una cartella temporanea, fuori dal repo.

1. **Directive con tsdown.** Sorgenti: `src/index.ts` (re-export), `src/button.tsx` (`'use client'` + `useState`), `src/card.tsx` (senza directive). Config: `defineConfig({ entry: ['src/index.ts'], unbundle: true, dts: true, platform: 'neutral' })`. Risultato con tsdown 0.23.7 / rolldown 1.3.3: `dist/button.js` inizia con `"use client";`, mentre `dist/card.js` e `dist/index.js` non lo hanno. I `.d.ts` vengono generati.
2. **`@source` dentro il pacchetto.** `node_modules/probe-ui/styles.css` contiene `@source "./dist";` + `@theme inline { --color-primary: var(--ui-primary); }` + variabili per `[data-theme="alpha"]` e `.dark`. `app.css` del consumatore: `@import "tailwindcss"; @import "probe-ui/styles.css";`. Con `@tailwindcss/cli` 4.3.5 l'output contiene `.bg-primary { background-color: var(--ui-primary); }` e `.rounded-lg` (classi presenti solo in `node_modules/probe-ui/dist`), più entrambi i blocchi di variabili.

## Non verificato

- Build reale di un'app Next 16.4 con Turbopack sul pacchetto: ho provato solo la CLI di Tailwind, non `@tailwindcss/postcss` dentro Next.
- `@theme reference` (usato da Astryx): non l'ho trovato nella pagina della docs che ho letto.
- La configurazione della monorepo di shadcn: la [pagina monorepo](https://ui.shadcn.com/docs/monorepo) mostra solo che il CSS sta in `packages/ui/src/styles/globals.css` ed è esportato come `"./globals.css"`. Non riporta le righe `@source`. shadcn non pubblica componenti su npm (si copiano), quindi conta poco come modello di pacchettizzazione.
