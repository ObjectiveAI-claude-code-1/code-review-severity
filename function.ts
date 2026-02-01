import { Functions } from "objectiveai";

export const Function: Functions.RemoteFunction = {
  type: "scalar.function",
  input_maps: null,
  description:
    "Score the severity of code review comments. Outputs a score from 0 (trivial/stylistic) to 1 (critical security/bug issue).",
  changelog: null,
  input_schema: {
    type: "object",
    properties: {
      comment: {
        type: "string",
        description: "The code review comment or feedback to evaluate.",
      },
      code: {
        type: "string",
        description: "Optional: The code snippet being reviewed.",
      },
      context: {
        type: "string",
        description: "Optional: Additional context about the codebase or review.",
      },
    },
    required: ["comment"],
  },
  tasks: [
    {
      type: "vector.completion",
      skip: null,
      map: null,
      messages: [
        {
          role: "user",
          content: {
            $jmespath:
              "join('', ['Classify the severity of this code review comment.\n\nComment: \"', input.comment, '\"', if(input.code, '\n\nCode being reviewed:\n', ''), if(input.code, input.code, ''), if(input.context, '\n\nAdditional context:\n', ''), if(input.context, input.context, ''), '\n\nWhich severity category best describes this issue?'])",
          },
        },
      ],
      tools: null,
      responses: [
        "Critical - Security vulnerability, crash, data loss, or major bug",
        "Major - Logic error, performance issue, or breaking change",
        "Moderate - Best practice violation, maintainability concern, or code organization",
        "Minor - Naming convention, documentation, or minor style issue",
        "Trivial - Whitespace, formatting, or negligible issue",
      ],
    },
  ],
  output: {
    $jmespath:
      "add(add(add(multiply(tasks[0].scores[0], `1.0`), multiply(tasks[0].scores[1], `0.75`)), multiply(tasks[0].scores[2], `0.5`)), multiply(tasks[0].scores[3], `0.25`))",
  },
};
