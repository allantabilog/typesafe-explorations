import { Either } from './either';

export class Pair<T1, T2> {
  fst: T1;
  snd: T2;

  constructor(fst: T1, snd: T2) {
    this.fst = fst;
    this.snd = snd;
  }
}

export type PointPr = Pair<number, number>;

export const distance = (point1: PointPr, point2: PointPr) =>
  Math.sqrt((point2.fst - point1.fst) ** 2 + (point2.fst - point2.snd) ** 2);

// encode the "meaning" of points within the type system

export type PointRec1 = Record<"first" | "second", number>;

// const point: PointRec1 = {
//   first: 1,
//   second: 1,
// };

export const distanceRec = <T extends PointRec1>(rec: T) =>
  Math.sqrt(rec.first ** 2 + rec.second ** 2);

type PointKeys = "first" | "second";
type PointRec2 = Record<PointKeys, number>;

export const distanceRec2 = <T extends PointRec2>(rec: T) =>
  Math.sqrt(rec.first ** 2 + rec.second ** 2);

console.log(distanceRec({ first: 10, second: 0.1 }));

type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type Weekend = "Saturday" | "Sunday";
type DayOfWeek1 = Weekday | Weekend;

const isMonday = (day: DayOfWeek1): boolean => day === "Monday";

console.log(isMonday("Wednesday"));
// console.log(isMonday("Yesterday"));

export enum DayOfWeek {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}
export function isWeekend(day: DayOfWeek): boolean {
  return day === DayOfWeek.Saturday || day === DayOfWeek.Sunday;
}
export function isWeekday(day: DayOfWeek) {
  return DayOfWeek.Monday <= day && day <= DayOfWeek.Friday;
}
export enum InputError {
  NoInput,
  Invalid,
}

export type Result = Either<InputError, DayOfWeek>;

console.log(isWeekday(DayOfWeek.Thursday));
console.log(isWeekend(DayOfWeek.Thursday));

export function parseDayOfWeek(input: string): Result {
  if (input === "") {
    return Either.makeLeft(InputError.NoInput);
  }

  switch (input.toLowerCase()) {
    case "monday":
      return Either.makeRight(DayOfWeek.Monday);
    case "tuesday":
      return Either.makeRight(DayOfWeek.Tuesday);
    case "wednesday":
      return Either.makeRight(DayOfWeek.Wednesday);
    case "thursday":
      return Either.makeRight(DayOfWeek.Thursday);
    case "friday":
      return Either.makeRight(DayOfWeek.Friday);
    case "saturday":
      return Either.makeRight(DayOfWeek.Saturday);
    case "sunday":
      return Either.makeRight(DayOfWeek.Sunday);
    default:
      return Either.makeLeft(InputError.Invalid);
  }
}

let names = ["a", "aa"];
console.log(names.length);

type Length<T extends any[]> = T["length"];

const len: Length<typeof names> = 1;
console.log(`len is ${len}`);

type SplitResult<T> = { first: T | undefined; rest: T[] };

function splitArray<T>(arr: T[]): SplitResult<T> {
  const [first, ...rest] = arr;
  return { first, rest };
}

console.log(splitArray([]));
console.log(splitArray([1]));
console.log(splitArray([1, 2]));
console.log(splitArray([1, 2, 3]));

// type Union<A extends any[], B extends any[]> = [...A, ...B];

// Recursive type manipulation
type Reverse<T extends any[]> = T extends [...infer Rest, infer Last]
  ? [Last, ...Reverse<Rest>]
  : [];

type Reversed = Reverse<[1, 2, 3, 4, 5]>;
const rev: Reversed = [5, 4, 3, 2, 1];
console.log(rev);

const arr = ["a"] as const;
console.log(typeof arr);
