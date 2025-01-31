[![Netlify Status](https://api.netlify.com/api/v1/badges/bece18c2-2495-4248-a6f6-62792c2ec8f3/deploy-status)](https://app.netlify.com/sites/dehub-frontend/deploys)

## Dehub Frontend

[Dehub Figma Design System](https://www.figma.com/design/vQyUQzckQ7rQzRYpwBqgaL/Dehub-Design-System)

## Development

### Commit Message Format

The project enforces [Conventional Commits](https://www.conventionalcommits.org/) specification. This means that all your commit messages must be formatted according to the specification. To help you write commit messages, the project uses [Commitizen](https://github.com/commitizen/cz-cli), an interactive CLI that guides you through the commit process. To use it, run the following command:

```shell
npm run commit
```

One of the benefits of using Conventional Commits is that it allows us to automatically generate a `CHANGELOG` file. It also allows us to automatically determine the next version number based on the types of commits that are included in a release.
