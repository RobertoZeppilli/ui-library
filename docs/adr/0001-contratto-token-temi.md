# Contratto pubblico dei token, schema con light-dark() e data-scheme

I temi si scambiano sugli stessi componenti solo se rispettano un contratto di token, e vogliamo che ogni progetto nuovo possa scriversi un tema suo: per questo il contratto (token semantici più token di componente facoltativi, lessico shadcn) è API pubblica, e rinominare o togliere un token è una breaking change. Lo schema chiaro/scuro si esprime con `light-dark()` nei valori dei colori e con l'attributo `data-scheme` che imposta solo `color-scheme`, non con la classe `.dark` di Tailwind/shadcn: così ogni colore si scrive una volta, schema e tema funzionano su qualsiasi sottoalbero e senza attributo vale lo schema del sistema.

## Considered Options

- **Classe `.dark` e variante `dark:`** (convenzione shadcn, compatibile con next-themes): scartata perché raddoppia i blocchi di variabili per tema e mette la logica dello schema nei componenti.
- **Due blocchi di variabili per tema** (`[data-theme=x]` e `[data-theme=x][data-scheme=dark]`): funziona anche per token che non sono colori, ma raddoppia le righe di ogni tema.
- **Solo token semantici**: contratto più piccolo, scartato per lasciare ai temi la possibilità di cambiare un singolo componente.

## Consequences

- I componenti non usano mai `dark:`. Un token non di colore che deve cambiare con lo schema (es. un'ombra) mette `light-dark()` sul suo colore.
- Un tema che non passa il test di contrasto delle coppie del contratto non si pubblica.
- Il tema ridefinisce `--spacing` di Tailwind, quindi la densità del tema vale anche per il layout del consumatore.
