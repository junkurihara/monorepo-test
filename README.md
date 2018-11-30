# monorepo-test
Lerna Monorepo Testing

# Approach

- merge LCOVs using https://www.npmjs.com/package/lcov-result-merger
- check and decide versioning patterns
  - we take `version=independent` in `lerna.json`, i.e., the versioning pattern is independent from the repository version. So we decided to manage every package independently from the repo version. For example for repo version = v0.1.0, package versions could be `package_a: v0.0.9` and `package_b: v0.1.2`.
  - policy: **the repo version is tied with the root package version**. Namely, repo version is always same as that of root package specified in `package.json`.
- check deployment strategy
  - deploy npm package only when tagged commit. the tag is associated only with the repo version.
  - does `lerna publish from-package` publish only the updated package even when the repo version: `version = xxx`.
  - we should note that **only when the root package version increases, updated packages are deployed.**.
- management policy for the git-flow + lerna in the release operation.
  1. first execute `yarn flow:release [patch|minor|major|...]` and bump versions of packages that have been modified on develop branch. this simultaneously update the repo version specified in root package.json. this commits nothing.
  2. commit changes and then execute `yarn release:start` to start release process on a release branch. here we note the release version will be the updated repo version.
  3. finally execute `yarn release:finish` to merge the release branch to master, and then merge master to develop. it will also tag the master branch with the updated repo version.
  4. execute `yarn release:finish` to push all branches and the generated tag of repo version to GitHub.
- renovate can manage monorepo package.json!

# TODO

- check common devDependencies
