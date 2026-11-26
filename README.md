# ui-library

## Using trama with an AI agent

Paste this block into the `AGENTS.md` (or `CLAUDE.md`) of the project that installs `@robzepdev/trama`. The last line makes the agent load the docs shipped in the package, so they always match the installed version.

<!-- trama:agents:start v0.2.0 -->

````md
## trama (v0.2.0)

UI components on Base UI with the shadcn/ui API, styled through Tailwind v4 theme tokens.

- Import the CSS once, after Tailwind, in your global stylesheet:
  `@import "@robzepdev/trama/styles.css";` and one theme, `@import "@robzepdev/trama/themes/brutalista.css";` or `@import "@robzepdev/trama/themes/neon.css";`.
- Switch theme and scheme with `data-theme` and `data-scheme` on `<html>`.
- Polymorphism goes through `render`, never `asChild` or `as`.
- No `dark:` classes: colors come from tokens such as `bg-primary` and `text-foreground`.
- Use only the `variant` and `size` values listed on the component's page.
- Self-check before you finish: `grep -rE "\basChild\b|\bdark:[a-z[!-]" src` finds nothing in the code that uses trama.

Docs for each component, with props, values and examples:
@node_modules/@robzepdev/trama/dist/AGENTS.md
````

<!-- trama:agents:end -->

The version in the markers and in the heading is bumped by hand when `package.json` changes version; `pnpm test` fails when they differ.

## For maintainers

Releases are driven by Changesets through `.github/workflows/release.yml`. On every push to `main` the workflow keeps a "Version packages" PR open; merging it publishes to npm, tags the commit and creates the GitHub Release.

### Repo secret

- `RELEASE_PAT`: fine-grained personal access token for this repo with `Contents: read and write` and `Pull requests: read and write`. A PAT is used instead of `GITHUB_TOKEN` so that checks run on the "Version packages" PR.

There is no `NPM_TOKEN`.

### npm configuration

- Publish the first version by hand (`pnpm publish --access public`): a trusted publisher can only be configured on a package that already exists.
- On npmjs.com, package `@robzepdev/trama` → Settings → Trusted Publisher → GitHub Actions: organization/user `RobertoZeppilli`, repository `ui-library`, workflow `release.yml`.
- `package.json` must keep `repository` pointing at `https://github.com/RobertoZeppilli/ui-library`, or npm rejects the publish with provenance.
