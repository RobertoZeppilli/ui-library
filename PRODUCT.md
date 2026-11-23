# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Agenti** (Claude Code, tai): l'utente principale. Scrivono la UI dei progetti React nuovi di Roberto e devono indovinare l'API giusta senza leggere la documentazione, o leggendo solo le docs spedite nel pacchetto installato.
- **Roberto**: autore della libreria e revisore di quello che gli agenti producono. Ci lavora poche ore a settimana.

Il pacchetto è pubblico su npm per comodità d'installazione. L'adozione da parte di altri non è un obiettivo: vetrina e README servono a Roberto e agli agenti, non a convincere sconosciuti.

## Product Purpose

`trama` è una UI library React personale: componenti accessibili e temi intercambiabili. Esiste per smettere di copiare componenti tra progetti, partire più veloce su un progetto nuovo e avere un'identità visiva riconoscibile. Ha successo quando un agente costruisce una schermata corretta, accessibile e nel tema giusto al primo colpo.

## Positioning

Una libreria pensata per essere scritta da agenti: API ancorata a shadcn (variante Base UI) perché è quella che gli agenti già conoscono, docs Markdown generate dal build dentro il pacchetto, e accessibilità WCAG 2.2 AA verificata da test automatici in CI su ogni componente, non solo dichiarata.

## Operating Context

- Consumatori: solo progetti nuovi; Next 16 è il caso tipico, ma la libreria non dipende da Next. fotosottocasa, release-tracker e robertoz restano fuori.
- Il consumatore fa `@import` del CSS di `trama` nel proprio Tailwind 4 e sceglie tema e schema con `data-theme` e `data-scheme`.
- Gli agenti leggono `node_modules/trama/AGENTS.md`, importato dal consumatore con `@node_modules/trama/AGENTS.md`.
- Vetrina: Storybook su GitHub Pages, con ogni componente in ogni tema e schema.

## Capabilities and Constraints

- Stack: React 19, TypeScript, Tailwind 4, primitive headless Base UI; pacchetto ESM-only costruito con tsdown; pnpm, Node 24.
- v0: 10 componenti in quest'ordine: Button, Stack, Text, Field+Input, Checkbox, Card, Select, Dialog, Menu, Toast.
- Due temi v0, ciascuno con schema chiaro e scuro: **Brutalista** (tema dell'identità) e **Neon notturno**. I temi valorizzano il contratto dei token (ADR 0001); le convenzioni dell'API sono in ADR 0002; i termini in `GLOSSARY.md`.
- Niente server MCP: le integrazioni per agenti passano dalla CLI (dopo la v0).
- Ogni decisione è dimensionata su poche ore di lavoro a settimana.
- Fuori scopo: framework diversi da React, adozione nei progetti esistenti.

## Brand Commitments

- Nome: `trama`, senza scope npm.
- Lingua: tutto il materiale pubblico (README, vetrina, docs per agenti, changelog) è in inglese. Issue, ADR, glossario e documenti interni restano in italiano.

## Evidence on Hand

Nessun utente esterno, testimonial o metrica d'uso: non vanno inventati. Le prove sono i test (accessibilità, contrasto delle coppie del contratto) e i prototipi in `prototypes/`.

## Product Principles

1. L'agente indovina: dove esiste un nome in shadcn si usa quello; ogni scostamento ha un motivo scritto.
2. L'accessibilità si prova, non si dichiara: un componente o un tema che non passa i test non si pubblica.
3. Il tema è un contratto: i componenti leggono solo token, e un tema nuovo non tocca i componenti.
4. Poco e finito: meglio dieci componenti completi che venti a metà, viste le poche ore a settimana.

## Accessibility & Inclusion

- WCAG 2.2 AA su ogni componente, verificato in CI (axe fino a `wcag22aa`) in tutte le combinazioni tema × schema; focus visibile e contrasto non testuale in una checklist manuale.
- Navigazione da tastiera completa: ogni interazione è raggiungibile e azionabile da tastiera, verificata con test `play`.
- `prefers-reduced-motion` rispettato da ogni tema, compreso il motion del Neon notturno.
