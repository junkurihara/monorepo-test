# monorepo-test
Lerna Monorepo Testing

# TODO

- (done) merge LCOVs using https://www.npmjs.com/package/lcov-result-merger
- check and decide versioning patterns
  - when `version=independent`, the versioning pattern is like `js-crypto-utils@0.14.1` which is tagged in the git repo. This implies that the versioning can be identified the tagged pattern from circle ci and the release.
- check deployment strategy
  - deploy npm package only when tagged commit?
  - does `lerna publish` publish only the updated package even when `version = xxx` (explicit, and not `independent`)?
- consider how to manage the git-flow + lerna in release operation
  1. first execute `git flow release start xxx` on develop branch <- how can we get the version tag xxx? it could be multiple for one monorepo...
  2. then at the release branch, do whatever for the release
  3. finally on the release branch, execute `lerna version [patch|minor|...]` which pushes the tags related to updated individual packages to GitHub.
  4. To finishes the versioning merge th release branch and additionally tags for the single monorepo.
  should we tie the version of git repo, specified in root package.json, with the 'main' packaged module version?
- check common devDependencies
- (done) renovate can monorepo package.json!