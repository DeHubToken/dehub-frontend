[![Netlify Status](https://api.netlify.com/api/v1/badges/bece18c2-2495-4248-a6f6-62792c2ec8f3/deploy-status)](https://app.netlify.com/sites/dehub-frontend/deploys)

## Dehub Frontend

[Dehub Figma Design System](https://www.figma.com/design/vQyUQzckQ7rQzRYpwBqgaL/Dehub-Design-System)

## Development

### Environment Variables

The project uses [t3-oss/env-nextjs](https://github.com/t3-oss/env-nextjs) to manage environment variables.

Steps of adding a new environment variable:

1. Decide if the environment variable is a server-side or client-side variable and add it to the relevant sections.
2. Add the environment variable to the `.env.example` file.
3. Add the environment variable to the `.env` file.
4. Add the environment variable to the `configs/env.ts` file.
5. Add the environment variable to Netlify environment variables.

**Notes to keep in mind**

- Never reference directly `process.env` in the code, always use the `env` object from `@/configs`.
- If the environment variable is a client-side variable, add it to the `NEXT_PUBLIC_` prefix.
- If you import server-side variables on the client and try access, you will get a runtime error.
- If you add new url environment variable be sure not to include the ending slash `/` in the variable.

### Commit Message Format

The project enforces [Conventional Commits](https://www.conventionalcommits.org/) specification. This means that all your commit messages must be formatted according to the specification. To help you write commit messages, the project uses [Commitizen](https://github.com/commitizen/cz-cli), an interactive CLI that guides you through the commit process. To use it, run the following command:

```shell
npm run commit
```

One of the benefits of using Conventional Commits is that it allows us to automatically generate a `CHANGELOG` file. It also allows us to automatically determine the next version number based on the types of commits that are included in a release.
