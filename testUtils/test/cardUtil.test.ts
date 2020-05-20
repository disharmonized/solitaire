import * as assert from 'assert';
import { parseCardColorFromString, SimpleCardColors } from 'testUtils/src/cardUtil';

describe('testUtils', function() {
  describe('CardUtil', function() {
    describe('#parseCardColorFromString()', function() {
      it('should correctly parse card color from string', function() {
        const cardColorString = '3';
        const color = parseCardColorFromString(cardColorString);
        assert.equal(color, SimpleCardColors.Green);
      });
      it('should throw error if string color code length is not equal 1', function() {
        const cardString = '__';
        assert.throws(() => parseCardColorFromString(cardString), { message: 'Cannot parse card color __ from string: length should be 1' });
      });
      it('should throw error if string color code is unknown', function() {
        const cardString = '7';
        assert.throws(() => parseCardColorFromString(cardString), { message: 'Cannot parse card color 7 from string: Unknown color code' });
      });
    });
  });
});
