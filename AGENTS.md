<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

This is still an Angular CLI application. Use Vite+ to run the Angular scripts through the managed runtime:

- `vp run dev` starts the Angular dev server.
- `vp run build` creates the production build in `dist/onlyfrogs-website/browser`.
- `vp run test` runs the Angular unit tests.
- `vp run test:e2e` runs the Playwright smoke test.
- `vp run verify` runs the full project validation gate.

Do not use raw `pnpm` commands for local validation unless you have confirmed the shell resolves the project-required Node and pnpm versions. Prefer `vp install` and `vp run ...`.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check`, `vp test`, and the relevant Angular script through `vp run`.
- [ ] Run `vp run verify` before considering migration/tooling changes complete.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
