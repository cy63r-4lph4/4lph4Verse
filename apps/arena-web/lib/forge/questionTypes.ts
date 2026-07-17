export type QuestionType = "mcq" | "true-false";

export function optionsForType(type: QuestionType, mcqOptions: string[]): string[] {
  return type === "true-false" ? ["True", "False"] : mcqOptions;
}

export function detectType(options: string[]): QuestionType {
  return options.length === 2 && options[0] === "True" && options[1] === "False"
    ? "true-false"
    : "mcq";
}