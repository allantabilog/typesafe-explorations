/**
 * A simple example function to demonstrate TypeScript type safety
 */
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

/**
 * Example of a more complex type-safe function
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * Example of using union types
 */
export type Status = 'loading' | 'success' | 'error';

export interface ApiResponse<T> {
  data: T;
  status: Status;
  message?: string;
}

/**
 * Generic function example
 */
export function createResponse<T>(data: T, status: Status, message?: string): ApiResponse<T> {
  const response: ApiResponse<T> = {
    data,
    status
  };
  
  if (message !== undefined) {
    response.message = message;
  }
  
  return response;
}
