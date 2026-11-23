# API dei componenti ancorata a shadcn (Base UI), polimorfismo solo con `render`

La libreria la usano soprattutto agenti, e il criterio è che un agente indovini l'API giusta senza leggere la documentazione. Per questo, dove un componente esiste in shadcn/ui (variante Base UI), ne copiamo nomi, parti esportate piatte (`Dialog`, `DialogTrigger`, `DialogContent`), prop e valori delle varianti (`variant`/`size`). Ce ne discostiamo solo con un motivo scritto (accessibilità, contratto dei token). Il polimorfismo passa solo per `render`, il meccanismo nativo di Base UI, anche sui componenti di layout. Niente `as` né `asChild`.

## Convenzioni

- `className` su ogni componente e ogni parte, unito alle classi interne con `cn()` (clsx + tailwind-merge): vince il consumatore.
- Stato controllato e non controllato con la tripletta di Base UI (`open`/`defaultOpen`/`onOpenChange`, `value`/`defaultValue`/`onValueChange`, …) senza rinomini.
- `ref` come prop normale (React 19). Le altre props HTML vanno sulla radice della parte, i tipi estendono quelli della parte Base UI e ogni parte ha `data-slot`.
- Componenti di layout (Stack, Text), che shadcn non ha: props a valori chiusi legati ai token (`gap` sulla scala `--spacing`, `size`, `tone` solo su Text). Le props di layout accettano anche un oggetto responsive mobile-first con i breakpoint di Tailwind più `initial` (`gap={{ initial: "2", md: "4" }}`). `variant` e `size` dei componenti non sono responsive.

## Considered Options

- **API grezza di Base UI** (namespace `Dialog.Trigger`): più vicina alla primitiva headless, ma meno presente nei dati di training degli agenti.
- **API nostra**: più coerente, ma da imparare dalle docs, che è proprio il costo da evitare.
- **`asChild`** (Radix e vecchio shadcn): gli agenti lo scrivono per abitudine, ma tenerlo accanto a `render` significa due modi per la stessa cosa. Lo intercettano i tipi.
- **Asse `tone` separato su Button** (enfasi × colore): scartato per restare sui valori di shadcn (`destructive` è un valore di `variant`).
- **Solo valori singoli sui layout** con i breakpoint via `className`: meno CSS generato, scartato perché l'oggetto responsive è più prevedibile per un agente.

## Consequences

- Prima di inventare un nome si controlla shadcn (Base UI). Ogni scostamento si annota nelle docs del componente.
- Un `asChild` scritto per abitudine dà errore TS. Lo snippet `AGENTS.md` lo dice esplicitamente.
- Le classi responsive dei layout vanno pre-generate per ogni valore × breakpoint e devono arrivare a Tailwind del consumatore: pesa sul CSS ed è da verificare con il primo Stack.
