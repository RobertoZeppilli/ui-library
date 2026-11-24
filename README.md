# ui-library

## For maintainers

Releases are driven by Changesets through `.github/workflows/release.yml`. On every push to `main` the workflow keeps a "Version packages" PR open; merging it publishes to npm, tags the commit and creates the GitHub Release.

### Repo secret

- `RELEASE_PAT`: fine-grained personal access token for this repo with `Contents: read and write` and `Pull requests: read and write`. A PAT is used instead of `GITHUB_TOKEN` so that checks run on the "Version packages" PR.

There is no `NPM_TOKEN`.

### npm configuration

- Publish the first version by hand (`pnpm publish --access public`): a trusted publisher can only be configured on a package that already exists.
- On npmjs.com, package `trama` → Settings → Trusted Publisher → GitHub Actions: organization/user `RobertoZeppilli`, repository `ui-library`, workflow `release.yml`.
- `package.json` must keep `repository` pointing at `https://github.com/RobertoZeppilli/ui-library`, or npm rejects the publish with provenance.
