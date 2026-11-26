import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { API, SymbolFlags } from "typescript/unstable/sync";

// Value exports of src/index.ts, one per component: `export { Button } from "./components/button"`.
// `export type { ... }` does not match, so types are skipped.
export function componentExports(indexSource: string): { name: string; file: string }[] {
  return [...indexSource.matchAll(/export\s*\{([^}]*)\}\s*from\s*"([^"]+)"/g)].flatMap(([, names, path]) =>
    names!
      .split(",")
      .map((n) => n.trim())
      // Lowercase exports (e.g. `toast`) are functions, not components: they have no `<Name>Props` to document.
      .filter((n) => /^[A-Z]/.test(n))
      .map((name) => ({ name, file: `src/${path!.replace(/^\.\//, "")}.tsx` })),
  );
}

export const pageName = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

interface Prop {
  name: string;
  type: string;
  optional: boolean;
  default: string | undefined;
  description: string;
}

interface Component {
  name: string;
  description: string;
  props: Prop[];
  examples: string[];
}

function renderPage({ name, description, props, examples }: Component): string {
  const sections = props.map((p) =>
    [
      `### \`${p.name}\``,
      `Type: \`${p.type}\`${p.optional ? "" : " (required)"}${p.default ? `, default: ${p.default}` : ""}`,
      "",
      p.description || "No description.",
    ].join("\n"),
  );
  const out = [
    `# ${name}`,
    "",
    description,
    "",
    "```tsx",
    `import { ${name} } from "@robzepdev/trama";`,
    "```",
    "",
    "## Props",
    "",
    "Every other prop of the underlying DOM element is accepted as well.",
    "",
    sections.join("\n\n"),
  ];
  if (examples.length) out.push("", "## Examples", "", ...examples.flatMap((e) => ["```tsx", e, "```", ""]));
  return out.join("\n").trimEnd() + "\n";
}

// Stories with a `render` function are the readable examples; `play`-only stories are tests.
function storyExamples(storySource: string): string[] {
  return storySource
    .split(/\n(?=export const )/)
    .filter((block) => block.startsWith("export const ") && /\brender:/.test(block) && !/\bplay:/.test(block))
    .map((block) => block.trim());
}

// `toast` is a function, not a component, so it has no generated page: the index documents it.
const TOAST_SECTION = `## toast()

\`toast(options): string\` shows a toast from anywhere, also outside React, and returns its id. \`options\` accepts \`title\`, \`description\`, \`type\` and \`timeout\` (milliseconds, \`0\` keeps it open). \`toast.close(id?)\` closes one toast, or all when called without an id. Mount \`ToastProvider\` once near the root first: [ToastProvider](./toast-provider.md).

\`\`\`tsx
import { toast } from "@robzepdev/trama";

const id = toast({ title: "Changes saved", description: "Your profile is up to date." });
toast.close(id);
\`\`\`
`;

export function generateAgentDocs({ root, outDir }: { root: string; outDir: string }): void {
  const components = componentExports(readFileSync(join(root, "src/index.ts"), "utf8"));
  mkdirSync(join(outDir, "docs"), { recursive: true });

  const api = new API({ cwd: root });
  try {
    const snapshot = api.updateSnapshot({ openFiles: components.map((c) => join(root, c.file)) });
    const index: string[] = [];

    for (const { name, file } of components) {
      const path = join(root, file);
      const project = snapshot.getDefaultProjectForFile(path);
      if (!project) throw new Error(`No TypeScript project contains ${file}`);
      const { checker } = project;
      const source = readFileSync(path, "utf8");
      const positionOf = (needle: string) => {
        const at = source.indexOf(needle);
        if (at < 0) throw new Error(`${file} must contain "${needle}"`);
        // Position of the identifier, which is the last word of the needle.
        return at + needle.length - needle.split(" ").pop()!.length;
      };

      const propsSymbol = checker.getSymbolAtPosition(path, positionOf(`interface ${name}Props`));
      if (!propsSymbol) throw new Error(`Cannot resolve ${name}Props in ${file}`);
      const componentSymbol = checker.getSymbolAtPosition(path, positionOf(`function ${name}`));

      const props = checker
        .getPropertiesOfType(checker.getDeclaredTypeOfSymbol(propsSymbol))
        // Plain DOM attributes come from @types/react and are not part of this library's API.
        .filter((s) => !s.declarations.every((d) => d.path.includes("/@types/react/")))
        .map((s): Prop => {
          const type = checker.getTypeOfSymbol(s);
          const tags = s.getJsDocTags(checker);
          return {
            name: s.name,
            type: (type ? checker.typeToString(type) : "unknown").replace(/\s+/g, " "),
            optional: (s.flags & SymbolFlags.Optional) !== 0,
            default: tags.find((t) => t.name === "default")?.text?.trim(),
            description: s.getDocumentationComment(checker).trim(),
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      const storiesPath = join(root, file.replace(/\.tsx$/, ".stories.tsx"));
      let examples: string[] = [];
      try {
        examples = storyExamples(readFileSync(storiesPath, "utf8"));
      } catch {
        // A component without stories just has no examples section.
      }

      const description = componentSymbol?.getDocumentationComment(checker).trim() ?? "";
      writeFileSync(join(outDir, "docs", `${pageName(name)}.md`), renderPage({ name, description, props, examples }));
      index.push(`- [${name}](./${pageName(name)}.md): ${description.split(/(?<=\.)\s/)[0] ?? ""}`.trimEnd());
    }

    writeFileSync(join(outDir, "docs", "index.md"), `# trama components\n\n${index.join("\n")}\n\n${TOAST_SECTION}`);
  } finally {
    api.close();
  }

  writeFileSync(join(outDir, "AGENTS.md"), readFileSync(join(root, "docs/agents/consumer.md"), "utf8"));
}

// CLI: node scripts/agent-docs.ts, run after tsdown has written dist/.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateAgentDocs({ root: process.cwd(), outDir: join(process.cwd(), "dist") });
}
