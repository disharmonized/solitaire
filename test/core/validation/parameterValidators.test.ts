import { DecoratedClass } from 'test/fixtures/validators';
import * as assert from 'assert';

describe('ParameterValidators', function() {
  describe('@cardIndex', function() {
    describe('for single parameter', function() {
      it('should throw error if value is negative', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          decoratedClass.method1(-1);
        };
        assert.throws(block, { message: 'Invalid card index -1: should be non-negative integer' });
      });
      it('should throw error if value is non-integer', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          decoratedClass.method1(3.1415);
        };
        assert.throws(block, { message: 'Invalid card index 3.1415: should be non-negative integer' });
      });
      it('should let pass through if value is positive integer number', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          decoratedClass.method1(1);
        };
        assert.doesNotThrow(block);
      });
    });
    describe('for two parameters', function() {
      it('should throw correct error if 1st value is invalid and 2nd is valid ', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          decoratedClass.method2(-1, 1);
        };
        assert.throws(block, { message: 'Invalid card index -1: should be non-negative integer' });
      });
      it('should throw correct error if 1st value is invalid and 2nd is invalid ', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          decoratedClass.method2(-1, -2);
        };
        assert.throws(block, { message: 'Invalid card index -2: should be non-negative integer' });
      });
      it('should throw correct error if 1st value is valid and 2nd is invalid ', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          decoratedClass.method2(1, -1);
        };
        assert.throws(block, { message: 'Invalid card index -1: should be non-negative integer' });
      });
      it('should let pass through if both values are valid', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          decoratedClass.method2(1, 1);
        };
        assert.doesNotThrow(block);
      });
    });
  });
  describe('@cardIndexesRest', function() {
    describe('for single parameter', function() {
      it('should throw error if value is invalid', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          decoratedClass.method3(1, 2, -3);
        };
        assert.throws(block, { message: 'Invalid card indexes 1, 2, -3: all should be non-negative integers' });
      });
      it('should let pass through if value is positive integer number', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          const result = decoratedClass.method3(1, 2, 3);
          assert.equal(result, '1,2,3');
        };
        assert.doesNotThrow(block);
      });
    });
    describe('@cardIndex + @cardIndexesRest', function() {
      it('should let pass through if @cardIndex is valid and @cardIndexesRest is valid', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          const result = decoratedClass.method4(1, 2, 3);
          assert.equal(result, '1,[2,3]');
        };
        assert.doesNotThrow(block);
      });
      it('should throw error if @cardIndex is invalid and @cardIndexesRest is valid', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          decoratedClass.method4(-1, 2, 3);
        };
        assert.throws(block, { message: 'Invalid card index -1: should be non-negative integer' });
      });
      it('should throw error if @cardIndex is valid and @cardIndexesRest is invalid', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          decoratedClass.method4(1, -2, -3);
        };
        assert.throws(block, { message: 'Invalid card indexes -2, -3: all should be non-negative integers' });
      });
    });
  });
  describe('@validCardNumberToTake', function() {
    describe('for single parameter', function() {
      it('should throw error if value is negative', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          decoratedClass.method5(-1);
        };
        assert.throws(block, { message: 'Invalid card number to take -1: should be non-negative integer' });
      });
      it('should throw error if value is non-integer', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          decoratedClass.method5(3.1415);
        };
        assert.throws(block, { message: 'Invalid card number to take 3.1415: should be non-negative integer' });
      });
      it('should let pass through if value is positive integer number', function() {
        const decoratedClass = new DecoratedClass();
        const block = (): void => {
          decoratedClass.method5(1);
        };
        assert.doesNotThrow(block);
      });
    });
  });
  describe('@nonNegativeInteger', function() {
    it('should throw error if value is invalid', function() {
      const decoratedClass = new DecoratedClass();
      assert.throws(() => decoratedClass.nonNegativeInteger(-1), { message: 'Invalid value -1: should be non-negative integer' });
    });
    it('should let pass through if value is valid', function() {
      const decoratedClass = new DecoratedClass();
      assert.doesNotThrow(() => decoratedClass.nonNegativeInteger(1));
    });
  });
  describe('@notEmptyArrayRest', function() {
    describe('for single parameter', function() {
      it('should throw error if array is empty', function() {
        const decoratedClass = new DecoratedClass();
        assert.throws(() => decoratedClass.emptyArray(), { message: 'Invalid value: array is empty' });
      });
      it('should let pass through if array is not empty', function() {
        const decoratedClass = new DecoratedClass();
        assert.doesNotThrow(() => decoratedClass.nonEmptyArray(1, 2, 3));
      });
    });
  });
});
