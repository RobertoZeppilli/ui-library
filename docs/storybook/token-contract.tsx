import contract from "../../contract.json" with { type: "json" };
import { contractModel } from "../../.storybook/contract";

// Every themes/*.css is picked up, so a new theme or token appears here without touching the MDX.
const sources = import.meta.glob<string>("../../themes/*.css", { query: "?raw", import: "default", eager: true });
const themes = Object.fromEntries(
  Object.entries(sources).map(([path, css]) => [path.split("/").pop()!.replace(/\.css$/, ""), css]),
);
const model = contractModel(themes, contract.pairs as [string, string, number][]);

// The border utilities are important because the Storybook docs stylesheet sets its own border on table cells.
const cell = "border-ui! border-border! px-2 py-1 text-left align-top";
const table = "w-full border-collapse text-sm";
const scroll = "overflow-x-auto";

export function TokenContract() {
  const themeNames = Object.keys(themes);
  return (
    // Explicit theme and scheme: a docs-only page has no story to set them, and the border token needs both.
    <div data-theme="brutalista" data-scheme="light">
      <h2>Tokens</h2>
      <p>
        Every <code>--ui-*</code> custom property a theme defines, read from <code>themes/*.css</code>. A dash means the theme does not
        define it.
      </p>
      <div className={scroll}>
        <table className={table} data-testid="token-table">
          <thead>
            <tr>
              <th className={cell}>Token</th>
              {themeNames.map((t) => (
                <th key={t} className={cell}>
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.tokens.map(({ name, values }) => (
              <tr key={name}>
                <td className={cell}>
                  <code>{name}</code>
                </td>
                {themeNames.map((t) => (
                  <td key={t} className={cell}>
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
      <div className={scroll}>
        <table className={table} data-testid="pair-table">
          <thead>
            <tr>
              <th className={cell}>Foreground / background</th>
              <th className={cell}>Min</th>
              {model.pairs[0]?.ratios.map(({ theme, scheme }) => (
                <th key={`${theme}-${scheme}`} className={cell}>
                  {theme} {scheme}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.pairs.map(({ fg, bg, min, ratios }) => (
              <tr key={`${fg}/${bg}`}>
                <td className={cell}>
                  <code>
                    {fg} / {bg}
                  </code>
                </td>
                <td className={cell}>{min}:1</td>
                {ratios.map(({ theme, scheme, ratio }) => (
                  <td key={`${theme}-${scheme}`} className={cell}>
                    {ratio.toFixed(2)}:1{ratio < min ? " FAIL" : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
