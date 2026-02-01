# Function Plan: code-review-severity

## Repository Name
`code-review-severity`

## Description
Scores the severity of code review feedback. Takes a code review comment (and optionally the code snippet it references) and outputs a severity score from 0 to 1, where:
- 0.0 = Minor/stylistic issue (formatting, naming conventions)
- 0.5 = Moderate issue (logic improvements, best practices)
- 1.0 = Critical issue (security vulnerabilities, bugs, data loss risks)

## Type
**Scalar Function** - outputs a single score in [0, 1]

## Input Schema
```json
{
  "type": "object",
  "properties": {
    "comment": {
      "type": "string",
      "description": "The code review comment or feedback to evaluate."
    },
    "code": {
      "type": "string",
      "description": "Optional: The code snippet being reviewed."
    },
    "context": {
      "type": "string",
      "description": "Optional: Additional context about the codebase or review."
    }
  },
  "required": ["comment"]
}
```

## Task Structure
The function will use a single vector completion task that asks LLMs to classify the severity of the review comment into categories:
- "Critical" (security, bugs, crashes, data loss) → mapped to score 1.0
- "Major" (logic errors, performance issues, breaking changes) → mapped to score 0.75
- "Moderate" (best practices, code organization, maintainability) → mapped to score 0.5
- "Minor" (style, naming, documentation) → mapped to score 0.25
- "Trivial" (whitespace, formatting) → mapped to score 0.0

The output expression will convert these categorical scores to a weighted average.

## Rationale
This function fills a practical need in software development workflows where code review comments need to be triaged by importance. It's self-validating via JSON Schema and doesn't require semantic constraints beyond what the schema can express.