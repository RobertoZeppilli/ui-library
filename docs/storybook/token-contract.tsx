import contract from "../../contract.json" with { type: "json" };
import { contractModel } from "../../.storybook/contract";

// Every themes/*.css is picked up, so a new theme or token appears here without touching the MDX.
const sources = import.meta.glob<string>("../../themes/*.css", { query: "?raw", import: "default", eager: true });
const themes = Object.fromEntries(
  Object.entries(sources).map(([path, css]) => [path.split("/").pop()!.replace(/\.css$/, ""), css]),
);
const model = contractModel(themes, contract.pairs as [string, string, number][]);

const cell = { border: "1px solid #8884", padding: "0.25rem 0.5rem", textAlign: "left", verticalAlign: "top" } as const;
const table = { borderCollapse: "collapse", fontSize: "0.8125rem", width: "100%" } as const;
const scroll = { overflowX: "auto" } as const;

export function TokenContract() {
  const themeNames = Object.keys(themes);
  return (
    <>
      <h2>Tokens</h2>
      <p>
        Every <code>--ui-*</code> custom property a theme defines, read from <code>themes/*.css</code>. A dash means the theme does not
        define it.
      </p>
      <div style={scroll}>
        <table style={table} data-testid="token-table">
          <thead>
            <tr>
              <th style={cell}>Token</th>
              {themeNames.map((t) => (
                <th key={t} style={cell}>
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.tokens.map(({ name, values }) => (
              <tr key={name}>
                <td style={cell}>
                  <code>{name}</code>
                </td>
                {themeNames.map((t) => (
                  <td key={t} style={cell}>
                    {values[t] ? <code>{values[t]}</code> : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Contrast pairs</h2>
      <p>
        Each pair must reach its minimum ratio in every theme and scheme; CI fails otherwise. Ratios below the minimum are marked
        with &quot;FAIL&quot;.
      </p>
      <div style={scroll}>
        <table style={table} data-testid="pair-table">
          <thead>
            <tr>
              <th style={cell}>Foreground / background</th>
              <th style={cell}>Min</th>
              {model.pairs[0]?.ratios.map(({ theme, scheme }) => (
                <th key={`${theme}-${scheme}`} style={cell}>
                  {theme} {scheme}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.pairs.map(({ fg, bg, min, ratios }) => (
              <tr key={`${fg}/${bg}`}>
                <td style={cell}>
                  <code>
                    {fg} / {bg}
                  </code>
                </td>
                <td style={cell}>{min}:1</td>
                {ratios.map(({ theme, scheme, ratio }) => (
                  <td key={`${theme}-${scheme}`} style={cell}>
                    {ratio.toFixed(2)}:1{ratio < min ? " FAIL" : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
