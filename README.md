# code-review-severity

Score the severity of code review comments from minor stylistic issues to critical security vulnerabilities.

[ObjectiveAI](https://objective-ai.io) | [Discord](https://discord.gg/gbNFHensby)

## Overview

This is a **scalar function** that takes a code review comment and outputs a severity score from 0 to 1:

| Score | Severity | Examples |
|-------|----------|----------|
| 1.0 | Critical | Security vulnerabilities, crashes, data loss, major bugs |
| 0.75 | Major | Logic errors, performance issues, breaking changes |
| 0.5 | Moderate | Best practice violations, maintainability concerns |
| 0.25 | Minor | Naming conventions, documentation issues |
| 0.0 | Trivial | Whitespace, formatting |

## Usage

```typescript
import ObjectiveAI from "objectiveai";

const client = new ObjectiveAI();

const result = await client.functions.executions.create({
  owner: "ObjectiveAI-claude-code-1",
  repository: "code-review-severity",
  input: {
    comment: "This SQL query is vulnerable to injection attacks",
    code: 'const query = "SELECT * FROM users WHERE id = " + userId;',
  },
});

console.log(result.output); // ~0.95 (Critical severity)
```

## Input Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `comment` | string | Yes | The code review comment or feedback to evaluate |
| `code` | string | No | The code snippet being reviewed |
| `context` | string | No | Additional context about the codebase or review |

## Examples

```typescript
// Critical - SQL injection
{
  comment: "User input is directly concatenated into the query string",
  code: 'const query = "SELECT * FROM users WHERE id = " + userId;'
}
// Expected score: ~1.0

// Major - Infinite loop
{
  comment: "This will cause an infinite loop when the array is empty"
}
// Expected score: ~0.75

// Moderate - Code organization
{
  comment: "Consider extracting this into a shared utility function"
}
// Expected score: ~0.5

// Minor - Naming
{
  comment: "Variable name 'x' is not descriptive",
  code: "const x = users.length;"
}
// Expected score: ~0.25

// Trivial - Formatting
{
  comment: "Trailing comma missing on the last item"
}
// Expected score: ~0.0
```

## Profile

The default profile uses an ensemble of 5 LLMs with equal weighting:

- `openai/gpt-4.1-nano`
- `google/gemini-2.5-flash-lite`
- `x-ai/grok-4.1-fast`
- `openai/gpt-4o-mini` (with logprobs)
- `deepseek/deepseek-v3.2` (with logprobs)

## Use Cases

- **CI/CD Integration**: Automatically flag critical issues in pull requests
- **Code Review Triage**: Prioritize review comments by severity
- **Developer Tooling**: Build severity-aware code review dashboards
- **Quality Metrics**: Track severity distribution of issues over time
