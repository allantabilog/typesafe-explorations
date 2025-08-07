/**
 * Basic prime checker using a trial division algorithm
 * @param n 
 * @returns 
 */
export function isPrime(n: number): boolean {
    if (!Number.isInteger(n) || n < 2) {
        return false
    }

    if (n == 2) return true;

    if (n % 2 === 0) return false;

    // check odd divisors up to sqrt(n)
    for (let i = 3; i < Math.sqrt(n); i += 2) {
        if (n % i === 0) {
            return false;
        }
    }

    return true;
}

// type PositiveInteger = number & { readonly __brand: unique symbol};

// function assertPositiveInteger(n: number): asserts n is PositiveInteger {
//     if (!Number.isInteger(n) || n < 1) {
//         throw new Error(`Expected positive integer, got: ${n}`)
//     }
// }

// function isPrimeSafe(n: number): boolean {
//     assertPositiveInteger(n);
//     return isPrime(n);
// }

export type PrimeCheckResult = {
    readonly number: number;
    readonly isPrime: boolean;
    readonly factors?: readonly number[];
}

export function checkPrimeWithDetails(n: number): PrimeCheckResult {
    if (!Number.isInteger(n) || n < 2){
        return {
            number: n,
            isPrime: false,
            factors: []
        };
    }

    const factors: number[] = []
    const limit = Math.sqrt(n);

    for (let i = 2; i < limit; i++) {
        if (n % i == 0) {
            factors.push(i);
            if (i !== n/i) {
                factors.push(n / i);
            }
        }
    }

    return {
        number: n,
        isPrime: factors.length === 0,
        factors: factors.length > 0 ? factors.sort((a, b) => a - b) : [],
    } as const;
}