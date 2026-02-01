import { ExampleInput } from "./exampleInput";

const responses = [
  "Critical - Security vulnerability, crash, data loss, or major bug",
  "Major - Logic error, performance issue, or breaking change",
  "Moderate - Best practice violation, maintainability concern, or code organization",
  "Minor - Naming convention, documentation, or minor style issue",
  "Trivial - Whitespace, formatting, or negligible issue",
];

function makeCompiledTask(
  comment: string,
  code?: string,
  context?: string,
): ExampleInput["compiledTasks"] {
  let content = `Classify the severity of this code review comment.\n\nComment: "${comment}"`;
  if (code) {
    content += `\n\nCode being reviewed:\n${code}`;
  }
  if (context) {
    content += `\n\nAdditional context:\n${context}`;
  }
  content += "\n\nWhich severity category best describes this issue?";

  return [
    {
      type: "vector.completion",
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
      responses: responses,
    },
  ];
}

export const Inputs: ExampleInput[] = [
  // Critical severity - SQL injection vulnerability
  {
    value: {
      comment:
        "This is vulnerable to SQL injection. User input is directly concatenated into the query string without any sanitization or parameterized queries.",
      code: 'const query = "SELECT * FROM users WHERE id = " + userId;',
    },
    compiledTasks: makeCompiledTask(
      "This is vulnerable to SQL injection. User input is directly concatenated into the query string without any sanitization or parameterized queries.",
      'const query = "SELECT * FROM users WHERE id = " + userId;',
    ),
    outputLength: null,
  },
  // Critical severity - authentication bypass
  {
    value: {
      comment:
        "CRITICAL: This authentication check can be bypassed by passing null. The function returns true when the password parameter is undefined.",
      code: "function checkAuth(password) { return password === expectedPassword; }",
      context: "This is the main authentication function for the admin panel.",
    },
    compiledTasks: makeCompiledTask(
      "CRITICAL: This authentication check can be bypassed by passing null. The function returns true when the password parameter is undefined.",
      "function checkAuth(password) { return password === expectedPassword; }",
      "This is the main authentication function for the admin panel.",
    ),
    outputLength: null,
  },
  // Major severity - logic error with breaking change
  {
    value: {
      comment:
        "This will cause an infinite loop when the array is empty. The while condition never becomes false.",
    },
    compiledTasks: makeCompiledTask(
      "This will cause an infinite loop when the array is empty. The while condition never becomes false.",
    ),
    outputLength: null,
  },
  // Major severity - performance issue
  {
    value: {
      comment:
        "This N+1 query pattern will cause severe performance issues at scale. Each iteration makes a separate database call instead of batching.",
      code: "users.forEach(user => { const orders = await db.query(`SELECT * FROM orders WHERE user_id = ${user.id}`); });",
    },
    compiledTasks: makeCompiledTask(
      "This N+1 query pattern will cause severe performance issues at scale. Each iteration makes a separate database call instead of batching.",
      "users.forEach(user => { const orders = await db.query(`SELECT * FROM orders WHERE user_id = ${user.id}`); });",
    ),
    outputLength: null,
  },
  // Moderate severity - best practice violation
  {
    value: {
      comment:
        "Consider extracting this repeated logic into a shared utility function. It appears in 3 other places in the codebase.",
    },
    compiledTasks: makeCompiledTask(
      "Consider extracting this repeated logic into a shared utility function. It appears in 3 other places in the codebase.",
    ),
    outputLength: null,
  },
  // Moderate severity - maintainability concern
  {
    value: {
      comment:
        "This function is doing too many things. It should be split into smaller, single-responsibility functions for better testability.",
      context: "Part of the order processing module.",
    },
    compiledTasks: makeCompiledTask(
      "This function is doing too many things. It should be split into smaller, single-responsibility functions for better testability.",
      undefined,
      "Part of the order processing module.",
    ),
    outputLength: null,
  },
  // Minor severity - naming convention
  {
    value: {
      comment:
        "Variable name 'x' is not descriptive. Consider renaming to something like 'userCount' or 'totalItems'.",
      code: "const x = users.length;",
    },
    compiledTasks: makeCompiledTask(
      "Variable name 'x' is not descriptive. Consider renaming to something like 'userCount' or 'totalItems'.",
      "const x = users.length;",
    ),
    outputLength: null,
  },
  // Minor severity - documentation
  {
    value: {
      comment:
        "Please add a JSDoc comment explaining the purpose of this function and its parameters.",
    },
    compiledTasks: makeCompiledTask(
      "Please add a JSDoc comment explaining the purpose of this function and its parameters.",
    ),
    outputLength: null,
  },
  // Trivial severity - whitespace
  {
    value: {
      comment: "There's an extra blank line here that should be removed.",
    },
    compiledTasks: makeCompiledTask(
      "There's an extra blank line here that should be removed.",
    ),
    outputLength: null,
  },
  // Trivial severity - formatting
  {
    value: {
      comment: "Nit: trailing comma missing on the last item in this array.",
      code: "const items = [\n  'apple',\n  'banana'\n];",
    },
    compiledTasks: makeCompiledTask(
      "Nit: trailing comma missing on the last item in this array.",
      "const items = [\n  'apple',\n  'banana'\n];",
    ),
    outputLength: null,
  },
  // Edge case - comment only (minimal input)
  {
    value: {
      comment: "LGTM",
    },
    compiledTasks: makeCompiledTask("LGTM"),
    outputLength: null,
  },
  // Edge case - all optional fields present
  {
    value: {
      comment:
        "The error handling here silently swallows exceptions. At minimum, log the error for debugging.",
      code: "try { doSomething(); } catch (e) { }",
      context:
        "This is in a critical payment processing flow where errors must be tracked.",
    },
    compiledTasks: makeCompiledTask(
      "The error handling here silently swallows exceptions. At minimum, log the error for debugging.",
      "try { doSomething(); } catch (e) { }",
      "This is in a critical payment processing flow where errors must be tracked.",
    ),
    outputLength: null,
  },
  // Edge case - very long comment
  {
    value: {
      comment:
        "While this implementation works, I have several concerns: First, the variable naming could be improved for clarity. Second, there's some code duplication with the processOrder function. Third, the error messages could be more user-friendly. Fourth, consider adding input validation. Fifth, the function could benefit from unit tests. Overall, this is functional but could use some polish before merging.",
    },
    compiledTasks: makeCompiledTask(
      "While this implementation works, I have several concerns: First, the variable naming could be improved for clarity. Second, there's some code duplication with the processOrder function. Third, the error messages could be more user-friendly. Fourth, consider adding input validation. Fifth, the function could benefit from unit tests. Overall, this is functional but could use some polish before merging.",
    ),
    outputLength: null,
  },
  // Moderate-to-major - race condition
  {
    value: {
      comment:
        "Potential race condition here. Multiple concurrent requests could read stale data before the update completes.",
      code: "const balance = await getBalance();\nawait updateBalance(balance + amount);",
    },
    compiledTasks: makeCompiledTask(
      "Potential race condition here. Multiple concurrent requests could read stale data before the update completes.",
      "const balance = await getBalance();\nawait updateBalance(balance + amount);",
    ),
    outputLength: null,
  },
  // Minor - style preference
  {
    value: {
      comment:
        "Prefer using arrow functions for consistency with the rest of the codebase.",
      code: "function handleClick() { ... }",
    },
    compiledTasks: makeCompiledTask(
      "Prefer using arrow functions for consistency with the rest of the codebase.",
      "function handleClick() { ... }",
    ),
    outputLength: null,
  },
  // Edge case - single character comment
  {
    value: {
      comment: "?",
    },
    compiledTasks: makeCompiledTask("?"),
    outputLength: null,
  },
  // Edge case - very long code snippet
  {
    value: {
      comment: "This function is overly complex and hard to follow.",
      code: "function processData(input) {\n  const result = [];\n  for (let i = 0; i < input.length; i++) {\n    for (let j = 0; j < input[i].items.length; j++) {\n      for (let k = 0; k < input[i].items[j].values.length; k++) {\n        result.push(transform(input[i].items[j].values[k]));\n      }\n    }\n  }\n  return result.filter(x => x !== null).map(x => x.value).reduce((a, b) => a + b, 0);\n}",
    },
    compiledTasks: makeCompiledTask(
      "This function is overly complex and hard to follow.",
      "function processData(input) {\n  const result = [];\n  for (let i = 0; i < input.length; i++) {\n    for (let j = 0; j < input[i].items.length; j++) {\n      for (let k = 0; k < input[i].items[j].values.length; k++) {\n        result.push(transform(input[i].items[j].values[k]));\n      }\n    }\n  }\n  return result.filter(x => x !== null).map(x => x.value).reduce((a, b) => a + b, 0);\n}",
    ),
    outputLength: null,
  },
  // Edge case - very long context
  {
    value: {
      comment: "This could cause issues in production.",
      context:
        "This file is part of the payment processing module which handles credit card transactions, refunds, and chargebacks. It integrates with Stripe, PayPal, and our internal ledger system. The module is critical for revenue and must maintain 99.99% uptime. Any changes require approval from the payments team lead and must include comprehensive test coverage.",
    },
    compiledTasks: makeCompiledTask(
      "This could cause issues in production.",
      undefined,
      "This file is part of the payment processing module which handles credit card transactions, refunds, and chargebacks. It integrates with Stripe, PayPal, and our internal ledger system. The module is critical for revenue and must maintain 99.99% uptime. Any changes require approval from the payments team lead and must include comprehensive test coverage.",
    ),
    outputLength: null,
  },
  // Edge case - code with special characters/unicode
  {
    value: {
      comment: "The emoji handling might cause encoding issues.",
      code: "const greeting = '\u{1F44B} Hello, World! \u00A9 2024';",
    },
    compiledTasks: makeCompiledTask(
      "The emoji handling might cause encoding issues.",
      "const greeting = '\u{1F44B} Hello, World! \u00A9 2024';",
    ),
    outputLength: null,
  },
  // Edge case - multiline code with mixed indentation
  {
    value: {
      comment: "Inconsistent indentation between tabs and spaces.",
      code: "function test() {\n\tif (condition) {\n        return true;\n\t}\n}",
    },
    compiledTasks: makeCompiledTask(
      "Inconsistent indentation between tabs and spaces.",
      "function test() {\n\tif (condition) {\n        return true;\n\t}\n}",
    ),
    outputLength: null,
  },
  // Edge case - additional context-only example (no code)
  {
    value: {
      comment: "This approach seems inefficient for our use case.",
      context:
        "We expect this endpoint to receive 10,000+ requests per minute during peak hours.",
    },
    compiledTasks: makeCompiledTask(
      "This approach seems inefficient for our use case.",
      undefined,
      "We expect this endpoint to receive 10,000+ requests per minute during peak hours.",
    ),
    outputLength: null,
  },
];
