import { add } from '../src/app/sum/utils';

describe('add function', () => {
  test('should return the sum of two numbers', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
    expect(add(10, -5)).toBe(5);
  });
});
