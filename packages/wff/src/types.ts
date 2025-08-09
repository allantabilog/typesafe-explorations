export type Variable = { type: "var"; name: string };
export type Not = { type: "not"; operand: Formula };
export type And = { type: "and"; left: Formula; right: Formula };
export type Or = { type: "or"; left: Formula; right: Formula };
export type Implies = { type: "implies"; left: Formula; right: Formula };
export type Iff = { type: "iff"; left: Formula; right: Formula };

export type Formula = Variable | Not | And | Or | Implies | Iff;

export function prettyPrint(formula: Formula): string | undefined {
  switch (formula.type) {
    case "var":
      return `${formula.name}`;
    case "not":
      return `~ ${prettyPrint(formula.operand)}`;
    case "and":
      return `${prettyPrint(formula.left)} /\\ ${prettyPrint(formula.right)}`;
    case "or":
      return `${prettyPrint(formula.left)} \\/ ${prettyPrint(formula.right)}`;
    case "implies":
      return `${prettyPrint(formula.left)} => ${prettyPrint(formula.right)}`;
    case "iff":
      return `${prettyPrint(formula.left)} <=> ${prettyPrint(formula.right)}`;
    default:
      return undefined;
  }
}

export function randomFormula(vars: string[], depth: number): Formula {
  if (depth === 0 || Math.random() < 0.3) {
    return {
      type: "var",
      name: vars[Math.floor(Math.random() * vars.length)] || "P",
    };
  }

  const choice = Math.floor(Math.random() * 5);
  const left = randomFormula(vars, depth - 1);
  const right = randomFormula(vars, depth - 1);

  switch (choice) {
    case 0:
      return { type: "not", operand: left };
    case 1:
      return { type: "and", left, right };
    case 2:
      return { type: "or", left, right };
    case 3:
      return { type: "implies", left, right };
    case 4:
      return { type: "iff", left, right };
    default:
      return { type: "var", name: "P" };
  }
}
