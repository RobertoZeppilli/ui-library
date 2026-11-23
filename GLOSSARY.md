# ui-library

UI library personale per progetti React nuovi: componenti accessibili e temi intercambiabili, pensati per essere usati soprattutto da agenti.

## Temi

**Tema**:
L'identità visiva di un progetto: colori, font, raggi, spessore dei bordi, ombre, motion e spaziatura, espressi come valori dei token del contratto.
_Avoid_: skin, stile, brand

**Schema**:
La variante chiara o scura di un tema. Ogni tema ha entrambi gli schemi.
_Avoid_: modo, variante, dark mode (come nome del concetto)

**Contratto dei token**:
L'insieme pubblico di token che ogni tema deve valorizzare perché i componenti funzionino. Include le coppie di colori con il loro contrasto minimo.
_Avoid_: design system, specifica del tema

**Token semantico**:
Un token del contratto che nomina un ruolo (superficie, testo su superficie, bordo, raggio), non un valore.
_Avoid_: alias, token globale

**Token di componente**:
Un token facoltativo del contratto che riguarda un solo componente e di default prende il valore di un token semantico.
_Avoid_: token locale, override

**Primitivo**:
Un valore grezzo della palette di un tema, privato del tema e fuori dal contratto.
_Avoid_: token base, token di palette, primitiva

## Componenti

**Primitiva headless**:
Un componente senza stile, fornito da una libreria esterna, che dà comportamento e accessibilità a un componente della libreria. Si scrive sempre con l'aggettivo, per non confonderla con un primitivo della palette.
_Avoid_: primitiva (da sola), base, headless component

**Componente di layout**:
Un componente senza comportamento che dispone o compone testo e altri componenti usando i token del tema (spaziatura, scala tipografica).
_Avoid_: primitiva di layout, layout primitive

**Parte**:
Uno dei componenti che insieme formano un componente composto, come il trigger o il contenuto di un dialog.
_Avoid_: slot, sottocomponente, pezzo

**Variante**:
L'enfasi visiva di un componente (pieno, contorno, trasparente, distruttivo), scelta fra valori chiusi.
_Avoid_: stile, tipo, aspetto

**Tono**:
Il colore semantico del testo in un componente di layout (normale, attenuato, distruttivo). I componenti interattivi non hanno un tono: il colore sta nella variante.
_Avoid_: colore (come nome della prop), variante di colore

**Prop responsive**:
Una prop di un componente di layout che accetta un valore diverso per ogni breakpoint, a partire da un valore iniziale senza media query.
_Avoid_: prop adattiva, breakpoint prop
