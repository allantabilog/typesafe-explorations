import { DayOfWeek, InputError, isWeekday, isWeekend, parseDayOfWeek } from '../../src/types/tuple';
import { Either } from './either';

describe("enum tests", () => {
  test.each([
    [DayOfWeek.Friday, false],
    [DayOfWeek.Saturday, true],
    [DayOfWeek.Sunday, true],
    [DayOfWeek.Monday, false],
    [DayOfWeek.Tuesday, false],
    [DayOfWeek.Wednesday, false],
    [DayOfWeek.Thursday, false],
  ])("isWeekend(%s) should return %p", (input, expected) => {
    expect(isWeekend(input)).toBe(expected);
  });

  test.each([
    [DayOfWeek.Friday, true],
    [DayOfWeek.Saturday, false],
    [DayOfWeek.Sunday, false],
    [DayOfWeek.Monday, true],
    [DayOfWeek.Tuesday, true],
    [DayOfWeek.Wednesday, true],
    [DayOfWeek.Thursday, true],
  ])("isWeekday(%s) should return %p", (input, expected) => {
    expect(isWeekday(input)).toBe(expected);
  });
  test.each([
    [
      "Monday",
      Either.makeRight(DayOfWeek.Monday) as Either<InputError, DayOfWeek>,
    ],
    [
      "tuesday",
      Either.makeRight(DayOfWeek.Tuesday) as Either<InputError, DayOfWeek>,
    ],
    [
      "tue",
      Either.makeLeft(InputError.Invalid) as Either<InputError, DayOfWeek>,
    ],
    ["", Either.makeLeft(InputError.NoInput) as Either<InputError, DayOfWeek>],
    [
      "sunday",
      Either.makeRight(DayOfWeek.Sunday) as Either<InputError, DayOfWeek>,
    ],
  ])(
    "parseDayOfWeek: %s returns %p",
    (input: string, result: Either<InputError, DayOfWeek>) => {
      expect(parseDayOfWeek(input)).toEqual(result);
    }
  );
});
