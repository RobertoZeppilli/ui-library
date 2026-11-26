// The README block the consumer pastes into their AGENTS.md names the version twice: in the start marker and in the heading.
export function agentsBlockVersionErrors(readme: string, version: string): string[] {
  const found = [
    ["start marker", /<!-- trama:agents:start v(\S+) -->/.exec(readme)?.[1]],
    ["heading", /^## trama \(v([^)]+)\)$/m.exec(readme)?.[1]],
  ] as const;
  return found.flatMap(([where, v]) =>
    v === version ? [] : [`README agents block ${where} says ${v === undefined ? "nothing" : `v${v}`}, package.json says ${version}`],
  );
}
