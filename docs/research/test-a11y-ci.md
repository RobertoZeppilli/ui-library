# Test automatici di accessibilità in CI

Ricerca per #5 (mappa #2). Data: 2026-11-23. Fonti primarie citate per ogni affermazione; versioni lette dal registry npm (`npm view <pkg> version`) lo stesso giorno.

## Domanda

Con quale setup si verifica WCAG 2.2 AA automaticamente su ogni componente e su ogni tema (chiaro e scuro)? Confronto fra axe-core con Vitest browser mode, Playwright e Storybook test runner; cosa coprono i test automatici e cosa no; come si testa la tastiera; costo con poche ore a settimana.

## Versioni correnti (npm, 2026-11-23)

| Pacchetto | Versione |
|---|---|
| `axe-core` | 4.14.1 |
| `vitest`, `@vitest/browser-playwright` | 5.1.1 |
| `vitest-browser-react` | 2.3.0 |
| `@playwright/test` | 1.65.1 |
| `@axe-core/playwright` | 4.14.0 |
| `storybook`, `@storybook/addon-a11y`, `@storybook/addon-vitest` | 10.6.8 |
| `@storybook/test-runner` | 0.26.1 |
| `vitest-axe` | 0.1.0 (ultimo rilascio gennaio 2025, fermo) |

## Risposta breve

- Il motore è sempre **axe-core**: tutte e tre le opzioni lo eseguono sul DOM renderizzato in un browser vero. Cambia solo il runner.
- **Storybook test runner: da scartare.** La documentazione dice che "has been superseded by the Vitest addon" e che con un framework Vite "we recommend using the Vitest addon instead of the test runner" ([test-runner](https://storybook.js.org/docs/writing-tests/integrations/test-runner)). Richiede anche Jest e un'istanza di Storybook in esecuzione.
- **Opzione consigliata: Storybook + `@storybook/addon-vitest` + `@storybook/addon-a11y`**, che gira su Vitest browser mode con Playwright/Chromium. Ogni story diventa un test (smoke render + `play` + axe) senza scrivere test a mano ([vitest-addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon), [accessibility-testing](https://storybook.js.org/docs/writing-tests/accessibility-testing)). Dà anche la vetrina per umani, che nella mappa è ancora aperta.
- **Alternativa senza Storybook: Vitest browser mode + `axe-core` chiamato direttamente** in un test che renderizza ogni componente sotto ogni tema. Meno dipendenze, ma l'elenco dei casi da testare va mantenuto a mano.
- **Playwright Test + `@axe-core/playwright`** è pensato per pagine intere (`AxeBuilder({ page })`) ([playwright a11y](https://playwright.dev/docs/accessibility-testing)). Per una libreria di componenti serve una pagina-fixture per componente: più lavoro, nessun vantaggio rispetto alle prime due. Utile solo per `toMatchAriaSnapshot` (vedi sotto).

## Confronto

| | Storybook + addon-vitest | Vitest browser + axe-core | Playwright + @axe-core/playwright | Storybook test-runner |
|---|---|---|---|---|
| Browser vero | Sì (Vitest browser, Playwright Chromium) | Sì | Sì | Sì |
| Casi di test | Le story stesse | Scritti a mano | Pagine/fixture scritte a mano | Le story |
| Serve Storybook avviato | No | No | No (serve un server di fixture) | Sì |
| Stato | Raccomandato da Storybook | Stabile | Stabile | "Superseded" |
| Temi | `globals` per story o progetto Vitest per tema | Loop sui temi nel test | `test.describe` per tema | Come addon |
| Dipendenze in più | storybook, 2 addon, addon-themes | axe-core | @playwright/test, @axe-core/playwright | Jest + storybook |

## Configurare WCAG 2.2 AA

- I tag di axe non sono cumulativi: per AA bisogna elencare tutti i livelli. "To run both Level A and Level AA rules, list both `wcag2a` and `wcag2aa`" ([axe API](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md)).
- Per WCAG 2.2 AA: `['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']`, più `best-practice` se si vuole.
- **WCAG 2.2 aggiunge una sola regola in axe**: `target-size` (SC 2.5.8, tag `wcag22aa`), **disattivata di default** "until WCAG 2.2 is more widely adopted" ([rule-descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)). Va abilitata esplicitamente; includere il tag in `runOnly` la seleziona.
- Storybook: di default l'addon esegue WCAG 2.0/2.1 A/AA + best practice e disattiva la regola `region`. Cambiando `runOnly` "explicitly re-specify the defaults" ([accessibility-testing](https://storybook.js.org/docs/writing-tests/accessibility-testing)).
- Storybook: in CI falliscono solo le story con `parameters.a11y.test: 'error'` ("Accessibility tests will only produce errors in CI if you have set parameters.a11y.test to 'error'"). Va messo a livello di progetto in `.storybook/preview`, altrimenti le violazioni restano avvisi (`'todo'`).

Esempio (`.storybook/preview.ts`):

```ts
parameters: {
  a11y: {
    test: 'error',
    options: { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
  },
},
```

## Più temi, chiaro e scuro

Il contrasto (`color-contrast`, SC 1.4.3) è calcolato sugli stili applicati, quindi ogni combinazione tema × modo va renderizzata e controllata a parte: 2 temi × 2 modi = 4 passate per componente.

- **Storybook**: `@storybook/addon-themes` applica il tema con `withThemeByDataAttribute` / `withThemeByClassName` su `html` ([addon-themes API](https://github.com/storybookjs/storybook/blob/next/code/addons/themes/docs/api.md)). Una story può fissare un global con `globals: { ... }` ([toolbars-and-globals](https://storybook.js.org/docs/essentials/toolbars-and-globals)). La documentazione **non dice** se i globals cambiano per ogni run dell'addon-vitest: le strade sono (a) story duplicate per tema con `globals`, oppure (b) più progetti Vitest con un `initialGlobals` diverso. Da verificare con un prototipo prima di decidere: è il punto debole di questa opzione.
- **Vitest browser + axe-core**: un loop esplicito che imposta `document.documentElement.dataset.theme`/`.mode` e chiama `axe.run(container, { runOnly })`. Nessuna incertezza, tutto codice proprio.
- Se il modo scuro dipende da `prefers-color-scheme` e non da un attributo, servono emulazione media del browser (Playwright `colorScheme`). Un attributo su `html` è più semplice da testare: da tenere presente nel ticket sul contratto dei temi.

## Cosa coprono i test automatici e cosa no

Storybook stesso dice che axe "automatically catches up to 57% of WCAG issues" ([accessibility-testing](https://storybook.js.org/docs/writing-tests/accessibility-testing)); Playwright: "automated testing cannot detect all types of WCAG violations" ([playwright a11y](https://playwright.dev/docs/accessibility-testing)).

**Coperto da axe** (regole attive di default, [rule-descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)):
- Contrasto del testo, SC 1.4.3 (`color-contrast`). Niente verdetto con `background-image`, testo coperto da altri elementi o rapporto 1:1 (finisce in "incomplete"); gradienti, pseudo-elementi e bordi sono casi difficili ([color-contrast](https://dequeuniversity.com/rules/axe/4.11/color-contrast)).
- ARIA e ruoli: attributi validi, ruoli ammessi, nomi accessibili, `nested-interactive` (SC 4.1.2).
- Alcune regole di tastiera statiche: `scrollable-region-focusable` (SC 2.1.1), `tabindex` positivo (best practice).
- Target size, SC 2.5.8, solo se abilitata.

**Non coperto da axe** (nessuna regola con quei tag nell'elenco):
- **Contrasto non testuale**, SC 1.4.11: bordi di input, icone, **indicatore di focus**.
- **Focus visibile**, SC 2.4.7, e **focus non nascosto**, SC 2.4.11 (nuovo in 2.2).
- **Ordine del focus**, SC 2.4.3: `focus-order-semantics` è sperimentale e disattivata.
- **Operabilità da tastiera**, SC 2.1.1/2.1.2: frecce in menu/tabs, Esc che chiude, focus trap nei dialog, ritorno del focus.
- Gli altri criteri nuovi di 2.2 (2.5.7 dragging, 3.2.6, 3.3.7, 3.3.8) sono soprattutto di pagina/flusso, poco rilevanti per componenti base.
- I risultati "incomplete" (needs review) "could not be definitively passed or failed" e richiedono revisione manuale ([axe API](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md)).

## Testare la tastiera

Servono test di interazione scritti a mano, uno per pattern (button, dialog, menu, tabs, ...), seguendo i pattern ARIA APG.

- **Vitest browser mode** (vale anche per le `play` function di Storybook, che girano lì): `userEvent.keyboard('{ArrowDown}')`, `userEvent.tab()`, `userEvent.tab({ shift: true })`, poi `expect(el).toHaveFocus()`. Con il provider Playwright gli eventi sono **reali** (CDP), non simulati; il provider `preview` invece simula con `@testing-library/user-event` ([interactivity-api](https://vitest.dev/guide/browser/interactivity-api)). Va usato il provider Playwright.
- Matcher utili già in Vitest: `toHaveFocus`, `toHaveRole`, `toHaveAccessibleName`, `toHaveAccessibleDescription`, `toHaveAccessibleErrorMessage`, `toBeDisabled`, `toBeChecked` ([assertion-api](https://vitest.dev/guide/browser/assertion-api)). Vitest non integra axe: si chiama `axe-core` direttamente o tramite l'addon Storybook.
- **Playwright Test** ha in più `toMatchAriaSnapshot`, che confronta l'albero di accessibilità con un template YAML ([aria-snapshots](https://playwright.dev/docs/aria-snapshots)). Non è documentato in Vitest. Utile, ma non basta da solo a giustificare un secondo runner.
- Focus visibile e contrasto dell'indicatore (1.4.11, 2.4.7) restano fuori: si possono coprire in parte con test visivi/screenshot, oppure con un controllo manuale per componente nuovo.

## Costo con poche ore a settimana (stima)

Stime mie, non da fonti.

- **Storybook + addon-vitest + addon-a11y + addon-themes**: setup ~1 sessione (`npx storybook@latest init` installa e configura Vitest), più prototipo per verificare i temi nei test. Manutenzione bassa per componente: si scrive la story, il test axe viene gratis; per la tastiera si aggiunge una `play`. Costo ricorrente: aggiornamenti delle major di Storybook (oggi 10.x) e Vitest (oggi 5.x), che devono restare compatibili fra loro.
- **Vitest browser + axe-core**: setup più rapido (poche dipendenze), ma ogni componente richiede di aggiungerlo all'elenco del test a11y e scrivere i casi. Nessuna vetrina.
- **Playwright + @axe-core/playwright**: setup e manutenzione più alti (server di fixture, pagine per componente). Sconsigliato come base.
- CI: un job con `npx playwright install --with-deps chromium` e `vitest run`. Con molti componenti c'è lo sharding (`vitest run --shard=1/3`), citato nella pagina dell'addon.
- Manuale, non eliminabile: un passaggio da tastiera e screen reader a ogni componente nuovo, con checklist breve (focus visibile, ordine, Esc, frecce).

## Raccomandazione

Storybook 10 con `addon-vitest`, `addon-a11y` (`test: 'error'`, tag fino a `wcag22aa`) e `addon-themes`, in CI su Chromium via Playwright. Test `play` per la tastiera sui componenti interattivi. Checklist manuale per 1.4.11, 2.4.7 e 2.4.11. Prima di confermarla, un prototipo di mezz'ora che dimostri le 4 combinazioni tema × modo eseguite in CI. Se fallisce, si passa a Vitest browser + axe-core con loop sui temi. Così si chiude anche la voce "vetrina" della mappa. La decisione resta a Roberto.

## Punti aperti

- Come far girare ogni story sotto 4 combinazioni di globals nell'addon-vitest: non documentato, da prototipare.
- Il modo scuro andrà su attributo/classe o su `prefers-color-scheme`? Cambia il setup dei test (dipende dal ticket sul contratto dei temi).
- `target-size` può dare falsi positivi su componenti isolati (dipende dallo spazio intorno): da osservare nel prototipo.
