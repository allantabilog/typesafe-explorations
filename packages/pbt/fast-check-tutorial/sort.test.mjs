import { test, expect } from 'vitest';
import { sortNumbersAscending } from './sort.mjs';
import fc from 'fast-check';

test('should keep an already sorted array sorted', () => {
    expect(sortNumbersAscending([1, 2, 3])).toEqual([1, 2, 3]);
})

test('should sort a randomly ordered array in ascending order', () => {
    expect(sortNumbersAscending([3, 1, 2])).toEqual([1, 2, 3]);
})

test('should sort a descending ordered array in ascending order', () => {
    expect(sortNumbersAscending([3, 2, 1])).toEqual([1, 2, 3]);
})

test('should sort a descending ordered array in ascending order -2', () => {
    expect(sortNumbersAscending([1000000000, 2])).toEqual([2, 1000000000]);
})

test('should sort numeric elements from the smallest to the largest one', () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (data) => {
      const sortedData = sortNumbersAscending(data);
      for (let i = 1; i < data.length; ++i) {
        expect(sortedData[i - 1]).toBeLessThanOrEqual(sortedData[i]);
      }
    }),
    { verbose: 2},
    { seed: -1932723939, endOnFailure: true },
  );
});


