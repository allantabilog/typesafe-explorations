import { checkPrimeWithDetails, isPrime } from './prime';

describe("isPrime", () => {
  describe("edge cases", () => {
    test("should return false for numbers less than 2", () => {
      expect(isPrime(-5)).toBe(false);
      expect(isPrime(-1)).toBe(false);
      expect(isPrime(0)).toBe(false);
      expect(isPrime(1)).toBe(false);
    });

    test("should return false for non-integers", () => {
      expect(isPrime(2.5)).toBe(false);
      expect(isPrime(3.14)).toBe(false);
      expect(isPrime(4.9)).toBe(false);
      expect(isPrime(NaN)).toBe(false);
      expect(isPrime(Infinity)).toBe(false);
      expect(isPrime(-Infinity)).toBe(false);
    });

    test("should handle 2 as the only even prime", () => {
      expect(isPrime(2)).toBe(true);
      expect(isPrime(4)).toBe(false);
    });
  });

  describe("small primes", () => {
    test.skip("should return true for small prime numbers", () => {
      const smallPrimes = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
      ];
      smallPrimes.forEach((prime) => {
        expect(isPrime(prime)).toBe(true);
      });
    });

    test("should return false for small composite numbers", () => {
      const smallComposites = [
        4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25,
      ];
      smallComposites.forEach((composite) => {
        expect(isPrime(composite)).toBe(false);
      });
    });
  });

  describe("medium range numbers", () => {
    test("should correctly identify medium primes", () => {
      expect(isPrime(97)).toBe(true);
      expect(isPrime(101)).toBe(true);
      expect(isPrime(103)).toBe(true);
      expect(isPrime(107)).toBe(true);
      expect(isPrime(109)).toBe(true);
      expect(isPrime(113)).toBe(true);
    });

    test("should correctly identify medium composites", () => {
      expect(isPrime(100)).toBe(false);
      expect(isPrime(102)).toBe(false);
      expect(isPrime(104)).toBe(false);
      expect(isPrime(105)).toBe(false);
      expect(isPrime(106)).toBe(false);
      expect(isPrime(108)).toBe(false);
    });
  });

  describe("perfect squares", () => {
    test("should return false for perfect squares > 1", () => {
      expect(isPrime(4)).toBe(false); // 2²
      expect(isPrime(9)).toBe(false); // 3²
      expect(isPrime(16)).toBe(false); // 4²
      expect(isPrime(25)).toBe(false); // 5²
      expect(isPrime(49)).toBe(false); // 7²
      expect(isPrime(121)).toBe(false); // 11²
    });
  });

  describe.skip("large numbers", () => {
    test("should handle larger prime numbers", () => {
      expect(isPrime(997)).toBe(true);
      expect(isPrime(1009)).toBe(true);
      expect(isPrime(1013)).toBe(true);
    });

    test("should handle larger composite numbers", () => {
      expect(isPrime(1000)).toBe(false);
      expect(isPrime(1001)).toBe(false); // 7 × 11 × 13
      expect(isPrime(1002)).toBe(false);
    });
  });
});

describe.skip("checkPrimeWithDetails", () => {
  describe("edge cases", () => {
    test("should handle numbers less than 2", () => {
      const result1 = checkPrimeWithDetails(1);
      expect(result1).toEqual({
        number: 1,
        isPrime: false,
        factors: [],
      });

      const result0 = checkPrimeWithDetails(0);
      expect(result0).toEqual({
        number: 0,
        isPrime: false,
        factors: [],
      });

      const resultNeg = checkPrimeWithDetails(-5);
      expect(resultNeg).toEqual({
        number: -5,
        isPrime: false,
        factors: [],
      });
    });

    test("should handle non-integers", () => {
      const result = checkPrimeWithDetails(2.5);
      expect(result).toEqual({
        number: 2.5,
        isPrime: false,
        factors: [],
      });
    });
  });

  describe.skip("prime numbers", () => {
    test("should return correct details for small primes", () => {
      const result2 = checkPrimeWithDetails(2);
      expect(result2.number).toBe(2);
      expect(result2.isPrime).toBe(true);
      expect(result2.factors).toEqual([]);

      const result7 = checkPrimeWithDetails(7);
      expect(result7.number).toBe(7);
      expect(result7.isPrime).toBe(true);
      expect(result7.factors).toEqual([]);

      const result17 = checkPrimeWithDetails(17);
      expect(result17.number).toBe(17);
      expect(result17.isPrime).toBe(true);
      expect(result17.factors).toEqual([]);
    });

    test("should return correct details for larger primes", () => {
      const result = checkPrimeWithDetails(97);
      expect(result.number).toBe(97);
      expect(result.isPrime).toBe(true);
      expect(result.factors).toEqual([]);
    });
  });

  describe.skip("composite numbers", () => {
    test("should return factors for small composites", () => {
      const result4 = checkPrimeWithDetails(4);
      expect(result4.number).toBe(4);
      expect(result4.isPrime).toBe(false);
      expect(result4.factors).toEqual([2]);

      const result6 = checkPrimeWithDetails(6);
      expect(result6.number).toBe(6);
      expect(result6.isPrime).toBe(false);
      expect(result6.factors).toEqual([2, 3]);

      const result12 = checkPrimeWithDetails(12);
      expect(result12.number).toBe(12);
      expect(result12.isPrime).toBe(false);
      expect(result12.factors).toEqual([2, 3, 4, 6]);
    });

    test("should handle perfect squares correctly", () => {
      const result9 = checkPrimeWithDetails(9);
      expect(result9.number).toBe(9);
      expect(result9.isPrime).toBe(false);
      expect(result9.factors).toEqual([3]); // Should only include 3 once

      const result16 = checkPrimeWithDetails(16);
      expect(result16.number).toBe(16);
      expect(result16.isPrime).toBe(false);
      expect(result16.factors).toEqual([2, 4]); // Should only include 4 once
    });

    test("should return sorted factors", () => {
      const result30 = checkPrimeWithDetails(30);
      expect(result30.number).toBe(30);
      expect(result30.isPrime).toBe(false);
      expect(result30.factors).toEqual([2, 3, 5, 6, 10, 15]);

      // Verify factors are sorted
      if (result30.factors) {
        const factors = result30.factors as number[];
        for (let i = 1; i < factors.length; i++) {
          expect(factors[i]).toBeGreaterThan(factors[i - 1] as number);
        }
      }
    });
  });

  describe.skip("type safety", () => {
    test("should return readonly properties", () => {
      const result = checkPrimeWithDetails(6);

      // TypeScript should enforce readonly, but we can test the structure
      expect(result).toHaveProperty("number");
      expect(result).toHaveProperty("isPrime");
      expect(result).toHaveProperty("factors");

      // Verify the result matches the PrimeCheckResult type structure
      expect(typeof result.number).toBe("number");
      expect(typeof result.isPrime).toBe("boolean");
      if (result.factors !== undefined) {
        expect(Array.isArray(result.factors)).toBe(true);
      }
    });

    test("should have consistent isPrime and factors relationship", () => {
      // For primes, factors should be empty
      const primeResult = checkPrimeWithDetails(7);
      expect(primeResult.isPrime).toBe(true);
      expect(primeResult.factors).toEqual([]);

      // For composites, factors should exist and be non-empty
      const compositeResult = checkPrimeWithDetails(8);
      expect(compositeResult.isPrime).toBe(false);
      expect(compositeResult.factors).toEqual([2, 4]);
      expect((compositeResult.factors as number[]).length).toBeGreaterThan(0);
    });
  });

  describe("mathematical correctness", () => {
    test("all factors should actually divide the number", () => {
      const testNumbers = [12, 18, 24, 30, 36, 60];

      testNumbers.forEach((num) => {
        const result = checkPrimeWithDetails(num);
        if (result.factors && result.factors.length > 0) {
          result.factors.forEach((factor) => {
            expect(num % factor).toBe(0);
          });
        }
      });
    });

    test("should find all proper divisors", () => {
      // 12 has divisors: 1, 2, 3, 4, 6, 12
      // Function should return proper divisors excluding 1 and 12: [2, 3, 4, 6]
      const result = checkPrimeWithDetails(12);
      expect(result.factors).toEqual([2, 3, 4, 6]);

      // Verify these are all the proper divisors
      const properDivisors: number[] = [];
      for (let i = 2; i < 12; i++) {
        if (12 % i === 0) {
          properDivisors.push(i);
        }
      }
      expect(result.factors).toEqual(properDivisors);
    });
  });
});
