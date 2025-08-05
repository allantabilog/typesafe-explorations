import { greet, add, createResponse, Status } from './index';

describe('Sandbox Functions', () => {
  describe('greet', () => {
    it('should return a greeting message', () => {
      const result = greet('World');
      expect(result).toBe('Hello, World!');
    });

    it('should handle empty string', () => {
      const result = greet('');
      expect(result).toBe('Hello, !');
    });
  });

  describe('add', () => {
    it('should add two positive numbers', () => {
      const result = add(2, 3);
      expect(result).toBe(5);
    });

    it('should add negative numbers', () => {
      const result = add(-2, -3);
      expect(result).toBe(-5);
    });

    it('should add zero', () => {
      const result = add(5, 0);
      expect(result).toBe(5);
    });
  });

  describe('createResponse', () => {
    it('should create response without message', () => {
      const data = { id: 1, name: 'Test' };
      const status: Status = 'success';
      const result = createResponse(data, status);
      
      expect(result).toEqual({
        data,
        status
      });
      expect(result.message).toBeUndefined();
    });

    it('should create response with message', () => {
      const data = { id: 1, name: 'Test' };
      const status: Status = 'error';
      const message = 'Something went wrong';
      const result = createResponse(data, status, message);
      
      expect(result).toEqual({
        data,
        status,
        message
      });
    });

    it('should work with different data types', () => {
      const stringData = 'test string';
      const result = createResponse(stringData, 'loading');
      
      expect(result.data).toBe(stringData);
      expect(result.status).toBe('loading');
    });
  });
});
