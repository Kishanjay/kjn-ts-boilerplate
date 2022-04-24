# KN TypeScript boilerplate

[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

Lets do a proper setup for a TypeScript project for the **last time**.
This repo will serve as a boilerplate for every future ts project to come.

The most relevant decision making will be captured for once and for all.

(This shows an example for a npm browser project, but will be fairly similair for NodeJS or Electron projects)

# Setup

## Folder structure

Source code is placed under the `src` directory.

Build files are placed under the `build` directory.

Distributions are placed under the `dist` directory.
(e.g. in case of electron).

The root folder structure should be something along the lines of:

```
/
  .
  ..
  src
  dist
  build
  package.json
```

## Npm

Projects that needs to be published should have a namespace in the name: `@kn/<project_name>`

For the scripts we follow the _refspec_ format: `<+><source>:<destination>`
Source being the bigger entity and destination being the smaller entity.
e.g.

```sh
build:ios
deploy:production
```

## Commitlint

[Setup commitlint with conventional commits and Husky](https://kishannirghin.medium.com/how-to-set-up-conventional-commits-with-commitlint-and-husky-in-may-2021-f1fee7f6a1ee)

Essentially this boils down to

```sh
npm install --save-dev @commitlint/cli
npm install --save-dev @commitlint/config-conventional
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
npm install husky --save-dev
npx husky-init && npm install
rm .husky/pre-commit
```

Create the .husky/commit-msg file

```sh
cat <<EEE > .husky/commit-msg
#!/bin/sh
. "\$(dirname "\$0")/_/husky.sh"

npx --no -- commitlint --edit "\${1}"
EEE
```

Conventional commits go hand-in-hand with semantic versioning.

## Editorconfig

Editorconfig to atleast enforce consistent behaviour across different editors.

```sh
[*]
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
max_line_length = 100
```

## Eslint/Prettier

Keep the distinction between eslint and prettier clear. Prettier will take care of ALL style
formatting rules and eslint should take care of ALL code quality rules.

### Eslint

```sh
npm install eslint --save-dev
```

Since we're using both prettier and eslint there isn't really a good out-of-the-box style
convention.

Running the command below should generate a nice `.eslintrc` file

```sh
npm init @eslint/config
```

Disable all style related rules to not conflict with prettier

```sh
npm install --save-dev eslint-config-prettier
```

Update eslintrc.js

```json
{
  "extends": ["whatever-more-configs-are-here", "prettier"]
}
```

`eslint:recommended` and `plugin:@typescript-eslint/recommended` contain most of the code-quality
linting rules.

### Prettier

```sh
npm install --save-dev --save-exact prettier
echo "package-lock.json" > .prettierignore
touch .prettierrc.js
```

Prettier will respect the .editorconfig settings

Following the philosophy of prettier we DON'T use `eslint-plugin-prettier` which would use prettier
as if it was a linter. Rather we only enable auto-format on save powered by our editor.

The idea is that you as a developer are never bothered by styling issues, because they shouldn't
consume any second of your time.

Additionally add a lint-staged husky hook:

```sh
npm install --save-dev lint-staged
```

Add `.lintstagedrc` with:

```
{
  "src/**/*.ts": "eslint",
  "**/*": "prettier --write --ignore-unknown"
}
```

Optionally add lint-staged to the pre-commit hook to ensure that no unlinted code ends up in the
repo. This however is quite aggressive.

```
npx husky add .husky/pre-commit "npx lint-staged"
```

## VScode

Install prettier plugin
_Press CMD+P and run_

```
ext install esbenp.prettier-vscode
```

Setup some basics

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.rulers": [100]
}
```

## Typescript

```sh
npm install typescript --save-dev
```

Get a default `tsconfig.json` file

```sh
npx tsc --init
```

Example:

```json
{
  "compilerOptions": {
    "target": "es2021",
    "module": "es2022",
    "rootDir": "./src",
    "outDir": "./build",
    "forceConsistentCasingInFileNames": true,
    "strict": true
  },
  "include": ["./src/**/*.ts"]
}
```

## Git

Optionally turn off fast-forwarding on merge

```sh
git config merge.ff no
```

# Release

Before publishing to npmjs.com create an NPM_TOKEN

```sh
npm adduser
```

## standard-version

Option 1: Releasing npm packages using `standard-version` in combination with conventional commits
to take care of our semantic versioning.

```sh
npm install --save-dev standard-version
npm set-script release "standard-version"
```

Now to create a release simply do

```sh
npm run release
```

To publish the current release

```sh
npm publish
```

## semantic-release

Semantic release is fully automated and pushes your releases from a ci environment

```sh
npx semantic-release-cli setup
npm install --save-dev semantic-release
```

Create a ci workflow file as in
[.github/workflows/release.yml](.github/workflows/release.yml)

Create `release.config.js` to also update package.json on every new release

```sh
module.exports = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: ["package.json"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
```

For the above to work, HUSKY would need to be disabled since the ${nextRelease.notes} doesn't
fit the conventional commit guidelines as to how lengthy the commit body can be.

```js
module.exports = {
  branches: ["main"],
};
```
