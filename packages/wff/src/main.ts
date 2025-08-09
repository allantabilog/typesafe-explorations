import { Formula, prettyPrint, randomFormula, Variable } from './types';

const P: Variable = { type: "var", name: "P" };
const Q: Variable = { type: "var", name: "Q" };

const exampleFormula: Formula = {
  type: "implies",
  left: {
    type: "and",
    left: P,
    right: { type: "not", operand: Q },
  },
  right: Q,
};

console.log(prettyPrint(exampleFormula));
console.log(
  prettyPrint({
    type: "implies",
    left: {
      type: "or",
      left: P,
      right: Q,
    },
    right: {
      type: "and",
      left: Q,
      right: P,
    },
  })
);
console.log(prettyPrint(randomFormula(["P", "Q", "R"], 3)));
console.log(prettyPrint(randomFormula(["P", "Q", "R"], 4)));
console.log(prettyPrint(randomFormula(["P", "Q", "R"], 5)));
console.log(prettyPrint(randomFormula(["P", "Q", "R"], 6)));
console.log(prettyPrint(randomFormula(["P", "Q", "R"], 7)));
console.log(prettyPrint(randomFormula(["P", "Q", "R"], 8)));
