# @rxtk/stats
> 📊 RxJS operators for statistics

```bash
yarn add @rxtk/stats
```

## API

### `accuracy([initialState={truePositives: 0, falsePositives: 0, trueNegatives: 0, falseNegatives: 0}])`
```js
import { from } from 'rxjs';
import { accuracy } from '@rxtk/stats';

const items = [
  [0, 1], // [trueLabel, prediction]
  [0, 1],
  [0, 1],
  [0, 0],
  [0, 0],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 0],
];

const accuracy$ = from(items).pipe(
  accuracy()
);

accuracy$.subscribe(console.log);
// Output
// 0
// 0
// 0
// 0.25
// 0.40
// 0.50
// 0.5714285714
// 0.625
// 0.6666666667
// 0.6
```

### `change()`
```js
import { from } from 'rxjs';
import { change } from '@rxtk/stats';

const num$ = from([2, 5, 9, 16, 26]);
const change$ = num$.pipe(
  change()
);
change$.subscribe(console.log);
// Output:
// 3
// 4
// 7
// 10
```

### `countValues([initialState={valueCounts: {}, keyCount: 0}])`
```js
import { from } from 'rxjs';
import { countValues } from '@rxtk/stats';

const item$ = from([1, 2, 2, 2, 'foo', 'foo']);
const counts$ = item$.pipe(
  countValues()
);
counts$.subscribe(console.log);
// Output:
// [{value: 1, count: 1}]
// [{value: 1, count: 1}, {value: 2, count: 1}]
// [{value: 1, count: 1}, {value: 2, count: 2}]
// [{value: 1, count: 1}, {value: 2, count: 3}]
// [{value: 1, count: 1}, {value: 2, count: 1}, {value: 'foo', count: 1}]
// [{value: 1, count: 1}, {value: 2, count: 1}, {value: 'foo', count: 2}]
```

### `dirtyR([initialState={meanState: Object, stdevState: Object}])`
> Warning: This method is called "dirty" because, by default, it will estimate R values using incremental estimates of the sample mean and standard deviation. This provides faster, streamable results but does not guarantee that the R value will be completely correct for all data sets.

Estimates R (the correlation coefficient) of an Observable. It will compute the current sample mean and sample standard deviation of the stream and then use those to estimate R. This allows it to provide estimates quickly and in real-time.

However, R values estimated early in the stream will typically be less correct than those estimated later (because the sample mean and variance will be estimated more correctly as more data points are ingested). For most large and randomly sampled datasets, the R value will eventually converge to its true values as more items are ingested over time.

```js
import { from } from 'rxjs';
import { dirtyR } from '@rxtk/stats';

const instance$ = from([
  // [x, y], // where x is a variable/feature and y is the value to predict
  [600, 75],
  [470, 60],
  [170, 15],
  [430, 40],
  [300, 30],
]);
const r$ = from(instance$).pipe(
  dirtyR()
);

r$.subscribe(console.log);
// 0.5
// 0.8684,
// 0.5723,
// 0.5130

```

### dirtyZScore([initialState={meanState: Object, stdevState: Object}])
> Warning: This method is called "dirty" because, by default, it will estimate z-score values using incremental estimates of the sample mean and standard deviation. If you want the true (pure) z-score, then you must pass it the true mean and true standard deviation in its initialState.

Estimates z-score (the correlation coefficient) of an Observable.

By default, it will compute the current sample mean and sample standard deviation of the stream and then use those to estimate the z-score. This allows it to provide estimates quickly and in real-time. Using this approach the entire dataset can be analyzed in just one pass. However, z-score values estimated early in the stream will typically be less correct than those estimated later (because the sample mean and variance will be estimated more correctly as more data points are ingested). For most large and randomly sampled datasets, the z-score value will eventually converge to its true values as more items are ingested over time.

Calculating the true (pure) z-score, requires first calculating the mean and standard deviation of the dataset and passing these values in as part of the initial state. (See example below)
```js
import { from } from 'rxjs';
import { dirtyZScore } from '@rxtk/stats';

const zombiePirateHeight$ = [
  600,
  470,
  170,
  430,
  300,
];
const zScore$ = from(zombiePirateHeight$).pipe(
  dirtyZScore()
);

zScore$.subscribe(console.log);
// -0.7071
// -1.1034
// 0.0693
// -0.5707
```

**Calculate True z-score**:

```js
import { from, zip } from 'rxjs';
import { mergeMap, takeLast } from 'rxjs/operators';
import { dirtyZScore, mean, stdev } from '@rxtk/stats';

const zombiePirateHeight$ = from([
  600,
  470,
  170,
  430,
  300,
]);

const mean$ = zombiePirateHeight$.pipe(
  mean(),
  takeLast(1)
);
const stdev$ = zombiePirateHeight$.pipe(
  stdev(),
  takeLast(1)
);
const trueZScore$ = zip(mean$, stdev$).pipe(
  mergeMap(([trueMean, trueStdev]) => (
    zombiePirateHeight$.pipe(
      dirtyZScore({trueMean, trueStdev})
    )
  ))
);

trueZScore$.subscribe(console.log);
```

### `f1([initialState={truePositives: 0, falsePositives: 0, falseNegatives: 0}])`
Given an Observable of ground-truth labels and predictions, the f1 operator returns the f1 score.

```js
import { from } from 'rxjs';
import { skip } from 'rxjs/operators';
import { f1 } from '@rxtk/stats';

const items = [
  [0, 1], // [trueLabel, predictedLabel]
  [1, 0],
  [1, 0],
  [0, 0],
  [0, 0],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
];

const f1$ = from(items).pipe(
  f1(),
  skip(4)
);

f1$.subscribe(console.log);
// Output
// 0.4
// 0.571429
// 0.666667
// 0.727273
// 0.769231
```

### `mean([initialState={average: 0, sum: 0, index: 0}])`
Calculate the mean on a stream of numbers.
```js
import { from } from 'rxjs';
import { mean } from '@rxtk/stats';

const mean$ = from([1, 2, 3, 4]).pipe(
  mean()
);

mean$.subscribe(console.log);
// 1
// 1.5
// 2
// 2.5
```

### `precision([initialState={truePositives: 0, falsePositives: 0}])`
Given an Observable of ground-truth labels and predictions, the precision operator returns the precision.
```js
import { from } from 'rxjs';
import { precision } from '@rxtk/stats';

const items = [
  [0, 1], // [trueLabel, prediction]
  [0, 1],
  [0, 1],
  [0, 0],
  [0, 0],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 0],
];

const precision$ = from(items).pipe(
  precision()
);

precision$.subscribe(console.log);
// Output
// 0
// 0
// 0
// 0
// 0
// 0.25
// 0.40
// 0.50
// 0.5714285714
// 0.5714285714
```

### `recall([initialState={truePositives: 0, falseNegatives: 0}])`
Given an Observable of ground-truth labels and predictions, the recall operator returns the recall.

```js
import { from } from 'rxjs';
import { recall } from '@rxtk/stats';

const items = [
  [0, 1], // [trueLabel, prediction]
  [0, 1],
  [0, 1],
  [0, 0],
  [0, 0],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 0],
];

const recall$ = from(items).pipe(
  recall()
);

recall$.subscribe(console.log);
// Output
// 0
// 0
// 0
// 0
// 0
// 0.25
// 0.40
// 0.50
// 0.5714285714
// 0.5714285714
```

### `roundTo(numDecimalPlaces: Number)`
Rounds numbers in an Observable to the number of desired decimal places.

```js
import { from } from 'rxjs';
import { roundTo } from '@rxtk/stats';

const num$ = from([1.234567, 4.5678]);
const roundedNum$ = num$.pipe(
  roundTo(3)
);
roundedNum$.subscribe(console.log);
// Output:
// 1.235
// 4.568
```

### `stdev([initialState={index: 0, mean: 0, m2: null}], [sample=true])`
Computes the sample standard deviation of an Observable using [Welford's Online Algorithm](https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance#Welford's_online_algorithm).

By default, it will compute the sample (rather than population) standard deviation.

```js
import { from } from 'rxjs';
import { takeLast } from 'rxjs';
import { stdev, roundTo } from '@rxtk/stats';

const stdev$ = from([600, 470, 170, 430, 300]).pipe(
  stdev(),
  takeLast(1),
  roundTo(6)
);

stdev$.subscribe(console.log);
// Output:
// 164.71187
```

### `sum([initialState={total: 0}])`
Calculates the sum of all items in an Observable.

```js
import { from } from 'rxjs';
import { sum } from '@rxtk/stats';

const num$ = from([1, 2, 3, 4, 5]);
const sum$ = num$.pipe(
  sum()
);
num$.subscribe(console.log);
// Output:
// 1
// 3
// 6
// 10
// 15
```

### `variance([initialState={index: 0, mean: 0, m2: null}], [sample=true])`
Computes the variance of an Observable using [Welford's Online Algorithm](https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance#Welford's_online_algorithm).

By default, it will compute the sample variance.

**Sample variance**:
```js
import { from } from 'rxjs';
import { takeLast } from 'rxjs';
import { variance } from '@rxtk/stats';

const variance$ = from([600, 470, 170, 430, 300]).pipe(
  variance(),
  takeLast(1)
);

variance$.subscribe(console.log);
// Output:
// 27130
```

**Population variance**:
```js
import { from } from 'rxjs';
import { takeLast } from 'rxjs';
import { variance } from '@rxtk/stats';

const variance$ = from([600, 470, 170, 430, 300]).pipe(
  variance(false),
  takeLast(1)
);

variance$.subscribe(console.log);
// Output:
// 21704
```