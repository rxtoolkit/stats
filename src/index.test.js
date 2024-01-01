import {expect} from 'chai';
// import sinon from 'sinon';
// import {marbles} from 'rxjs-marbles/mocha';

import * as api from './index';

describe('index', () => {
  it('should export public API', () => {
    expect(Object.keys(api)).to.deep.equal([
      'accuracy',
      'change',
      'countValues',
      'dirtyR',
      'dirtyZScore',
      'f1',
      'mean',
      'precision',
      'recall',
      'roundTo',
      'stdev',
      'sum',
      'throwUnlessNum',
      'variance',
    ]);
  });
});
