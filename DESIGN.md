---
name: trama
description: UI library React con un contratto di token fisso e temi intercambiabili; v0 con Brutalista e Neon notturno.
colors:
  brutalista-background: "light-dark(oklch(0.97 0.05 100), oklch(0.15 0 0))"
  brutalista-foreground: "light-dark(oklch(0.15 0 0), oklch(0.96 0.06 100))"
  brutalista-card: "light-dark(oklch(1 0 0), oklch(0.2 0 0))"
  brutalista-primary: "light-dark(oklch(0.15 0 0), oklch(0.9 0.17 100))"
  brutalista-primary-foreground: "light-dark(oklch(0.97 0.05 100), oklch(0.15 0 0))"
  brutalista-secondary: "light-dark(oklch(0.85 0.12 200), oklch(0.45 0.1 200))"
  brutalista-secondary-foreground: "light-dark(oklch(0.15 0 0), oklch(0.98 0 0))"
  brutalista-muted: "light-dark(oklch(0.92 0.04 100), oklch(0.24 0 0))"
  brutalista-muted-foreground: "light-dark(oklch(0.4 0.02 100), oklch(0.78 0.03 100))"
  brutalista-accent: "light-dark(oklch(0.82 0.15 350), oklch(0.5 0.17 350))"
  brutalista-accent-foreground: "light-dark(oklch(0.15 0 0), oklch(0.98 0 0))"
  brutalista-destructive: "light-dark(oklch(0.55 0.22 28), oklch(0.68 0.2 28))"
  brutalista-destructive-foreground: "light-dark(oklch(1 0 0), oklch(0.15 0 0))"
  brutalista-ring: "light-dark(oklch(0.55 0.22 28), oklch(0.9 0.17 100))"
  neon-background: "light-dark(oklch(0.97 0.012 300), oklch(0.15 0.035 285))"
  neon-foreground: "light-dark(oklch(0.22 0.05 285), oklch(0.95 0.02 285))"
  neon-card: "light-dark(oklch(1 0 0), oklch(0.19 0.04 285))"
  neon-popover: "light-dark(oklch(1 0 0), oklch(0.21 0.045 285))"
  neon-primary: "light-dark(oklch(0.5 0.24 330), oklch(0.86 0.19 165))"
  neon-primary-foreground: "light-dark(oklch(0.99 0 0), oklch(0.18 0.05 165))"
  neon-secondary: "light-dark(oklch(0.93 0.04 220), oklch(0.3 0.08 230))"
  neon-secondary-foreground: "light-dark(oklch(0.3 0.09 230), oklch(0.9 0.08 210))"
  neon-muted: "light-dark(oklch(0.94 0.012 300), oklch(0.22 0.04 285))"
  neon-muted-foreground: "light-dark(oklch(0.48 0.04 285), oklch(0.74 0.04 285))"
  neon-accent: "light-dark(oklch(0.93 0.06 330), oklch(0.32 0.12 330))"
  neon-accent-foreground: "light-dark(oklch(0.35 0.15 330), oklch(0.93 0.06 330))"
  neon-destructive: "light-dark(oklch(0.53 0.21 20), oklch(0.72 0.19 20))"
  neon-destructive-foreground: "light-dark(oklch(1 0 0), oklch(0.16 0.05 20))"
  neon-border: "light-dark(oklch(0.88 0.03 300), oklch(0.32 0.06 285))"
  neon-input: "light-dark(oklch(0.6 0.06 300), oklch(0.58 0.08 285))"
typography:
  brutalista-heading:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1.15
  brutalista-body:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  brutalista-mono:
    fontFamily: "ui-monospace, monospace"
  neon-heading:
    fontFamily: "Unbounded, system-ui, sans-serif"
    fontWeight: 600
    lineHeight: 1.15
  neon-body:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  neon-mono:
    fontFamily: "Space Mono, ui-monospace, monospace"
rounded:
  brutalista: "0rem"
  neon: "0.625rem"
spacing:
  brutalista-unit: "0.25rem"
  neon-unit: "0.27rem"
components:
  button-primary:
    backgroundColor: "{colors.brutalista-primary}"
    textColor: "{colors.brutalista-primary-foreground}"
    rounded: "{rounded.brutalista}"
    padding: "calc(var(--spacing) * 2) calc(var(--spacing) * 4)"
  card:
    backgroundColor: "{colors.brutalista-card}"
    textColor: "{colors.brutalista-foreground}"
    rounded: "{rounded.brutalista}"
    padding: "calc(var(--spacing) * 5)"
---

# Design System: trama

<!-- Fonte dei valori: prototipo approvato sul branch prototype/temi-v0 (prototypes/temi-v0/index.html), decisioni #10 e #15, contratto in ADR 0001. Rilanciare /impeccable document quando themes/*.css esistono: da lì in poi la fonte sono quei file. -->

## Overview

**Creative North Star: "Un telaio, molti tessuti"**

`trama` è un telaio: il contratto dei token (ADR 0001) è l'ordito fisso, uguale per ogni tema, e i componenti ci lavorano sopra senza sapere quale tessuto ne uscirà. Ogni tema è un tessuto diverso intrecciato sugli stessi fili. La prova che il telaio funziona è che i due temi della v0 sono lontani su ogni asse che il contratto regge: raggio, ombra, motion, spessore dei bordi, tipografia, densità.

Il **Brutalista** è il tema dell'identità: carta gialla, inchiostro nero, bordi pieni, ombre piatte sfalsate, nessun arrotondamento e nessun movimento. Il **Neon notturno** nasce scuro: fondo viola-notte, primario menta che emana un alone, angoli morbidi, motion lento e fluido; in chiaro diventa carta fotografica con primario magenta. I componenti sono gli stessi; cambia solo il tessuto.

Scartati perché già visti (estetica shadcn/SaaS): Morbido, Tecnico denso, Editoriale (#10). Scartati perché il contratto non li regge o perché troppo vicini al Brutalista: Risograph, Retro OS, Svizzero tipografico (#15).

**Key Characteristics:**
- Un solo contratto di token, valorizzato per intero da ogni tema; i componenti leggono solo `--ui-*`.
- Ogni colore si scrive una volta con `light-dark()`; lo schema lo sceglie `data-scheme` o il sistema.
- Ogni tema × schema passa AA sulle coppie del contratto, verificato in CI.
- I temi divergono sul serio: un tema nuovo che somiglia a uno esistente non entra.

## Colors

I colori sono ruoli semantici del lessico shadcn, con un `-foreground` per ogni superficie; ogni tema dà un valore a ogni ruolo, in chiaro e in scuro.

### Primary
- **Inchiostro / Giallo segnale** (`brutalista-primary`): nel chiaro il primario è il nero del testo, nel scuro diventa giallo pieno. Azione principale, checkbox selezionata.
- **Magenta fotografico / Menta neon** (`neon-primary`): magenta in chiaro, menta in scuro. Colora anche l'alone delle ombre e il ring del focus.

### Secondary
- **Ciano tipografico** (`brutalista-secondary`): bottone secondario e badge.
- **Azzurro velato** (`neon-secondary`): stesso ruolo, tenue in chiaro e blu notte in scuro.

### Tertiary
- **Rosa evidenziatore** (`brutalista-accent`): voce evidenziata di menu, hover dei bottoni ghost.
- **Rosa orchidea** (`neon-accent`): stesso ruolo.

### Neutral
- **Carta gialla / Nero pieno** (`brutalista-background`): fondo della pagina. La card è bianca in chiaro (`brutalista-card`), così si stacca dal giallo.
- **Viola-notte / Carta fotografica** (`neon-background`): fondo; card e popover sono un gradino più chiari in scuro.
- **Testo attenuato** (`*-muted-foreground`): descrizioni, metadati; passa 4.5:1 sul fondo.
- **Bordi**: nel Brutalista bordi e input sono il colore del testo; nel Neon i bordi sono tenui (`neon-border`) e gli input più marcati (`neon-input`, 3:1).
- **Distruttivo** (`*-destructive`): rosso, solo per errori e azioni distruttive.

### Named Rules
**La Regola del Contratto.** Un colore che non è un token del contratto non esiste: niente palette di Tailwind, niente valori nei componenti. Un test lo vieta nei sorgenti della libreria.

**La Regola delle Coppie.** Ogni superficie ha il suo `-foreground`, e la coppia passa 4.5:1 (testo) o 3:1 (bordi input e ring) in entrambi gli schemi. Un tema che non passa non si pubblica.

**La Regola dello Schema Unico.** Mai `dark:` nei componenti: lo schema vive solo nei valori `light-dark()` del tema.

## Typography

**Brutalista:** Space Grotesk per tutto (titoli 700), mono di sistema.
**Neon notturno:** Unbounded per i titoli (600), Inter Tight per il testo, Space Mono per il mono.

**Character:** il Brutalista parla con una sola voce, grottesca e piena; il Neon contrappone un titolo largo e geometrico a un testo stretto e leggibile.

I font li carica il consumatore; il tema dichiara solo `--ui-font-sans`, `--ui-font-heading`, `--ui-font-mono` (con fallback) e `--ui-heading-weight`.

### Hierarchy
- **Headline** (peso del tema, 2rem, 1.15): titolo di pagina.
- **Title** (peso del tema, 1.35rem, 1.15): titolo di sezione o card.
- **Subtitle** (peso del tema, 1.05rem, 1.15): titolo di gruppo.
- **Body** (400, 15px, 1.5): testo corrente, input, voci di menu.
- **Label** (600, 0.9em): etichette dei campi e testo dei bottoni.
- **Caption** (400, 0.85em): descrizioni ed errori (errori 600 nel colore distruttivo).

### Named Rules
**La Regola della Scala Condivisa.** Il contratto non ha una scala tipografica: le dimensioni sono uguali in ogni tema, cambiano solo famiglie e peso dei titoli. Un tema che vuole una scala sua chiede prima un token nel contratto.

## Layout

Lo spazio passa da `--spacing` di Tailwind, che il tema ridefinisce: Brutalista `0.25rem`, Neon `0.27rem`, quindi il Neon è un po' più arioso e la densità del tema vale anche per il layout del consumatore. Stack e Text espongono `gap` e dimensioni sulla scala del tema, con oggetti responsive mobile-first (`initial` + breakpoint di Tailwind, ADR 0002).

## Elevation & Depth

Le ombre sono due token del contratto, `--ui-shadow-sm` (bottoni, card) e `--ui-shadow-md` (popover, dialog), e cambiano natura da un tema all'altro.

### Shadow Vocabulary
- **Brutalista, piena sfalsata** (`3px 3px 0` e `6px 6px 0` nel colore del testo): nessuno sfocato, sembra un foglio incollato sopra un altro.
- **Neon, alone** (`0 0 18px -4px` al 55% del primario; `md` aggiunge un filo di 1px e un alone `0 12px 40px -8px` al 45%): con `color-mix` sul primario, quindi l'alone segue il tema e lo schema.

### Named Rules
**La Regola dell'Ombra nel Colore.** Un'ombra che deve cambiare con lo schema prende il colore da un token (`--ui-foreground`, `--ui-primary`), mai un nero fisso.

## Shapes

Il raggio è un solo token, `--ui-radius` (Brutalista `0`, Neon `0.625rem`); i componenti ne usano frazioni (bottoni e input `× 0.75`, voci di menu `× 0.5`, checkbox `× 0.35`), così un tema cambia tutti gli angoli insieme. Lo spessore dei bordi è `--ui-border-width` (Brutalista `2px`, Neon `1px`, default del contratto `1px`). Il motion è `--ui-duration` + `--ui-ease`: Brutalista `0ms` / `steps(1)`, Neon `260ms` / `cubic-bezier(.2, .8, .2, 1)`. Con `prefers-reduced-motion` ogni tema azzera le transizioni.

## Components

Riferimenti visivi dal prototipo; nomi, parti e varianti seguono shadcn (Base UI) come da ADR 0002.

### Buttons
- **Shape:** `--ui-radius × 0.75`, bordo di `--ui-border-width`.
- **Primary:** fondo primario, testo `primary-foreground`, peso 600, padding `2 × 4` unità di spaziatura, ombra `sm`.
- **Hover / Active:** sale di 1px e scende di 1px, con la durata del tema (nel Brutalista lo scatto è istantaneo).
- **Varianti:** `secondary` (fondo secondario), `outline` (trasparente, bordo `--ui-border`, senza ombra), `ghost` (trasparente, hover con fondo accent), `destructive`. Dimensioni `sm`, default, `lg`. Disabilitato al 50% di opacità.

### Cards / Containers
- **Corner Style:** `--ui-radius`.
- **Background:** `--ui-card` con `card-foreground`.
- **Shadow Strategy:** `--ui-shadow-sm`.
- **Border:** `--ui-border-width` in `--ui-border`.
- **Internal Padding:** 5 unità di spaziatura.

### Inputs / Fields
- **Style:** fondo `--ui-background`, bordo `--ui-border-width` in `--ui-input`, raggio `× 0.75`, padding `2 × 3`.
- **Focus:** outline 2px in `--ui-ring` con offset 2px, solo su `:focus-visible`.
- **Error:** bordo distruttivo (`aria-invalid`) e messaggio in caption distruttivo.
- **Checkbox:** 18px, bordo `--ui-input`; selezionata prende il primario.

### Popover, Menu, Dialog
- Fondo `--ui-popover`, bordo e raggio del tema, ombra `md`. Voce evidenziata in accent, voce pericolosa nel colore distruttivo, separatori alti quanto il bordo.

## Do's and Don'ts

### Do:
- **Do** leggi solo token `--ui-*` (e `--spacing`) nei componenti, con le frazioni di raggio indicate sopra.
- **Do** metti il focus come outline 2px in `--ui-ring` su `:focus-visible`, in ogni tema e su ogni elemento interattivo.
- **Do** aggiungi un token al contratto, con default neutro, quando un tema nuovo non si esprime senza (com'è stato per `--ui-border-width`).
- **Do** guarda e testa ogni componente nelle 4 combinazioni tema × schema.

### Don't:
- **Don't** usare `dark:`, la palette di Tailwind o colori letterali nei componenti.
- **Don't** togliere l'outline dagli input per "pulizia" visiva: serve un segnale di focus (WCAG 2.4.7).
- **Don't** mettere ombre sfocate nel Brutalista o ombre nere fisse nel Neon.
- **Don't** aggiungere un tema che somiglia all'estetica shadcn/SaaS o a un tema esistente.

### Aperto
- Nel Brutalista chiaro `--ui-ring` è rosso come `--ui-destructive`: il focus si confonde con l'errore. Si decide nel ticket del tema Brutalista, con il test di contrasto 3:1.
