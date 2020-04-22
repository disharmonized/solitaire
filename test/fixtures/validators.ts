/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { validate } from 'src/core/validation/validateMethod';
import { cardIndex, cardIndexesRest } from 'src/core/validation/parameterValidators';

export class DecoratedClass {
  @validate
  method1(@cardIndex _param: number): void {}

  @validate
  method2(@cardIndex _param1: number, @cardIndex _para21: number): void {}

  @validate
  method3(@cardIndexesRest ..._param1: number[]): string {
    return _param1.join(',');
  }
}
