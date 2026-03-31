---
title: Pull Request Guide
description: How to create and submit pull requests to AEGIS repositories.
---

# Pull Request Guide

This guide covers the process for submitting pull requests to AEGIS repositories, from branch creation through merge.

## Before You Start

1. **Check for existing work** -- Search open issues and PRs to avoid duplicating effort
2. **Understand the scope** -- Make sure you are contributing to the right repository (see [Repository
Map](/contributing/))
3. **Follow conventions** -- Use conventional commits, descriptive branch names, and the project's code style

## Creating a Pull Request

### 1. Fork and Branch

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/aegis-docs.git
cd aegis-docs

# Create a descriptive branch
git checkout -b docs/add-deployment-guide
```

Use descriptive branch names that indicate the type and scope of the change:

- `docs/add-quickstart-guide`
- `feat/policy-engine-conditions`
- `fix/sdk-timeout-handling`
- `chore/update-ci-workflow`

### 2. Make Your Changes

- Keep changes focused -- one logical change per PR
- Write or update tests where applicable
- Update documentation if your change affects user-facing behavior
- Follow the existing code style and conventions

### 3. Commit with Conventional Commits

```bash
git add .
git commit -m "docs: add deployment guide for self-hosted runtime"
```

Use the appropriate type prefix (`feat:`, `docs:`, `fix:`, `chore:`, `refactor:`). Write a clear, concise commit message
that explains *what* changed.

### 4. Push and Open the PR

```bash
git push origin docs/add-deployment-guide
```

Then open a pull request on GitHub. In the PR description:

- **Explain the motivation** -- Why is this change needed?
- **Describe the change** -- What does this PR do?
- **Reference related issues** -- Link to relevant issues or ADRs
- **Note any concerns** -- Flag areas where you are uncertain or want specific review feedback

### 5. Review Process

- All PRs require at least one approving review before merge
- CI checks must pass (linting, schema validation, link checks, etc.)
- Reviewers may request changes -- address feedback promptly or explain your reasoning
- Once approved, the PR will be merged by a maintainer

## PR Best Practices

- **Keep PRs small** -- Smaller PRs are easier to review and less likely to introduce issues
- **Separate refactoring from features** -- If you need to refactor to support a new feature, do the refactoring in a
separate PR first
- **Update the PR description** -- If the scope of the PR evolves during review, update the description to match
- **Respond to all review comments** -- Even if you disagree, acknowledge the feedback and explain your position

## Documentation PRs

For changes to this documentation site:

- Content pages are Markdown files in `src/content/docs/`
- Each page must have `title` and `description` frontmatter
- Test your changes locally with `npm run dev`
- Verify that links work and pages render correctly

## Further Reading

- [Contributing Overview](/contributing/) -- General contribution guidelines
- [Development Setup](/contributing/development-setup/) -- Local environment setup
- [Code of Conduct](/contributing/code-of-conduct/) -- Community standards
