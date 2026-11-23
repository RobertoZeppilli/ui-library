# PROTOTIPO, da buttare: classi responsive nel CSS del consumatore

Ticket: https://github.com/RobertoZeppilli/ui-library/issues/22

- `pkg/`: finto `trama` con due Stack. `StackA` = classi pre-generate valore × breakpoint. `StackB` = classi fisse + variabili CSS inline.
- `app/`: Next 16 + Turbopack che lo consuma come dipendenza `file:`.
- `measure.sh`: build dell'app con nessuno / A / B, stampa peso del CSS finale.
