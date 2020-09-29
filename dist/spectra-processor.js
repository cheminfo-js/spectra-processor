/**
 * spectra-processor
 * @version v1.3.1
 * @link https://github.com/cheminfo/spectra-processor#readme
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.spectraProcessor = {}));
}(this, (function (exports) { 'use strict';

  const toString = Object.prototype.toString;

  function isAnyArray(object) {
    return toString.call(object).endsWith('Array]');
  }

  var src = isAnyArray;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  		path: basedir,
  		exports: {},
  		require: function (path, base) {
  			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
  		}
  	}, fn(module, module.exports), module.exports;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  var medianQuickselect_min = createCommonjsModule(function (module) {
    (function () {
      function a(d) {
        for (var e = 0, f = d.length - 1, g = void 0, h = void 0, i = void 0, j = c(e, f); !0;) {
          if (f <= e) return d[j];
          if (f == e + 1) return d[e] > d[f] && b(d, e, f), d[j];

          for (g = c(e, f), d[g] > d[f] && b(d, g, f), d[e] > d[f] && b(d, e, f), d[g] > d[e] && b(d, g, e), b(d, g, e + 1), h = e + 1, i = f; !0;) {
            do h++; while (d[e] > d[h]);

            do i--; while (d[i] > d[e]);

            if (i < h) break;
            b(d, h, i);
          }

          b(d, e, i), i <= j && (e = h), i >= j && (f = i - 1);
        }
      }

      var b = function b(d, e, f) {
        var _ref;

        return _ref = [d[f], d[e]], d[e] = _ref[0], d[f] = _ref[1], _ref;
      },
          c = function c(d, e) {
        return ~~((d + e) / 2);
      };

       module.exports ? module.exports = a : window.median = a;
    })();
  });

  /**
   * Computes the median of the given values
   * @param {Array<number>} input
   * @return {number}
   */

  function median(input) {
    if (!src(input)) {
      throw new TypeError('input must be an array');
    }

    if (input.length === 0) {
      throw new TypeError('input must not be empty');
    }

    return medianQuickselect_min(input.slice());
  }

  /**

  /**
   * This function xMultiply the first array by the second array or a constant value to each element of the first array
   * @param {Array} array1 - the array that will be rotated
   * @param {Array|Number} array2
   * @return {Float64Array}
   */
  function xMultiply(array1, array2) {
    let isConstant = false;
    let constant;

    if (Array.isArray(array2)) {
      if (array1.length !== array2.length) {
        throw new Error('sub: size of array1 and array2 must be identical');
      }
    } else {
      isConstant = true;
      constant = Number(array2);
    }

    let array3 = new Float64Array(array1.length);

    if (isConstant) {
      for (let i = 0; i < array1.length; i++) {
        array3[i] = array1[i] * constant;
      }
    } else {
      for (let i = 0; i < array1.length; i++) {
        array3[i] = array1[i] * array2[i];
      }
    }

    return array3;
  }

  /**
   * This function xSubtract the first array by the second array or a constant value from each element of the first array
   * @param {Array<Number>} array1 - the array that will be rotated
   * @return {object}
   */
  function xBoxPlot(array) {
    array = array.slice(0).sort((a, b) => a - b);

    if (array.length < 5) {
      throw Error('xBoxPlot: can not calculate info if array contains less than 3 elements');
    }

    let info = {
      Q1: 0.0,
      Q2: 0.0,
      Q3: 0.0,
      min: array[0],
      max: array[array.length - 1]
    };
    let q1max, q3min;

    if (array.length % 2 === 1) {
      // odd
      let middle = (array.length - 1) / 2;
      info.Q2 = array[middle];
      q1max = middle - 1;
      q3min = middle + 1;
    } else {
      // even
      q3min = array.length / 2;
      q1max = q3min - 1;
      info.Q2 = (array[q1max] + array[q3min]) / 2;
    }

    if (q1max % 2 === 0) {
      info.Q1 = array[q1max / 2];
      info.Q3 = array[(array.length + q3min - 1) / 2];
    } else {
      info.Q1 = (array[(q1max + 1) / 2] + array[(q1max - 1) / 2]) / 2;
      let middleOver = (array.length + q3min) / 2;
      info.Q3 = (array[middleOver] + array[middleOver - 1]) / 2;
    }

    return info;
  }

  /**

  /**
   * Calculates the correlation between 2 vectors
   * https://en.wikipedia.org/wiki/Correlation_and_dependence
   *
   * @param {Array<Number>} [A] - the array that will be rotated
   * @param {Array<Number>} [B]
   * @return {Array}
   */
  function xCorrelation(A, B) {
    let n = A.length;
    let sumA = 0;
    let sumA2 = 0;
    let sumB = 0;
    let sumB2 = 0;
    let sumAB = 0;

    for (let i = 0; i < n; i++) {
      let a = A[i];
      let b = B[i];
      sumA += a;
      sumA2 += a ** 2;
      sumB += b;
      sumB2 += b ** 2;
      sumAB += a * b;
    }

    return (n * sumAB - sumA * sumB) / (Math.sqrt(n * sumA2 - sumA ** 2) * Math.sqrt(n * sumB2 - sumB ** 2));
  }

  /**
   * Returns the closest index of a `target` in an ordered array
   * @param {array<Number>} array
   * @param {number} target
   */
  function xFindClosestIndex(array, target) {
    let low = 0;
    let high = array.length - 1;
    let middle = 0;

    while (high - low > 1) {
      middle = low + (high - low >> 1);

      if (array[middle] < target) {
        low = middle;
      } else if (array[middle] > target) {
        high = middle;
      } else {
        return middle;
      }
    }

    if (low < array.length - 1) {
      if (Math.abs(target - array[low]) < Math.abs(array[low + 1] - target)) {
        return low;
      } else {
        return low + 1;
      }
    } else {
      return low;
    }
  }

  /**
   * Returns an object with {fromIndex, toIndex} for a specific from / to
   * @param {array} x
   * @param {object} [options={}]
   * @param {number} [options.from] - First value for xyIntegration in the X scale
   * @param {number} [options.fromIndex=0] - First point for xyIntegration
   * @param {number} [options.to] - Last value for xyIntegration in the X scale
   * @param {number} [options.toIndex=x.length-1] - Last point for xyIntegration
   */

  function xGetFromToIndex(x, options = {}) {
    let {
      fromIndex,
      toIndex,
      from,
      to
    } = options;

    if (fromIndex === undefined) {
      if (from !== undefined) {
        fromIndex = xFindClosestIndex(x, from);
      } else {
        fromIndex = 0;
      }
    }

    if (toIndex === undefined) {
      if (to !== undefined) {
        toIndex = xFindClosestIndex(x, to);
      } else {
        toIndex = x.length - 1;
      }
    }

    if (fromIndex > toIndex) [fromIndex, toIndex] = [toIndex, fromIndex];
    return {
      fromIndex,
      toIndex
    };
  }

  var d3Array = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
       factory(exports) ;
    })(commonjsGlobal, function (exports) {

      function ascending(a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
      }

      function bisector(compare) {
        if (compare.length === 1) compare = ascendingComparator(compare);
        return {
          left: function (a, x, lo, hi) {
            if (lo == null) lo = 0;
            if (hi == null) hi = a.length;

            while (lo < hi) {
              var mid = lo + hi >>> 1;
              if (compare(a[mid], x) < 0) lo = mid + 1;else hi = mid;
            }

            return lo;
          },
          right: function (a, x, lo, hi) {
            if (lo == null) lo = 0;
            if (hi == null) hi = a.length;

            while (lo < hi) {
              var mid = lo + hi >>> 1;
              if (compare(a[mid], x) > 0) hi = mid;else lo = mid + 1;
            }

            return lo;
          }
        };
      }

      function ascendingComparator(f) {
        return function (d, x) {
          return ascending(f(d), x);
        };
      }

      var ascendingBisect = bisector(ascending);
      var bisectRight = ascendingBisect.right;
      var bisectLeft = ascendingBisect.left;

      function descending(a, b) {
        return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
      }

      function number$1(x) {
        return x === null ? NaN : +x;
      }

      function variance(array, f) {
        var n = array.length,
            m = 0,
            a,
            d,
            s = 0,
            i = -1,
            j = 0;

        if (f == null) {
          while (++i < n) {
            if (!isNaN(a = number$1(array[i]))) {
              d = a - m;
              m += d / ++j;
              s += d * (a - m);
            }
          }
        } else {
          while (++i < n) {
            if (!isNaN(a = number$1(f(array[i], i, array)))) {
              d = a - m;
              m += d / ++j;
              s += d * (a - m);
            }
          }
        }

        if (j > 1) return s / (j - 1);
      }

      function deviation(array, f) {
        var v = variance(array, f);
        return v ? Math.sqrt(v) : v;
      }

      function extent(array, f) {
        var i = -1,
            n = array.length,
            a,
            b,
            c;

        if (f == null) {
          while (++i < n) if ((b = array[i]) != null && b >= b) {
            a = c = b;
            break;
          }

          while (++i < n) if ((b = array[i]) != null) {
            if (a > b) a = b;
            if (c < b) c = b;
          }
        } else {
          while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) {
            a = c = b;
            break;
          }

          while (++i < n) if ((b = f(array[i], i, array)) != null) {
            if (a > b) a = b;
            if (c < b) c = b;
          }
        }

        return [a, c];
      }

      function constant(x) {
        return function () {
          return x;
        };
      }

      function identity(x) {
        return x;
      }

      function range(start, stop, step) {
        start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
        var i = -1,
            n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
            range = new Array(n);

        while (++i < n) {
          range[i] = start + i * step;
        }

        return range;
      }

      var e10 = Math.sqrt(50);
      var e5 = Math.sqrt(10);
      var e2 = Math.sqrt(2);

      function ticks(start, stop, count) {
        var step = tickStep(start, stop, count);
        return range(Math.ceil(start / step) * step, Math.floor(stop / step) * step + step / 2, // inclusive
        step);
      }

      function tickStep(start, stop, count) {
        var step0 = Math.abs(stop - start) / Math.max(0, count),
            step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
            error = step0 / step1;
        if (error >= e10) step1 *= 10;else if (error >= e5) step1 *= 5;else if (error >= e2) step1 *= 2;
        return stop < start ? -step1 : step1;
      }

      function sturges(values) {
        return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
      }

      function number(x) {
        return +x;
      }

      function histogram() {
        var value = identity,
            domain = extent,
            threshold = sturges;

        function histogram(data) {
          var i,
              n = data.length,
              x,
              values = new Array(n); // Coerce values to numbers.

          for (i = 0; i < n; ++i) {
            values[i] = +value(data[i], i, data);
          }

          var xz = domain(values),
              x0 = +xz[0],
              x1 = +xz[1],
              tz = threshold(values, x0, x1); // Convert number of thresholds into uniform thresholds.

          if (!Array.isArray(tz)) tz = ticks(x0, x1, +tz); // Coerce thresholds to numbers, ignoring any outside the domain.

          var m = tz.length;

          for (i = 0; i < m; ++i) tz[i] = +tz[i];

          while (tz[0] <= x0) tz.shift(), --m;

          while (tz[m - 1] >= x1) tz.pop(), --m;

          var bins = new Array(m + 1),
              bin; // Initialize bins.

          for (i = 0; i <= m; ++i) {
            bin = bins[i] = [];
            bin.x0 = i > 0 ? tz[i - 1] : x0;
            bin.x1 = i < m ? tz[i] : x1;
          } // Assign data to bins by value, ignoring any outside the domain.


          for (i = 0; i < n; ++i) {
            x = values[i];

            if (x0 <= x && x <= x1) {
              bins[bisectRight(tz, x, 0, m)].push(data[i]);
            }
          }

          return bins;
        }

        histogram.value = function (_) {
          return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), histogram) : value;
        };

        histogram.domain = function (_) {
          return arguments.length ? (domain = typeof _ === "function" ? _ : constant([+_[0], +_[1]]), histogram) : domain;
        };

        histogram.thresholds = function (_) {
          if (!arguments.length) return threshold;
          threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(Array.prototype.map.call(_, number)) : constant(+_);
          return histogram;
        };

        return histogram;
      }

      function quantile(array, p, f) {
        if (f == null) f = number$1;
        if (!(n = array.length)) return;
        if ((p = +p) <= 0 || n < 2) return +f(array[0], 0, array);
        if (p >= 1) return +f(array[n - 1], n - 1, array);
        var n,
            h = (n - 1) * p,
            i = Math.floor(h),
            a = +f(array[i], i, array),
            b = +f(array[i + 1], i + 1, array);
        return a + (b - a) * (h - i);
      }

      function freedmanDiaconis(values, min, max) {
        values.sort(ascending);
        return Math.ceil((max - min) / (2 * (quantile(values, 0.75) - quantile(values, 0.25)) * Math.pow(values.length, -1 / 3)));
      }

      function scott(values, min, max) {
        return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3)));
      }

      function max(array, f) {
        var i = -1,
            n = array.length,
            a,
            b;

        if (f == null) {
          while (++i < n) if ((b = array[i]) != null && b >= b) {
            a = b;
            break;
          }

          while (++i < n) if ((b = array[i]) != null && b > a) a = b;
        } else {
          while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) {
            a = b;
            break;
          }

          while (++i < n) if ((b = f(array[i], i, array)) != null && b > a) a = b;
        }

        return a;
      }

      function mean(array, f) {
        var s = 0,
            n = array.length,
            a,
            i = -1,
            j = n;

        if (f == null) {
          while (++i < n) if (!isNaN(a = number$1(array[i]))) s += a;else --j;
        } else {
          while (++i < n) if (!isNaN(a = number$1(f(array[i], i, array)))) s += a;else --j;
        }

        if (j) return s / j;
      }

      function median(array, f) {
        var numbers = [],
            n = array.length,
            a,
            i = -1;

        if (f == null) {
          while (++i < n) if (!isNaN(a = number$1(array[i]))) numbers.push(a);
        } else {
          while (++i < n) if (!isNaN(a = number$1(f(array[i], i, array)))) numbers.push(a);
        }

        return quantile(numbers.sort(ascending), 0.5);
      }

      function merge(arrays) {
        var n = arrays.length,
            m,
            i = -1,
            j = 0,
            merged,
            array;

        while (++i < n) j += arrays[i].length;

        merged = new Array(j);

        while (--n >= 0) {
          array = arrays[n];
          m = array.length;

          while (--m >= 0) {
            merged[--j] = array[m];
          }
        }

        return merged;
      }

      function min(array, f) {
        var i = -1,
            n = array.length,
            a,
            b;

        if (f == null) {
          while (++i < n) if ((b = array[i]) != null && b >= b) {
            a = b;
            break;
          }

          while (++i < n) if ((b = array[i]) != null && a > b) a = b;
        } else {
          while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) {
            a = b;
            break;
          }

          while (++i < n) if ((b = f(array[i], i, array)) != null && a > b) a = b;
        }

        return a;
      }

      function pairs(array) {
        var i = 0,
            n = array.length - 1,
            p = array[0],
            pairs = new Array(n < 0 ? 0 : n);

        while (i < n) pairs[i] = [p, p = array[++i]];

        return pairs;
      }

      function permute(array, indexes) {
        var i = indexes.length,
            permutes = new Array(i);

        while (i--) permutes[i] = array[indexes[i]];

        return permutes;
      }

      function scan(array, compare) {
        if (!(n = array.length)) return;
        var i = 0,
            n,
            j = 0,
            xi,
            xj = array[j];
        if (!compare) compare = ascending;

        while (++i < n) if (compare(xi = array[i], xj) < 0 || compare(xj, xj) !== 0) xj = xi, j = i;

        if (compare(xj, xj) === 0) return j;
      }

      function shuffle(array, i0, i1) {
        var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
            t,
            i;

        while (m) {
          i = Math.random() * m-- | 0;
          t = array[m + i0];
          array[m + i0] = array[i + i0];
          array[i + i0] = t;
        }

        return array;
      }

      function sum(array, f) {
        var s = 0,
            n = array.length,
            a,
            i = -1;

        if (f == null) {
          while (++i < n) if (a = +array[i]) s += a; // Note: zero and null are equivalent.

        } else {
          while (++i < n) if (a = +f(array[i], i, array)) s += a;
        }

        return s;
      }

      function transpose(matrix) {
        if (!(n = matrix.length)) return [];

        for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
          for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
            row[j] = matrix[j][i];
          }
        }

        return transpose;
      }

      function length(d) {
        return d.length;
      }

      function zip() {
        return transpose(arguments);
      }

      var version = "0.7.1";
      exports.version = version;
      exports.bisect = bisectRight;
      exports.bisectRight = bisectRight;
      exports.bisectLeft = bisectLeft;
      exports.ascending = ascending;
      exports.bisector = bisector;
      exports.descending = descending;
      exports.deviation = deviation;
      exports.extent = extent;
      exports.histogram = histogram;
      exports.thresholdFreedmanDiaconis = freedmanDiaconis;
      exports.thresholdScott = scott;
      exports.thresholdSturges = sturges;
      exports.max = max;
      exports.mean = mean;
      exports.median = median;
      exports.merge = merge;
      exports.min = min;
      exports.pairs = pairs;
      exports.permute = permute;
      exports.quantile = quantile;
      exports.range = range;
      exports.scan = scan;
      exports.shuffle = shuffle;
      exports.sum = sum;
      exports.ticks = ticks;
      exports.tickStep = tickStep;
      exports.transpose = transpose;
      exports.variance = variance;
      exports.zip = zip;
    });
  });

  /**
   * This function xSubtract the first array by the second array or a constant value from each element of the first array
   * @param {Array} array1 - the array that will be rotated
   * @param {Array|Number} array2
   * @return {Array}
   */
  function xSubtract(array1, array2) {
    let isConstant = false;
    let constant;

    if (Array.isArray(array2)) {
      if (array1.length !== array2.length) {
        throw new Error('sub: size of array1 and array2 must be identical');
      }
    } else {
      isConstant = true;
      constant = Number(array2);
    }

    let array3 = new Array(array1.length);

    if (isConstant) {
      for (let i = 0; i < array1.length; i++) {
        array3[i] = array1[i] - constant;
      }
    } else {
      for (let i = 0; i < array1.length; i++) {
        array3[i] = array1[i] - array2[i];
      }
    }

    return array3;
  }

  const toString$1 = Object.prototype.toString;
  function isAnyArray$1(object) {
    return toString$1.call(object).endsWith('Array]');
  }

  /**
   * Throw an error in no an object of x,y arrays
   * @param {DataXY} [data={}]
   */

  function xyCheck(data = {}) {
    if (!isAnyArray$1(data.x) || !isAnyArray$1(data.y)) {
      throw new Error('Points must be an object of x and y arrays');
    }

    if (data.x.length !== data.y.length) {
      throw new Error('The x and y arrays mush have the same length');
    }
  }

  /**
   * In place modification of the 2 arrays to make X unique and sum the Y if X has the same value
   * @param {DataXY} [data={}] - Object that contains property x (an ordered increasing array) and y (an array)
   * @param {object} [options={}]
   * @param {number} [options.from] - First value for xyIntegration in the X scale
   * @param {number} [options.fromIndex=0] - First point for xyIntegration
   * @param {number} [options.to] - Last value for xyIntegration in the X scale
   * @param {number} [options.toIndex=x.length-1] - Last point for xyIntegration
   * @return {number} xyIntegration value on the specified range
   */

  function xyIntegration(data = {}, options = {}) {
    xyCheck(data);
    const {
      x,
      y
    } = data;
    if (x.length < 2) return 0;
    const {
      fromIndex,
      toIndex
    } = xGetFromToIndex(x, options);
    let currentxyIntegration = 0;

    for (let i = fromIndex; i < toIndex; i++) {
      currentxyIntegration += (x[i + 1] - x[i]) * (y[i + 1] + y[i]) / 2;
    }

    return currentxyIntegration;
  }

  /**
   * Finds the max y value in a range and return a {x,y} point
   * @param {DataXY} [data={}] - Object that contains property x (an ordered increasing array) and y (an array)
   * @param {object} [options={}]
   * @param {number} [options.from] - First value for xyIntegration in the X scale
   * @param {number} [options.fromIndex=0] - First point for xyIntegration
   * @param {number} [options.to] - Last value for xyIntegration in the X scale
   * @param {number} [options.toIndex=x.length-1] - Last point for xyIntegration
   * @return {object}
   */

  function xyMaxYPoint(data = {}, options = {}) {
    xyCheck(data);
    const {
      x,
      y
    } = data;
    if (x.length < 2) return 0;
    const {
      fromIndex,
      toIndex
    } = xGetFromToIndex(x, options);
    let current = {
      x: x[fromIndex],
      y: y[fromIndex],
      index: fromIndex
    };

    for (let i = fromIndex; i <= toIndex; i++) {
      if (y[i] > current.y) current = {
        x: x[i],
        y: y[i],
        index: i
      };
    }

    return current;
  }

  /**
   * Finds the max y value in a range and return a {x,y} point
   * @param {DataXY} [data={}] - Object that contains property x (an ordered increasing array) and y (an array)
   * @param {object} [options={}]
   * @param {number} [options.from] - First value for xyIntegration in the X scale
   * @param {number} [options.fromIndex=0] - First point for xyIntegration
   * @param {number} [options.to] - Last value for xyIntegration in the X scale
   * @param {number} [options.toIndex=x.length-1] - Last point for xyIntegration
   * @return {object}
   */

  function xyMinYPoint(data = {}, options = {}) {
    xyCheck(data);
    const {
      x,
      y
    } = data;
    if (x.length < 2) return 0;
    const {
      fromIndex,
      toIndex
    } = xGetFromToIndex(x, options);
    let current = {
      x: x[fromIndex],
      y: y[fromIndex],
      index: fromIndex
    };

    for (let i = fromIndex; i <= toIndex; i++) {
      if (y[i] < current.y) current = {
        x: x[i],
        y: y[i],
        index: i
      };
    }

    return current;
  }

  var chroma = createCommonjsModule(function (module, exports) {
    /**
     * chroma.js - JavaScript library for color conversions
     *
     * Copyright (c) 2011-2019, Gregor Aisch
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     * 1. Redistributions of source code must retain the above copyright notice, this
     * list of conditions and the following disclaimer.
     *
     * 2. Redistributions in binary form must reproduce the above copyright notice,
     * this list of conditions and the following disclaimer in the documentation
     * and/or other materials provided with the distribution.
     *
     * 3. The name Gregor Aisch may not be used to endorse or promote products
     * derived from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
     * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
     * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
     * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
     * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
     * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *
     * -------------------------------------------------------
     *
     * chroma.js includes colors from colorbrewer2.org, which are released under
     * the following license:
     *
     * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
     * and The Pennsylvania State University.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing,
     * software distributed under the License is distributed on an
     * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
     * either express or implied. See the License for the specific
     * language governing permissions and limitations under the License.
     *
     * ------------------------------------------------------
     *
     * Named colors are taken from X11 Color Names.
     * http://www.w3.org/TR/css3-color/#svg-color
     *
     * @preserve
     */
    (function (global, factory) {
       module.exports = factory() ;
    })(commonjsGlobal, function () {

      var limit = function (x, min, max) {
        if (min === void 0) min = 0;
        if (max === void 0) max = 1;
        return x < min ? min : x > max ? max : x;
      };

      var clip_rgb = function (rgb) {
        rgb._clipped = false;
        rgb._unclipped = rgb.slice(0);

        for (var i = 0; i <= 3; i++) {
          if (i < 3) {
            if (rgb[i] < 0 || rgb[i] > 255) {
              rgb._clipped = true;
            }

            rgb[i] = limit(rgb[i], 0, 255);
          } else if (i === 3) {
            rgb[i] = limit(rgb[i], 0, 1);
          }
        }

        return rgb;
      }; // ported from jQuery's $.type


      var classToType = {};

      for (var i = 0, list = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Undefined', 'Null']; i < list.length; i += 1) {
        var name = list[i];
        classToType["[object " + name + "]"] = name.toLowerCase();
      }

      var type = function (obj) {
        return classToType[Object.prototype.toString.call(obj)] || "object";
      };

      var unpack = function (args, keyOrder) {
        if (keyOrder === void 0) keyOrder = null; // if called with more than 3 arguments, we return the arguments

        if (args.length >= 3) {
          return Array.prototype.slice.call(args);
        } // with less than 3 args we check if first arg is object
        // and use the keyOrder string to extract and sort properties


        if (type(args[0]) == 'object' && keyOrder) {
          return keyOrder.split('').filter(function (k) {
            return args[0][k] !== undefined;
          }).map(function (k) {
            return args[0][k];
          });
        } // otherwise we just return the first argument
        // (which we suppose is an array of args)


        return args[0];
      };

      var last = function (args) {
        if (args.length < 2) {
          return null;
        }

        var l = args.length - 1;

        if (type(args[l]) == 'string') {
          return args[l].toLowerCase();
        }

        return null;
      };

      var PI = Math.PI;
      var utils = {
        clip_rgb: clip_rgb,
        limit: limit,
        type: type,
        unpack: unpack,
        last: last,
        PI: PI,
        TWOPI: PI * 2,
        PITHIRD: PI / 3,
        DEG2RAD: PI / 180,
        RAD2DEG: 180 / PI
      };
      var input = {
        format: {},
        autodetect: []
      };
      var last$1 = utils.last;
      var clip_rgb$1 = utils.clip_rgb;
      var type$1 = utils.type;

      var Color = function Color() {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        var me = this;

        if (type$1(args[0]) === 'object' && args[0].constructor && args[0].constructor === this.constructor) {
          // the argument is already a Color instance
          return args[0];
        } // last argument could be the mode


        var mode = last$1(args);
        var autodetect = false;

        if (!mode) {
          autodetect = true;

          if (!input.sorted) {
            input.autodetect = input.autodetect.sort(function (a, b) {
              return b.p - a.p;
            });
            input.sorted = true;
          } // auto-detect format


          for (var i = 0, list = input.autodetect; i < list.length; i += 1) {
            var chk = list[i];
            mode = chk.test.apply(chk, args);

            if (mode) {
              break;
            }
          }
        }

        if (input.format[mode]) {
          var rgb = input.format[mode].apply(null, autodetect ? args : args.slice(0, -1));
          me._rgb = clip_rgb$1(rgb);
        } else {
          throw new Error('unknown format: ' + args);
        } // add alpha channel


        if (me._rgb.length === 3) {
          me._rgb.push(1);
        }
      };

      Color.prototype.toString = function toString() {
        if (type$1(this.hex) == 'function') {
          return this.hex();
        }

        return "[" + this._rgb.join(',') + "]";
      };

      var Color_1 = Color;

      var chroma = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(chroma.Color, [null].concat(args)))();
      };

      chroma.Color = Color_1;
      chroma.version = '2.1.0';
      var chroma_1 = chroma;
      var unpack$1 = utils.unpack;
      var max = Math.max;

      var rgb2cmyk = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        var ref = unpack$1(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        r = r / 255;
        g = g / 255;
        b = b / 255;
        var k = 1 - max(r, max(g, b));
        var f = k < 1 ? 1 / (1 - k) : 0;
        var c = (1 - r - k) * f;
        var m = (1 - g - k) * f;
        var y = (1 - b - k) * f;
        return [c, m, y, k];
      };

      var rgb2cmyk_1 = rgb2cmyk;
      var unpack$2 = utils.unpack;

      var cmyk2rgb = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        args = unpack$2(args, 'cmyk');
        var c = args[0];
        var m = args[1];
        var y = args[2];
        var k = args[3];
        var alpha = args.length > 4 ? args[4] : 1;

        if (k === 1) {
          return [0, 0, 0, alpha];
        }

        return [c >= 1 ? 0 : 255 * (1 - c) * (1 - k), // r
        m >= 1 ? 0 : 255 * (1 - m) * (1 - k), // g
        y >= 1 ? 0 : 255 * (1 - y) * (1 - k), // b
        alpha];
      };

      var cmyk2rgb_1 = cmyk2rgb;
      var unpack$3 = utils.unpack;
      var type$2 = utils.type;

      Color_1.prototype.cmyk = function () {
        return rgb2cmyk_1(this._rgb);
      };

      chroma_1.cmyk = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(Color_1, [null].concat(args, ['cmyk'])))();
      };

      input.format.cmyk = cmyk2rgb_1;
      input.autodetect.push({
        p: 2,
        test: function () {
          var args = [],
              len = arguments.length;

          while (len--) args[len] = arguments[len];

          args = unpack$3(args, 'cmyk');

          if (type$2(args) === 'array' && args.length === 4) {
            return 'cmyk';
          }
        }
      });
      var unpack$4 = utils.unpack;
      var last$2 = utils.last;

      var rnd = function (a) {
        return Math.round(a * 100) / 100;
      };
      /*
       * supported arguments:
       * - hsl2css(h,s,l)
       * - hsl2css(h,s,l,a)
       * - hsl2css([h,s,l], mode)
       * - hsl2css([h,s,l,a], mode)
       * - hsl2css({h,s,l,a}, mode)
       */


      var hsl2css = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        var hsla = unpack$4(args, 'hsla');
        var mode = last$2(args) || 'lsa';
        hsla[0] = rnd(hsla[0] || 0);
        hsla[1] = rnd(hsla[1] * 100) + '%';
        hsla[2] = rnd(hsla[2] * 100) + '%';

        if (mode === 'hsla' || hsla.length > 3 && hsla[3] < 1) {
          hsla[3] = hsla.length > 3 ? hsla[3] : 1;
          mode = 'hsla';
        } else {
          hsla.length = 3;
        }

        return mode + "(" + hsla.join(',') + ")";
      };

      var hsl2css_1 = hsl2css;
      var unpack$5 = utils.unpack;
      /*
       * supported arguments:
       * - rgb2hsl(r,g,b)
       * - rgb2hsl(r,g,b,a)
       * - rgb2hsl([r,g,b])
       * - rgb2hsl([r,g,b,a])
       * - rgb2hsl({r,g,b,a})
       */

      var rgb2hsl = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        args = unpack$5(args, 'rgba');
        var r = args[0];
        var g = args[1];
        var b = args[2];
        r /= 255;
        g /= 255;
        b /= 255;
        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);
        var l = (max + min) / 2;
        var s, h;

        if (max === min) {
          s = 0;
          h = Number.NaN;
        } else {
          s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
        }

        if (r == max) {
          h = (g - b) / (max - min);
        } else if (g == max) {
          h = 2 + (b - r) / (max - min);
        } else if (b == max) {
          h = 4 + (r - g) / (max - min);
        }

        h *= 60;

        if (h < 0) {
          h += 360;
        }

        if (args.length > 3 && args[3] !== undefined) {
          return [h, s, l, args[3]];
        }

        return [h, s, l];
      };

      var rgb2hsl_1 = rgb2hsl;
      var unpack$6 = utils.unpack;
      var last$3 = utils.last;
      var round = Math.round;
      /*
       * supported arguments:
       * - rgb2css(r,g,b)
       * - rgb2css(r,g,b,a)
       * - rgb2css([r,g,b], mode)
       * - rgb2css([r,g,b,a], mode)
       * - rgb2css({r,g,b,a}, mode)
       */

      var rgb2css = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        var rgba = unpack$6(args, 'rgba');
        var mode = last$3(args) || 'rgb';

        if (mode.substr(0, 3) == 'hsl') {
          return hsl2css_1(rgb2hsl_1(rgba), mode);
        }

        rgba[0] = round(rgba[0]);
        rgba[1] = round(rgba[1]);
        rgba[2] = round(rgba[2]);

        if (mode === 'rgba' || rgba.length > 3 && rgba[3] < 1) {
          rgba[3] = rgba.length > 3 ? rgba[3] : 1;
          mode = 'rgba';
        }

        return mode + "(" + rgba.slice(0, mode === 'rgb' ? 3 : 4).join(',') + ")";
      };

      var rgb2css_1 = rgb2css;
      var unpack$7 = utils.unpack;
      var round$1 = Math.round;

      var hsl2rgb = function () {
        var assign;
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        args = unpack$7(args, 'hsl');
        var h = args[0];
        var s = args[1];
        var l = args[2];
        var r, g, b;

        if (s === 0) {
          r = g = b = l * 255;
        } else {
          var t3 = [0, 0, 0];
          var c = [0, 0, 0];
          var t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var t1 = 2 * l - t2;
          var h_ = h / 360;
          t3[0] = h_ + 1 / 3;
          t3[1] = h_;
          t3[2] = h_ - 1 / 3;

          for (var i = 0; i < 3; i++) {
            if (t3[i] < 0) {
              t3[i] += 1;
            }

            if (t3[i] > 1) {
              t3[i] -= 1;
            }

            if (6 * t3[i] < 1) {
              c[i] = t1 + (t2 - t1) * 6 * t3[i];
            } else if (2 * t3[i] < 1) {
              c[i] = t2;
            } else if (3 * t3[i] < 2) {
              c[i] = t1 + (t2 - t1) * (2 / 3 - t3[i]) * 6;
            } else {
              c[i] = t1;
            }
          }

          assign = [round$1(c[0] * 255), round$1(c[1] * 255), round$1(c[2] * 255)], r = assign[0], g = assign[1], b = assign[2];
        }

        if (args.length > 3) {
          // keep alpha channel
          return [r, g, b, args[3]];
        }

        return [r, g, b, 1];
      };

      var hsl2rgb_1 = hsl2rgb;
      var RE_RGB = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/;
      var RE_RGBA = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/;
      var RE_RGB_PCT = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
      var RE_RGBA_PCT = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
      var RE_HSL = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
      var RE_HSLA = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
      var round$2 = Math.round;

      var css2rgb = function (css) {
        css = css.toLowerCase().trim();
        var m;

        if (input.format.named) {
          try {
            return input.format.named(css);
          } catch (e) {// eslint-disable-next-line
          }
        } // rgb(250,20,0)


        if (m = css.match(RE_RGB)) {
          var rgb = m.slice(1, 4);

          for (var i = 0; i < 3; i++) {
            rgb[i] = +rgb[i];
          }

          rgb[3] = 1; // default alpha

          return rgb;
        } // rgba(250,20,0,0.4)


        if (m = css.match(RE_RGBA)) {
          var rgb$1 = m.slice(1, 5);

          for (var i$1 = 0; i$1 < 4; i$1++) {
            rgb$1[i$1] = +rgb$1[i$1];
          }

          return rgb$1;
        } // rgb(100%,0%,0%)


        if (m = css.match(RE_RGB_PCT)) {
          var rgb$2 = m.slice(1, 4);

          for (var i$2 = 0; i$2 < 3; i$2++) {
            rgb$2[i$2] = round$2(rgb$2[i$2] * 2.55);
          }

          rgb$2[3] = 1; // default alpha

          return rgb$2;
        } // rgba(100%,0%,0%,0.4)


        if (m = css.match(RE_RGBA_PCT)) {
          var rgb$3 = m.slice(1, 5);

          for (var i$3 = 0; i$3 < 3; i$3++) {
            rgb$3[i$3] = round$2(rgb$3[i$3] * 2.55);
          }

          rgb$3[3] = +rgb$3[3];
          return rgb$3;
        } // hsl(0,100%,50%)


        if (m = css.match(RE_HSL)) {
          var hsl = m.slice(1, 4);
          hsl[1] *= 0.01;
          hsl[2] *= 0.01;
          var rgb$4 = hsl2rgb_1(hsl);
          rgb$4[3] = 1;
          return rgb$4;
        } // hsla(0,100%,50%,0.5)


        if (m = css.match(RE_HSLA)) {
          var hsl$1 = m.slice(1, 4);
          hsl$1[1] *= 0.01;
          hsl$1[2] *= 0.01;
          var rgb$5 = hsl2rgb_1(hsl$1);
          rgb$5[3] = +m[4]; // default alpha = 1

          return rgb$5;
        }
      };

      css2rgb.test = function (s) {
        return RE_RGB.test(s) || RE_RGBA.test(s) || RE_RGB_PCT.test(s) || RE_RGBA_PCT.test(s) || RE_HSL.test(s) || RE_HSLA.test(s);
      };

      var css2rgb_1 = css2rgb;
      var type$3 = utils.type;

      Color_1.prototype.css = function (mode) {
        return rgb2css_1(this._rgb, mode);
      };

      chroma_1.css = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(Color_1, [null].concat(args, ['css'])))();
      };

      input.format.css = css2rgb_1;
      input.autodetect.push({
        p: 5,
        test: function (h) {
          var rest = [],
              len = arguments.length - 1;

          while (len-- > 0) rest[len] = arguments[len + 1];

          if (!rest.length && type$3(h) === 'string' && css2rgb_1.test(h)) {
            return 'css';
          }
        }
      });
      var unpack$8 = utils.unpack;

      input.format.gl = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        var rgb = unpack$8(args, 'rgba');
        rgb[0] *= 255;
        rgb[1] *= 255;
        rgb[2] *= 255;
        return rgb;
      };

      chroma_1.gl = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(Color_1, [null].concat(args, ['gl'])))();
      };

      Color_1.prototype.gl = function () {
        var rgb = this._rgb;
        return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, rgb[3]];
      };

      var unpack$9 = utils.unpack;

      var rgb2hcg = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        var ref = unpack$9(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);
        var delta = max - min;
        var c = delta * 100 / 255;

        var _g = min / (255 - delta) * 100;

        var h;

        if (delta === 0) {
          h = Number.NaN;
        } else {
          if (r === max) {
            h = (g - b) / delta;
          }

          if (g === max) {
            h = 2 + (b - r) / delta;
          }

          if (b === max) {
            h = 4 + (r - g) / delta;
          }

          h *= 60;

          if (h < 0) {
            h += 360;
          }
        }

        return [h, c, _g];
      };

      var rgb2hcg_1 = rgb2hcg;
      var unpack$a = utils.unpack;
      var floor = Math.floor;
      /*
       * this is basically just HSV with some minor tweaks
       *
       * hue.. [0..360]
       * chroma .. [0..1]
       * grayness .. [0..1]
       */

      var hcg2rgb = function () {
        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        args = unpack$a(args, 'hcg');
        var h = args[0];
        var c = args[1];
        var _g = args[2];
        var r, g, b;
        _g = _g * 255;

        var _c = c * 255;

        if (c === 0) {
          r = g = b = _g;
        } else {
          if (h === 360) {
            h = 0;
          }

          if (h > 360) {
            h -= 360;
          }

          if (h < 0) {
            h += 360;
          }

          h /= 60;
          var i = floor(h);
          var f = h - i;
          var p = _g * (1 - c);
          var q = p + _c * (1 - f);
          var t = p + _c * f;
          var v = p + _c;

          switch (i) {
            case 0:
              assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2];
              break;

            case 1:
              assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2];
              break;

            case 2:
              assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2];
              break;

            case 3:
              assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2];
              break;

            case 4:
              assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2];
              break;

            case 5:
              assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2];
              break;
          }
        }

        return [r, g, b, args.length > 3 ? args[3] : 1];
      };

      var hcg2rgb_1 = hcg2rgb;
      var unpack$b = utils.unpack;
      var type$4 = utils.type;

      Color_1.prototype.hcg = function () {
        return rgb2hcg_1(this._rgb);
      };

      chroma_1.hcg = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(Color_1, [null].concat(args, ['hcg'])))();
      };

      input.format.hcg = hcg2rgb_1;
      input.autodetect.push({
        p: 1,
        test: function () {
          var args = [],
              len = arguments.length;

          while (len--) args[len] = arguments[len];

          args = unpack$b(args, 'hcg');

          if (type$4(args) === 'array' && args.length === 3) {
            return 'hcg';
          }
        }
      });
      var unpack$c = utils.unpack;
      var last$4 = utils.last;
      var round$3 = Math.round;

      var rgb2hex = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        var ref = unpack$c(args, 'rgba');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var a = ref[3];
        var mode = last$4(args) || 'auto';

        if (a === undefined) {
          a = 1;
        }

        if (mode === 'auto') {
          mode = a < 1 ? 'rgba' : 'rgb';
        }

        r = round$3(r);
        g = round$3(g);
        b = round$3(b);
        var u = r << 16 | g << 8 | b;
        var str = "000000" + u.toString(16); //#.toUpperCase();

        str = str.substr(str.length - 6);
        var hxa = '0' + round$3(a * 255).toString(16);
        hxa = hxa.substr(hxa.length - 2);

        switch (mode.toLowerCase()) {
          case 'rgba':
            return "#" + str + hxa;

          case 'argb':
            return "#" + hxa + str;

          default:
            return "#" + str;
        }
      };

      var rgb2hex_1 = rgb2hex;
      var RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      var RE_HEXA = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/;

      var hex2rgb = function (hex) {
        if (hex.match(RE_HEX)) {
          // remove optional leading #
          if (hex.length === 4 || hex.length === 7) {
            hex = hex.substr(1);
          } // expand short-notation to full six-digit


          if (hex.length === 3) {
            hex = hex.split('');
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
          }

          var u = parseInt(hex, 16);
          var r = u >> 16;
          var g = u >> 8 & 0xFF;
          var b = u & 0xFF;
          return [r, g, b, 1];
        } // match rgba hex format, eg #FF000077


        if (hex.match(RE_HEXA)) {
          if (hex.length === 5 || hex.length === 9) {
            // remove optional leading #
            hex = hex.substr(1);
          } // expand short-notation to full eight-digit


          if (hex.length === 4) {
            hex = hex.split('');
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
          }

          var u$1 = parseInt(hex, 16);
          var r$1 = u$1 >> 24 & 0xFF;
          var g$1 = u$1 >> 16 & 0xFF;
          var b$1 = u$1 >> 8 & 0xFF;
          var a = Math.round((u$1 & 0xFF) / 0xFF * 100) / 100;
          return [r$1, g$1, b$1, a];
        } // we used to check for css colors here
        // if _input.css? and rgb = _input.css hex
        //     return rgb


        throw new Error("unknown hex color: " + hex);
      };

      var hex2rgb_1 = hex2rgb;
      var type$5 = utils.type;

      Color_1.prototype.hex = function (mode) {
        return rgb2hex_1(this._rgb, mode);
      };

      chroma_1.hex = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(Color_1, [null].concat(args, ['hex'])))();
      };

      input.format.hex = hex2rgb_1;
      input.autodetect.push({
        p: 4,
        test: function (h) {
          var rest = [],
              len = arguments.length - 1;

          while (len-- > 0) rest[len] = arguments[len + 1];

          if (!rest.length && type$5(h) === 'string' && [3, 4, 5, 6, 7, 8, 9].indexOf(h.length) >= 0) {
            return 'hex';
          }
        }
      });
      var unpack$d = utils.unpack;
      var TWOPI = utils.TWOPI;
      var min = Math.min;
      var sqrt = Math.sqrt;
      var acos = Math.acos;

      var rgb2hsi = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];
        /*
        borrowed from here:
        http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
        */


        var ref = unpack$d(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        r /= 255;
        g /= 255;
        b /= 255;
        var h;
        var min_ = min(r, g, b);
        var i = (r + g + b) / 3;
        var s = i > 0 ? 1 - min_ / i : 0;

        if (s === 0) {
          h = NaN;
        } else {
          h = (r - g + (r - b)) / 2;
          h /= sqrt((r - g) * (r - g) + (r - b) * (g - b));
          h = acos(h);

          if (b > g) {
            h = TWOPI - h;
          }

          h /= TWOPI;
        }

        return [h * 360, s, i];
      };

      var rgb2hsi_1 = rgb2hsi;
      var unpack$e = utils.unpack;
      var limit$1 = utils.limit;
      var TWOPI$1 = utils.TWOPI;
      var PITHIRD = utils.PITHIRD;
      var cos = Math.cos;
      /*
       * hue [0..360]
       * saturation [0..1]
       * intensity [0..1]
       */

      var hsi2rgb = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];
        /*
        borrowed from here:
        http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
        */


        args = unpack$e(args, 'hsi');
        var h = args[0];
        var s = args[1];
        var i = args[2];
        var r, g, b;

        if (isNaN(h)) {
          h = 0;
        }

        if (isNaN(s)) {
          s = 0;
        } // normalize hue


        if (h > 360) {
          h -= 360;
        }

        if (h < 0) {
          h += 360;
        }

        h /= 360;

        if (h < 1 / 3) {
          b = (1 - s) / 3;
          r = (1 + s * cos(TWOPI$1 * h) / cos(PITHIRD - TWOPI$1 * h)) / 3;
          g = 1 - (b + r);
        } else if (h < 2 / 3) {
          h -= 1 / 3;
          r = (1 - s) / 3;
          g = (1 + s * cos(TWOPI$1 * h) / cos(PITHIRD - TWOPI$1 * h)) / 3;
          b = 1 - (r + g);
        } else {
          h -= 2 / 3;
          g = (1 - s) / 3;
          b = (1 + s * cos(TWOPI$1 * h) / cos(PITHIRD - TWOPI$1 * h)) / 3;
          r = 1 - (g + b);
        }

        r = limit$1(i * r * 3);
        g = limit$1(i * g * 3);
        b = limit$1(i * b * 3);
        return [r * 255, g * 255, b * 255, args.length > 3 ? args[3] : 1];
      };

      var hsi2rgb_1 = hsi2rgb;
      var unpack$f = utils.unpack;
      var type$6 = utils.type;

      Color_1.prototype.hsi = function () {
        return rgb2hsi_1(this._rgb);
      };

      chroma_1.hsi = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(Color_1, [null].concat(args, ['hsi'])))();
      };

      input.format.hsi = hsi2rgb_1;
      input.autodetect.push({
        p: 2,
        test: function () {
          var args = [],
              len = arguments.length;

          while (len--) args[len] = arguments[len];

          args = unpack$f(args, 'hsi');

          if (type$6(args) === 'array' && args.length === 3) {
            return 'hsi';
          }
        }
      });
      var unpack$g = utils.unpack;
      var type$7 = utils.type;

      Color_1.prototype.hsl = function () {
        return rgb2hsl_1(this._rgb);
      };

      chroma_1.hsl = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(Color_1, [null].concat(args, ['hsl'])))();
      };

      input.format.hsl = hsl2rgb_1;
      input.autodetect.push({
        p: 2,
        test: function () {
          var args = [],
              len = arguments.length;

          while (len--) args[len] = arguments[len];

          args = unpack$g(args, 'hsl');

          if (type$7(args) === 'array' && args.length === 3) {
            return 'hsl';
          }
        }
      });
      var unpack$h = utils.unpack;
      var min$1 = Math.min;
      var max$1 = Math.max;
      /*
       * supported arguments:
       * - rgb2hsv(r,g,b)
       * - rgb2hsv([r,g,b])
       * - rgb2hsv({r,g,b})
       */

      var rgb2hsl$1 = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        args = unpack$h(args, 'rgb');
        var r = args[0];
        var g = args[1];
        var b = args[2];
        var min_ = min$1(r, g, b);
        var max_ = max$1(r, g, b);
        var delta = max_ - min_;
        var h, s, v;
        v = max_ / 255.0;

        if (max_ === 0) {
          h = Number.NaN;
          s = 0;
        } else {
          s = delta / max_;

          if (r === max_) {
            h = (g - b) / delta;
          }

          if (g === max_) {
            h = 2 + (b - r) / delta;
          }

          if (b === max_) {
            h = 4 + (r - g) / delta;
          }

          h *= 60;

          if (h < 0) {
            h += 360;
          }
        }

        return [h, s, v];
      };

      var rgb2hsv = rgb2hsl$1;
      var unpack$i = utils.unpack;
      var floor$1 = Math.floor;

      var hsv2rgb = function () {
        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        args = unpack$i(args, 'hsv');
        var h = args[0];
        var s = args[1];
        var v = args[2];
        var r, g, b;
        v *= 255;

        if (s === 0) {
          r = g = b = v;
        } else {
          if (h === 360) {
            h = 0;
          }

          if (h > 360) {
            h -= 360;
          }

          if (h < 0) {
            h += 360;
          }

          h /= 60;
          var i = floor$1(h);
          var f = h - i;
          var p = v * (1 - s);
          var q = v * (1 - s * f);
          var t = v * (1 - s * (1 - f));

          switch (i) {
            case 0:
              assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2];
              break;

            case 1:
              assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2];
              break;

            case 2:
              assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2];
              break;

            case 3:
              assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2];
              break;

            case 4:
              assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2];
              break;

            case 5:
              assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2];
              break;
          }
        }

        return [r, g, b, args.length > 3 ? args[3] : 1];
      };

      var hsv2rgb_1 = hsv2rgb;
      var unpack$j = utils.unpack;
      var type$8 = utils.type;

      Color_1.prototype.hsv = function () {
        return rgb2hsv(this._rgb);
      };

      chroma_1.hsv = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(Color_1, [null].concat(args, ['hsv'])))();
      };

      input.format.hsv = hsv2rgb_1;
      input.autodetect.push({
        p: 2,
        test: function () {
          var args = [],
              len = arguments.length;

          while (len--) args[len] = arguments[len];

          args = unpack$j(args, 'hsv');

          if (type$8(args) === 'array' && args.length === 3) {
            return 'hsv';
          }
        }
      });
      var labConstants = {
        // Corresponds roughly to RGB brighter/darker
        Kn: 18,
        // D65 standard referent
        Xn: 0.950470,
        Yn: 1,
        Zn: 1.088830,
        t0: 0.137931034,
        // 4 / 29
        t1: 0.206896552,
        // 6 / 29
        t2: 0.12841855,
        // 3 * t1 * t1
        t3: 0.008856452 // t1 * t1 * t1

      };
      var unpack$k = utils.unpack;
      var pow = Math.pow;

      var rgb2lab = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        var ref = unpack$k(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2xyz(r, g, b);
        var x = ref$1[0];
        var y = ref$1[1];
        var z = ref$1[2];
        var l = 116 * y - 16;
        return [l < 0 ? 0 : l, 500 * (x - y), 200 * (y - z)];
      };

      var rgb_xyz = function (r) {
        if ((r /= 255) <= 0.04045) {
          return r / 12.92;
        }

        return pow((r + 0.055) / 1.055, 2.4);
      };

      var xyz_lab = function (t) {
        if (t > labConstants.t3) {
          return pow(t, 1 / 3);
        }

        return t / labConstants.t2 + labConstants.t0;
      };

      var rgb2xyz = function (r, g, b) {
        r = rgb_xyz(r);
        g = rgb_xyz(g);
        b = rgb_xyz(b);
        var x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / labConstants.Xn);
        var y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / labConstants.Yn);
        var z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / labConstants.Zn);
        return [x, y, z];
      };

      var rgb2lab_1 = rgb2lab;
      var unpack$l = utils.unpack;
      var pow$1 = Math.pow;
      /*
       * L* [0..100]
       * a [-100..100]
       * b [-100..100]
       */

      var lab2rgb = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        args = unpack$l(args, 'lab');
        var l = args[0];
        var a = args[1];
        var b = args[2];
        var x, y, z, r, g, b_;
        y = (l + 16) / 116;
        x = isNaN(a) ? y : y + a / 500;
        z = isNaN(b) ? y : y - b / 200;
        y = labConstants.Yn * lab_xyz(y);
        x = labConstants.Xn * lab_xyz(x);
        z = labConstants.Zn * lab_xyz(z);
        r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z); // D65 -> sRGB

        g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
        b_ = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);
        return [r, g, b_, args.length > 3 ? args[3] : 1];
      };

      var xyz_rgb = function (r) {
        return 255 * (r <= 0.00304 ? 12.92 * r : 1.055 * pow$1(r, 1 / 2.4) - 0.055);
      };

      var lab_xyz = function (t) {
        return t > labConstants.t1 ? t * t * t : labConstants.t2 * (t - labConstants.t0);
      };

      var lab2rgb_1 = lab2rgb;
      var unpack$m = utils.unpack;
      var type$9 = utils.type;

      Color_1.prototype.lab = function () {
        return rgb2lab_1(this._rgb);
      };

      chroma_1.lab = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(Color_1, [null].concat(args, ['lab'])))();
      };

      input.format.lab = lab2rgb_1;
      input.autodetect.push({
        p: 2,
        test: function () {
          var args = [],
              len = arguments.length;

          while (len--) args[len] = arguments[len];

          args = unpack$m(args, 'lab');

          if (type$9(args) === 'array' && args.length === 3) {
            return 'lab';
          }
        }
      });
      var unpack$n = utils.unpack;
      var RAD2DEG = utils.RAD2DEG;
      var sqrt$1 = Math.sqrt;
      var atan2 = Math.atan2;
      var round$4 = Math.round;

      var lab2lch = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        var ref = unpack$n(args, 'lab');
        var l = ref[0];
        var a = ref[1];
        var b = ref[2];
        var c = sqrt$1(a * a + b * b);
        var h = (atan2(b, a) * RAD2DEG + 360) % 360;

        if (round$4(c * 10000) === 0) {
          h = Number.NaN;
        }

        return [l, c, h];
      };

      var lab2lch_1 = lab2lch;
      var unpack$o = utils.unpack;

      var rgb2lch = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        var ref = unpack$o(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2lab_1(r, g, b);
        var l = ref$1[0];
        var a = ref$1[1];
        var b_ = ref$1[2];
        return lab2lch_1(l, a, b_);
      };

      var rgb2lch_1 = rgb2lch;
      var unpack$p = utils.unpack;
      var DEG2RAD = utils.DEG2RAD;
      var sin = Math.sin;
      var cos$1 = Math.cos;

      var lch2lab = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];
        /*
        Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
        These formulas were invented by David Dalrymple to obtain maximum contrast without going
        out of gamut if the parameters are in the range 0-1.
         A saturation multiplier was added by Gregor Aisch
        */


        var ref = unpack$p(args, 'lch');
        var l = ref[0];
        var c = ref[1];
        var h = ref[2];

        if (isNaN(h)) {
          h = 0;
        }

        h = h * DEG2RAD;
        return [l, cos$1(h) * c, sin(h) * c];
      };

      var lch2lab_1 = lch2lab;
      var unpack$q = utils.unpack;

      var lch2rgb = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        args = unpack$q(args, 'lch');
        var l = args[0];
        var c = args[1];
        var h = args[2];
        var ref = lch2lab_1(l, c, h);
        var L = ref[0];
        var a = ref[1];
        var b_ = ref[2];
        var ref$1 = lab2rgb_1(L, a, b_);
        var r = ref$1[0];
        var g = ref$1[1];
        var b = ref$1[2];
        return [r, g, b, args.length > 3 ? args[3] : 1];
      };

      var lch2rgb_1 = lch2rgb;
      var unpack$r = utils.unpack;

      var hcl2rgb = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        var hcl = unpack$r(args, 'hcl').reverse();
        return lch2rgb_1.apply(void 0, hcl);
      };

      var hcl2rgb_1 = hcl2rgb;
      var unpack$s = utils.unpack;
      var type$a = utils.type;

      Color_1.prototype.lch = function () {
        return rgb2lch_1(this._rgb);
      };

      Color_1.prototype.hcl = function () {
        return rgb2lch_1(this._rgb).reverse();
      };

      chroma_1.lch = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(Color_1, [null].concat(args, ['lch'])))();
      };

      chroma_1.hcl = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(Color_1, [null].concat(args, ['hcl'])))();
      };

      input.format.lch = lch2rgb_1;
      input.format.hcl = hcl2rgb_1;
      ['lch', 'hcl'].forEach(function (m) {
        return input.autodetect.push({
          p: 2,
          test: function () {
            var args = [],
                len = arguments.length;

            while (len--) args[len] = arguments[len];

            args = unpack$s(args, m);

            if (type$a(args) === 'array' && args.length === 3) {
              return m;
            }
          }
        });
      });
      /**
      	X11 color names
       	http://www.w3.org/TR/css3-color/#svg-color
      */

      var w3cx11 = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflower: '#6495ed',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkgrey: '#a9a9a9',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkslategrey: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        grey: '#808080',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        laserlemon: '#ffff54',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrod: '#fafad2',
        lightgoldenrodyellow: '#fafad2',
        lightgray: '#d3d3d3',
        lightgreen: '#90ee90',
        lightgrey: '#d3d3d3',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        maroon2: '#7f0000',
        maroon3: '#b03060',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370db',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#db7093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        purple2: '#7f007f',
        purple3: '#a020f0',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32'
      };
      var w3cx11_1 = w3cx11;
      var type$b = utils.type;

      Color_1.prototype.name = function () {
        var hex = rgb2hex_1(this._rgb, 'rgb');

        for (var i = 0, list = Object.keys(w3cx11_1); i < list.length; i += 1) {
          var n = list[i];

          if (w3cx11_1[n] === hex) {
            return n.toLowerCase();
          }
        }

        return hex;
      };

      input.format.named = function (name) {
        name = name.toLowerCase();

        if (w3cx11_1[name]) {
          return hex2rgb_1(w3cx11_1[name]);
        }

        throw new Error('unknown color name: ' + name);
      };

      input.autodetect.push({
        p: 5,
        test: function (h) {
          var rest = [],
              len = arguments.length - 1;

          while (len-- > 0) rest[len] = arguments[len + 1];

          if (!rest.length && type$b(h) === 'string' && w3cx11_1[h.toLowerCase()]) {
            return 'named';
          }
        }
      });
      var unpack$t = utils.unpack;

      var rgb2num = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        var ref = unpack$t(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        return (r << 16) + (g << 8) + b;
      };

      var rgb2num_1 = rgb2num;
      var type$c = utils.type;

      var num2rgb = function (num) {
        if (type$c(num) == "number" && num >= 0 && num <= 0xFFFFFF) {
          var r = num >> 16;
          var g = num >> 8 & 0xFF;
          var b = num & 0xFF;
          return [r, g, b, 1];
        }

        throw new Error("unknown num color: " + num);
      };

      var num2rgb_1 = num2rgb;
      var type$d = utils.type;

      Color_1.prototype.num = function () {
        return rgb2num_1(this._rgb);
      };

      chroma_1.num = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(Color_1, [null].concat(args, ['num'])))();
      };

      input.format.num = num2rgb_1;
      input.autodetect.push({
        p: 5,
        test: function () {
          var args = [],
              len = arguments.length;

          while (len--) args[len] = arguments[len];

          if (args.length === 1 && type$d(args[0]) === 'number' && args[0] >= 0 && args[0] <= 0xFFFFFF) {
            return 'num';
          }
        }
      });
      var unpack$u = utils.unpack;
      var type$e = utils.type;
      var round$5 = Math.round;

      Color_1.prototype.rgb = function (rnd) {
        if (rnd === void 0) rnd = true;

        if (rnd === false) {
          return this._rgb.slice(0, 3);
        }

        return this._rgb.slice(0, 3).map(round$5);
      };

      Color_1.prototype.rgba = function (rnd) {
        if (rnd === void 0) rnd = true;
        return this._rgb.slice(0, 4).map(function (v, i) {
          return i < 3 ? rnd === false ? v : round$5(v) : v;
        });
      };

      chroma_1.rgb = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(Color_1, [null].concat(args, ['rgb'])))();
      };

      input.format.rgb = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        var rgba = unpack$u(args, 'rgba');

        if (rgba[3] === undefined) {
          rgba[3] = 1;
        }

        return rgba;
      };

      input.autodetect.push({
        p: 3,
        test: function () {
          var args = [],
              len = arguments.length;

          while (len--) args[len] = arguments[len];

          args = unpack$u(args, 'rgba');

          if (type$e(args) === 'array' && (args.length === 3 || args.length === 4 && type$e(args[3]) == 'number' && args[3] >= 0 && args[3] <= 1)) {
            return 'rgb';
          }
        }
      });
      /*
       * Based on implementation by Neil Bartlett
       * https://github.com/neilbartlett/color-temperature
       */

      var log = Math.log;

      var temperature2rgb = function (kelvin) {
        var temp = kelvin / 100;
        var r, g, b;

        if (temp < 66) {
          r = 255;
          g = -155.25485562709179 - 0.44596950469579133 * (g = temp - 2) + 104.49216199393888 * log(g);
          b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp - 10) + 115.67994401066147 * log(b);
        } else {
          r = 351.97690566805693 + 0.114206453784165 * (r = temp - 55) - 40.25366309332127 * log(r);
          g = 325.4494125711974 + 0.07943456536662342 * (g = temp - 50) - 28.0852963507957 * log(g);
          b = 255;
        }

        return [r, g, b, 1];
      };

      var temperature2rgb_1 = temperature2rgb;
      /*
       * Based on implementation by Neil Bartlett
       * https://github.com/neilbartlett/color-temperature
       **/

      var unpack$v = utils.unpack;
      var round$6 = Math.round;

      var rgb2temperature = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        var rgb = unpack$v(args, 'rgb');
        var r = rgb[0],
            b = rgb[2];
        var minTemp = 1000;
        var maxTemp = 40000;
        var eps = 0.4;
        var temp;

        while (maxTemp - minTemp > eps) {
          temp = (maxTemp + minTemp) * 0.5;
          var rgb$1 = temperature2rgb_1(temp);

          if (rgb$1[2] / rgb$1[0] >= b / r) {
            maxTemp = temp;
          } else {
            minTemp = temp;
          }
        }

        return round$6(temp);
      };

      var rgb2temperature_1 = rgb2temperature;

      Color_1.prototype.temp = Color_1.prototype.kelvin = Color_1.prototype.temperature = function () {
        return rgb2temperature_1(this._rgb);
      };

      chroma_1.temp = chroma_1.kelvin = chroma_1.temperature = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        return new (Function.prototype.bind.apply(Color_1, [null].concat(args, ['temp'])))();
      };

      input.format.temp = input.format.kelvin = input.format.temperature = temperature2rgb_1;
      var type$f = utils.type;

      Color_1.prototype.alpha = function (a, mutate) {
        if (mutate === void 0) mutate = false;

        if (a !== undefined && type$f(a) === 'number') {
          if (mutate) {
            this._rgb[3] = a;
            return this;
          }

          return new Color_1([this._rgb[0], this._rgb[1], this._rgb[2], a], 'rgb');
        }

        return this._rgb[3];
      };

      Color_1.prototype.clipped = function () {
        return this._rgb._clipped || false;
      };

      Color_1.prototype.darken = function (amount) {
        if (amount === void 0) amount = 1;
        var me = this;
        var lab = me.lab();
        lab[0] -= labConstants.Kn * amount;
        return new Color_1(lab, 'lab').alpha(me.alpha(), true);
      };

      Color_1.prototype.brighten = function (amount) {
        if (amount === void 0) amount = 1;
        return this.darken(-amount);
      };

      Color_1.prototype.darker = Color_1.prototype.darken;
      Color_1.prototype.brighter = Color_1.prototype.brighten;

      Color_1.prototype.get = function (mc) {
        var ref = mc.split('.');
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();

        if (channel) {
          var i = mode.indexOf(channel);

          if (i > -1) {
            return src[i];
          }

          throw new Error("unknown channel " + channel + " in mode " + mode);
        } else {
          return src;
        }
      };

      var type$g = utils.type;
      var pow$2 = Math.pow;
      var EPS = 1e-7;
      var MAX_ITER = 20;

      Color_1.prototype.luminance = function (lum) {
        if (lum !== undefined && type$g(lum) === 'number') {
          if (lum === 0) {
            // return pure black
            return new Color_1([0, 0, 0, this._rgb[3]], 'rgb');
          }

          if (lum === 1) {
            // return pure white
            return new Color_1([255, 255, 255, this._rgb[3]], 'rgb');
          } // compute new color using...


          var cur_lum = this.luminance();
          var mode = 'rgb';
          var max_iter = MAX_ITER;

          var test = function (low, high) {
            var mid = low.interpolate(high, 0.5, mode);
            var lm = mid.luminance();

            if (Math.abs(lum - lm) < EPS || !max_iter--) {
              // close enough
              return mid;
            }

            return lm > lum ? test(low, mid) : test(mid, high);
          };

          var rgb = (cur_lum > lum ? test(new Color_1([0, 0, 0]), this) : test(this, new Color_1([255, 255, 255]))).rgb();
          return new Color_1(rgb.concat([this._rgb[3]]));
        }

        return rgb2luminance.apply(void 0, this._rgb.slice(0, 3));
      };

      var rgb2luminance = function (r, g, b) {
        // relative luminance
        // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        r = luminance_x(r);
        g = luminance_x(g);
        b = luminance_x(b);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };

      var luminance_x = function (x) {
        x /= 255;
        return x <= 0.03928 ? x / 12.92 : pow$2((x + 0.055) / 1.055, 2.4);
      };

      var interpolator = {};
      var type$h = utils.type;

      var mix = function (col1, col2, f) {
        if (f === void 0) f = 0.5;
        var rest = [],
            len = arguments.length - 3;

        while (len-- > 0) rest[len] = arguments[len + 3];

        var mode = rest[0] || 'lrgb';

        if (!interpolator[mode] && !rest.length) {
          // fall back to the first supported mode
          mode = Object.keys(interpolator)[0];
        }

        if (!interpolator[mode]) {
          throw new Error("interpolation mode " + mode + " is not defined");
        }

        if (type$h(col1) !== 'object') {
          col1 = new Color_1(col1);
        }

        if (type$h(col2) !== 'object') {
          col2 = new Color_1(col2);
        }

        return interpolator[mode](col1, col2, f).alpha(col1.alpha() + f * (col2.alpha() - col1.alpha()));
      };

      Color_1.prototype.mix = Color_1.prototype.interpolate = function (col2, f) {
        if (f === void 0) f = 0.5;
        var rest = [],
            len = arguments.length - 2;

        while (len-- > 0) rest[len] = arguments[len + 2];

        return mix.apply(void 0, [this, col2, f].concat(rest));
      };

      Color_1.prototype.premultiply = function (mutate) {
        if (mutate === void 0) mutate = false;
        var rgb = this._rgb;
        var a = rgb[3];

        if (mutate) {
          this._rgb = [rgb[0] * a, rgb[1] * a, rgb[2] * a, a];
          return this;
        } else {
          return new Color_1([rgb[0] * a, rgb[1] * a, rgb[2] * a, a], 'rgb');
        }
      };

      Color_1.prototype.saturate = function (amount) {
        if (amount === void 0) amount = 1;
        var me = this;
        var lch = me.lch();
        lch[1] += labConstants.Kn * amount;

        if (lch[1] < 0) {
          lch[1] = 0;
        }

        return new Color_1(lch, 'lch').alpha(me.alpha(), true);
      };

      Color_1.prototype.desaturate = function (amount) {
        if (amount === void 0) amount = 1;
        return this.saturate(-amount);
      };

      var type$i = utils.type;

      Color_1.prototype.set = function (mc, value, mutate) {
        if (mutate === void 0) mutate = false;
        var ref = mc.split('.');
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();

        if (channel) {
          var i = mode.indexOf(channel);

          if (i > -1) {
            if (type$i(value) == 'string') {
              switch (value.charAt(0)) {
                case '+':
                  src[i] += +value;
                  break;

                case '-':
                  src[i] += +value;
                  break;

                case '*':
                  src[i] *= +value.substr(1);
                  break;

                case '/':
                  src[i] /= +value.substr(1);
                  break;

                default:
                  src[i] = +value;
              }
            } else if (type$i(value) === 'number') {
              src[i] = value;
            } else {
              throw new Error("unsupported value for Color.set");
            }

            var out = new Color_1(src, mode);

            if (mutate) {
              this._rgb = out._rgb;
              return this;
            }

            return out;
          }

          throw new Error("unknown channel " + channel + " in mode " + mode);
        } else {
          return src;
        }
      };

      var rgb$1 = function (col1, col2, f) {
        var xyz0 = col1._rgb;
        var xyz1 = col2._rgb;
        return new Color_1(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), 'rgb');
      }; // register interpolator


      interpolator.rgb = rgb$1;
      var sqrt$2 = Math.sqrt;
      var pow$3 = Math.pow;

      var lrgb = function (col1, col2, f) {
        var ref = col1._rgb;
        var x1 = ref[0];
        var y1 = ref[1];
        var z1 = ref[2];
        var ref$1 = col2._rgb;
        var x2 = ref$1[0];
        var y2 = ref$1[1];
        var z2 = ref$1[2];
        return new Color_1(sqrt$2(pow$3(x1, 2) * (1 - f) + pow$3(x2, 2) * f), sqrt$2(pow$3(y1, 2) * (1 - f) + pow$3(y2, 2) * f), sqrt$2(pow$3(z1, 2) * (1 - f) + pow$3(z2, 2) * f), 'rgb');
      }; // register interpolator


      interpolator.lrgb = lrgb;

      var lab$1 = function (col1, col2, f) {
        var xyz0 = col1.lab();
        var xyz1 = col2.lab();
        return new Color_1(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), 'lab');
      }; // register interpolator


      interpolator.lab = lab$1;

      var _hsx = function (col1, col2, f, m) {
        var assign, assign$1;
        var xyz0, xyz1;

        if (m === 'hsl') {
          xyz0 = col1.hsl();
          xyz1 = col2.hsl();
        } else if (m === 'hsv') {
          xyz0 = col1.hsv();
          xyz1 = col2.hsv();
        } else if (m === 'hcg') {
          xyz0 = col1.hcg();
          xyz1 = col2.hcg();
        } else if (m === 'hsi') {
          xyz0 = col1.hsi();
          xyz1 = col2.hsi();
        } else if (m === 'lch' || m === 'hcl') {
          m = 'hcl';
          xyz0 = col1.hcl();
          xyz1 = col2.hcl();
        }

        var hue0, hue1, sat0, sat1, lbv0, lbv1;

        if (m.substr(0, 1) === 'h') {
          assign = xyz0, hue0 = assign[0], sat0 = assign[1], lbv0 = assign[2];
          assign$1 = xyz1, hue1 = assign$1[0], sat1 = assign$1[1], lbv1 = assign$1[2];
        }

        var sat, hue, lbv, dh;

        if (!isNaN(hue0) && !isNaN(hue1)) {
          // both colors have hue
          if (hue1 > hue0 && hue1 - hue0 > 180) {
            dh = hue1 - (hue0 + 360);
          } else if (hue1 < hue0 && hue0 - hue1 > 180) {
            dh = hue1 + 360 - hue0;
          } else {
            dh = hue1 - hue0;
          }

          hue = hue0 + f * dh;
        } else if (!isNaN(hue0)) {
          hue = hue0;

          if ((lbv1 == 1 || lbv1 == 0) && m != 'hsv') {
            sat = sat0;
          }
        } else if (!isNaN(hue1)) {
          hue = hue1;

          if ((lbv0 == 1 || lbv0 == 0) && m != 'hsv') {
            sat = sat1;
          }
        } else {
          hue = Number.NaN;
        }

        if (sat === undefined) {
          sat = sat0 + f * (sat1 - sat0);
        }

        lbv = lbv0 + f * (lbv1 - lbv0);
        return new Color_1([hue, sat, lbv], m);
      };

      var lch$1 = function (col1, col2, f) {
        return _hsx(col1, col2, f, 'lch');
      }; // register interpolator


      interpolator.lch = lch$1;
      interpolator.hcl = lch$1;

      var num$1 = function (col1, col2, f) {
        var c1 = col1.num();
        var c2 = col2.num();
        return new Color_1(c1 + f * (c2 - c1), 'num');
      }; // register interpolator


      interpolator.num = num$1;

      var hcg$1 = function (col1, col2, f) {
        return _hsx(col1, col2, f, 'hcg');
      }; // register interpolator


      interpolator.hcg = hcg$1;

      var hsi$1 = function (col1, col2, f) {
        return _hsx(col1, col2, f, 'hsi');
      }; // register interpolator


      interpolator.hsi = hsi$1;

      var hsl$1 = function (col1, col2, f) {
        return _hsx(col1, col2, f, 'hsl');
      }; // register interpolator


      interpolator.hsl = hsl$1;

      var hsv$1 = function (col1, col2, f) {
        return _hsx(col1, col2, f, 'hsv');
      }; // register interpolator


      interpolator.hsv = hsv$1;
      var clip_rgb$2 = utils.clip_rgb;
      var pow$4 = Math.pow;
      var sqrt$3 = Math.sqrt;
      var PI$1 = Math.PI;
      var cos$2 = Math.cos;
      var sin$1 = Math.sin;
      var atan2$1 = Math.atan2;

      var average = function (colors, mode, weights) {
        if (mode === void 0) mode = 'lrgb';
        if (weights === void 0) weights = null;
        var l = colors.length;

        if (!weights) {
          weights = Array.from(new Array(l)).map(function () {
            return 1;
          });
        } // normalize weights


        var k = l / weights.reduce(function (a, b) {
          return a + b;
        });
        weights.forEach(function (w, i) {
          weights[i] *= k;
        }); // convert colors to Color objects

        colors = colors.map(function (c) {
          return new Color_1(c);
        });

        if (mode === 'lrgb') {
          return _average_lrgb(colors, weights);
        }

        var first = colors.shift();
        var xyz = first.get(mode);
        var cnt = [];
        var dx = 0;
        var dy = 0; // initial color

        for (var i = 0; i < xyz.length; i++) {
          xyz[i] = (xyz[i] || 0) * weights[0];
          cnt.push(isNaN(xyz[i]) ? 0 : weights[0]);

          if (mode.charAt(i) === 'h' && !isNaN(xyz[i])) {
            var A = xyz[i] / 180 * PI$1;
            dx += cos$2(A) * weights[0];
            dy += sin$1(A) * weights[0];
          }
        }

        var alpha = first.alpha() * weights[0];
        colors.forEach(function (c, ci) {
          var xyz2 = c.get(mode);
          alpha += c.alpha() * weights[ci + 1];

          for (var i = 0; i < xyz.length; i++) {
            if (!isNaN(xyz2[i])) {
              cnt[i] += weights[ci + 1];

              if (mode.charAt(i) === 'h') {
                var A = xyz2[i] / 180 * PI$1;
                dx += cos$2(A) * weights[ci + 1];
                dy += sin$1(A) * weights[ci + 1];
              } else {
                xyz[i] += xyz2[i] * weights[ci + 1];
              }
            }
          }
        });

        for (var i$1 = 0; i$1 < xyz.length; i$1++) {
          if (mode.charAt(i$1) === 'h') {
            var A$1 = atan2$1(dy / cnt[i$1], dx / cnt[i$1]) / PI$1 * 180;

            while (A$1 < 0) {
              A$1 += 360;
            }

            while (A$1 >= 360) {
              A$1 -= 360;
            }

            xyz[i$1] = A$1;
          } else {
            xyz[i$1] = xyz[i$1] / cnt[i$1];
          }
        }

        alpha /= l;
        return new Color_1(xyz, mode).alpha(alpha > 0.99999 ? 1 : alpha, true);
      };

      var _average_lrgb = function (colors, weights) {
        var l = colors.length;
        var xyz = [0, 0, 0, 0];

        for (var i = 0; i < colors.length; i++) {
          var col = colors[i];
          var f = weights[i] / l;
          var rgb = col._rgb;
          xyz[0] += pow$4(rgb[0], 2) * f;
          xyz[1] += pow$4(rgb[1], 2) * f;
          xyz[2] += pow$4(rgb[2], 2) * f;
          xyz[3] += rgb[3] * f;
        }

        xyz[0] = sqrt$3(xyz[0]);
        xyz[1] = sqrt$3(xyz[1]);
        xyz[2] = sqrt$3(xyz[2]);

        if (xyz[3] > 0.9999999) {
          xyz[3] = 1;
        }

        return new Color_1(clip_rgb$2(xyz));
      }; // minimal multi-purpose interface
      // @requires utils color analyze


      var type$j = utils.type;
      var pow$5 = Math.pow;

      var scale = function (colors) {
        // constructor
        var _mode = 'rgb';

        var _nacol = chroma_1('#ccc');

        var _spread = 0; // const _fixed = false;

        var _domain = [0, 1];
        var _pos = [];
        var _padding = [0, 0];
        var _classes = false;
        var _colors = [];
        var _out = false;
        var _min = 0;
        var _max = 1;
        var _correctLightness = false;
        var _colorCache = {};
        var _useCache = true;
        var _gamma = 1; // private methods

        var setColors = function (colors) {
          colors = colors || ['#fff', '#000'];

          if (colors && type$j(colors) === 'string' && chroma_1.brewer && chroma_1.brewer[colors.toLowerCase()]) {
            colors = chroma_1.brewer[colors.toLowerCase()];
          }

          if (type$j(colors) === 'array') {
            // handle single color
            if (colors.length === 1) {
              colors = [colors[0], colors[0]];
            } // make a copy of the colors


            colors = colors.slice(0); // convert to chroma classes

            for (var c = 0; c < colors.length; c++) {
              colors[c] = chroma_1(colors[c]);
            } // auto-fill color position


            _pos.length = 0;

            for (var c$1 = 0; c$1 < colors.length; c$1++) {
              _pos.push(c$1 / (colors.length - 1));
            }
          }

          resetCache();
          return _colors = colors;
        };

        var getClass = function (value) {
          if (_classes != null) {
            var n = _classes.length - 1;
            var i = 0;

            while (i < n && value >= _classes[i]) {
              i++;
            }

            return i - 1;
          }

          return 0;
        };

        var tMapLightness = function (t) {
          return t;
        };

        var tMapDomain = function (t) {
          return t;
        }; // const classifyValue = function(value) {
        //     let val = value;
        //     if (_classes.length > 2) {
        //         const n = _classes.length-1;
        //         const i = getClass(value);
        //         const minc = _classes[0] + ((_classes[1]-_classes[0]) * (0 + (_spread * 0.5)));  // center of 1st class
        //         const maxc = _classes[n-1] + ((_classes[n]-_classes[n-1]) * (1 - (_spread * 0.5)));  // center of last class
        //         val = _min + ((((_classes[i] + ((_classes[i+1] - _classes[i]) * 0.5)) - minc) / (maxc-minc)) * (_max - _min));
        //     }
        //     return val;
        // };


        var getColor = function (val, bypassMap) {
          var col, t;

          if (bypassMap == null) {
            bypassMap = false;
          }

          if (isNaN(val) || val === null) {
            return _nacol;
          }

          if (!bypassMap) {
            if (_classes && _classes.length > 2) {
              // find the class
              var c = getClass(val);
              t = c / (_classes.length - 2);
            } else if (_max !== _min) {
              // just interpolate between min/max
              t = (val - _min) / (_max - _min);
            } else {
              t = 1;
            }
          } else {
            t = val;
          } // domain map


          t = tMapDomain(t);

          if (!bypassMap) {
            t = tMapLightness(t); // lightness correction
          }

          if (_gamma !== 1) {
            t = pow$5(t, _gamma);
          }

          t = _padding[0] + t * (1 - _padding[0] - _padding[1]);
          t = Math.min(1, Math.max(0, t));
          var k = Math.floor(t * 10000);

          if (_useCache && _colorCache[k]) {
            col = _colorCache[k];
          } else {
            if (type$j(_colors) === 'array') {
              //for i in [0.._pos.length-1]
              for (var i = 0; i < _pos.length; i++) {
                var p = _pos[i];

                if (t <= p) {
                  col = _colors[i];
                  break;
                }

                if (t >= p && i === _pos.length - 1) {
                  col = _colors[i];
                  break;
                }

                if (t > p && t < _pos[i + 1]) {
                  t = (t - p) / (_pos[i + 1] - p);
                  col = chroma_1.interpolate(_colors[i], _colors[i + 1], t, _mode);
                  break;
                }
              }
            } else if (type$j(_colors) === 'function') {
              col = _colors(t);
            }

            if (_useCache) {
              _colorCache[k] = col;
            }
          }

          return col;
        };

        var resetCache = function () {
          return _colorCache = {};
        };

        setColors(colors); // public interface

        var f = function (v) {
          var c = chroma_1(getColor(v));

          if (_out && c[_out]) {
            return c[_out]();
          } else {
            return c;
          }
        };

        f.classes = function (classes) {
          if (classes != null) {
            if (type$j(classes) === 'array') {
              _classes = classes;
              _domain = [classes[0], classes[classes.length - 1]];
            } else {
              var d = chroma_1.analyze(_domain);

              if (classes === 0) {
                _classes = [d.min, d.max];
              } else {
                _classes = chroma_1.limits(d, 'e', classes);
              }
            }

            return f;
          }

          return _classes;
        };

        f.domain = function (domain) {
          if (!arguments.length) {
            return _domain;
          }

          _min = domain[0];
          _max = domain[domain.length - 1];
          _pos = [];
          var k = _colors.length;

          if (domain.length === k && _min !== _max) {
            // update positions
            for (var i = 0, list = Array.from(domain); i < list.length; i += 1) {
              var d = list[i];

              _pos.push((d - _min) / (_max - _min));
            }
          } else {
            for (var c = 0; c < k; c++) {
              _pos.push(c / (k - 1));
            }

            if (domain.length > 2) {
              // set domain map
              var tOut = domain.map(function (d, i) {
                return i / (domain.length - 1);
              });
              var tBreaks = domain.map(function (d) {
                return (d - _min) / (_max - _min);
              });

              if (!tBreaks.every(function (val, i) {
                return tOut[i] === val;
              })) {
                tMapDomain = function (t) {
                  if (t <= 0 || t >= 1) {
                    return t;
                  }

                  var i = 0;

                  while (t >= tBreaks[i + 1]) {
                    i++;
                  }

                  var f = (t - tBreaks[i]) / (tBreaks[i + 1] - tBreaks[i]);
                  var out = tOut[i] + f * (tOut[i + 1] - tOut[i]);
                  return out;
                };
              }
            }
          }

          _domain = [_min, _max];
          return f;
        };

        f.mode = function (_m) {
          if (!arguments.length) {
            return _mode;
          }

          _mode = _m;
          resetCache();
          return f;
        };

        f.range = function (colors, _pos) {
          setColors(colors);
          return f;
        };

        f.out = function (_o) {
          _out = _o;
          return f;
        };

        f.spread = function (val) {
          if (!arguments.length) {
            return _spread;
          }

          _spread = val;
          return f;
        };

        f.correctLightness = function (v) {
          if (v == null) {
            v = true;
          }

          _correctLightness = v;
          resetCache();

          if (_correctLightness) {
            tMapLightness = function (t) {
              var L0 = getColor(0, true).lab()[0];
              var L1 = getColor(1, true).lab()[0];
              var pol = L0 > L1;
              var L_actual = getColor(t, true).lab()[0];
              var L_ideal = L0 + (L1 - L0) * t;
              var L_diff = L_actual - L_ideal;
              var t0 = 0;
              var t1 = 1;
              var max_iter = 20;

              while (Math.abs(L_diff) > 1e-2 && max_iter-- > 0) {
                (function () {
                  if (pol) {
                    L_diff *= -1;
                  }

                  if (L_diff < 0) {
                    t0 = t;
                    t += (t1 - t) * 0.5;
                  } else {
                    t1 = t;
                    t += (t0 - t) * 0.5;
                  }

                  L_actual = getColor(t, true).lab()[0];
                  return L_diff = L_actual - L_ideal;
                })();
              }

              return t;
            };
          } else {
            tMapLightness = function (t) {
              return t;
            };
          }

          return f;
        };

        f.padding = function (p) {
          if (p != null) {
            if (type$j(p) === 'number') {
              p = [p, p];
            }

            _padding = p;
            return f;
          } else {
            return _padding;
          }
        };

        f.colors = function (numColors, out) {
          // If no arguments are given, return the original colors that were provided
          if (arguments.length < 2) {
            out = 'hex';
          }

          var result = [];

          if (arguments.length === 0) {
            result = _colors.slice(0);
          } else if (numColors === 1) {
            result = [f(0.5)];
          } else if (numColors > 1) {
            var dm = _domain[0];
            var dd = _domain[1] - dm;
            result = __range__(0, numColors, false).map(function (i) {
              return f(dm + i / (numColors - 1) * dd);
            });
          } else {
            // returns all colors based on the defined classes
            colors = [];
            var samples = [];

            if (_classes && _classes.length > 2) {
              for (var i = 1, end = _classes.length, asc = 1 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
                samples.push((_classes[i - 1] + _classes[i]) * 0.5);
              }
            } else {
              samples = _domain;
            }

            result = samples.map(function (v) {
              return f(v);
            });
          }

          if (chroma_1[out]) {
            result = result.map(function (c) {
              return c[out]();
            });
          }

          return result;
        };

        f.cache = function (c) {
          if (c != null) {
            _useCache = c;
            return f;
          } else {
            return _useCache;
          }
        };

        f.gamma = function (g) {
          if (g != null) {
            _gamma = g;
            return f;
          } else {
            return _gamma;
          }
        };

        f.nodata = function (d) {
          if (d != null) {
            _nacol = chroma_1(d);
            return f;
          } else {
            return _nacol;
          }
        };

        return f;
      };

      function __range__(left, right, inclusive) {
        var range = [];
        var ascending = left < right;
        var end = !inclusive ? right : ascending ? right + 1 : right - 1;

        for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
          range.push(i);
        }

        return range;
      } //
      // interpolates between a set of colors uzing a bezier spline
      //
      // @requires utils lab


      var bezier = function (colors) {
        var assign, assign$1, assign$2;
        var I, lab0, lab1, lab2;
        colors = colors.map(function (c) {
          return new Color_1(c);
        });

        if (colors.length === 2) {
          // linear interpolation
          assign = colors.map(function (c) {
            return c.lab();
          }), lab0 = assign[0], lab1 = assign[1];

          I = function (t) {
            var lab = [0, 1, 2].map(function (i) {
              return lab0[i] + t * (lab1[i] - lab0[i]);
            });
            return new Color_1(lab, 'lab');
          };
        } else if (colors.length === 3) {
          // quadratic bezier interpolation
          assign$1 = colors.map(function (c) {
            return c.lab();
          }), lab0 = assign$1[0], lab1 = assign$1[1], lab2 = assign$1[2];

          I = function (t) {
            var lab = [0, 1, 2].map(function (i) {
              return (1 - t) * (1 - t) * lab0[i] + 2 * (1 - t) * t * lab1[i] + t * t * lab2[i];
            });
            return new Color_1(lab, 'lab');
          };
        } else if (colors.length === 4) {
          // cubic bezier interpolation
          var lab3;
          assign$2 = colors.map(function (c) {
            return c.lab();
          }), lab0 = assign$2[0], lab1 = assign$2[1], lab2 = assign$2[2], lab3 = assign$2[3];

          I = function (t) {
            var lab = [0, 1, 2].map(function (i) {
              return (1 - t) * (1 - t) * (1 - t) * lab0[i] + 3 * (1 - t) * (1 - t) * t * lab1[i] + 3 * (1 - t) * t * t * lab2[i] + t * t * t * lab3[i];
            });
            return new Color_1(lab, 'lab');
          };
        } else if (colors.length === 5) {
          var I0 = bezier(colors.slice(0, 3));
          var I1 = bezier(colors.slice(2, 5));

          I = function (t) {
            if (t < 0.5) {
              return I0(t * 2);
            } else {
              return I1((t - 0.5) * 2);
            }
          };
        }

        return I;
      };

      var bezier_1 = function (colors) {
        var f = bezier(colors);

        f.scale = function () {
          return scale(f);
        };

        return f;
      };
      /*
       * interpolates between a set of colors uzing a bezier spline
       * blend mode formulas taken from http://www.venture-ware.com/kevin/coding/lets-learn-math-photoshop-blend-modes/
       */


      var blend = function (bottom, top, mode) {
        if (!blend[mode]) {
          throw new Error('unknown blend mode ' + mode);
        }

        return blend[mode](bottom, top);
      };

      var blend_f = function (f) {
        return function (bottom, top) {
          var c0 = chroma_1(top).rgb();
          var c1 = chroma_1(bottom).rgb();
          return chroma_1.rgb(f(c0, c1));
        };
      };

      var each = function (f) {
        return function (c0, c1) {
          var out = [];
          out[0] = f(c0[0], c1[0]);
          out[1] = f(c0[1], c1[1]);
          out[2] = f(c0[2], c1[2]);
          return out;
        };
      };

      var normal = function (a) {
        return a;
      };

      var multiply = function (a, b) {
        return a * b / 255;
      };

      var darken$1 = function (a, b) {
        return a > b ? b : a;
      };

      var lighten = function (a, b) {
        return a > b ? a : b;
      };

      var screen = function (a, b) {
        return 255 * (1 - (1 - a / 255) * (1 - b / 255));
      };

      var overlay = function (a, b) {
        return b < 128 ? 2 * a * b / 255 : 255 * (1 - 2 * (1 - a / 255) * (1 - b / 255));
      };

      var burn = function (a, b) {
        return 255 * (1 - (1 - b / 255) / (a / 255));
      };

      var dodge = function (a, b) {
        if (a === 255) {
          return 255;
        }

        a = 255 * (b / 255) / (1 - a / 255);
        return a > 255 ? 255 : a;
      }; // # add = (a,b) ->
      // #     if (a + b > 255) then 255 else a + b


      blend.normal = blend_f(each(normal));
      blend.multiply = blend_f(each(multiply));
      blend.screen = blend_f(each(screen));
      blend.overlay = blend_f(each(overlay));
      blend.darken = blend_f(each(darken$1));
      blend.lighten = blend_f(each(lighten));
      blend.dodge = blend_f(each(dodge));
      blend.burn = blend_f(each(burn)); // blend.add = blend_f(each(add));

      var blend_1 = blend; // cubehelix interpolation
      // based on D.A. Green "A colour scheme for the display of astronomical intensity images"
      // http://astron-soc.in/bulletin/11June/289392011.pdf

      var type$k = utils.type;
      var clip_rgb$3 = utils.clip_rgb;
      var TWOPI$2 = utils.TWOPI;
      var pow$6 = Math.pow;
      var sin$2 = Math.sin;
      var cos$3 = Math.cos;

      var cubehelix = function (start, rotations, hue, gamma, lightness) {
        if (start === void 0) start = 300;
        if (rotations === void 0) rotations = -1.5;
        if (hue === void 0) hue = 1;
        if (gamma === void 0) gamma = 1;
        if (lightness === void 0) lightness = [0, 1];
        var dh = 0,
            dl;

        if (type$k(lightness) === 'array') {
          dl = lightness[1] - lightness[0];
        } else {
          dl = 0;
          lightness = [lightness, lightness];
        }

        var f = function (fract) {
          var a = TWOPI$2 * ((start + 120) / 360 + rotations * fract);
          var l = pow$6(lightness[0] + dl * fract, gamma);
          var h = dh !== 0 ? hue[0] + fract * dh : hue;
          var amp = h * l * (1 - l) / 2;
          var cos_a = cos$3(a);
          var sin_a = sin$2(a);
          var r = l + amp * (-0.14861 * cos_a + 1.78277 * sin_a);
          var g = l + amp * (-0.29227 * cos_a - 0.90649 * sin_a);
          var b = l + amp * (+1.97294 * cos_a);
          return chroma_1(clip_rgb$3([r * 255, g * 255, b * 255, 1]));
        };

        f.start = function (s) {
          if (s == null) {
            return start;
          }

          start = s;
          return f;
        };

        f.rotations = function (r) {
          if (r == null) {
            return rotations;
          }

          rotations = r;
          return f;
        };

        f.gamma = function (g) {
          if (g == null) {
            return gamma;
          }

          gamma = g;
          return f;
        };

        f.hue = function (h) {
          if (h == null) {
            return hue;
          }

          hue = h;

          if (type$k(hue) === 'array') {
            dh = hue[1] - hue[0];

            if (dh === 0) {
              hue = hue[1];
            }
          } else {
            dh = 0;
          }

          return f;
        };

        f.lightness = function (h) {
          if (h == null) {
            return lightness;
          }

          if (type$k(h) === 'array') {
            lightness = h;
            dl = h[1] - h[0];
          } else {
            lightness = [h, h];
            dl = 0;
          }

          return f;
        };

        f.scale = function () {
          return chroma_1.scale(f);
        };

        f.hue(hue);
        return f;
      };

      var digits = '0123456789abcdef';
      var floor$2 = Math.floor;
      var random = Math.random;

      var random_1 = function () {
        var code = '#';

        for (var i = 0; i < 6; i++) {
          code += digits.charAt(floor$2(random() * 16));
        }

        return new Color_1(code, 'hex');
      };

      var log$1 = Math.log;
      var pow$7 = Math.pow;
      var floor$3 = Math.floor;
      var abs = Math.abs;

      var analyze = function (data, key) {
        if (key === void 0) key = null;
        var r = {
          min: Number.MAX_VALUE,
          max: Number.MAX_VALUE * -1,
          sum: 0,
          values: [],
          count: 0
        };

        if (type(data) === 'object') {
          data = Object.values(data);
        }

        data.forEach(function (val) {
          if (key && type(val) === 'object') {
            val = val[key];
          }

          if (val !== undefined && val !== null && !isNaN(val)) {
            r.values.push(val);
            r.sum += val;

            if (val < r.min) {
              r.min = val;
            }

            if (val > r.max) {
              r.max = val;
            }

            r.count += 1;
          }
        });
        r.domain = [r.min, r.max];

        r.limits = function (mode, num) {
          return limits(r, mode, num);
        };

        return r;
      };

      var limits = function (data, mode, num) {
        if (mode === void 0) mode = 'equal';
        if (num === void 0) num = 7;

        if (type(data) == 'array') {
          data = analyze(data);
        }

        var min = data.min;
        var max = data.max;
        var values = data.values.sort(function (a, b) {
          return a - b;
        });

        if (num === 1) {
          return [min, max];
        }

        var limits = [];

        if (mode.substr(0, 1) === 'c') {
          // continuous
          limits.push(min);
          limits.push(max);
        }

        if (mode.substr(0, 1) === 'e') {
          // equal interval
          limits.push(min);

          for (var i = 1; i < num; i++) {
            limits.push(min + i / num * (max - min));
          }

          limits.push(max);
        } else if (mode.substr(0, 1) === 'l') {
          // log scale
          if (min <= 0) {
            throw new Error('Logarithmic scales are only possible for values > 0');
          }

          var min_log = Math.LOG10E * log$1(min);
          var max_log = Math.LOG10E * log$1(max);
          limits.push(min);

          for (var i$1 = 1; i$1 < num; i$1++) {
            limits.push(pow$7(10, min_log + i$1 / num * (max_log - min_log)));
          }

          limits.push(max);
        } else if (mode.substr(0, 1) === 'q') {
          // quantile scale
          limits.push(min);

          for (var i$2 = 1; i$2 < num; i$2++) {
            var p = (values.length - 1) * i$2 / num;
            var pb = floor$3(p);

            if (pb === p) {
              limits.push(values[pb]);
            } else {
              // p > pb
              var pr = p - pb;
              limits.push(values[pb] * (1 - pr) + values[pb + 1] * pr);
            }
          }

          limits.push(max);
        } else if (mode.substr(0, 1) === 'k') {
          // k-means clustering

          /*
          implementation based on
          http://code.google.com/p/figue/source/browse/trunk/figue.js#336
          simplified for 1-d input values
          */
          var cluster;
          var n = values.length;
          var assignments = new Array(n);
          var clusterSizes = new Array(num);
          var repeat = true;
          var nb_iters = 0;
          var centroids = null; // get seed values

          centroids = [];
          centroids.push(min);

          for (var i$3 = 1; i$3 < num; i$3++) {
            centroids.push(min + i$3 / num * (max - min));
          }

          centroids.push(max);

          while (repeat) {
            // assignment step
            for (var j = 0; j < num; j++) {
              clusterSizes[j] = 0;
            }

            for (var i$4 = 0; i$4 < n; i$4++) {
              var value = values[i$4];
              var mindist = Number.MAX_VALUE;
              var best = void 0;

              for (var j$1 = 0; j$1 < num; j$1++) {
                var dist = abs(centroids[j$1] - value);

                if (dist < mindist) {
                  mindist = dist;
                  best = j$1;
                }

                clusterSizes[best]++;
                assignments[i$4] = best;
              }
            } // update centroids step


            var newCentroids = new Array(num);

            for (var j$2 = 0; j$2 < num; j$2++) {
              newCentroids[j$2] = null;
            }

            for (var i$5 = 0; i$5 < n; i$5++) {
              cluster = assignments[i$5];

              if (newCentroids[cluster] === null) {
                newCentroids[cluster] = values[i$5];
              } else {
                newCentroids[cluster] += values[i$5];
              }
            }

            for (var j$3 = 0; j$3 < num; j$3++) {
              newCentroids[j$3] *= 1 / clusterSizes[j$3];
            } // check convergence


            repeat = false;

            for (var j$4 = 0; j$4 < num; j$4++) {
              if (newCentroids[j$4] !== centroids[j$4]) {
                repeat = true;
                break;
              }
            }

            centroids = newCentroids;
            nb_iters++;

            if (nb_iters > 200) {
              repeat = false;
            }
          } // finished k-means clustering
          // the next part is borrowed from gabrielflor.it


          var kClusters = {};

          for (var j$5 = 0; j$5 < num; j$5++) {
            kClusters[j$5] = [];
          }

          for (var i$6 = 0; i$6 < n; i$6++) {
            cluster = assignments[i$6];
            kClusters[cluster].push(values[i$6]);
          }

          var tmpKMeansBreaks = [];

          for (var j$6 = 0; j$6 < num; j$6++) {
            tmpKMeansBreaks.push(kClusters[j$6][0]);
            tmpKMeansBreaks.push(kClusters[j$6][kClusters[j$6].length - 1]);
          }

          tmpKMeansBreaks = tmpKMeansBreaks.sort(function (a, b) {
            return a - b;
          });
          limits.push(tmpKMeansBreaks[0]);

          for (var i$7 = 1; i$7 < tmpKMeansBreaks.length; i$7 += 2) {
            var v = tmpKMeansBreaks[i$7];

            if (!isNaN(v) && limits.indexOf(v) === -1) {
              limits.push(v);
            }
          }
        }

        return limits;
      };

      var analyze_1 = {
        analyze: analyze,
        limits: limits
      };

      var contrast = function (a, b) {
        // WCAG contrast ratio
        // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
        a = new Color_1(a);
        b = new Color_1(b);
        var l1 = a.luminance();
        var l2 = b.luminance();
        return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
      };

      var sqrt$4 = Math.sqrt;
      var atan2$2 = Math.atan2;
      var abs$1 = Math.abs;
      var cos$4 = Math.cos;
      var PI$2 = Math.PI;

      var deltaE = function (a, b, L, C) {
        if (L === void 0) L = 1;
        if (C === void 0) C = 1; // Delta E (CMC)
        // see http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CMC.html

        a = new Color_1(a);
        b = new Color_1(b);
        var ref = Array.from(a.lab());
        var L1 = ref[0];
        var a1 = ref[1];
        var b1 = ref[2];
        var ref$1 = Array.from(b.lab());
        var L2 = ref$1[0];
        var a2 = ref$1[1];
        var b2 = ref$1[2];
        var c1 = sqrt$4(a1 * a1 + b1 * b1);
        var c2 = sqrt$4(a2 * a2 + b2 * b2);
        var sl = L1 < 16.0 ? 0.511 : 0.040975 * L1 / (1.0 + 0.01765 * L1);
        var sc = 0.0638 * c1 / (1.0 + 0.0131 * c1) + 0.638;
        var h1 = c1 < 0.000001 ? 0.0 : atan2$2(b1, a1) * 180.0 / PI$2;

        while (h1 < 0) {
          h1 += 360;
        }

        while (h1 >= 360) {
          h1 -= 360;
        }

        var t = h1 >= 164.0 && h1 <= 345.0 ? 0.56 + abs$1(0.2 * cos$4(PI$2 * (h1 + 168.0) / 180.0)) : 0.36 + abs$1(0.4 * cos$4(PI$2 * (h1 + 35.0) / 180.0));
        var c4 = c1 * c1 * c1 * c1;
        var f = sqrt$4(c4 / (c4 + 1900.0));
        var sh = sc * (f * t + 1.0 - f);
        var delL = L1 - L2;
        var delC = c1 - c2;
        var delA = a1 - a2;
        var delB = b1 - b2;
        var dH2 = delA * delA + delB * delB - delC * delC;
        var v1 = delL / (L * sl);
        var v2 = delC / (C * sc);
        var v3 = sh;
        return sqrt$4(v1 * v1 + v2 * v2 + dH2 / (v3 * v3));
      }; // simple Euclidean distance


      var distance = function (a, b, mode) {
        if (mode === void 0) mode = 'lab'; // Delta E (CIE 1976)
        // see http://www.brucelindbloom.com/index.html?Equations.html

        a = new Color_1(a);
        b = new Color_1(b);
        var l1 = a.get(mode);
        var l2 = b.get(mode);
        var sum_sq = 0;

        for (var i in l1) {
          var d = (l1[i] || 0) - (l2[i] || 0);
          sum_sq += d * d;
        }

        return Math.sqrt(sum_sq);
      };

      var valid = function () {
        var args = [],
            len = arguments.length;

        while (len--) args[len] = arguments[len];

        try {
          new (Function.prototype.bind.apply(Color_1, [null].concat(args)))();
          return true;
        } catch (e) {
          return false;
        }
      }; // some pre-defined color scales:


      var scales = {
        cool: function cool() {
          return scale([chroma_1.hsl(180, 1, .9), chroma_1.hsl(250, .7, .4)]);
        },
        hot: function hot() {
          return scale(['#000', '#f00', '#ff0', '#fff']).mode('rgb');
        }
      };
      /**
          ColorBrewer colors for chroma.js
           Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The
          Pennsylvania State University.
           Licensed under the Apache License, Version 2.0 (the "License");
          you may not use this file except in compliance with the License.
          You may obtain a copy of the License at
          http://www.apache.org/licenses/LICENSE-2.0
           Unless required by applicable law or agreed to in writing, software distributed
          under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
          CONDITIONS OF ANY KIND, either express or implied. See the License for the
          specific language governing permissions and limitations under the License.
      */

      var colorbrewer = {
        // sequential
        OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
        PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
        BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
        Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
        BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
        YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
        YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
        Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
        RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
        Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
        YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
        Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
        GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
        Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
        YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
        PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
        Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
        PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
        Viridis: ['#440154', '#482777', '#3f4a8a', '#31678e', '#26838f', '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'],
        // diverging
        Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
        RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
        RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
        PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
        PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
        RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
        BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
        RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
        PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],
        // qualitative
        Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
        Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
        Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
        Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
        Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
        Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
        Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
        Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2']
      }; // add lowercase aliases for case-insensitive matches

      for (var i$1 = 0, list$1 = Object.keys(colorbrewer); i$1 < list$1.length; i$1 += 1) {
        var key = list$1[i$1];
        colorbrewer[key.toLowerCase()] = colorbrewer[key];
      }

      var colorbrewer_1 = colorbrewer; // feel free to comment out anything to rollup
      // a smaller chroma.js built
      // io --> convert colors
      // operators --> modify existing Colors
      // interpolators
      // generators -- > create new colors

      chroma_1.average = average;
      chroma_1.bezier = bezier_1;
      chroma_1.blend = blend_1;
      chroma_1.cubehelix = cubehelix;
      chroma_1.mix = chroma_1.interpolate = mix;
      chroma_1.random = random_1;
      chroma_1.scale = scale; // other utility methods

      chroma_1.analyze = analyze_1.analyze;
      chroma_1.contrast = contrast;
      chroma_1.deltaE = deltaE;
      chroma_1.distance = distance;
      chroma_1.limits = analyze_1.limits;
      chroma_1.valid = valid; // scale

      chroma_1.scales = scales; // colors

      chroma_1.colors = w3cx11_1;
      chroma_1.brewer = colorbrewer_1;
      var chroma_js = chroma_1;
      return chroma_js;
    });
  });

  function getZones(from, to, exclusions = []) {
    if (from > to) {
      [from, to] = [to, from];
    } // in exclusions from and to have to be defined


    exclusions = exclusions.filter(exclusion => exclusion.from !== undefined && exclusion.to !== undefined);
    exclusions = JSON.parse(JSON.stringify(exclusions)); // we ensure that from before to

    exclusions.forEach(exclusion => {
      if (exclusion.from > exclusion.to) {
        [exclusion.to, exclusion.from] = [exclusion.from, exclusion.to];
      }
    });
    exclusions.sort((a, b) => a.from - b.from); // we will rework the exclusions in order to remove overlap and outside range (from / to)

    exclusions.forEach(exclusion => {
      if (exclusion.from < from) exclusion.from = from;
      if (exclusion.to > to) exclusion.to = to;
    });

    for (let i = 0; i < exclusions.length - 1; i++) {
      if (exclusions[i].to > exclusions[i + 1].from) {
        exclusions[i].to = exclusions[i + 1].from;
      }
    }

    exclusions = exclusions.filter(exclusion => exclusion.from < exclusion.to);

    if (!exclusions || exclusions.length === 0) {
      return [{
        from,
        to
      }];
    }

    let zones = [];
    let currentFrom = from;

    for (let exclusion of exclusions) {
      if (currentFrom < exclusion.from) {
        zones.push({
          from: currentFrom,
          to: exclusion.from
        });
      }

      currentFrom = exclusion.to;
    }

    if (currentFrom < to) {
      zones.push({
        from: currentFrom,
        to: to
      });
    }

    return zones;
  }

  /**
   * Filter an array x/y based on various criteria
   * x points are expected to be sorted
   *
   * @param {object} points
   * @param {object} [options={}]
   * @param {array} [options.from]
   * @param {array} [options.to]
   * @param {array} [options.exclusions=[]]
   * @return {{x: Array<number>, y: Array<number>}}
   */

  function filterX(points, options = {}) {
    const {
      x,
      y
    } = points;
    const {
      from = x[0],
      to = x[x.length - 1],
      exclusions = []
    } = options;
    let zones = getZones(from, to, exclusions);
    let currentZoneIndex = 0;
    let newX = [];
    let newY = [];
    let position = 0;

    while (position < x.length) {
      if (x[position] <= zones[currentZoneIndex].to && x[position] >= zones[currentZoneIndex].from) {
        newX.push(x[position]);
        newY.push(y[position]);
      } else {
        if (x[position] > zones[currentZoneIndex].to) {
          currentZoneIndex++;
          if (!zones[currentZoneIndex]) break;
        }
      }

      position++;
    }

    return {
      x: newX,
      y: newY
    };
  }

  /**
   * Retrieve a chart with autocorrelation color
   * @param {SpectraProcessor} [spectraProcessor]
   * @param {number} [index]
   * @param {object} [options={}]
   * @param {Array} [options.autocorrelation] precalculated autocorrelation {x,y}
   * @param {Array} [options.maxDataPoints=]
   * @param {array} [options.xFilter.from]
   * @param {array} [options.xFilter.to]
   * @param {array} [options.xFilter.exclusions=[]]
   */

  function getAutocorrelationChart(spectraProcessor, index, options = {}) {
    const {
      autocorrelation = spectraProcessor.getAutocorrelation(index),
      xFilter
    } = options;
    let max = autocorrelation.y.reduce(function (a, b) {
      return isNaN(b) ? a : Math.max(a, b);
    }, Number.MIN_VALUE);
    let min = autocorrelation.y.reduce(function (a, b) {
      return isNaN(b) ? a : Math.min(a, b);
    }, Number.MAX_VALUE);
    let colorCallback = chroma.scale(['blue', 'cyan', 'yellow', 'red']).domain([min, max]).mode('lch');
    let colorScale = autocorrelation.y.map(y => `rgb(${colorCallback(y).rgb().join()})`);
    let mean = spectraProcessor.getMeanData();

    if (xFilter) {
      mean = filterX({
        x: mean.x,
        y: mean.y
      }, xFilter);
    }

    let colorSpectrum = {
      type: 'color',
      x: mean.x,
      y: mean.y,
      color: colorScale,
      styles: {
        unselected: {
          lineWidth: 1,
          lineStyle: 1
        },
        selected: {
          lineWidth: 3,
          lineStyle: 1
        }
      }
    };
    return colorSpectrum;
  }

  /**
   * @private
   * @param {*} spectra
   */

  function getBoxPlotData(spectra) {
    let matrix = [];
    let x = spectra[0].normalized.x;

    for (let spectrum of spectra) {
      matrix.push(spectrum.normalized.y);
    }

    let nbRow = matrix.length;
    let nbColumn = matrix[0].length;
    let result;
    let aColumn = new Float64Array(nbRow);

    for (let column = 0; column < nbColumn; column++) {
      for (let row = 0; row < nbRow; row++) {
        aColumn[row] = matrix[row][column];
      }

      let info = xBoxPlot(aColumn);

      if (!result) {
        result = {
          x
        };

        for (let key in info) {
          result[key] = [];
        }
      }

      for (let key in info) {
        result[key].push(info[key]);
      }
    }

    return result;
  }

  function getBoxPlotAnnotations(spectra, options = {}) {
    const {
      q13FillColor = '#000',
      q13FillOpacity = 0.3,
      q2StrokeColor = '#000',
      q2StrokeWidth = 3,
      minMaxFillColor = '#000',
      minMaxFillOpacity = 0.15
    } = options;
    let annotations = [];
    let data = getBoxPlotData(spectra);

    if (q13FillOpacity && q13FillColor) {
      let q13 = [];

      for (let i = 0; i < data.x.length; i++) {
        q13.push({
          x: data.x[i],
          y: data.Q1[i]
        });
      }

      for (let i = data.x.length - 1; i >= 0; i--) {
        q13.push({
          x: data.x[i],
          y: data.Q3[i]
        });
      }

      annotations.push({
        type: 'polygon',
        layer: 0,
        properties: {
          fillColor: q13FillColor,
          fillOpacity: q13FillOpacity,
          strokeWidth: 0.0000001,
          position: q13
        }
      });
    }

    if (q2StrokeColor && q2StrokeWidth) {
      let q2 = [];

      for (let i = 0; i < data.x.length; i++) {
        q2.push({
          x: data.x[i],
          y: data.Q2[i]
        });
      } // Temp code because polyline is not working


      for (let i = data.x.length - 1; i >= 0; i--) {
        q2.push({
          x: data.x[i],
          y: data.Q2[i]
        });
      }

      annotations.push({
        type: 'polygon',
        layer: 0,
        properties: {
          strokeWidth: q2StrokeWidth,
          strokeColor: q2StrokeColor,
          position: q2
        }
      });
    }

    if (minMaxFillColor && minMaxFillOpacity) {
      let minMax = [];

      for (let i = 0; i < data.x.length; i++) {
        minMax.push({
          x: data.x[i],
          y: data.min[i]
        });
      }

      for (let i = data.x.length - 1; i >= 0; i--) {
        minMax.push({
          x: data.x[i],
          y: data.max[i]
        });
      }

      annotations.push({
        type: 'polygon',
        layer: 0,
        properties: {
          fillColor: minMaxFillColor,
          fillOpacity: minMaxFillOpacity,
          strokeWidth: 0.0000001,
          strokeColor: '#FFF',
          position: minMax
        }
      });
    }

    return annotations;
  }

  function addChartDataStyle(data, spectrum) {
    data.styles = {
      unselected: {
        lineColor: spectrum.meta.color || 'darkgrey',
        lineWidth: 1,
        lineStyle: 1
      },
      selected: {
        lineColor: spectrum.meta.color || 'darkgrey',
        lineWidth: 3,
        lineStyle: 1
      }
    };
    data.label = spectrum.meta.id || spectrum.id;
  }

  /**
   * Retrieve a chart with selected original data
   * @param {object} [options={}]
   * @param {Array} [options.ids] List of spectra ids, by default all
   * @param {Array} [options.yFactor=1]
   */

  function getChart(spectra, options = {}) {
    const {
      ids,
      yFactor,
      xFilter = {}
    } = options;
    let chart = {
      data: []
    };

    for (let spectrum of spectra) {
      if (!ids || ids.includes(spectrum.id)) {
        let data = spectrum.getData({
          yFactor,
          xFilter
        });
        addChartDataStyle(data, spectrum);
        chart.data.push(data);
      }
    }

    return chart;
  }

  function getNormalizationAnnotations(filter = {}, boundary = {}) {
    let {
      exclusions = []
    } = filter;
    let annotations = [];
    exclusions = exclusions.filter(exclusion => !exclusion.ignore);
    annotations = exclusions.map(exclusion => {
      let annotation = {
        type: 'rect',
        position: [{
          x: exclusion.from,
          y: boundary.y.min
        }, {
          x: exclusion.to,
          y: boundary.y.max
        }],
        strokeWidth: 0,
        fillColor: 'rgba(255,255,224,1)'
      };
      return annotation;
    });

    if (filter.from !== undefined) {
      annotations.push({
        type: 'rect',
        position: [{
          x: Number.MIN_SAFE_INTEGER,
          y: boundary.y.min
        }, {
          x: filter.from,
          y: boundary.y.max
        }],
        strokeWidth: 0,
        fillColor: 'rgba(255,255,224,1)'
      });
    }

    if (filter.to !== undefined) {
      annotations.push({
        type: 'rect',
        position: [{
          x: filter.to,
          y: boundary.y.min
        }, {
          x: Number.MAX_SAFE_INTEGER,
          y: boundary.y.max
        }],
        strokeWidth: 0,
        fillColor: 'rgba(255,255,224,1)'
      });
    }

    return annotations;
  }

  /**
   * @param {Array<Spectrum>} spectra
   * @param {object} [options={}]
   * @param {array} [options.ids]
   * @param {object} [options.xFilter={}]
   * @param {array} [options.xFilter.from]
   * @param {array} [options.xFilter.to]
   * @param {array} [options.xFilter.exclusions=[]]
   */

  function getNormalizedChart(spectra, options = {}) {
    const {
      ids,
      xFilter
    } = options;
    let chart = {
      data: []
    };

    for (let spectrum of spectra) {
      if (!ids || ids.includes(spectrum.id)) {
        let data = spectrum.normalized;

        if (xFilter) {
          data = filterX({
            x: data.x,
            y: data.y
          }, xFilter);
        }

        addChartDataStyle(data, spectrum);
        chart.data.push(data);
      }
    }

    return chart;
  }

  /**
   *
   * @param {SpectraProcessor} spectraProcessor
   * @param {object} [options={}] scale spectra based on various parameters
   * @param {object} [options.range] from - to
   * @param {Array} [options.ids] ids of selected spectra
   * @param {string} [options.targetID=spectra[0].id]
   * @param {string} [options.method='max'] min, max, range, minMax
   * @param {Array} [options.ranges] Array of object containing {from:'', to:'', label:''}
   * @param {Array} [options.calculations] Array of object containing {label:'', formula:''}
   * @param {boolean} [options.relative=false]
   */

  function getScaledChart(spectraProcessor, options = {}) {
    let scaled = spectraProcessor.getScaledData(options);
    let chart = {
      data: []
    };
    if (!scaled || !scaled.matrix) return chart;

    for (let i = 0; i < scaled.matrix.length; i++) {
      let data = {
        x: scaled.x,
        y: Array.from(scaled.matrix[i]) // need to ensure not a typed array

      };
      addChartDataStyle(data, {
        meta: scaled.meta[i],
        id: scaled.ids[i]
      });
      chart.data.push(data);
    }

    return chart;
  }

  /**
   * @private
   * @param {*} spectra
   * @param {object} options
   */
  function getNormalizedData(spectra, options = {}) {
    const {
      ids
    } = options;
    let matrix = [];
    let meta = [];
    let currentIDs = [];
    let x = [];

    if (Array.isArray(spectra) && spectra.length > 0) {
      for (let spectrum of spectra) {
        if (!ids || ids.includes(spectrum.id)) {
          currentIDs.push(spectrum.id);
          matrix.push(spectrum.normalized.y);
          meta.push(spectrum.meta);
        }
      }

      x = spectra[0].normalized.x;
    }

    return {
      ids: currentIDs,
      matrix,
      meta,
      x
    };
  }

  function getTrackAnnotation(spectra, index, options = {}) {
    const {
      ids,
      showSpectrumID = true
    } = options;
    let annotations = [];
    let normalized = getNormalizedData(spectra, {
      ids
    });
    if (normalized.ids.length === 0) return annotations;
    let line = 0; // header containing X coordinate

    annotations.push({
      type: 'line',
      position: [{
        x: `${70}px`,
        y: `${15 + 15 * line}px`
      }, {
        x: `${85}px`,
        y: `${15 + 15 * line}px`
      }],
      strokeWidth: 0.0000001,
      label: {
        size: 16,
        text: `x: ${normalized.x[index].toPrecision(6)}`,
        position: {
          x: `${130}px`,
          y: `${20 + 15 * line}px`
        }
      }
    });
    line++;

    for (let i = 0; i < normalized.ids.length; i++) {
      let id = normalized.ids[i];
      let meta = normalized.meta[i];
      let y = normalized.matrix[i][index];
      annotations.push({
        type: 'line',
        position: [{
          x: `${70}px`,
          y: `${15 + 15 * line}px`
        }, {
          x: `${85}px`,
          y: `${15 + 15 * line}px`
        }],
        strokeColor: meta.color,
        strokeWidth: 2,
        label: {
          text: `${y.toPrecision(4)}${showSpectrumID ? ` - ${id}` : ''}`,
          position: {
            x: `${90}px`,
            y: `${20 + 15 * line}px`
          }
        }
      });
      line++;
    }

    return annotations;
  }

  /**
   * @private
   * @param {Array<object>} [metadata]
   * @param {object} [options={}] scale spectra based on various parameters
   * @param {string} [options.propertyName="category"]
   */
  function getCategoriesStats(metadata, options = {}) {
    const {
      propertyName = 'category'
    } = options;
    let categories = {};
    let classNumber = 0;

    for (let metadatum of metadata) {
      let value = metadatum[propertyName];

      if (!categories[value]) {
        categories[value] = {
          classNumber: classNumber++,
          counter: 0
        };
      }

      categories[value].counter++;
    }

    return categories;
  }

  /**
   * @private
   * @param {Array<object>} [metadata]
   * @param {object} [options={}] scale spectra based on various parameters
   * @param {string} [options.propertyName="category"]
   */

  function getClasses(metadata, options = {}) {
    const {
      propertyName = 'category'
    } = options;
    const categoriesStats = getCategoriesStats(metadata, options);
    const result = new Array(metadata.length);

    for (let i = 0; i < metadata.length; i++) {
      result[i] = categoriesStats[metadata[i][propertyName]].classNumber;
    }

    return result;
  }

  /**
   * @private
   * @param {*} spectra
   * @param {object} options
   */
  function getMetadata(spectra, options = {}) {
    const {
      ids
    } = options;
    let metadata = [];

    if (Array.isArray(spectra) && spectra.length > 0) {
      for (let spectrum of spectra) {
        if (!ids || ids.includes(spectrum.id)) {
          metadata.push(spectrum.meta);
        }
      }
    }

    return metadata;
  }

  const GC_MS_FIELDS = ['TIC', '.RIC', 'SCANNUMBER'];
  function complexChromatogram(result) {
    let spectra = result.spectra;
    let length = spectra.length;
    let chromatogram = {
      times: new Array(length),
      series: {
        ms: {
          dimension: 2,
          data: new Array(length)
        }
      }
    };
    let existingGCMSFields = [];

    for (let i = 0; i < GC_MS_FIELDS.length; i++) {
      let label = convertMSFieldToLabel(GC_MS_FIELDS[i]);

      if (spectra[0][label]) {
        existingGCMSFields.push(label);
        chromatogram.series[label] = {
          dimension: 1,
          data: new Array(length)
        };
      }
    }

    for (let i = 0; i < length; i++) {
      let spectrum = spectra[i];
      chromatogram.times[i] = spectrum.pageValue;

      for (let j = 0; j < existingGCMSFields.length; j++) {
        chromatogram.series[existingGCMSFields[j]].data[i] = parseFloat(spectrum[existingGCMSFields[j]]);
      }

      if (spectrum.data) {
        chromatogram.series.ms.data[i] = [spectrum.data.x, spectrum.data.y];
      }
    }

    result.chromatogram = chromatogram;
  }
  function isMSField(canonicDataLabel) {
    return GC_MS_FIELDS.indexOf(canonicDataLabel) !== -1;
  }
  function convertMSFieldToLabel(value) {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function convertToFloatArray(stringArray) {
    let floatArray = [];

    for (let i = 0; i < stringArray.length; i++) {
      floatArray.push(parseFloat(stringArray[i]));
    }

    return floatArray;
  }

  function fastParseXYData(spectrum, value) {
    // TODO need to deal with result
    //  console.log(value);
    // we check if deltaX is defined otherwise we calculate it
    let yFactor = spectrum.yFactor;
    let deltaX = spectrum.deltaX;
    spectrum.isXYdata = true;
    let currentData = {
      x: [],
      y: []
    };
    spectrum.data = currentData;
    let currentX = spectrum.firstX;
    let currentY = spectrum.firstY; // we skip the first line
    //

    let endLine = false;
    let ascii;
    let i = 0;

    for (; i < value.length; i++) {
      ascii = value.charCodeAt(i);

      if (ascii === 13 || ascii === 10) {
        endLine = true;
      } else {
        if (endLine) break;
      }
    } // we proceed taking the i after the first line


    let newLine = true;
    let isDifference = false;
    let isLastDifference = false;
    let lastDifference = 0;
    let isDuplicate = false;
    let inComment = false;
    let currentValue = 0; // can be a difference or a duplicate

    let lastValue = 0; // must be the real last value

    let isNegative = false;
    let inValue = false;
    let skipFirstValue = false;
    let decimalPosition = 0;

    for (; i <= value.length; i++) {
      if (i === value.length) ascii = 13;else ascii = value.charCodeAt(i);

      if (inComment) {
        // we should ignore the text if we are after $$
        if (ascii === 13 || ascii === 10) {
          newLine = true;
          inComment = false;
        }
      } else {
        // when is it a new value ?
        // when it is not a digit, . or comma
        // it is a number that is either new or we continue
        if (ascii <= 57 && ascii >= 48) {
          // a number
          inValue = true;

          if (decimalPosition > 0) {
            currentValue += (ascii - 48) / Math.pow(10, decimalPosition++);
          } else {
            currentValue *= 10;
            currentValue += ascii - 48;
          }
        } else if (ascii === 44 || ascii === 46) {
          // a "," or "."
          inValue = true;
          decimalPosition++;
        } else {
          if (inValue) {
            // need to process the previous value
            if (newLine) {
              newLine = false; // we don't check the X value
              // console.log("NEW LINE",isDifference, lastDifference);
              // if new line and lastDifference, the first value is just a check !
              // that we don't check ...

              if (isLastDifference) skipFirstValue = true;
            } else {
              // need to deal with duplicate and differences
              if (skipFirstValue) {
                skipFirstValue = false;
              } else {
                if (isDifference) {
                  lastDifference = isNegative ? 0 - currentValue : currentValue;
                  isLastDifference = true;
                  isDifference = false;
                } else if (!isDuplicate) {
                  lastValue = isNegative ? 0 - currentValue : currentValue;
                }

                let duplicate = isDuplicate ? currentValue - 1 : 1;

                for (let j = 0; j < duplicate; j++) {
                  if (isLastDifference) {
                    currentY += lastDifference;
                  } else {
                    currentY = lastValue;
                  }

                  currentData.x.push(currentX);
                  currentData.y.push(currentY * yFactor);
                  currentX += deltaX;
                }
              }
            }

            isNegative = false;
            currentValue = 0;
            decimalPosition = 0;
            inValue = false;
            isDuplicate = false;
          } // positive SQZ digits @ A B C D E F G H I (ascii 64-73)


          if (ascii < 74 && ascii > 63) {
            inValue = true;
            isLastDifference = false;
            currentValue = ascii - 64;
          } else if (ascii > 96 && ascii < 106) {
            // negative SQZ digits a b c d e f g h i (ascii 97-105)
            inValue = true;
            isLastDifference = false;
            currentValue = ascii - 96;
            isNegative = true;
          } else if (ascii === 115) {
            // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
            inValue = true;
            isDuplicate = true;
            currentValue = 9;
          } else if (ascii > 82 && ascii < 91) {
            inValue = true;
            isDuplicate = true;
            currentValue = ascii - 82;
          } else if (ascii > 73 && ascii < 83) {
            // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
            inValue = true;
            isDifference = true;
            currentValue = ascii - 73;
          } else if (ascii > 105 && ascii < 115) {
            // negative DIF digits j k l m n o p q r (ascii 106-114)
            inValue = true;
            isDifference = true;
            currentValue = ascii - 105;
            isNegative = true;
          } else if (ascii === 36 && value.charCodeAt(i + 1) === 36) {
            // $ sign, we need to check the next one
            inValue = true;
            inComment = true;
          } else if (ascii === 37) {
            // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
            inValue = true;
            isDifference = true;
            currentValue = 0;
            isNegative = false;
          } else if (ascii === 45) {
            // a "-"
            // check if after there is a number, decimal or comma
            let ascii2 = value.charCodeAt(i + 1);

            if (ascii2 >= 48 && ascii2 <= 57 || ascii2 === 44 || ascii2 === 46) {
              inValue = true;
              if (!newLine) isLastDifference = false;
              isNegative = true;
            }
          } else if (ascii === 13 || ascii === 10) {
            newLine = true;
            inComment = false;
          } // and now analyse the details ... space or tabulation
          // if "+" we just don't care

        }
      }
    }
  }

  const removeCommentRegExp = /\$\$.*/;
  const peakTableSplitRegExp = /[,\t ]+/;
  function parsePeakTable(spectrum, value, result) {
    spectrum.isPeaktable = true;

    if (!spectrum.variables || Object.keys(spectrum.variables) === 2) {
      parseXY(spectrum, value, result);
    } else {
      parseXYZ(spectrum, value, result);
    } // we will add the data in the variables


    if (spectrum.variables) {
      for (let key in spectrum.variables) {
        spectrum.variables[key].data = spectrum.data[key];
      }
    }
  }

  function parseXY(spectrum, value, result) {
    let currentData = {
      x: [],
      y: []
    };
    spectrum.data = currentData; // counts for around 20% of the time

    let lines = value.split(/,? *,?[;\r\n]+ */);

    for (let i = 1; i < lines.length; i++) {
      let values = lines[i].trim().replace(removeCommentRegExp, '').split(peakTableSplitRegExp);

      if (values.length % 2 === 0) {
        for (let j = 0; j < values.length; j = j + 2) {
          // takes around 40% of the time to add and parse the 2 values nearly exclusively because of parseFloat
          currentData.x.push(parseFloat(values[j]) * spectrum.xFactor);
          currentData.y.push(parseFloat(values[j + 1]) * spectrum.yFactor);
        }
      } else {
        result.logs.push(`Format error: ${values}`);
      }
    }
  }

  function parseXYZ(spectrum, value, result) {
    let currentData = {};
    let variables = Object.keys(spectrum.variables);
    let numberOfVariables = variables.length;
    variables.forEach(variable => currentData[variable] = []);
    spectrum.data = currentData; // counts for around 20% of the time

    let lines = value.split(/,? *,?[;\r\n]+ */);

    for (let i = 1; i < lines.length; i++) {
      let values = lines[i].trim().replace(removeCommentRegExp, '').split(peakTableSplitRegExp);

      if (values.length % numberOfVariables === 0) {
        for (let j = 0; j < values.length; j++) {
          // todo should try to find a xFactor (y, ...)
          currentData[variables[j % numberOfVariables]].push(parseFloat(values[j]));
        }
      } else {
        result.logs.push(`Format error: ${values}`);
      }
    }
  }

  function parseXYA(spectrum, value) {
    let removeSymbolRegExp = /(\(+|\)+|<+|>+|\s+)/g;
    spectrum.isXYAdata = true;
    let values;
    let currentData = {
      x: [],
      y: []
    };
    spectrum.data = currentData;
    let lines = value.split(/,? *,?[;\r\n]+ */);

    for (let i = 1; i < lines.length; i++) {
      values = lines[i].trim().replace(removeSymbolRegExp, '').split(',');
      currentData.x.push(parseFloat(values[0]));
      currentData.y.push(parseFloat(values[1]));
    }
  }

  function convertTo3DZ(spectra) {
    let minZ = spectra[0].data.y[0];
    let maxZ = minZ;
    let ySize = spectra.length;
    let xSize = spectra[0].data.x.length;
    let z = new Array(ySize);

    for (let i = 0; i < ySize; i++) {
      z[i] = spectra[i].data.y;

      for (let j = 0; j < xSize; j++) {
        let value = z[i][j];
        if (value < minZ) minZ = value;
        if (value > maxZ) maxZ = value;
      }
    }

    const firstX = spectra[0].data.x[0];
    const lastX = spectra[0].data.x[spectra[0].data.x.length - 1]; // has to be -2 because it is a 1D array [x,y,x,y,...]

    const firstY = spectra[0].pageValue;
    const lastY = spectra[ySize - 1].pageValue; // Because the min / max value are the only information about the matrix if we invert
    // min and max we need to invert the array

    if (firstX > lastX) {
      for (let spectrum of z) {
        spectrum.reverse();
      }
    }

    if (firstY > lastY) {
      z.reverse();
    }

    return {
      z: z,
      minX: Math.min(firstX, lastX),
      maxX: Math.max(firstX, lastX),
      minY: Math.min(firstY, lastY),
      maxY: Math.max(firstY, lastY),
      minZ: minZ,
      maxZ: maxZ,
      noise: median(z[0].map(Math.abs))
    };
  }

  function generateContourLines(zData, options) {
    let noise = zData.noise;
    let z = zData.z;
    let povarHeight0, povarHeight1, povarHeight2, povarHeight3;
    let isOver0, isOver1, isOver2, isOver3;
    let nbSubSpectra = z.length;
    let nbPovars = z[0].length;
    let pAx, pAy, pBx, pBy;
    let x0 = zData.minX;
    let xN = zData.maxX;
    let dx = (xN - x0) / (nbPovars - 1);
    let y0 = zData.minY;
    let yN = zData.maxY;
    let dy = (yN - y0) / (nbSubSpectra - 1);
    let minZ = zData.minZ;
    let maxZ = zData.maxZ; // System.out.prvarln('y0 '+y0+' yN '+yN);
    // -------------------------
    // Povars attribution
    //
    // 0----1
    // |  / |
    // | /  |
    // 2----3
    //
    // ---------------------d------

    let iter = options.nbContourLevels * 2;
    let contourLevels = new Array(iter);
    let lineZValue;

    for (let level = 0; level < iter; level++) {
      // multiply by 2 for positif and negatif
      let contourLevel = {};
      contourLevels[level] = contourLevel;
      let side = level % 2;
      let factor = (maxZ - options.noiseMultiplier * noise) * Math.exp((level >> 1) - options.nbContourLevels);

      if (side === 0) {
        lineZValue = factor + options.noiseMultiplier * noise;
      } else {
        lineZValue = 0 - factor - options.noiseMultiplier * noise;
      }

      let lines = [];
      contourLevel.zValue = lineZValue;
      contourLevel.lines = lines;
      if (lineZValue <= minZ || lineZValue >= maxZ) continue;

      for (let iSubSpectra = 0; iSubSpectra < nbSubSpectra - 1; iSubSpectra++) {
        let subSpectra = z[iSubSpectra];
        let subSpectraAfter = z[iSubSpectra + 1];

        for (let povar = 0; povar < nbPovars - 1; povar++) {
          povarHeight0 = subSpectra[povar];
          povarHeight1 = subSpectra[povar + 1];
          povarHeight2 = subSpectraAfter[povar];
          povarHeight3 = subSpectraAfter[povar + 1];
          isOver0 = povarHeight0 > lineZValue;
          isOver1 = povarHeight1 > lineZValue;
          isOver2 = povarHeight2 > lineZValue;
          isOver3 = povarHeight3 > lineZValue; // Example povar0 is over the plane and povar1 and
          // povar2 are below, we find the varersections and add
          // the segment

          if (isOver0 !== isOver1 && isOver0 !== isOver2) {
            pAx = povar + (lineZValue - povarHeight0) / (povarHeight1 - povarHeight0);
            pAy = iSubSpectra;
            pBx = povar;
            pBy = iSubSpectra + (lineZValue - povarHeight0) / (povarHeight2 - povarHeight0);
            lines.push(pAx * dx + x0);
            lines.push(pAy * dy + y0);
            lines.push(pBx * dx + x0);
            lines.push(pBy * dy + y0);
          } // remove push does not help !!!!


          if (isOver3 !== isOver1 && isOver3 !== isOver2) {
            pAx = povar + 1;
            pAy = iSubSpectra + 1 - (lineZValue - povarHeight3) / (povarHeight1 - povarHeight3);
            pBx = povar + 1 - (lineZValue - povarHeight3) / (povarHeight2 - povarHeight3);
            pBy = iSubSpectra + 1;
            lines.push(pAx * dx + x0);
            lines.push(pAy * dy + y0);
            lines.push(pBx * dx + x0);
            lines.push(pBy * dy + y0);
          } // test around the diagonal


          if (isOver1 !== isOver2) {
            pAx = (povar + 1 - (lineZValue - povarHeight1) / (povarHeight2 - povarHeight1)) * dx + x0;
            pAy = (iSubSpectra + (lineZValue - povarHeight1) / (povarHeight2 - povarHeight1)) * dy + y0;

            if (isOver1 !== isOver0) {
              pBx = povar + 1 - (lineZValue - povarHeight1) / (povarHeight0 - povarHeight1);
              pBy = iSubSpectra;
              lines.push(pAx);
              lines.push(pAy);
              lines.push(pBx * dx + x0);
              lines.push(pBy * dy + y0);
            }

            if (isOver2 !== isOver0) {
              pBx = povar;
              pBy = iSubSpectra + 1 - (lineZValue - povarHeight2) / (povarHeight0 - povarHeight2);
              lines.push(pAx);
              lines.push(pAy);
              lines.push(pBx * dx + x0);
              lines.push(pBy * dy + y0);
            }

            if (isOver1 !== isOver3) {
              pBx = povar + 1;
              pBy = iSubSpectra + (lineZValue - povarHeight1) / (povarHeight3 - povarHeight1);
              lines.push(pAx);
              lines.push(pAy);
              lines.push(pBx * dx + x0);
              lines.push(pBy * dy + y0);
            }

            if (isOver2 !== isOver3) {
              pBx = povar + (lineZValue - povarHeight2) / (povarHeight3 - povarHeight2);
              pBy = iSubSpectra + 1;
              lines.push(pAx);
              lines.push(pAy);
              lines.push(pBx * dx + x0);
              lines.push(pBy * dy + y0);
            }
          }
        }
      }
    }

    return {
      minX: zData.minX,
      maxX: zData.maxX,
      minY: zData.minY,
      maxY: zData.maxY,
      segments: contourLevels
    };
  }

  function add2D(result, options) {
    let zData = convertTo3DZ(result.spectra);

    if (!options.noContour) {
      result.contourLines = generateContourLines(zData, options);
      delete zData.z;
    }

    result.minMax = zData;
  }

  /**
   * Computes the maximum of the given values
   * @param {Array<number>} input
   * @return {number}
   */

  function max(input) {
    if (!src(input)) {
      throw new TypeError('input must be an array');
    }

    if (input.length === 0) {
      throw new TypeError('input must not be empty');
    }

    var maxValue = input[0];

    for (var i = 1; i < input.length; i++) {
      if (input[i] > maxValue) maxValue = input[i];
    }

    return maxValue;
  }

  /**
   * Computes the minimum of the given values
   * @param {Array<number>} input
   * @return {number}
   */

  function min(input) {
    if (!src(input)) {
      throw new TypeError('input must be an array');
    }

    if (input.length === 0) {
      throw new TypeError('input must not be empty');
    }

    var minValue = input[0];

    for (var i = 1; i < input.length; i++) {
      if (input[i] < minValue) minValue = input[i];
    }

    return minValue;
  }

  /**
   *
   * @param {Array} input
   * @param {object} [options={}]
   * @param {Array} [options.output=[]] specify the output array, can be the input array for in place modification
   */

  function rescale(input) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!src(input)) {
      throw new TypeError('input must be an array');
    } else if (input.length === 0) {
      throw new TypeError('input must not be empty');
    }

    var output;

    if (options.output !== undefined) {
      if (!src(options.output)) {
        throw new TypeError('output option must be an array if specified');
      }

      output = options.output;
    } else {
      output = new Array(input.length);
    }

    var currentMin = min(input);
    var currentMax = max(input);

    if (currentMin === currentMax) {
      throw new RangeError('minimum and maximum input values are equal. Cannot rescale a constant array');
    }

    var _options$min = options.min,
        minValue = _options$min === void 0 ? options.autoMinMax ? currentMin : 0 : _options$min,
        _options$max = options.max,
        maxValue = _options$max === void 0 ? options.autoMinMax ? currentMax : 1 : _options$max;

    if (minValue >= maxValue) {
      throw new RangeError('min option must be smaller than max option');
    }

    var factor = (maxValue - minValue) / (currentMax - currentMin);

    for (var i = 0; i < input.length; i++) {
      output[i] = (input[i] - currentMin) * factor + minValue;
    }

    return output;
  }

  const indent = ' '.repeat(2);
  const indentData = ' '.repeat(4);
  function inspectMatrix() {
    return inspectMatrixWithOptions(this);
  }
  function inspectMatrixWithOptions(matrix, options = {}) {
    const {
      maxRows = 15,
      maxColumns = 10,
      maxNumSize = 8
    } = options;
    return `${matrix.constructor.name} {
${indent}[
${indentData}${inspectData(matrix, maxRows, maxColumns, maxNumSize)}
${indent}]
${indent}rows: ${matrix.rows}
${indent}columns: ${matrix.columns}
}`;
  }

  function inspectData(matrix, maxRows, maxColumns, maxNumSize) {
    const {
      rows,
      columns
    } = matrix;
    const maxI = Math.min(rows, maxRows);
    const maxJ = Math.min(columns, maxColumns);
    const result = [];

    for (let i = 0; i < maxI; i++) {
      let line = [];

      for (let j = 0; j < maxJ; j++) {
        line.push(formatNumber(matrix.get(i, j), maxNumSize));
      }

      result.push(`${line.join(' ')}`);
    }

    if (maxJ !== columns) {
      result[result.length - 1] += ` ... ${columns - maxColumns} more columns`;
    }

    if (maxI !== rows) {
      result.push(`... ${rows - maxRows} more rows`);
    }

    return result.join(`\n${indentData}`);
  }

  function formatNumber(num, maxNumSize) {
    const numStr = String(num);

    if (numStr.length <= maxNumSize) {
      return numStr.padEnd(maxNumSize, ' ');
    }

    const precise = num.toPrecision(maxNumSize - 2);

    if (precise.length <= maxNumSize) {
      return precise;
    }

    const exponential = num.toExponential(maxNumSize - 2);
    const eIndex = exponential.indexOf('e');
    const e = exponential.slice(eIndex);
    return exponential.slice(0, maxNumSize - e.length) + e;
  }

  function installMathOperations(AbstractMatrix, Matrix) {
    AbstractMatrix.prototype.add = function add(value) {
      if (typeof value === 'number') return this.addS(value);
      return this.addM(value);
    };

    AbstractMatrix.prototype.addS = function addS(value) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) + value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.addM = function addM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) + matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.add = function add(matrix, value) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.add(value);
    };

    AbstractMatrix.prototype.sub = function sub(value) {
      if (typeof value === 'number') return this.subS(value);
      return this.subM(value);
    };

    AbstractMatrix.prototype.subS = function subS(value) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) - value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.subM = function subM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) - matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.sub = function sub(matrix, value) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.sub(value);
    };

    AbstractMatrix.prototype.subtract = AbstractMatrix.prototype.sub;
    AbstractMatrix.prototype.subtractS = AbstractMatrix.prototype.subS;
    AbstractMatrix.prototype.subtractM = AbstractMatrix.prototype.subM;
    AbstractMatrix.subtract = AbstractMatrix.sub;

    AbstractMatrix.prototype.mul = function mul(value) {
      if (typeof value === 'number') return this.mulS(value);
      return this.mulM(value);
    };

    AbstractMatrix.prototype.mulS = function mulS(value) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) * value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.mulM = function mulM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) * matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.mul = function mul(matrix, value) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.mul(value);
    };

    AbstractMatrix.prototype.multiply = AbstractMatrix.prototype.mul;
    AbstractMatrix.prototype.multiplyS = AbstractMatrix.prototype.mulS;
    AbstractMatrix.prototype.multiplyM = AbstractMatrix.prototype.mulM;
    AbstractMatrix.multiply = AbstractMatrix.mul;

    AbstractMatrix.prototype.div = function div(value) {
      if (typeof value === 'number') return this.divS(value);
      return this.divM(value);
    };

    AbstractMatrix.prototype.divS = function divS(value) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) / value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.divM = function divM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) / matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.div = function div(matrix, value) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.div(value);
    };

    AbstractMatrix.prototype.divide = AbstractMatrix.prototype.div;
    AbstractMatrix.prototype.divideS = AbstractMatrix.prototype.divS;
    AbstractMatrix.prototype.divideM = AbstractMatrix.prototype.divM;
    AbstractMatrix.divide = AbstractMatrix.div;

    AbstractMatrix.prototype.mod = function mod(value) {
      if (typeof value === 'number') return this.modS(value);
      return this.modM(value);
    };

    AbstractMatrix.prototype.modS = function modS(value) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) % value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.modM = function modM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) % matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.mod = function mod(matrix, value) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.mod(value);
    };

    AbstractMatrix.prototype.modulus = AbstractMatrix.prototype.mod;
    AbstractMatrix.prototype.modulusS = AbstractMatrix.prototype.modS;
    AbstractMatrix.prototype.modulusM = AbstractMatrix.prototype.modM;
    AbstractMatrix.modulus = AbstractMatrix.mod;

    AbstractMatrix.prototype.and = function and(value) {
      if (typeof value === 'number') return this.andS(value);
      return this.andM(value);
    };

    AbstractMatrix.prototype.andS = function andS(value) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) & value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.andM = function andM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) & matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.and = function and(matrix, value) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.and(value);
    };

    AbstractMatrix.prototype.or = function or(value) {
      if (typeof value === 'number') return this.orS(value);
      return this.orM(value);
    };

    AbstractMatrix.prototype.orS = function orS(value) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) | value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.orM = function orM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) | matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.or = function or(matrix, value) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.or(value);
    };

    AbstractMatrix.prototype.xor = function xor(value) {
      if (typeof value === 'number') return this.xorS(value);
      return this.xorM(value);
    };

    AbstractMatrix.prototype.xorS = function xorS(value) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) ^ value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.xorM = function xorM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) ^ matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.xor = function xor(matrix, value) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.xor(value);
    };

    AbstractMatrix.prototype.leftShift = function leftShift(value) {
      if (typeof value === 'number') return this.leftShiftS(value);
      return this.leftShiftM(value);
    };

    AbstractMatrix.prototype.leftShiftS = function leftShiftS(value) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) << value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.leftShiftM = function leftShiftM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) << matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.leftShift = function leftShift(matrix, value) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.leftShift(value);
    };

    AbstractMatrix.prototype.signPropagatingRightShift = function signPropagatingRightShift(value) {
      if (typeof value === 'number') return this.signPropagatingRightShiftS(value);
      return this.signPropagatingRightShiftM(value);
    };

    AbstractMatrix.prototype.signPropagatingRightShiftS = function signPropagatingRightShiftS(value) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) >> value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.signPropagatingRightShiftM = function signPropagatingRightShiftM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) >> matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.signPropagatingRightShift = function signPropagatingRightShift(matrix, value) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.signPropagatingRightShift(value);
    };

    AbstractMatrix.prototype.rightShift = function rightShift(value) {
      if (typeof value === 'number') return this.rightShiftS(value);
      return this.rightShiftM(value);
    };

    AbstractMatrix.prototype.rightShiftS = function rightShiftS(value) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) >>> value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.rightShiftM = function rightShiftM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) >>> matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.rightShift = function rightShift(matrix, value) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.rightShift(value);
    };

    AbstractMatrix.prototype.zeroFillRightShift = AbstractMatrix.prototype.rightShift;
    AbstractMatrix.prototype.zeroFillRightShiftS = AbstractMatrix.prototype.rightShiftS;
    AbstractMatrix.prototype.zeroFillRightShiftM = AbstractMatrix.prototype.rightShiftM;
    AbstractMatrix.zeroFillRightShift = AbstractMatrix.rightShift;

    AbstractMatrix.prototype.not = function not() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, ~this.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.not = function not(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.not();
    };

    AbstractMatrix.prototype.abs = function abs() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.abs(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.abs = function abs(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.abs();
    };

    AbstractMatrix.prototype.acos = function acos() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.acos(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.acos = function acos(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.acos();
    };

    AbstractMatrix.prototype.acosh = function acosh() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.acosh(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.acosh = function acosh(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.acosh();
    };

    AbstractMatrix.prototype.asin = function asin() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.asin(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.asin = function asin(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.asin();
    };

    AbstractMatrix.prototype.asinh = function asinh() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.asinh(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.asinh = function asinh(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.asinh();
    };

    AbstractMatrix.prototype.atan = function atan() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.atan(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.atan = function atan(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.atan();
    };

    AbstractMatrix.prototype.atanh = function atanh() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.atanh(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.atanh = function atanh(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.atanh();
    };

    AbstractMatrix.prototype.cbrt = function cbrt() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.cbrt(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.cbrt = function cbrt(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.cbrt();
    };

    AbstractMatrix.prototype.ceil = function ceil() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.ceil(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.ceil = function ceil(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.ceil();
    };

    AbstractMatrix.prototype.clz32 = function clz32() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.clz32(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.clz32 = function clz32(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.clz32();
    };

    AbstractMatrix.prototype.cos = function cos() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.cos(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.cos = function cos(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.cos();
    };

    AbstractMatrix.prototype.cosh = function cosh() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.cosh(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.cosh = function cosh(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.cosh();
    };

    AbstractMatrix.prototype.exp = function exp() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.exp(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.exp = function exp(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.exp();
    };

    AbstractMatrix.prototype.expm1 = function expm1() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.expm1(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.expm1 = function expm1(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.expm1();
    };

    AbstractMatrix.prototype.floor = function floor() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.floor(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.floor = function floor(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.floor();
    };

    AbstractMatrix.prototype.fround = function fround() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.fround(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.fround = function fround(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.fround();
    };

    AbstractMatrix.prototype.log = function log() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.log(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.log = function log(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.log();
    };

    AbstractMatrix.prototype.log1p = function log1p() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.log1p(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.log1p = function log1p(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.log1p();
    };

    AbstractMatrix.prototype.log10 = function log10() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.log10(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.log10 = function log10(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.log10();
    };

    AbstractMatrix.prototype.log2 = function log2() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.log2(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.log2 = function log2(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.log2();
    };

    AbstractMatrix.prototype.round = function round() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.round(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.round = function round(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.round();
    };

    AbstractMatrix.prototype.sign = function sign() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.sign(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.sign = function sign(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.sign();
    };

    AbstractMatrix.prototype.sin = function sin() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.sin(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.sin = function sin(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.sin();
    };

    AbstractMatrix.prototype.sinh = function sinh() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.sinh(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.sinh = function sinh(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.sinh();
    };

    AbstractMatrix.prototype.sqrt = function sqrt() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.sqrt(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.sqrt = function sqrt(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.sqrt();
    };

    AbstractMatrix.prototype.tan = function tan() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.tan(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.tan = function tan(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.tan();
    };

    AbstractMatrix.prototype.tanh = function tanh() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.tanh(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.tanh = function tanh(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.tanh();
    };

    AbstractMatrix.prototype.trunc = function trunc() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.trunc(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.trunc = function trunc(matrix) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.trunc();
    };

    AbstractMatrix.pow = function pow(matrix, arg0) {
      const newMatrix = new Matrix(matrix);
      return newMatrix.pow(arg0);
    };

    AbstractMatrix.prototype.pow = function pow(value) {
      if (typeof value === 'number') return this.powS(value);
      return this.powM(value);
    };

    AbstractMatrix.prototype.powS = function powS(value) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.pow(this.get(i, j), value));
        }
      }

      return this;
    };

    AbstractMatrix.prototype.powM = function powM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, Math.pow(this.get(i, j), matrix.get(i, j)));
        }
      }

      return this;
    };
  }

  /**
   * @private
   * Check that a row index is not out of bounds
   * @param {Matrix} matrix
   * @param {number} index
   * @param {boolean} [outer]
   */
  function checkRowIndex(matrix, index, outer) {
    let max = outer ? matrix.rows : matrix.rows - 1;

    if (index < 0 || index > max) {
      throw new RangeError('Row index out of range');
    }
  }
  /**
   * @private
   * Check that a column index is not out of bounds
   * @param {Matrix} matrix
   * @param {number} index
   * @param {boolean} [outer]
   */

  function checkColumnIndex(matrix, index, outer) {
    let max = outer ? matrix.columns : matrix.columns - 1;

    if (index < 0 || index > max) {
      throw new RangeError('Column index out of range');
    }
  }
  /**
   * @private
   * Check that the provided vector is an array with the right length
   * @param {Matrix} matrix
   * @param {Array|Matrix} vector
   * @return {Array}
   * @throws {RangeError}
   */

  function checkRowVector(matrix, vector) {
    if (vector.to1DArray) {
      vector = vector.to1DArray();
    }

    if (vector.length !== matrix.columns) {
      throw new RangeError('vector size must be the same as the number of columns');
    }

    return vector;
  }
  /**
   * @private
   * Check that the provided vector is an array with the right length
   * @param {Matrix} matrix
   * @param {Array|Matrix} vector
   * @return {Array}
   * @throws {RangeError}
   */

  function checkColumnVector(matrix, vector) {
    if (vector.to1DArray) {
      vector = vector.to1DArray();
    }

    if (vector.length !== matrix.rows) {
      throw new RangeError('vector size must be the same as the number of rows');
    }

    return vector;
  }
  function checkIndices(matrix, rowIndices, columnIndices) {
    return {
      row: checkRowIndices(matrix, rowIndices),
      column: checkColumnIndices(matrix, columnIndices)
    };
  }
  function checkRowIndices(matrix, rowIndices) {
    if (typeof rowIndices !== 'object') {
      throw new TypeError('unexpected type for row indices');
    }

    let rowOut = rowIndices.some(r => {
      return r < 0 || r >= matrix.rows;
    });

    if (rowOut) {
      throw new RangeError('row indices are out of range');
    }

    if (!Array.isArray(rowIndices)) rowIndices = Array.from(rowIndices);
    return rowIndices;
  }
  function checkColumnIndices(matrix, columnIndices) {
    if (typeof columnIndices !== 'object') {
      throw new TypeError('unexpected type for column indices');
    }

    let columnOut = columnIndices.some(c => {
      return c < 0 || c >= matrix.columns;
    });

    if (columnOut) {
      throw new RangeError('column indices are out of range');
    }

    if (!Array.isArray(columnIndices)) columnIndices = Array.from(columnIndices);
    return columnIndices;
  }
  function checkRange(matrix, startRow, endRow, startColumn, endColumn) {
    if (arguments.length !== 5) {
      throw new RangeError('expected 4 arguments');
    }

    checkNumber('startRow', startRow);
    checkNumber('endRow', endRow);
    checkNumber('startColumn', startColumn);
    checkNumber('endColumn', endColumn);

    if (startRow > endRow || startColumn > endColumn || startRow < 0 || startRow >= matrix.rows || endRow < 0 || endRow >= matrix.rows || startColumn < 0 || startColumn >= matrix.columns || endColumn < 0 || endColumn >= matrix.columns) {
      throw new RangeError('Submatrix indices are out of range');
    }
  }
  function newArray(length, value = 0) {
    let array = [];

    for (let i = 0; i < length; i++) {
      array.push(value);
    }

    return array;
  }

  function checkNumber(name, value) {
    if (typeof value !== 'number') {
      throw new TypeError(`${name} must be a number`);
    }
  }

  function sumByRow(matrix) {
    let sum = newArray(matrix.rows);

    for (let i = 0; i < matrix.rows; ++i) {
      for (let j = 0; j < matrix.columns; ++j) {
        sum[i] += matrix.get(i, j);
      }
    }

    return sum;
  }
  function sumByColumn(matrix) {
    let sum = newArray(matrix.columns);

    for (let i = 0; i < matrix.rows; ++i) {
      for (let j = 0; j < matrix.columns; ++j) {
        sum[j] += matrix.get(i, j);
      }
    }

    return sum;
  }
  function sumAll(matrix) {
    let v = 0;

    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.columns; j++) {
        v += matrix.get(i, j);
      }
    }

    return v;
  }
  function productByRow(matrix) {
    let sum = newArray(matrix.rows, 1);

    for (let i = 0; i < matrix.rows; ++i) {
      for (let j = 0; j < matrix.columns; ++j) {
        sum[i] *= matrix.get(i, j);
      }
    }

    return sum;
  }
  function productByColumn(matrix) {
    let sum = newArray(matrix.columns, 1);

    for (let i = 0; i < matrix.rows; ++i) {
      for (let j = 0; j < matrix.columns; ++j) {
        sum[j] *= matrix.get(i, j);
      }
    }

    return sum;
  }
  function productAll(matrix) {
    let v = 1;

    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.columns; j++) {
        v *= matrix.get(i, j);
      }
    }

    return v;
  }
  function varianceByRow(matrix, unbiased, mean) {
    const rows = matrix.rows;
    const cols = matrix.columns;
    const variance = [];

    for (let i = 0; i < rows; i++) {
      let sum1 = 0;
      let sum2 = 0;
      let x = 0;

      for (let j = 0; j < cols; j++) {
        x = matrix.get(i, j) - mean[i];
        sum1 += x;
        sum2 += x * x;
      }

      if (unbiased) {
        variance.push((sum2 - sum1 * sum1 / cols) / (cols - 1));
      } else {
        variance.push((sum2 - sum1 * sum1 / cols) / cols);
      }
    }

    return variance;
  }
  function varianceByColumn(matrix, unbiased, mean) {
    const rows = matrix.rows;
    const cols = matrix.columns;
    const variance = [];

    for (let j = 0; j < cols; j++) {
      let sum1 = 0;
      let sum2 = 0;
      let x = 0;

      for (let i = 0; i < rows; i++) {
        x = matrix.get(i, j) - mean[j];
        sum1 += x;
        sum2 += x * x;
      }

      if (unbiased) {
        variance.push((sum2 - sum1 * sum1 / rows) / (rows - 1));
      } else {
        variance.push((sum2 - sum1 * sum1 / rows) / rows);
      }
    }

    return variance;
  }
  function varianceAll(matrix, unbiased, mean) {
    const rows = matrix.rows;
    const cols = matrix.columns;
    const size = rows * cols;
    let sum1 = 0;
    let sum2 = 0;
    let x = 0;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        x = matrix.get(i, j) - mean;
        sum1 += x;
        sum2 += x * x;
      }
    }

    if (unbiased) {
      return (sum2 - sum1 * sum1 / size) / (size - 1);
    } else {
      return (sum2 - sum1 * sum1 / size) / size;
    }
  }
  function centerByRow(matrix, mean) {
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.columns; j++) {
        matrix.set(i, j, matrix.get(i, j) - mean[i]);
      }
    }
  }
  function centerByColumn(matrix, mean) {
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.columns; j++) {
        matrix.set(i, j, matrix.get(i, j) - mean[j]);
      }
    }
  }
  function centerAll(matrix, mean) {
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.columns; j++) {
        matrix.set(i, j, matrix.get(i, j) - mean);
      }
    }
  }
  function getScaleByRow(matrix) {
    const scale = [];

    for (let i = 0; i < matrix.rows; i++) {
      let sum = 0;

      for (let j = 0; j < matrix.columns; j++) {
        sum += Math.pow(matrix.get(i, j), 2) / (matrix.columns - 1);
      }

      scale.push(Math.sqrt(sum));
    }

    return scale;
  }
  function scaleByRow(matrix, scale) {
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.columns; j++) {
        matrix.set(i, j, matrix.get(i, j) / scale[i]);
      }
    }
  }
  function getScaleByColumn(matrix) {
    const scale = [];

    for (let j = 0; j < matrix.columns; j++) {
      let sum = 0;

      for (let i = 0; i < matrix.rows; i++) {
        sum += Math.pow(matrix.get(i, j), 2) / (matrix.rows - 1);
      }

      scale.push(Math.sqrt(sum));
    }

    return scale;
  }
  function scaleByColumn(matrix, scale) {
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.columns; j++) {
        matrix.set(i, j, matrix.get(i, j) / scale[j]);
      }
    }
  }
  function getScaleAll(matrix) {
    const divider = matrix.size - 1;
    let sum = 0;

    for (let j = 0; j < matrix.columns; j++) {
      for (let i = 0; i < matrix.rows; i++) {
        sum += Math.pow(matrix.get(i, j), 2) / divider;
      }
    }

    return Math.sqrt(sum);
  }
  function scaleAll(matrix, scale) {
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.columns; j++) {
        matrix.set(i, j, matrix.get(i, j) / scale);
      }
    }
  }

  class AbstractMatrix {
    static from1DArray(newRows, newColumns, newData) {
      let length = newRows * newColumns;

      if (length !== newData.length) {
        throw new RangeError('data length does not match given dimensions');
      }

      let newMatrix = new Matrix(newRows, newColumns);

      for (let row = 0; row < newRows; row++) {
        for (let column = 0; column < newColumns; column++) {
          newMatrix.set(row, column, newData[row * newColumns + column]);
        }
      }

      return newMatrix;
    }

    static rowVector(newData) {
      let vector = new Matrix(1, newData.length);

      for (let i = 0; i < newData.length; i++) {
        vector.set(0, i, newData[i]);
      }

      return vector;
    }

    static columnVector(newData) {
      let vector = new Matrix(newData.length, 1);

      for (let i = 0; i < newData.length; i++) {
        vector.set(i, 0, newData[i]);
      }

      return vector;
    }

    static zeros(rows, columns) {
      return new Matrix(rows, columns);
    }

    static ones(rows, columns) {
      return new Matrix(rows, columns).fill(1);
    }

    static rand(rows, columns, options = {}) {
      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }

      const {
        random = Math.random
      } = options;
      let matrix = new Matrix(rows, columns);

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          matrix.set(i, j, random());
        }
      }

      return matrix;
    }

    static randInt(rows, columns, options = {}) {
      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }

      const {
        min = 0,
        max = 1000,
        random = Math.random
      } = options;
      if (!Number.isInteger(min)) throw new TypeError('min must be an integer');
      if (!Number.isInteger(max)) throw new TypeError('max must be an integer');
      if (min >= max) throw new RangeError('min must be smaller than max');
      let interval = max - min;
      let matrix = new Matrix(rows, columns);

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          let value = min + Math.round(random() * interval);
          matrix.set(i, j, value);
        }
      }

      return matrix;
    }

    static eye(rows, columns, value) {
      if (columns === undefined) columns = rows;
      if (value === undefined) value = 1;
      let min = Math.min(rows, columns);
      let matrix = this.zeros(rows, columns);

      for (let i = 0; i < min; i++) {
        matrix.set(i, i, value);
      }

      return matrix;
    }

    static diag(data, rows, columns) {
      let l = data.length;
      if (rows === undefined) rows = l;
      if (columns === undefined) columns = rows;
      let min = Math.min(l, rows, columns);
      let matrix = this.zeros(rows, columns);

      for (let i = 0; i < min; i++) {
        matrix.set(i, i, data[i]);
      }

      return matrix;
    }

    static min(matrix1, matrix2) {
      matrix1 = this.checkMatrix(matrix1);
      matrix2 = this.checkMatrix(matrix2);
      let rows = matrix1.rows;
      let columns = matrix1.columns;
      let result = new Matrix(rows, columns);

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          result.set(i, j, Math.min(matrix1.get(i, j), matrix2.get(i, j)));
        }
      }

      return result;
    }

    static max(matrix1, matrix2) {
      matrix1 = this.checkMatrix(matrix1);
      matrix2 = this.checkMatrix(matrix2);
      let rows = matrix1.rows;
      let columns = matrix1.columns;
      let result = new this(rows, columns);

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          result.set(i, j, Math.max(matrix1.get(i, j), matrix2.get(i, j)));
        }
      }

      return result;
    }

    static checkMatrix(value) {
      return AbstractMatrix.isMatrix(value) ? value : new Matrix(value);
    }

    static isMatrix(value) {
      return value != null && value.klass === 'Matrix';
    }

    get size() {
      return this.rows * this.columns;
    }

    apply(callback) {
      if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function');
      }

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          callback.call(this, i, j);
        }
      }

      return this;
    }

    to1DArray() {
      let array = [];

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          array.push(this.get(i, j));
        }
      }

      return array;
    }

    to2DArray() {
      let copy = [];

      for (let i = 0; i < this.rows; i++) {
        copy.push([]);

        for (let j = 0; j < this.columns; j++) {
          copy[i].push(this.get(i, j));
        }
      }

      return copy;
    }

    toJSON() {
      return this.to2DArray();
    }

    isRowVector() {
      return this.rows === 1;
    }

    isColumnVector() {
      return this.columns === 1;
    }

    isVector() {
      return this.rows === 1 || this.columns === 1;
    }

    isSquare() {
      return this.rows === this.columns;
    }

    isSymmetric() {
      if (this.isSquare()) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j <= i; j++) {
            if (this.get(i, j) !== this.get(j, i)) {
              return false;
            }
          }
        }

        return true;
      }

      return false;
    }

    isEchelonForm() {
      let i = 0;
      let j = 0;
      let previousColumn = -1;
      let isEchelonForm = true;
      let checked = false;

      while (i < this.rows && isEchelonForm) {
        j = 0;
        checked = false;

        while (j < this.columns && checked === false) {
          if (this.get(i, j) === 0) {
            j++;
          } else if (this.get(i, j) === 1 && j > previousColumn) {
            checked = true;
            previousColumn = j;
          } else {
            isEchelonForm = false;
            checked = true;
          }
        }

        i++;
      }

      return isEchelonForm;
    }

    isReducedEchelonForm() {
      let i = 0;
      let j = 0;
      let previousColumn = -1;
      let isReducedEchelonForm = true;
      let checked = false;

      while (i < this.rows && isReducedEchelonForm) {
        j = 0;
        checked = false;

        while (j < this.columns && checked === false) {
          if (this.get(i, j) === 0) {
            j++;
          } else if (this.get(i, j) === 1 && j > previousColumn) {
            checked = true;
            previousColumn = j;
          } else {
            isReducedEchelonForm = false;
            checked = true;
          }
        }

        for (let k = j + 1; k < this.rows; k++) {
          if (this.get(i, k) !== 0) {
            isReducedEchelonForm = false;
          }
        }

        i++;
      }

      return isReducedEchelonForm;
    }

    echelonForm() {
      let result = this.clone();
      let h = 0;
      let k = 0;

      while (h < result.rows && k < result.columns) {
        let iMax = h;

        for (let i = h; i < result.rows; i++) {
          if (result.get(i, k) > result.get(iMax, k)) {
            iMax = i;
          }
        }

        if (result.get(iMax, k) === 0) {
          k++;
        } else {
          result.swapRows(h, iMax);
          let tmp = result.get(h, k);

          for (let j = k; j < result.columns; j++) {
            result.set(h, j, result.get(h, j) / tmp);
          }

          for (let i = h + 1; i < result.rows; i++) {
            let factor = result.get(i, k) / result.get(h, k);
            result.set(i, k, 0);

            for (let j = k + 1; j < result.columns; j++) {
              result.set(i, j, result.get(i, j) - result.get(h, j) * factor);
            }
          }

          h++;
          k++;
        }
      }

      return result;
    }

    reducedEchelonForm() {
      let result = this.echelonForm();
      let m = result.columns;
      let n = result.rows;
      let h = n - 1;

      while (h >= 0) {
        if (result.maxRow(h) === 0) {
          h--;
        } else {
          let p = 0;
          let pivot = false;

          while (p < n && pivot === false) {
            if (result.get(h, p) === 1) {
              pivot = true;
            } else {
              p++;
            }
          }

          for (let i = 0; i < h; i++) {
            let factor = result.get(i, p);

            for (let j = p; j < m; j++) {
              let tmp = result.get(i, j) - factor * result.get(h, j);
              result.set(i, j, tmp);
            }
          }

          h--;
        }
      }

      return result;
    }

    set() {
      throw new Error('set method is unimplemented');
    }

    get() {
      throw new Error('get method is unimplemented');
    }

    repeat(options = {}) {
      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }

      const {
        rows = 1,
        columns = 1
      } = options;

      if (!Number.isInteger(rows) || rows <= 0) {
        throw new TypeError('rows must be a positive integer');
      }

      if (!Number.isInteger(columns) || columns <= 0) {
        throw new TypeError('columns must be a positive integer');
      }

      let matrix = new Matrix(this.rows * rows, this.columns * columns);

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          matrix.setSubMatrix(this, this.rows * i, this.columns * j);
        }
      }

      return matrix;
    }

    fill(value) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, value);
        }
      }

      return this;
    }

    neg() {
      return this.mulS(-1);
    }

    getRow(index) {
      checkRowIndex(this, index);
      let row = [];

      for (let i = 0; i < this.columns; i++) {
        row.push(this.get(index, i));
      }

      return row;
    }

    getRowVector(index) {
      return Matrix.rowVector(this.getRow(index));
    }

    setRow(index, array) {
      checkRowIndex(this, index);
      array = checkRowVector(this, array);

      for (let i = 0; i < this.columns; i++) {
        this.set(index, i, array[i]);
      }

      return this;
    }

    swapRows(row1, row2) {
      checkRowIndex(this, row1);
      checkRowIndex(this, row2);

      for (let i = 0; i < this.columns; i++) {
        let temp = this.get(row1, i);
        this.set(row1, i, this.get(row2, i));
        this.set(row2, i, temp);
      }

      return this;
    }

    getColumn(index) {
      checkColumnIndex(this, index);
      let column = [];

      for (let i = 0; i < this.rows; i++) {
        column.push(this.get(i, index));
      }

      return column;
    }

    getColumnVector(index) {
      return Matrix.columnVector(this.getColumn(index));
    }

    setColumn(index, array) {
      checkColumnIndex(this, index);
      array = checkColumnVector(this, array);

      for (let i = 0; i < this.rows; i++) {
        this.set(i, index, array[i]);
      }

      return this;
    }

    swapColumns(column1, column2) {
      checkColumnIndex(this, column1);
      checkColumnIndex(this, column2);

      for (let i = 0; i < this.rows; i++) {
        let temp = this.get(i, column1);
        this.set(i, column1, this.get(i, column2));
        this.set(i, column2, temp);
      }

      return this;
    }

    addRowVector(vector) {
      vector = checkRowVector(this, vector);

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) + vector[j]);
        }
      }

      return this;
    }

    subRowVector(vector) {
      vector = checkRowVector(this, vector);

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) - vector[j]);
        }
      }

      return this;
    }

    mulRowVector(vector) {
      vector = checkRowVector(this, vector);

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) * vector[j]);
        }
      }

      return this;
    }

    divRowVector(vector) {
      vector = checkRowVector(this, vector);

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) / vector[j]);
        }
      }

      return this;
    }

    addColumnVector(vector) {
      vector = checkColumnVector(this, vector);

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) + vector[i]);
        }
      }

      return this;
    }

    subColumnVector(vector) {
      vector = checkColumnVector(this, vector);

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) - vector[i]);
        }
      }

      return this;
    }

    mulColumnVector(vector) {
      vector = checkColumnVector(this, vector);

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) * vector[i]);
        }
      }

      return this;
    }

    divColumnVector(vector) {
      vector = checkColumnVector(this, vector);

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) / vector[i]);
        }
      }

      return this;
    }

    mulRow(index, value) {
      checkRowIndex(this, index);

      for (let i = 0; i < this.columns; i++) {
        this.set(index, i, this.get(index, i) * value);
      }

      return this;
    }

    mulColumn(index, value) {
      checkColumnIndex(this, index);

      for (let i = 0; i < this.rows; i++) {
        this.set(i, index, this.get(i, index) * value);
      }

      return this;
    }

    max() {
      let v = this.get(0, 0);

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          if (this.get(i, j) > v) {
            v = this.get(i, j);
          }
        }
      }

      return v;
    }

    maxIndex() {
      let v = this.get(0, 0);
      let idx = [0, 0];

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          if (this.get(i, j) > v) {
            v = this.get(i, j);
            idx[0] = i;
            idx[1] = j;
          }
        }
      }

      return idx;
    }

    min() {
      let v = this.get(0, 0);

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          if (this.get(i, j) < v) {
            v = this.get(i, j);
          }
        }
      }

      return v;
    }

    minIndex() {
      let v = this.get(0, 0);
      let idx = [0, 0];

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          if (this.get(i, j) < v) {
            v = this.get(i, j);
            idx[0] = i;
            idx[1] = j;
          }
        }
      }

      return idx;
    }

    maxRow(row) {
      checkRowIndex(this, row);
      let v = this.get(row, 0);

      for (let i = 1; i < this.columns; i++) {
        if (this.get(row, i) > v) {
          v = this.get(row, i);
        }
      }

      return v;
    }

    maxRowIndex(row) {
      checkRowIndex(this, row);
      let v = this.get(row, 0);
      let idx = [row, 0];

      for (let i = 1; i < this.columns; i++) {
        if (this.get(row, i) > v) {
          v = this.get(row, i);
          idx[1] = i;
        }
      }

      return idx;
    }

    minRow(row) {
      checkRowIndex(this, row);
      let v = this.get(row, 0);

      for (let i = 1; i < this.columns; i++) {
        if (this.get(row, i) < v) {
          v = this.get(row, i);
        }
      }

      return v;
    }

    minRowIndex(row) {
      checkRowIndex(this, row);
      let v = this.get(row, 0);
      let idx = [row, 0];

      for (let i = 1; i < this.columns; i++) {
        if (this.get(row, i) < v) {
          v = this.get(row, i);
          idx[1] = i;
        }
      }

      return idx;
    }

    maxColumn(column) {
      checkColumnIndex(this, column);
      let v = this.get(0, column);

      for (let i = 1; i < this.rows; i++) {
        if (this.get(i, column) > v) {
          v = this.get(i, column);
        }
      }

      return v;
    }

    maxColumnIndex(column) {
      checkColumnIndex(this, column);
      let v = this.get(0, column);
      let idx = [0, column];

      for (let i = 1; i < this.rows; i++) {
        if (this.get(i, column) > v) {
          v = this.get(i, column);
          idx[0] = i;
        }
      }

      return idx;
    }

    minColumn(column) {
      checkColumnIndex(this, column);
      let v = this.get(0, column);

      for (let i = 1; i < this.rows; i++) {
        if (this.get(i, column) < v) {
          v = this.get(i, column);
        }
      }

      return v;
    }

    minColumnIndex(column) {
      checkColumnIndex(this, column);
      let v = this.get(0, column);
      let idx = [0, column];

      for (let i = 1; i < this.rows; i++) {
        if (this.get(i, column) < v) {
          v = this.get(i, column);
          idx[0] = i;
        }
      }

      return idx;
    }

    diag() {
      let min = Math.min(this.rows, this.columns);
      let diag = [];

      for (let i = 0; i < min; i++) {
        diag.push(this.get(i, i));
      }

      return diag;
    }

    norm(type = 'frobenius') {
      let result = 0;

      if (type === 'max') {
        return this.max();
      } else if (type === 'frobenius') {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            result = result + this.get(i, j) * this.get(i, j);
          }
        }

        return Math.sqrt(result);
      } else {
        throw new RangeError(`unknown norm type: ${type}`);
      }
    }

    cumulativeSum() {
      let sum = 0;

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          sum += this.get(i, j);
          this.set(i, j, sum);
        }
      }

      return this;
    }

    dot(vector2) {
      if (AbstractMatrix.isMatrix(vector2)) vector2 = vector2.to1DArray();
      let vector1 = this.to1DArray();

      if (vector1.length !== vector2.length) {
        throw new RangeError('vectors do not have the same size');
      }

      let dot = 0;

      for (let i = 0; i < vector1.length; i++) {
        dot += vector1[i] * vector2[i];
      }

      return dot;
    }

    mmul(other) {
      other = Matrix.checkMatrix(other);
      let m = this.rows;
      let n = this.columns;
      let p = other.columns;
      let result = new Matrix(m, p);
      let Bcolj = new Float64Array(n);

      for (let j = 0; j < p; j++) {
        for (let k = 0; k < n; k++) {
          Bcolj[k] = other.get(k, j);
        }

        for (let i = 0; i < m; i++) {
          let s = 0;

          for (let k = 0; k < n; k++) {
            s += this.get(i, k) * Bcolj[k];
          }

          result.set(i, j, s);
        }
      }

      return result;
    }

    strassen2x2(other) {
      other = Matrix.checkMatrix(other);
      let result = new Matrix(2, 2);
      const a11 = this.get(0, 0);
      const b11 = other.get(0, 0);
      const a12 = this.get(0, 1);
      const b12 = other.get(0, 1);
      const a21 = this.get(1, 0);
      const b21 = other.get(1, 0);
      const a22 = this.get(1, 1);
      const b22 = other.get(1, 1); // Compute intermediate values.

      const m1 = (a11 + a22) * (b11 + b22);
      const m2 = (a21 + a22) * b11;
      const m3 = a11 * (b12 - b22);
      const m4 = a22 * (b21 - b11);
      const m5 = (a11 + a12) * b22;
      const m6 = (a21 - a11) * (b11 + b12);
      const m7 = (a12 - a22) * (b21 + b22); // Combine intermediate values into the output.

      const c00 = m1 + m4 - m5 + m7;
      const c01 = m3 + m5;
      const c10 = m2 + m4;
      const c11 = m1 - m2 + m3 + m6;
      result.set(0, 0, c00);
      result.set(0, 1, c01);
      result.set(1, 0, c10);
      result.set(1, 1, c11);
      return result;
    }

    strassen3x3(other) {
      other = Matrix.checkMatrix(other);
      let result = new Matrix(3, 3);
      const a00 = this.get(0, 0);
      const a01 = this.get(0, 1);
      const a02 = this.get(0, 2);
      const a10 = this.get(1, 0);
      const a11 = this.get(1, 1);
      const a12 = this.get(1, 2);
      const a20 = this.get(2, 0);
      const a21 = this.get(2, 1);
      const a22 = this.get(2, 2);
      const b00 = other.get(0, 0);
      const b01 = other.get(0, 1);
      const b02 = other.get(0, 2);
      const b10 = other.get(1, 0);
      const b11 = other.get(1, 1);
      const b12 = other.get(1, 2);
      const b20 = other.get(2, 0);
      const b21 = other.get(2, 1);
      const b22 = other.get(2, 2);
      const m1 = (a00 + a01 + a02 - a10 - a11 - a21 - a22) * b11;
      const m2 = (a00 - a10) * (-b01 + b11);
      const m3 = a11 * (-b00 + b01 + b10 - b11 - b12 - b20 + b22);
      const m4 = (-a00 + a10 + a11) * (b00 - b01 + b11);
      const m5 = (a10 + a11) * (-b00 + b01);
      const m6 = a00 * b00;
      const m7 = (-a00 + a20 + a21) * (b00 - b02 + b12);
      const m8 = (-a00 + a20) * (b02 - b12);
      const m9 = (a20 + a21) * (-b00 + b02);
      const m10 = (a00 + a01 + a02 - a11 - a12 - a20 - a21) * b12;
      const m11 = a21 * (-b00 + b02 + b10 - b11 - b12 - b20 + b21);
      const m12 = (-a02 + a21 + a22) * (b11 + b20 - b21);
      const m13 = (a02 - a22) * (b11 - b21);
      const m14 = a02 * b20;
      const m15 = (a21 + a22) * (-b20 + b21);
      const m16 = (-a02 + a11 + a12) * (b12 + b20 - b22);
      const m17 = (a02 - a12) * (b12 - b22);
      const m18 = (a11 + a12) * (-b20 + b22);
      const m19 = a01 * b10;
      const m20 = a12 * b21;
      const m21 = a10 * b02;
      const m22 = a20 * b01;
      const m23 = a22 * b22;
      const c00 = m6 + m14 + m19;
      const c01 = m1 + m4 + m5 + m6 + m12 + m14 + m15;
      const c02 = m6 + m7 + m9 + m10 + m14 + m16 + m18;
      const c10 = m2 + m3 + m4 + m6 + m14 + m16 + m17;
      const c11 = m2 + m4 + m5 + m6 + m20;
      const c12 = m14 + m16 + m17 + m18 + m21;
      const c20 = m6 + m7 + m8 + m11 + m12 + m13 + m14;
      const c21 = m12 + m13 + m14 + m15 + m22;
      const c22 = m6 + m7 + m8 + m9 + m23;
      result.set(0, 0, c00);
      result.set(0, 1, c01);
      result.set(0, 2, c02);
      result.set(1, 0, c10);
      result.set(1, 1, c11);
      result.set(1, 2, c12);
      result.set(2, 0, c20);
      result.set(2, 1, c21);
      result.set(2, 2, c22);
      return result;
    }

    mmulStrassen(y) {
      y = Matrix.checkMatrix(y);
      let x = this.clone();
      let r1 = x.rows;
      let c1 = x.columns;
      let r2 = y.rows;
      let c2 = y.columns;

      if (c1 !== r2) {
        // eslint-disable-next-line no-console
        console.warn(`Multiplying ${r1} x ${c1} and ${r2} x ${c2} matrix: dimensions do not match.`);
      } // Put a matrix into the top left of a matrix of zeros.
      // `rows` and `cols` are the dimensions of the output matrix.


      function embed(mat, rows, cols) {
        let r = mat.rows;
        let c = mat.columns;

        if (r === rows && c === cols) {
          return mat;
        } else {
          let resultat = AbstractMatrix.zeros(rows, cols);
          resultat = resultat.setSubMatrix(mat, 0, 0);
          return resultat;
        }
      } // Make sure both matrices are the same size.
      // This is exclusively for simplicity:
      // this algorithm can be implemented with matrices of different sizes.


      let r = Math.max(r1, r2);
      let c = Math.max(c1, c2);
      x = embed(x, r, c);
      y = embed(y, r, c); // Our recursive multiplication function.

      function blockMult(a, b, rows, cols) {
        // For small matrices, resort to naive multiplication.
        if (rows <= 512 || cols <= 512) {
          return a.mmul(b); // a is equivalent to this
        } // Apply dynamic padding.


        if (rows % 2 === 1 && cols % 2 === 1) {
          a = embed(a, rows + 1, cols + 1);
          b = embed(b, rows + 1, cols + 1);
        } else if (rows % 2 === 1) {
          a = embed(a, rows + 1, cols);
          b = embed(b, rows + 1, cols);
        } else if (cols % 2 === 1) {
          a = embed(a, rows, cols + 1);
          b = embed(b, rows, cols + 1);
        }

        let halfRows = parseInt(a.rows / 2, 10);
        let halfCols = parseInt(a.columns / 2, 10); // Subdivide input matrices.

        let a11 = a.subMatrix(0, halfRows - 1, 0, halfCols - 1);
        let b11 = b.subMatrix(0, halfRows - 1, 0, halfCols - 1);
        let a12 = a.subMatrix(0, halfRows - 1, halfCols, a.columns - 1);
        let b12 = b.subMatrix(0, halfRows - 1, halfCols, b.columns - 1);
        let a21 = a.subMatrix(halfRows, a.rows - 1, 0, halfCols - 1);
        let b21 = b.subMatrix(halfRows, b.rows - 1, 0, halfCols - 1);
        let a22 = a.subMatrix(halfRows, a.rows - 1, halfCols, a.columns - 1);
        let b22 = b.subMatrix(halfRows, b.rows - 1, halfCols, b.columns - 1); // Compute intermediate values.

        let m1 = blockMult(AbstractMatrix.add(a11, a22), AbstractMatrix.add(b11, b22), halfRows, halfCols);
        let m2 = blockMult(AbstractMatrix.add(a21, a22), b11, halfRows, halfCols);
        let m3 = blockMult(a11, AbstractMatrix.sub(b12, b22), halfRows, halfCols);
        let m4 = blockMult(a22, AbstractMatrix.sub(b21, b11), halfRows, halfCols);
        let m5 = blockMult(AbstractMatrix.add(a11, a12), b22, halfRows, halfCols);
        let m6 = blockMult(AbstractMatrix.sub(a21, a11), AbstractMatrix.add(b11, b12), halfRows, halfCols);
        let m7 = blockMult(AbstractMatrix.sub(a12, a22), AbstractMatrix.add(b21, b22), halfRows, halfCols); // Combine intermediate values into the output.

        let c11 = AbstractMatrix.add(m1, m4);
        c11.sub(m5);
        c11.add(m7);
        let c12 = AbstractMatrix.add(m3, m5);
        let c21 = AbstractMatrix.add(m2, m4);
        let c22 = AbstractMatrix.sub(m1, m2);
        c22.add(m3);
        c22.add(m6); // Crop output to the desired size (undo dynamic padding).

        let resultat = AbstractMatrix.zeros(2 * c11.rows, 2 * c11.columns);
        resultat = resultat.setSubMatrix(c11, 0, 0);
        resultat = resultat.setSubMatrix(c12, c11.rows, 0);
        resultat = resultat.setSubMatrix(c21, 0, c11.columns);
        resultat = resultat.setSubMatrix(c22, c11.rows, c11.columns);
        return resultat.subMatrix(0, rows - 1, 0, cols - 1);
      }

      return blockMult(x, y, r, c);
    }

    scaleRows(options = {}) {
      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }

      const {
        min = 0,
        max = 1
      } = options;
      if (!Number.isFinite(min)) throw new TypeError('min must be a number');
      if (!Number.isFinite(max)) throw new TypeError('max must be a number');
      if (min >= max) throw new RangeError('min must be smaller than max');
      let newMatrix = new Matrix(this.rows, this.columns);

      for (let i = 0; i < this.rows; i++) {
        const row = this.getRow(i);
        rescale(row, {
          min,
          max,
          output: row
        });
        newMatrix.setRow(i, row);
      }

      return newMatrix;
    }

    scaleColumns(options = {}) {
      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }

      const {
        min = 0,
        max = 1
      } = options;
      if (!Number.isFinite(min)) throw new TypeError('min must be a number');
      if (!Number.isFinite(max)) throw new TypeError('max must be a number');
      if (min >= max) throw new RangeError('min must be smaller than max');
      let newMatrix = new Matrix(this.rows, this.columns);

      for (let i = 0; i < this.columns; i++) {
        const column = this.getColumn(i);
        rescale(column, {
          min: min,
          max: max,
          output: column
        });
        newMatrix.setColumn(i, column);
      }

      return newMatrix;
    }

    flipRows() {
      const middle = Math.ceil(this.columns / 2);

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < middle; j++) {
          let first = this.get(i, j);
          let last = this.get(i, this.columns - 1 - j);
          this.set(i, j, last);
          this.set(i, this.columns - 1 - j, first);
        }
      }

      return this;
    }

    flipColumns() {
      const middle = Math.ceil(this.rows / 2);

      for (let j = 0; j < this.columns; j++) {
        for (let i = 0; i < middle; i++) {
          let first = this.get(i, j);
          let last = this.get(this.rows - 1 - i, j);
          this.set(i, j, last);
          this.set(this.rows - 1 - i, j, first);
        }
      }

      return this;
    }

    kroneckerProduct(other) {
      other = Matrix.checkMatrix(other);
      let m = this.rows;
      let n = this.columns;
      let p = other.rows;
      let q = other.columns;
      let result = new Matrix(m * p, n * q);

      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          for (let k = 0; k < p; k++) {
            for (let l = 0; l < q; l++) {
              result.set(p * i + k, q * j + l, this.get(i, j) * other.get(k, l));
            }
          }
        }
      }

      return result;
    }

    transpose() {
      let result = new Matrix(this.columns, this.rows);

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          result.set(j, i, this.get(i, j));
        }
      }

      return result;
    }

    sortRows(compareFunction = compareNumbers) {
      for (let i = 0; i < this.rows; i++) {
        this.setRow(i, this.getRow(i).sort(compareFunction));
      }

      return this;
    }

    sortColumns(compareFunction = compareNumbers) {
      for (let i = 0; i < this.columns; i++) {
        this.setColumn(i, this.getColumn(i).sort(compareFunction));
      }

      return this;
    }

    subMatrix(startRow, endRow, startColumn, endColumn) {
      checkRange(this, startRow, endRow, startColumn, endColumn);
      let newMatrix = new Matrix(endRow - startRow + 1, endColumn - startColumn + 1);

      for (let i = startRow; i <= endRow; i++) {
        for (let j = startColumn; j <= endColumn; j++) {
          newMatrix.set(i - startRow, j - startColumn, this.get(i, j));
        }
      }

      return newMatrix;
    }

    subMatrixRow(indices, startColumn, endColumn) {
      if (startColumn === undefined) startColumn = 0;
      if (endColumn === undefined) endColumn = this.columns - 1;

      if (startColumn > endColumn || startColumn < 0 || startColumn >= this.columns || endColumn < 0 || endColumn >= this.columns) {
        throw new RangeError('Argument out of range');
      }

      let newMatrix = new Matrix(indices.length, endColumn - startColumn + 1);

      for (let i = 0; i < indices.length; i++) {
        for (let j = startColumn; j <= endColumn; j++) {
          if (indices[i] < 0 || indices[i] >= this.rows) {
            throw new RangeError(`Row index out of range: ${indices[i]}`);
          }

          newMatrix.set(i, j - startColumn, this.get(indices[i], j));
        }
      }

      return newMatrix;
    }

    subMatrixColumn(indices, startRow, endRow) {
      if (startRow === undefined) startRow = 0;
      if (endRow === undefined) endRow = this.rows - 1;

      if (startRow > endRow || startRow < 0 || startRow >= this.rows || endRow < 0 || endRow >= this.rows) {
        throw new RangeError('Argument out of range');
      }

      let newMatrix = new Matrix(endRow - startRow + 1, indices.length);

      for (let i = 0; i < indices.length; i++) {
        for (let j = startRow; j <= endRow; j++) {
          if (indices[i] < 0 || indices[i] >= this.columns) {
            throw new RangeError(`Column index out of range: ${indices[i]}`);
          }

          newMatrix.set(j - startRow, i, this.get(j, indices[i]));
        }
      }

      return newMatrix;
    }

    setSubMatrix(matrix, startRow, startColumn) {
      matrix = Matrix.checkMatrix(matrix);
      let endRow = startRow + matrix.rows - 1;
      let endColumn = startColumn + matrix.columns - 1;
      checkRange(this, startRow, endRow, startColumn, endColumn);

      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          this.set(startRow + i, startColumn + j, matrix.get(i, j));
        }
      }

      return this;
    }

    selection(rowIndices, columnIndices) {
      let indices = checkIndices(this, rowIndices, columnIndices);
      let newMatrix = new Matrix(rowIndices.length, columnIndices.length);

      for (let i = 0; i < indices.row.length; i++) {
        let rowIndex = indices.row[i];

        for (let j = 0; j < indices.column.length; j++) {
          let columnIndex = indices.column[j];
          newMatrix.set(i, j, this.get(rowIndex, columnIndex));
        }
      }

      return newMatrix;
    }

    trace() {
      let min = Math.min(this.rows, this.columns);
      let trace = 0;

      for (let i = 0; i < min; i++) {
        trace += this.get(i, i);
      }

      return trace;
    }

    clone() {
      let newMatrix = new Matrix(this.rows, this.columns);

      for (let row = 0; row < this.rows; row++) {
        for (let column = 0; column < this.columns; column++) {
          newMatrix.set(row, column, this.get(row, column));
        }
      }

      return newMatrix;
    }

    sum(by) {
      switch (by) {
        case 'row':
          return sumByRow(this);

        case 'column':
          return sumByColumn(this);

        case undefined:
          return sumAll(this);

        default:
          throw new Error(`invalid option: ${by}`);
      }
    }

    product(by) {
      switch (by) {
        case 'row':
          return productByRow(this);

        case 'column':
          return productByColumn(this);

        case undefined:
          return productAll(this);

        default:
          throw new Error(`invalid option: ${by}`);
      }
    }

    mean(by) {
      const sum = this.sum(by);

      switch (by) {
        case 'row':
          {
            for (let i = 0; i < this.rows; i++) {
              sum[i] /= this.columns;
            }

            return sum;
          }

        case 'column':
          {
            for (let i = 0; i < this.columns; i++) {
              sum[i] /= this.rows;
            }

            return sum;
          }

        case undefined:
          return sum / this.size;

        default:
          throw new Error(`invalid option: ${by}`);
      }
    }

    variance(by, options = {}) {
      if (typeof by === 'object') {
        options = by;
        by = undefined;
      }

      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }

      const {
        unbiased = true,
        mean = this.mean(by)
      } = options;

      if (typeof unbiased !== 'boolean') {
        throw new TypeError('unbiased must be a boolean');
      }

      switch (by) {
        case 'row':
          {
            if (!Array.isArray(mean)) {
              throw new TypeError('mean must be an array');
            }

            return varianceByRow(this, unbiased, mean);
          }

        case 'column':
          {
            if (!Array.isArray(mean)) {
              throw new TypeError('mean must be an array');
            }

            return varianceByColumn(this, unbiased, mean);
          }

        case undefined:
          {
            if (typeof mean !== 'number') {
              throw new TypeError('mean must be a number');
            }

            return varianceAll(this, unbiased, mean);
          }

        default:
          throw new Error(`invalid option: ${by}`);
      }
    }

    standardDeviation(by, options) {
      if (typeof by === 'object') {
        options = by;
        by = undefined;
      }

      const variance = this.variance(by, options);

      if (by === undefined) {
        return Math.sqrt(variance);
      } else {
        for (let i = 0; i < variance.length; i++) {
          variance[i] = Math.sqrt(variance[i]);
        }

        return variance;
      }
    }

    center(by, options = {}) {
      if (typeof by === 'object') {
        options = by;
        by = undefined;
      }

      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }

      const {
        center = this.mean(by)
      } = options;

      switch (by) {
        case 'row':
          {
            if (!Array.isArray(center)) {
              throw new TypeError('center must be an array');
            }

            centerByRow(this, center);
            return this;
          }

        case 'column':
          {
            if (!Array.isArray(center)) {
              throw new TypeError('center must be an array');
            }

            centerByColumn(this, center);
            return this;
          }

        case undefined:
          {
            if (typeof center !== 'number') {
              throw new TypeError('center must be a number');
            }

            centerAll(this, center);
            return this;
          }

        default:
          throw new Error(`invalid option: ${by}`);
      }
    }

    scale(by, options = {}) {
      if (typeof by === 'object') {
        options = by;
        by = undefined;
      }

      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }

      let scale = options.scale;

      switch (by) {
        case 'row':
          {
            if (scale === undefined) {
              scale = getScaleByRow(this);
            } else if (!Array.isArray(scale)) {
              throw new TypeError('scale must be an array');
            }

            scaleByRow(this, scale);
            return this;
          }

        case 'column':
          {
            if (scale === undefined) {
              scale = getScaleByColumn(this);
            } else if (!Array.isArray(scale)) {
              throw new TypeError('scale must be an array');
            }

            scaleByColumn(this, scale);
            return this;
          }

        case undefined:
          {
            if (scale === undefined) {
              scale = getScaleAll(this);
            } else if (typeof scale !== 'number') {
              throw new TypeError('scale must be a number');
            }

            scaleAll(this, scale);
            return this;
          }

        default:
          throw new Error(`invalid option: ${by}`);
      }
    }

    toString(options) {
      return inspectMatrixWithOptions(this, options);
    }

  }
  AbstractMatrix.prototype.klass = 'Matrix';

  if (typeof Symbol !== 'undefined') {
    AbstractMatrix.prototype[Symbol.for('nodejs.util.inspect.custom')] = inspectMatrix;
  }

  function compareNumbers(a, b) {
    return a - b;
  } // Synonyms


  AbstractMatrix.random = AbstractMatrix.rand;
  AbstractMatrix.randomInt = AbstractMatrix.randInt;
  AbstractMatrix.diagonal = AbstractMatrix.diag;
  AbstractMatrix.prototype.diagonal = AbstractMatrix.prototype.diag;
  AbstractMatrix.identity = AbstractMatrix.eye;
  AbstractMatrix.prototype.negate = AbstractMatrix.prototype.neg;
  AbstractMatrix.prototype.tensorProduct = AbstractMatrix.prototype.kroneckerProduct;
  class Matrix extends AbstractMatrix {
    constructor(nRows, nColumns) {
      super();

      if (Matrix.isMatrix(nRows)) {
        return nRows.clone();
      } else if (Number.isInteger(nRows) && nRows > 0) {
        // Create an empty matrix
        this.data = [];

        if (Number.isInteger(nColumns) && nColumns > 0) {
          for (let i = 0; i < nRows; i++) {
            this.data.push(new Float64Array(nColumns));
          }
        } else {
          throw new TypeError('nColumns must be a positive integer');
        }
      } else if (Array.isArray(nRows)) {
        // Copy the values from the 2D array
        const arrayData = nRows;
        nRows = arrayData.length;
        nColumns = arrayData[0].length;

        if (typeof nColumns !== 'number' || nColumns === 0) {
          throw new TypeError('Data must be a 2D array with at least one element');
        }

        this.data = [];

        for (let i = 0; i < nRows; i++) {
          if (arrayData[i].length !== nColumns) {
            throw new RangeError('Inconsistent array dimensions');
          }

          this.data.push(Float64Array.from(arrayData[i]));
        }
      } else {
        throw new TypeError('First argument must be a positive number or an array');
      }

      this.rows = nRows;
      this.columns = nColumns;
      return this;
    }

    set(rowIndex, columnIndex, value) {
      this.data[rowIndex][columnIndex] = value;
      return this;
    }

    get(rowIndex, columnIndex) {
      return this.data[rowIndex][columnIndex];
    }

    removeRow(index) {
      checkRowIndex(this, index);

      if (this.rows === 1) {
        throw new RangeError('A matrix cannot have less than one row');
      }

      this.data.splice(index, 1);
      this.rows -= 1;
      return this;
    }

    addRow(index, array) {
      if (array === undefined) {
        array = index;
        index = this.rows;
      }

      checkRowIndex(this, index, true);
      array = Float64Array.from(checkRowVector(this, array));
      this.data.splice(index, 0, array);
      this.rows += 1;
      return this;
    }

    removeColumn(index) {
      checkColumnIndex(this, index);

      if (this.columns === 1) {
        throw new RangeError('A matrix cannot have less than one column');
      }

      for (let i = 0; i < this.rows; i++) {
        const newRow = new Float64Array(this.columns - 1);

        for (let j = 0; j < index; j++) {
          newRow[j] = this.data[i][j];
        }

        for (let j = index + 1; j < this.columns; j++) {
          newRow[j - 1] = this.data[i][j];
        }

        this.data[i] = newRow;
      }

      this.columns -= 1;
      return this;
    }

    addColumn(index, array) {
      if (typeof array === 'undefined') {
        array = index;
        index = this.columns;
      }

      checkColumnIndex(this, index, true);
      array = checkColumnVector(this, array);

      for (let i = 0; i < this.rows; i++) {
        const newRow = new Float64Array(this.columns + 1);
        let j = 0;

        for (; j < index; j++) {
          newRow[j] = this.data[i][j];
        }

        newRow[j++] = array[i];

        for (; j < this.columns + 1; j++) {
          newRow[j] = this.data[i][j - 1];
        }

        this.data[i] = newRow;
      }

      this.columns += 1;
      return this;
    }

  }
  installMathOperations(AbstractMatrix, Matrix);

  var fftlib = createCommonjsModule(function (module, exports) {
    /**
     * Fast Fourier Transform module
     * 1D-FFT/IFFT, 2D-FFT/IFFT (radix-2)
     */
    var FFT = function () {
      var FFT;

      {
        FFT = exports; // for CommonJS
      }

      var version = {
        release: '0.3.0',
        date: '2013-03'
      };

      FFT.toString = function () {
        return "version " + version.release + ", released " + version.date;
      }; // core operations


      var _n = 0,
          // order
      _bitrev = null,
          // bit reversal table
      _cstb = null; // sin/cos table

      var core = {
        init: function (n) {
          if (n !== 0 && (n & n - 1) === 0) {
            _n = n;

            core._initArray();

            core._makeBitReversalTable();

            core._makeCosSinTable();
          } else {
            throw new Error("init: radix-2 required");
          }
        },
        // 1D-FFT
        fft1d: function (re, im) {
          core.fft(re, im, 1);
        },
        // 1D-IFFT
        ifft1d: function (re, im) {
          var n = 1 / _n;
          core.fft(re, im, -1);

          for (var i = 0; i < _n; i++) {
            re[i] *= n;
            im[i] *= n;
          }
        },
        // 1D-IFFT
        bt1d: function (re, im) {
          core.fft(re, im, -1);
        },
        // 2D-FFT Not very useful if the number of rows have to be equal to cols
        fft2d: function (re, im) {
          var tre = [],
              tim = [],
              i = 0; // x-axis

          for (var y = 0; y < _n; y++) {
            i = y * _n;

            for (var x1 = 0; x1 < _n; x1++) {
              tre[x1] = re[x1 + i];
              tim[x1] = im[x1 + i];
            }

            core.fft1d(tre, tim);

            for (var x2 = 0; x2 < _n; x2++) {
              re[x2 + i] = tre[x2];
              im[x2 + i] = tim[x2];
            }
          } // y-axis


          for (var x = 0; x < _n; x++) {
            for (var y1 = 0; y1 < _n; y1++) {
              i = x + y1 * _n;
              tre[y1] = re[i];
              tim[y1] = im[i];
            }

            core.fft1d(tre, tim);

            for (var y2 = 0; y2 < _n; y2++) {
              i = x + y2 * _n;
              re[i] = tre[y2];
              im[i] = tim[y2];
            }
          }
        },
        // 2D-IFFT
        ifft2d: function (re, im) {
          var tre = [],
              tim = [],
              i = 0; // x-axis

          for (var y = 0; y < _n; y++) {
            i = y * _n;

            for (var x1 = 0; x1 < _n; x1++) {
              tre[x1] = re[x1 + i];
              tim[x1] = im[x1 + i];
            }

            core.ifft1d(tre, tim);

            for (var x2 = 0; x2 < _n; x2++) {
              re[x2 + i] = tre[x2];
              im[x2 + i] = tim[x2];
            }
          } // y-axis


          for (var x = 0; x < _n; x++) {
            for (var y1 = 0; y1 < _n; y1++) {
              i = x + y1 * _n;
              tre[y1] = re[i];
              tim[y1] = im[i];
            }

            core.ifft1d(tre, tim);

            for (var y2 = 0; y2 < _n; y2++) {
              i = x + y2 * _n;
              re[i] = tre[y2];
              im[i] = tim[y2];
            }
          }
        },
        // core operation of FFT
        fft: function (re, im, inv) {
          var d,
              h,
              ik,
              m,
              tmp,
              wr,
              wi,
              xr,
              xi,
              n4 = _n >> 2; // bit reversal

          for (var l = 0; l < _n; l++) {
            m = _bitrev[l];

            if (l < m) {
              tmp = re[l];
              re[l] = re[m];
              re[m] = tmp;
              tmp = im[l];
              im[l] = im[m];
              im[m] = tmp;
            }
          } // butterfly operation


          for (var k = 1; k < _n; k <<= 1) {
            h = 0;
            d = _n / (k << 1);

            for (var j = 0; j < k; j++) {
              wr = _cstb[h + n4];
              wi = inv * _cstb[h];

              for (var i = j; i < _n; i += k << 1) {
                ik = i + k;
                xr = wr * re[ik] + wi * im[ik];
                xi = wr * im[ik] - wi * re[ik];
                re[ik] = re[i] - xr;
                re[i] += xr;
                im[ik] = im[i] - xi;
                im[i] += xi;
              }

              h += d;
            }
          }
        },
        // initialize the array (supports TypedArray)
        _initArray: function () {
          if (typeof Uint32Array !== 'undefined') {
            _bitrev = new Uint32Array(_n);
          } else {
            _bitrev = [];
          }

          if (typeof Float64Array !== 'undefined') {
            _cstb = new Float64Array(_n * 1.25);
          } else {
            _cstb = [];
          }
        },
        // zero padding
        _paddingZero: function () {// TODO
        },
        // makes bit reversal table
        _makeBitReversalTable: function () {
          var i = 0,
              j = 0,
              k = 0;
          _bitrev[0] = 0;

          while (++i < _n) {
            k = _n >> 1;

            while (k <= j) {
              j -= k;
              k >>= 1;
            }

            j += k;
            _bitrev[i] = j;
          }
        },
        // makes trigonometiric function table
        _makeCosSinTable: function () {
          var n2 = _n >> 1,
              n4 = _n >> 2,
              n8 = _n >> 3,
              n2p4 = n2 + n4,
              t = Math.sin(Math.PI / _n),
              dc = 2 * t * t,
              ds = Math.sqrt(dc * (2 - dc)),
              c = _cstb[n4] = 1,
              s = _cstb[0] = 0;
          t = 2 * dc;

          for (var i = 1; i < n8; i++) {
            c -= dc;
            dc += t * c;
            s += ds;
            ds -= t * s;
            _cstb[i] = s;
            _cstb[n4 - i] = c;
          }

          if (n8 !== 0) {
            _cstb[n8] = Math.sqrt(0.5);
          }

          for (var j = 0; j < n4; j++) {
            _cstb[n2 - j] = _cstb[j];
          }

          for (var k = 0; k < n2p4; k++) {
            _cstb[k + n2] = -_cstb[k];
          }
        }
      }; // aliases (public APIs)

      var apis = ['init', 'fft1d', 'ifft1d', 'fft2d', 'ifft2d'];

      for (var i = 0; i < apis.length; i++) {
        FFT[apis[i]] = core[apis[i]];
      }

      FFT.bt = core.bt1d;
      FFT.fft = core.fft1d;
      FFT.ifft = core.ifft1d;
      return FFT;
    }.call(commonjsGlobal);
  });

  // sources:
  // https://en.wikipedia.org/wiki/Gyromagnetic_ratio
  // TODO: can we have a better source and more digits ? @jwist
  const gyromagneticRatio = {
    '1H': 267.52218744e6,
    '2H': 41.065e6,
    '3H': 285.3508e6,
    '3He': -203.789e6,
    '7Li': 103.962e6,
    '13C': 67.28284e6,
    '14N': 19.331e6,
    '15N': -27.116e6,
    '17O': -36.264e6,
    '19F': 251.662e6,
    '23Na': 70.761e6,
    '27Al': 69.763e6,
    '29Si': -53.19e6,
    '31P': 108.291e6,
    '57Fe': 8.681e6,
    '63Cu': 71.118e6,
    '67Zn': 16.767e6,
    '129Xe': -73.997e6
  };

  function postProcessingNMR(entriesFlat) {
    // specific NMR functions
    let observeFrequency = 0;
    let shiftOffsetVal = 0;

    for (let entry of entriesFlat) {
      for (let spectrum of entry.spectra) {
        if (entry.ntuples && entry.ntuples.symbol) {
          if (!observeFrequency && spectrum.observeFrequency) {
            observeFrequency = spectrum.observeFrequency;
          }

          if (!shiftOffsetVal && spectrum.shiftOffsetVal) {
            shiftOffsetVal = spectrum.shiftOffsetVal;
          }
        } else {
          observeFrequency = spectrum.observeFrequency;
          shiftOffsetVal = spectrum.shiftOffsetVal;
        }

        if (observeFrequency) {
          if (spectrum.xUnits && spectrum.xUnits.toUpperCase().includes('HZ')) {
            spectrum.xUnits = 'PPM';
            spectrum.xFactor = spectrum.xFactor / observeFrequency;
            spectrum.firstX = spectrum.firstX / observeFrequency;
            spectrum.lastX = spectrum.lastX / observeFrequency;
            spectrum.deltaX = spectrum.deltaX / observeFrequency;

            for (let i = 0; i < spectrum.data.x.length; i++) {
              spectrum.data.x[i] /= observeFrequency;
            }
          }
        }

        if (shiftOffsetVal) {
          let shift = spectrum.firstX - shiftOffsetVal;
          spectrum.firstX = spectrum.firstX - shift;
          spectrum.lastX = spectrum.lastX - shift;

          for (let i = 0; i < spectrum.data.x.length; i++) {
            spectrum.data.x[i] -= shift;
          }
        }

        if (observeFrequency && entry.ntuples && entry.ntuples.symbol && entry.ntuples.nucleus) {
          let unit = '';
          let pageSymbolIndex = entry.ntuples.symbol.indexOf(spectrum.pageSymbol);

          if (entry.ntuples.units && entry.ntuples.units[pageSymbolIndex]) {
            unit = entry.ntuples.units[pageSymbolIndex];
          }

          if (unit !== 'PPM') {
            if (pageSymbolIndex !== 0) {
              throw Error('Not sure about this ntuples format');
            }

            let ratio0 = gyromagneticRatio[entry.ntuples.nucleus[0]];
            let ratio1 = gyromagneticRatio[entry.ntuples.nucleus[1]];

            if (!ratio0 || !ratio1) {
              throw Error('Problem with determination of gyromagnetic ratio');
            }

            let ratio = ratio0 / ratio1 * observeFrequency;
            spectrum.pageValue /= ratio;
          }
        }
      }
    }
  }

  function profiling(result, action, options) {
    if (result.profiling) {
      result.profiling.push({
        action,
        time: Date.now() - options.start
      });
    }
  }

  function simpleChromatogram(result) {
    let data = result.spectra[0].data;
    result.chromatogram = {
      times: data.x.slice(),
      series: {
        intensity: {
          dimension: 1,
          data: data.y.slice()
        }
      }
    };
  }

  function postProcessing(entriesFlat, result, options) {
    // converting Hz to ppm
    postProcessingNMR(entriesFlat);

    for (let entry of entriesFlat) {
      if (Object.keys(entry.ntuples).length > 0) {
        let newNtuples = [];
        let keys = Object.keys(entry.ntuples);

        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          let values = entry.ntuples[key];

          for (let j = 0; j < values.length; j++) {
            if (!newNtuples[j]) newNtuples[j] = {};
            newNtuples[j][key] = values[j];
          }
        }

        entry.ntuples = newNtuples;
      }

      if (entry.twoD && options.wantXY) {
        add2D(entry, options);
        profiling(result, 'Finished countour plot calculation', options);

        if (!options.keepSpectra) {
          delete entry.spectra;
        }
      } // maybe it is a GC (HPLC) / MS. In this case we add a new format


      if (options.chromatogram) {
        if (entry.spectra.length > 1) {
          complexChromatogram(entry);
        } else {
          simpleChromatogram(entry);
        }

        profiling(result, 'Finished chromatogram calculation', options);
      }
    }
  }

  function prepareNtuplesDatatable(currentEntry, spectrum, kind) {
    let xIndex = -1;
    let yIndex = -1;
    let firstVariable = '';
    let secondVariable = '';

    if (kind.indexOf('++') > 0) {
      firstVariable = kind.replace(/.*\(([a-zA-Z0-9]+)\+\+.*/, '$1');
      secondVariable = kind.replace(/.*\.\.([a-zA-Z0-9]+).*/, '$1');
    } else {
      kind = kind.replace(/[^a-zA-Z]/g, '');
      firstVariable = kind.charAt(0);
      secondVariable = kind.charAt(1);
      spectrum.variables = {};

      for (let symbol of kind) {
        let lowerCaseSymbol = symbol.toLowerCase();
        let index = currentEntry.ntuples.symbol.indexOf(symbol);
        if (index === -1) throw Error(`Symbol undefined: ${symbol}`);
        spectrum.variables[lowerCaseSymbol] = {};

        for (let key in currentEntry.ntuples) {
          if (currentEntry.ntuples[key][index]) {
            spectrum.variables[lowerCaseSymbol][key.replace(/^var/, '')] = currentEntry.ntuples[key][index];
          }
        }
      }
    }

    xIndex = currentEntry.ntuples.symbol.indexOf(firstVariable);
    yIndex = currentEntry.ntuples.symbol.indexOf(secondVariable);
    if (xIndex === -1) xIndex = 0;
    if (yIndex === -1) yIndex = 0;

    if (currentEntry.ntuples.first) {
      if (currentEntry.ntuples.first.length > xIndex) {
        spectrum.firstX = currentEntry.ntuples.first[xIndex];
      }

      if (currentEntry.ntuples.first.length > yIndex) {
        spectrum.firstY = currentEntry.ntuples.first[yIndex];
      }
    }

    if (currentEntry.ntuples.last) {
      if (currentEntry.ntuples.last.length > xIndex) {
        spectrum.lastX = currentEntry.ntuples.last[xIndex];
      }

      if (currentEntry.ntuples.last.length > yIndex) {
        spectrum.lastY = currentEntry.ntuples.last[yIndex];
      }
    }

    if (currentEntry.ntuples.vardim && currentEntry.ntuples.vardim.length > xIndex) {
      spectrum.nbPoints = currentEntry.ntuples.vardim[xIndex];
    }

    if (currentEntry.ntuples.factor) {
      if (currentEntry.ntuples.factor.length > xIndex) {
        spectrum.xFactor = currentEntry.ntuples.factor[xIndex];
      }

      if (currentEntry.ntuples.factor.length > yIndex) {
        spectrum.yFactor = currentEntry.ntuples.factor[yIndex];
      }
    }

    if (currentEntry.ntuples.units) {
      if (currentEntry.ntuples.units.length > xIndex) {
        if (currentEntry.ntuples.varname && currentEntry.ntuples.varname[xIndex]) {
          spectrum.xUnits = `${currentEntry.ntuples.varname[xIndex]} [${currentEntry.ntuples.units[xIndex]}]`;
        } else {
          spectrum.xUnits = currentEntry.ntuples.units[xIndex];
        }
      }

      if (currentEntry.ntuples.units.length > yIndex) {
        if (currentEntry.ntuples.varname && currentEntry.ntuples.varname[yIndex]) {
          spectrum.yUnits = `${currentEntry.ntuples.varname[yIndex]} [${currentEntry.ntuples.units[yIndex]}]`;
        } else {
          spectrum.yUnits = currentEntry.ntuples.units[yIndex];
        }
      }
    }
  }

  function prepareSpectrum(spectrum) {
    if (!spectrum.xFactor) spectrum.xFactor = 1;
    if (!spectrum.yFactor) spectrum.yFactor = 1;
  }

  const ntuplesSeparator = /[ \t]*,[ \t]*/;

  class Spectrum {}

  const defaultOptions = {
    keepRecordsRegExp: /^$/,
    canonicDataLabels: true,
    canonicMetadataLabels: false,
    dynamicTyping: true,
    withoutXY: false,
    chromatogram: false,
    keepSpectra: false,
    noContour: false,
    nbContourLevels: 7,
    noiseMultiplier: 5,
    profiling: false
  };
  /**
   *
   * @param {text} jcamp
   * @param {object} [options]
   * @param {number} [options.keepRecordsRegExp=/^$/] By default we don't keep meta information
   * @param {number} [options.canonicDataLabels=true] Canonize the Labels (uppercase without symbol)
   * @param {number} [options.canonicMetadataLabels=false] Canonize the metadata Labels (uppercase without symbol)
   * @param {number} [options.dynamicTyping=false] Convert numbers to Number
   * @param {number} [options.withoutXY=false] Remove the XY data
   * @param {number} [options.chromatogram=false] Special post-processing for GC / HPLC / MS
   * @param {number} [options.keepSpectra=false] Force to keep the spectra in case of 2D
   * @param {number} [options.noContour=false] Don't calculate countour in case of 2D
   * @param {number} [options.nbContourLevels=7] Number of positive / negative contour levels to calculate
   * @param {number} [options.noiseMultiplier=5] Define for 2D the level as 5 times the median as default
   * @param {number} [options.profiling=false] Add profiling information
   */

  function convert(jcamp, options = {}) {
    options = Object.assign({}, defaultOptions, options);
    options.wantXY = !options.withoutXY;
    options.start = Date.now();
    let entriesFlat = [];
    let result = {
      profiling: options.profiling ? [] : false,
      logs: [],
      entries: []
    };
    let tmpResult = {
      children: []
    };
    let currentEntry = tmpResult;
    let parentsStack = [];
    let spectrum = new Spectrum();

    if (typeof jcamp !== 'string') {
      throw new TypeError('the JCAMP should be a string');
    }

    profiling(result, 'Before split to LDRS', options);
    let ldrs = jcamp.replace(/[\r\n]+##/g, '\n##').split('\n##');
    profiling(result, 'Split to LDRS', options);
    if (ldrs[0]) ldrs[0] = ldrs[0].replace(/^[\r\n ]*##/, '');

    for (let ldr of ldrs) {
      // This is a new LDR
      let position = ldr.indexOf('=');
      let dataLabel = position > 0 ? ldr.substring(0, position) : ldr;
      let dataValue = position > 0 ? ldr.substring(position + 1).trim() : '';
      let canonicDataLabel = dataLabel.replace(/[_ -]/g, '').toUpperCase();

      if (canonicDataLabel === 'DATATABLE') {
        let endLine = dataValue.indexOf('\n');
        if (endLine === -1) endLine = dataValue.indexOf('\r');

        if (endLine > 0) {
          // ##DATA TABLE= (X++(I..I)), XYDATA
          // We need to find the variables
          let infos = dataValue.substring(0, endLine).split(/[ ,;\t]+/);
          prepareNtuplesDatatable(currentEntry, spectrum, infos[0]);
          spectrum.datatable = infos[0];

          if (infos[1] && infos[1].indexOf('PEAKS') > -1) {
            canonicDataLabel = 'PEAKTABLE';
          } else if (infos[1] && (infos[1].indexOf('XYDATA') || infos[0].indexOf('++') > 0)) {
            canonicDataLabel = 'XYDATA';
            spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
          }
        }
      }

      if (canonicDataLabel === 'XYDATA') {
        if (options.wantXY) {
          prepareSpectrum(spectrum); // well apparently we should still consider it is a PEAK TABLE if there are no '++' after

          if (dataValue.match(/.*\+\+.*/)) {
            // ex: (X++(Y..Y))
            if (!spectrum.deltaX) {
              spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
            }

            fastParseXYData(spectrum, dataValue);
          } else {
            parsePeakTable(spectrum, dataValue, result);
          }

          currentEntry.spectra.push(spectrum);
          spectrum = new Spectrum();
        }

        continue;
      } else if (canonicDataLabel === 'PEAKTABLE') {
        if (options.wantXY) {
          prepareSpectrum(spectrum);
          parsePeakTable(spectrum, dataValue, result);
          currentEntry.spectra.push(spectrum);
          spectrum = new Spectrum();
        }

        continue;
      }

      if (canonicDataLabel === 'PEAKASSIGNMENTS') {
        if (options.wantXY) {
          if (dataValue.match(/.*(XYA).*/)) {
            // ex: (XYA)
            parseXYA(spectrum, dataValue);
          }

          currentEntry.spectra.push(spectrum);
          spectrum = new Spectrum();
        }

        continue;
      }

      if (canonicDataLabel === 'TITLE') {
        let parentEntry = currentEntry;

        if (!parentEntry.children) {
          parentEntry.children = [];
        }

        currentEntry = {
          spectra: [],
          ntuples: {},
          info: {},
          meta: {}
        };
        parentEntry.children.push(currentEntry);
        parentsStack.push(parentEntry);
        entriesFlat.push(currentEntry);
        currentEntry.title = dataValue;
      } else if (canonicDataLabel === 'DATATYPE') {
        currentEntry.dataType = dataValue;

        if (dataValue.toLowerCase().indexOf('nd') > -1) {
          currentEntry.twoD = true;
        }
      } else if (canonicDataLabel === 'NTUPLES') {
        if (dataValue.toLowerCase().indexOf('nd') > -1) {
          currentEntry.twoD = true;
        }
      } else if (canonicDataLabel === 'DATACLASS') {
        currentEntry.dataClass = dataValue;
      } else if (canonicDataLabel === 'XUNITS') {
        spectrum.xUnits = dataValue;
      } else if (canonicDataLabel === 'YUNITS') {
        spectrum.yUnits = dataValue;
      } else if (canonicDataLabel === 'FIRSTX') {
        spectrum.firstX = parseFloat(dataValue);
      } else if (canonicDataLabel === 'LASTX') {
        spectrum.lastX = parseFloat(dataValue);
      } else if (canonicDataLabel === 'FIRSTY') {
        spectrum.firstY = parseFloat(dataValue);
      } else if (canonicDataLabel === 'LASTY') {
        spectrum.lastY = parseFloat(dataValue);
      } else if (canonicDataLabel === 'NPOINTS') {
        spectrum.nbPoints = parseFloat(dataValue);
      } else if (canonicDataLabel === 'XFACTOR') {
        spectrum.xFactor = parseFloat(dataValue);
      } else if (canonicDataLabel === 'YFACTOR') {
        spectrum.yFactor = parseFloat(dataValue);
      } else if (canonicDataLabel === 'MAXX') {
        spectrum.maxX = parseFloat(dataValue);
      } else if (canonicDataLabel === 'MINX') {
        spectrum.minX = parseFloat(dataValue);
      } else if (canonicDataLabel === 'MAXY') {
        spectrum.maxY = parseFloat(dataValue);
      } else if (canonicDataLabel === 'MINY') {
        spectrum.minY = parseFloat(dataValue);
      } else if (canonicDataLabel === 'DELTAX') {
        spectrum.deltaX = parseFloat(dataValue);
      } else if (canonicDataLabel === '.OBSERVEFREQUENCY' || canonicDataLabel === '$SFO1') {
        if (!spectrum.observeFrequency) {
          spectrum.observeFrequency = parseFloat(dataValue);
        }
      } else if (canonicDataLabel === '.OBSERVENUCLEUS') {
        if (!spectrum.xType) {
          currentEntry.xType = dataValue.replace(/[^a-zA-Z0-9]/g, '');
        }
      } else if (canonicDataLabel === '$OFFSET') {
        // OFFSET for Bruker spectra
        currentEntry.shiftOffsetNum = 0;

        if (!spectrum.shiftOffsetVal) {
          spectrum.shiftOffsetVal = parseFloat(dataValue);
        }
      } else if (canonicDataLabel === '$REFERENCEPOINT') ; else if (canonicDataLabel === 'VARNAME') {
        currentEntry.ntuples.varname = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'SYMBOL') {
        currentEntry.ntuples.symbol = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'VARTYPE') {
        currentEntry.ntuples.vartype = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'VARFORM') {
        currentEntry.ntuples.varform = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'VARDIM') {
        currentEntry.ntuples.vardim = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'UNITS') {
        currentEntry.ntuples.units = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'FACTOR') {
        currentEntry.ntuples.factor = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'FIRST') {
        currentEntry.ntuples.first = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'LAST') {
        currentEntry.ntuples.last = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'MIN') {
        currentEntry.ntuples.min = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'MAX') {
        currentEntry.ntuples.max = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === '.NUCLEUS') {
        if (currentEntry.ntuples) {
          currentEntry.ntuples.nucleus = dataValue.split(ntuplesSeparator);
        }

        if (currentEntry.twoD) {
          currentEntry.yType = dataValue.split(ntuplesSeparator)[0];
        }
      } else if (canonicDataLabel === 'PAGE') {
        spectrum.page = dataValue.trim();
        spectrum.pageValue = parseFloat(dataValue.replace(/^.*=/, ''));
        spectrum.pageSymbol = spectrum.page.replace(/[=].*/, '');
      } else if (canonicDataLabel === 'RETENTIONTIME') {
        spectrum.pageValue = parseFloat(dataValue);
      } else if (isMSField(canonicDataLabel)) {
        spectrum[convertMSFieldToLabel(canonicDataLabel)] = dataValue;
      } else if (canonicDataLabel === 'SAMPLEDESCRIPTION') {
        spectrum.sampleDescription = dataValue;
      } else if (canonicDataLabel === 'END') {
        currentEntry = parentsStack.pop();
      }

      if (currentEntry && currentEntry.info && currentEntry.meta && canonicDataLabel.match(options.keepRecordsRegExp)) {
        let value = dataValue.trim();
        let target, label;

        if (dataLabel.startsWith('$')) {
          label = options.canonicMetadataLabels ? canonicDataLabel.substring(1) : dataLabel.substring(1);
          target = currentEntry.meta;
        } else {
          label = options.canonicDataLabels ? canonicDataLabel : dataLabel;
          target = currentEntry.info;
        }

        if (options.dynamicTyping) {
          let parsedValue = Number.parseFloat(value);
          if (!Number.isNaN(parsedValue)) value = parsedValue;
        }

        if (target[label]) {
          if (!Array.isArray(target[label])) {
            target[label] = [target[label]];
          }

          target[label].push(value);
        } else {
          target[label] = value;
        }
      }
    }

    profiling(result, 'Finished parsing', options);
    postProcessing(entriesFlat, result, options);
    profiling(result, 'Total time', options);
    /*
    if (result.children && result.children.length>0) {
      result = { ...result, ...result.children[0] };
    }
    */

    result.entries = tmpResult.children;
    result.flatten = entriesFlat;
    return result;
  }

  function getJcampKind(data) {
    let dataType = data.dataType.toLowerCase();
    let yUnits = data.spectra[0].yUnits.toLowerCase();

    if (dataType.match(/infrared/)) {
      if (yUnits.match(/absorbance/)) {
        return IR_ABSORBANCE;
      } else {
        return IR_TRANSMITTANCE;
      }
    }

    return undefined;
  }
  const IR_TRANSMITTANCE = {
    normalization: {},
    importation: {
      converter: transmittance => -Math.log10(transmittance)
    },
    kind: 'Infrared',
    display: {
      xLabel: 'wavelength [cm-1]',
      xInverted: true,
      yLabel: 'Absorbance'
    }
  };
  const IR_ABSORBANCE = {
    normalization: {},
    kind: 'Infrared',
    display: {
      xLabel: 'wavelength [cm-1]',
      xInverted: true,
      yLabel: 'Absorbance'
    }
  };

  /**
   * Create a spectrum from a jcamp
   * @param {string} jcampText - String containing the JCAMP data
   * @return {Spectrum} - new instance of Spectrum with the provided data
   */

  function jcamp(jcampText) {
    const parsed = convert(jcampText, {
      xy: true,
      keepRecordsRegExp: /TITLE/
    }).flatten[0];
    const kind = getJcampKind(parsed);
    const data = parsed.spectra[0].data;
    const meta = parsed.info; // we convert the data

    if (kind && kind.importation && kind.importation.converter) {
      data.y = data.y.map(kind.importation.converter);
    }

    return {
      data,
      kind,
      meta
    };
  }

  /**
   * Creates a g
   * @param {string} text - String containing the text data
   * @param {object} [options={}]
   * @param {string} [options.fs='\t'] Field separator
   * @return {object} - {matrix, data, x, ids}
   */
  function matrix(text, options = {}) {
    const lines = text.split(/[\r\n]+/).filter(value => value);
    const {
      fs = '\t'
    } = options;
    let currentMatrix = [];
    let ids = [];
    let meta = [];
    let x = [];
    let headers = lines[0].split(fs);
    let labels = [];

    for (let i = 0; i < headers.length; i++) {
      let header = headers[i];

      if (isNaN(header)) {
        labels[i] = header;
      } else {
        x = headers.slice(i).map(value => Number(value));
        break;
      }
    }

    for (let i = 1; i < lines.length; i++) {
      let line = lines[i];
      let parts = line.split('\t');
      ids.push(parts[0]);
      let oneMeta = {};
      meta.push(oneMeta);

      for (let j = 1; j < parts.length; j++) {
        if (j < labels.length) {
          oneMeta[labels[j]] = parts[j];
        } else {
          currentMatrix.push(parts.slice(labels.length).map(value => Number(value)));
          break;
        }
      }
    }

    return {
      x,
      meta,
      matrix: currentMatrix,
      ids
    };
  }

  /**
   * In place modification of the 2 arrays to make X unique and sum the Y if X has the same value
   * @param {object} [points={}] : Object of points contains property x (an array) and y (an array)
   * @return points
   */
  function uniqueX(points = {}) {
    const {
      x,
      y
    } = points;
    if (x.length < 2) return;

    if (x.length !== y.length) {
      throw new Error('The X and Y arrays mush have the same length');
    }

    let current = x[0];
    let counter = 0;

    for (let i = 1; i < x.length; i++) {
      if (current !== x[i]) {
        counter++;
        current = x[i];
        x[counter] = x[i];

        if (i !== counter) {
          y[counter] = 0;
        }
      }

      if (i !== counter) {
        y[counter] += y[i];
      }
    }

    x.length = counter + 1;
    y.length = counter + 1;
  }

  /**
   * Parse a text-file and convert it to an array of XY points
   * @param {string} text - csv or tsv strings
   * @param {object} [options={}]
   * @param {boolean} [options.rescale = false] - will set the maximum value to 1
   * @param {boolean} [options.uniqueX = false] - Make the X values unique (works only with 'xxyy' format). If the X value is repeated the sum of Y is done.
   * @param {number} [options.xColumn = 0] - A number that specifies the x column
   * @param {number} [options.yColumn = 1] - A number that specifies the y column
   * @param {number} [options.maxNumberColumns = (Math.max(xColumn, yColumn)+1)] - A number that specifies the maximum number of y columns
   * @param {number} [options.minNumberColumns = (Math.min(xColumn, yColumn)+1)] - A number that specifies the minimum number of y columns
   * @param {boolean} [options.keepInfo = false] - shoud we keep the non numeric lines. In this case the system will return an object {data, info}
   * @return {object{x:<Array<number>>,y:<Array<number>>}
   */

  function parseXY$1(text, options = {}) {
    let {
      rescale = false,
      uniqueX: uniqueX$1 = false,
      xColumn = 0,
      yColumn = 1,
      keepInfo = false,
      maxNumberColumns = Number.MAX_SAFE_INTEGER,
      minNumberColumns = 2
    } = options;
    maxNumberColumns = Math.max(maxNumberColumns, xColumn + 1, yColumn + 1);
    minNumberColumns = Math.max(xColumn + 1, yColumn + 1, minNumberColumns);
    let lines = text.split(/[\r\n]+/);
    let maxY = Number.MIN_VALUE;
    let result = {
      x: [],
      y: []
    };
    let info = [];

    for (let l = 0; l < lines.length; l++) {
      let line = lines[l].trim(); // we will consider only lines that contains only numbers

      if (line.match(/[0-9]+/) && line.match(/^[0-9eE,;. \t+-]+$/)) {
        let fields = line.split(/,[; \t]+|[; \t]+/);

        if (fields.length === 1) {
          fields = line.split(/[,; \t]+/);
        }

        if (fields && fields.length >= minNumberColumns && fields.length <= maxNumberColumns) {
          let x = parseFloat(fields[xColumn].replace(',', '.'));
          let y = parseFloat(fields[yColumn].replace(',', '.'));
          if (y > maxY) maxY = y;
          result.x.push(x);
          result.y.push(y);
        }
      } else if (line) {
        info.push({
          position: result.x.length,
          value: line
        });
      }
    }

    if (uniqueX$1) {
      uniqueX(result);
    }

    if (rescale) {
      for (let i = 0; i < result.y.length; i++) {
        result.y[i] /= maxY;
      }
    }

    if (!keepInfo) return result;
    return {
      info,
      data: result
    };
  }

  /**
   * Create a spectrum from a text file
   * @param {string} value - String containing the JCAMP data
   * @return {Spectrum} - new instance of Spectrum with the provided data
   */

  function text(value, options = {}) {
    const {
      kind,
      parserOptions = {}
    } = options;
    const data = parseXY$1(value, parserOptions); // we convert the data

    if (kind && kind.importation && kind.importation.converter) {
      data.y = data.y.map(kind.importation.converter);
    }

    return {
      data
    };
  }

  /**
   * @private
   */

  function getAutocorrelation(normalized, index) {
    let matrix = normalized.matrix;
    let nbRow = matrix.length;
    let nbColumn = matrix[0].length;
    let array1 = new Float64Array(nbRow);
    let array2 = new Float64Array(nbRow);
    let result = new Array(nbColumn);

    for (let j = 0; j < nbRow; j++) {
      array1[j] = matrix[j][index];
    }

    for (let i = 0; i < nbColumn; i++) {
      for (let j = 0; j < nbRow; j++) {
        array2[j] = matrix[j][i];
      }

      result[i] = xCorrelation(array1, array2);
    }

    return {
      x: normalized.x,
      y: result
    };
  }

  /**
   * @private
   */

  function getMeanData(normalized) {
    let matrix = new Matrix(normalized.matrix);
    return {
      x: normalized.x,
      y: matrix.mean('column')
    };
  }

  /**
   * @private
   * @param {*} spectra
   * @param {object} [options={}]
   * @param {string} [options.fs='\t'] field separator
   * @param {string} [options.rs='\n'] record (line) separator
   */

  function getNormalizedText(spectra, options = {}) {
    let {
      fs = '\t',
      rs = '\n'
    } = options;
    let {
      matrix,
      meta,
      ids,
      x
    } = getNormalizedData(spectra);
    let allKeysObject = {};

    for (let metum of meta) {
      for (let key of Object.keys(metum)) {
        let type = typeof metum[key];

        if (type === 'number' || type === 'string' || type === 'boolean') {
          allKeysObject[key] = true;
        }
      }
    }

    let allKeys = Object.keys(allKeysObject);
    let lines = [];
    let line = [];
    line.push('id', ...allKeys, ...x);
    lines.push(line.join(fs));

    for (let i = 0; i < ids.length; i++) {
      line = [];
      line.push(ids[i]);

      for (let key of allKeys) {
        line.push(meta[i][key]);
      }

      line.push(...matrix[i]);
      lines.push(line.join(fs));
    }

    return lines.join(rs);
  }

  function getFromToIndex(xs, range) {
    let {
      from,
      to
    } = range;

    if (from === undefined) {
      from = xs[0];
    }

    if (to === undefined) {
      to = xs[xs.length - 1];
    }

    return {
      fromIndex: xFindClosestIndex(xs, from),
      toIndex: xFindClosestIndex(xs, to)
    };
  }

  function max$1(spectra, targetSpectrum, range = {}) {
    let fromToIndex = getFromToIndex(targetSpectrum.normalized.x, range);
    let targetValue = xyMaxYPoint(targetSpectrum.normalized, fromToIndex).y;
    let values = spectra.map(spectrum => xyMaxYPoint(spectrum.normalized, fromToIndex).y);
    let matrix = [];

    for (let i = 0; i < spectra.length; i++) {
      let spectrum = spectra[i];
      let factor = targetValue / values[i];
      matrix.push(xMultiply(spectrum.normalized.y, factor));
    }

    return matrix;
  }

  function min$1(spectra, targetSpectrum, range = {}) {
    let fromToIndex = getFromToIndex(targetSpectrum.normalized.x, range);
    let targetValue = xyMinYPoint(targetSpectrum.normalized, fromToIndex).y;
    let values = spectra.map(spectrum => xyMinYPoint(spectrum.normalized, fromToIndex).y);
    let matrix = [];

    for (let i = 0; i < spectra.length; i++) {
      let spectrum = spectra[i];
      let factor = targetValue / values[i];
      matrix.push(xMultiply(spectrum.normalized.y, factor));
    }

    return matrix;
  }

  function maybeToPrecision(value, digits) {
    if (value < 0) {
      value = 0 - value;

      if (typeof digits === 'number') {
        return `- ${value.toPrecision(digits)}`;
      } else {
        return `- ${value.toString()}`;
      }
    } else {
      if (typeof digits === 'number') {
        return value.toPrecision(digits);
      } else {
        return value.toString();
      }
    }
  }

  function checkArraySize(x, y) {
    if (!src(x) || !src(y)) {
      throw new TypeError('x and y must be arrays');
    }

    if (x.length !== y.length) {
      throw new RangeError('x and y arrays must have the same length');
    }
  }

  class BaseRegression {
    constructor() {
      if (new.target === BaseRegression) {
        throw new Error('BaseRegression must be subclassed');
      }
    }

    predict(x) {
      if (typeof x === 'number') {
        return this._predict(x);
      } else if (src(x)) {
        const y = [];

        for (let i = 0; i < x.length; i++) {
          y.push(this._predict(x[i]));
        }

        return y;
      } else {
        throw new TypeError('x must be a number or array');
      }
    }

    _predict() {
      throw new Error('_predict must be implemented');
    }

    train() {// Do nothing for this package
    }

    toString() {
      return '';
    }

    toLaTeX() {
      return '';
    }
    /**
     * Return the correlation coefficient of determination (r) and chi-square.
     * @param {Array<number>} x
     * @param {Array<number>} y
     * @return {object}
     */


    score(x, y) {
      if (!src(x) || !src(y) || x.length !== y.length) {
        throw new Error('x and y must be arrays of the same length');
      }

      const n = x.length;
      const y2 = new Array(n);

      for (let i = 0; i < n; i++) {
        y2[i] = this._predict(x[i]);
      }

      let xSum = 0;
      let ySum = 0;
      let chi2 = 0;
      let rmsd = 0;
      let xSquared = 0;
      let ySquared = 0;
      let xY = 0;

      for (let i = 0; i < n; i++) {
        xSum += y2[i];
        ySum += y[i];
        xSquared += y2[i] * y2[i];
        ySquared += y[i] * y[i];
        xY += y2[i] * y[i];

        if (y[i] !== 0) {
          chi2 += (y[i] - y2[i]) * (y[i] - y2[i]) / y[i];
        }

        rmsd += (y[i] - y2[i]) * (y[i] - y2[i]);
      }

      const r = (n * xY - xSum * ySum) / Math.sqrt((n * xSquared - xSum * xSum) * (n * ySquared - ySum * ySum));
      return {
        r: r,
        r2: r * r,
        chi2: chi2,
        rmsd: Math.sqrt(rmsd / n)
      };
    }

  }

  class SimpleLinearRegression extends BaseRegression {
    constructor(x, y) {
      super();

      if (x === true) {
        this.slope = y.slope;
        this.intercept = y.intercept;
        this.coefficients = [y.intercept, y.slope];
      } else {
        checkArraySize(x, y);
        regress(this, x, y);
      }
    }

    toJSON() {
      return {
        name: 'simpleLinearRegression',
        slope: this.slope,
        intercept: this.intercept
      };
    }

    _predict(x) {
      return this.slope * x + this.intercept;
    }

    computeX(y) {
      return (y - this.intercept) / this.slope;
    }

    toString(precision) {
      let result = 'f(x) = ';

      if (this.slope !== 0) {
        const xFactor = maybeToPrecision(this.slope, precision);
        result += `${xFactor === '1' ? '' : `${xFactor} * `}x`;

        if (this.intercept !== 0) {
          const absIntercept = Math.abs(this.intercept);
          const operator = absIntercept === this.intercept ? '+' : '-';
          result += ` ${operator} ${maybeToPrecision(absIntercept, precision)}`;
        }
      } else {
        result += maybeToPrecision(this.intercept, precision);
      }

      return result;
    }

    toLaTeX(precision) {
      return this.toString(precision);
    }

    static load(json) {
      if (json.name !== 'simpleLinearRegression') {
        throw new TypeError('not a SLR model');
      }

      return new SimpleLinearRegression(true, json);
    }

  }

  function regress(slr, x, y) {
    const n = x.length;
    let xSum = 0;
    let ySum = 0;
    let xSquared = 0;
    let xY = 0;

    for (let i = 0; i < n; i++) {
      xSum += x[i];
      ySum += y[i];
      xSquared += x[i] * x[i];
      xY += x[i] * y[i];
    }

    const numerator = n * xY - xSum * ySum;
    slr.slope = numerator / (n * xSquared - xSum * xSum);
    slr.intercept = 1 / n * ySum - slr.slope * (1 / n) * xSum;
    slr.coefficients = [slr.intercept, slr.slope];
  }

  function minMax(spectra, targetSpectrum, range = {}) {
    let fromToIndex = getFromToIndex(targetSpectrum.normalized.x, range);
    let targetValue = {
      min: xyMinYPoint(targetSpectrum.normalized, fromToIndex).y,
      max: xyMaxYPoint(targetSpectrum.normalized, fromToIndex).y
    };
    let values = spectra.map(spectrum => {
      return {
        min: xyMinYPoint(spectrum.normalized, fromToIndex).y,
        max: xyMaxYPoint(spectrum.normalized, fromToIndex).y
      };
    });
    let matrix = [];

    for (let i = 0; i < spectra.length; i++) {
      let spectrum = spectra[i];
      const regression = new SimpleLinearRegression([targetValue.min, targetValue.max], [values[i].min, values[i].max]);
      let length = spectrum.normalized.y.length;
      let scaled = new Array(length);

      for (let j = 0; j < length; j++) {
        scaled[j] = regression.computeX(spectrum.normalized.y[j]);
      }

      matrix.push(scaled);
    }

    return matrix;
  }

  function range(spectra, targetSpectrum, currentrange = {}) {
    let fromToIndex = getFromToIndex(targetSpectrum.normalized.x, currentrange);
    let targetValue = xyIntegration(targetSpectrum.normalized, fromToIndex);
    let values = spectra.map(spectrum => xyIntegration(spectrum.normalized, fromToIndex));
    let matrix = [];

    for (let i = 0; i < spectra.length; i++) {
      let spectrum = spectra[i];
      let factor = targetValue / values[i];
      matrix.push(xMultiply(spectrum.normalized.y, factor));
    }

    return matrix;
  }

  /**
   * @private
   * @param {Array<Spectrum>} spectra
   * @param {object} [options={}] scale spectra based on various parameters
   * @param {object} [options.range] from - to
   * @param {Array} [options.ids] ids of selected spectra
   * @param {string} [options.targetID=spectra[0].id]
   * @param {string} [options.method='max'] min, max, range, minMax
   * @param {boolean} [options.relative=false]
   * @param {Array} [options.ranges] Array of object containing {from:'', to:'', label:''}
   * @param {Array} [options.calculations] Array of object containing {label:'', formula:''}
   * @returns {object} { ids:[], matrix:[Array], meta:[object], x:[], ranges:[object] }
   */

  function getScaledData(spectraProcessor, options = {}) {
    if (!spectraProcessor.spectra || !spectraProcessor.spectra[0]) return {};
    const {
      range: range$1,
      targetID,
      relative,
      method,
      ids,
      ranges,
      calculations
    } = options;
    let targetSpectrum = spectraProcessor.getSpectrum(targetID) || spectraProcessor.spectra[0];
    let spectra = spectraProcessor.getSpectra(ids);
    let result;

    if (method === '' || method === undefined) {
      result = getNormalizedData(spectra);
    } else {
      let matrix;

      switch (method.toLowerCase()) {
        case 'min':
          matrix = min$1(spectra, targetSpectrum, range$1);
          break;

        case 'max':
          matrix = max$1(spectra, targetSpectrum, range$1);
          break;

        case 'minmax':
          matrix = minMax(spectra, targetSpectrum, range$1);
          break;

        case 'range':
          matrix = range(spectra, targetSpectrum, range$1);
          break;

        default:
          throw new Error(`getScaledData: unknown method: ${method}`);
      }

      let meta = [];
      let currentIDs = [];

      for (let spectrum of spectra) {
        currentIDs.push(spectrum.id);
        meta.push(spectrum.meta);
      }

      let x = spectra[0].normalized.x;
      result = {
        ids: currentIDs,
        matrix,
        meta,
        x
      };
    }

    if (relative) {
      for (let i = 0; i < result.matrix.length; i++) {
        result.matrix[i] = xSubtract(result.matrix[i], targetSpectrum.normalized.y);
      }
    }

    if (ranges) {
      result.ranges = [];

      for (let i = 0; i < result.matrix.length; i++) {
        let rangesCopy = JSON.parse(JSON.stringify(ranges));
        let yNormalized = result.matrix[i];
        let resultRanges = {};
        result.ranges.push(resultRanges);

        for (let currentRange of rangesCopy) {
          if (currentRange.label) {
            let fromToIndex = getFromToIndex(targetSpectrum.normalized.x, currentRange);
            currentRange.integration = xyIntegration({
              x: result.x,
              y: yNormalized
            }, fromToIndex);
            currentRange.maxPoint = xyMaxYPoint({
              x: result.x,
              y: yNormalized
            }, fromToIndex);
            resultRanges[currentRange.label] = currentRange;
          }
        }
      }
    }

    if (calculations && result.ranges) {
      result.calculations = result.ranges.map(() => {
        return {};
      });
      const parameters = Object.keys(result.ranges[0]);

      for (let calculation of calculations) {
        // eslint-disable-next-line no-new-func
        const callback = new Function(...parameters, `return ${calculation.formula}`);

        for (let i = 0; i < result.ranges.length; i++) {
          let oneRanges = result.ranges[i];
          let values = parameters.map(key => oneRanges[key].integration);
          result.calculations[i][calculation.label] = callback(...values);
        }
      }
    }

    return result;
  }

  var array = createCommonjsModule(function (module, exports) {

    function compareNumbers(a, b) {
      return a - b;
    }
    /**
     * Computes the sum of the given values
     * @param {Array} values
     * @returns {number}
     */


    exports.sum = function sum(values) {
      var sum = 0;

      for (var i = 0; i < values.length; i++) {
        sum += values[i];
      }

      return sum;
    };
    /**
     * Computes the maximum of the given values
     * @param {Array} values
     * @returns {number}
     */


    exports.max = function max(values) {
      var max = values[0];
      var l = values.length;

      for (var i = 1; i < l; i++) {
        if (values[i] > max) max = values[i];
      }

      return max;
    };
    /**
     * Computes the minimum of the given values
     * @param {Array} values
     * @returns {number}
     */


    exports.min = function min(values) {
      var min = values[0];
      var l = values.length;

      for (var i = 1; i < l; i++) {
        if (values[i] < min) min = values[i];
      }

      return min;
    };
    /**
     * Computes the min and max of the given values
     * @param {Array} values
     * @returns {{min: number, max: number}}
     */


    exports.minMax = function minMax(values) {
      var min = values[0];
      var max = values[0];
      var l = values.length;

      for (var i = 1; i < l; i++) {
        if (values[i] < min) min = values[i];
        if (values[i] > max) max = values[i];
      }

      return {
        min: min,
        max: max
      };
    };
    /**
     * Computes the arithmetic mean of the given values
     * @param {Array} values
     * @returns {number}
     */


    exports.arithmeticMean = function arithmeticMean(values) {
      var sum = 0;
      var l = values.length;

      for (var i = 0; i < l; i++) {
        sum += values[i];
      }

      return sum / l;
    };
    /**
     * {@link arithmeticMean}
     */


    exports.mean = exports.arithmeticMean;
    /**
     * Computes the geometric mean of the given values
     * @param {Array} values
     * @returns {number}
     */

    exports.geometricMean = function geometricMean(values) {
      var mul = 1;
      var l = values.length;

      for (var i = 0; i < l; i++) {
        mul *= values[i];
      }

      return Math.pow(mul, 1 / l);
    };
    /**
     * Computes the mean of the log of the given values
     * If the return value is exponentiated, it gives the same result as the
     * geometric mean.
     * @param {Array} values
     * @returns {number}
     */


    exports.logMean = function logMean(values) {
      var lnsum = 0;
      var l = values.length;

      for (var i = 0; i < l; i++) {
        lnsum += Math.log(values[i]);
      }

      return lnsum / l;
    };
    /**
     * Computes the weighted grand mean for a list of means and sample sizes
     * @param {Array} means - Mean values for each set of samples
     * @param {Array} samples - Number of original values for each set of samples
     * @returns {number}
     */


    exports.grandMean = function grandMean(means, samples) {
      var sum = 0;
      var n = 0;
      var l = means.length;

      for (var i = 0; i < l; i++) {
        sum += samples[i] * means[i];
        n += samples[i];
      }

      return sum / n;
    };
    /**
     * Computes the truncated mean of the given values using a given percentage
     * @param {Array} values
     * @param {number} percent - The percentage of values to keep (range: [0,1])
     * @param {boolean} [alreadySorted=false]
     * @returns {number}
     */


    exports.truncatedMean = function truncatedMean(values, percent, alreadySorted) {
      if (alreadySorted === undefined) alreadySorted = false;

      if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
      }

      var l = values.length;
      var k = Math.floor(l * percent);
      var sum = 0;

      for (var i = k; i < l - k; i++) {
        sum += values[i];
      }

      return sum / (l - 2 * k);
    };
    /**
     * Computes the harmonic mean of the given values
     * @param {Array} values
     * @returns {number}
     */


    exports.harmonicMean = function harmonicMean(values) {
      var sum = 0;
      var l = values.length;

      for (var i = 0; i < l; i++) {
        if (values[i] === 0) {
          throw new RangeError('value at index ' + i + 'is zero');
        }

        sum += 1 / values[i];
      }

      return l / sum;
    };
    /**
     * Computes the contraharmonic mean of the given values
     * @param {Array} values
     * @returns {number}
     */


    exports.contraHarmonicMean = function contraHarmonicMean(values) {
      var r1 = 0;
      var r2 = 0;
      var l = values.length;

      for (var i = 0; i < l; i++) {
        r1 += values[i] * values[i];
        r2 += values[i];
      }

      if (r2 < 0) {
        throw new RangeError('sum of values is negative');
      }

      return r1 / r2;
    };
    /**
     * Computes the median of the given values
     * @param {Array} values
     * @param {boolean} [alreadySorted=false]
     * @returns {number}
     */


    exports.median = function median(values, alreadySorted) {
      if (alreadySorted === undefined) alreadySorted = false;

      if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
      }

      var l = values.length;
      var half = Math.floor(l / 2);

      if (l % 2 === 0) {
        return (values[half - 1] + values[half]) * 0.5;
      } else {
        return values[half];
      }
    };
    /**
     * Computes the variance of the given values
     * @param {Array} values
     * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
     * @returns {number}
     */


    exports.variance = function variance(values, unbiased) {
      if (unbiased === undefined) unbiased = true;
      var theMean = exports.mean(values);
      var theVariance = 0;
      var l = values.length;

      for (var i = 0; i < l; i++) {
        var x = values[i] - theMean;
        theVariance += x * x;
      }

      if (unbiased) {
        return theVariance / (l - 1);
      } else {
        return theVariance / l;
      }
    };
    /**
     * Computes the standard deviation of the given values
     * @param {Array} values
     * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
     * @returns {number}
     */


    exports.standardDeviation = function standardDeviation(values, unbiased) {
      return Math.sqrt(exports.variance(values, unbiased));
    };

    exports.standardError = function standardError(values) {
      return exports.standardDeviation(values) / Math.sqrt(values.length);
    };
    /**
     * IEEE Transactions on biomedical engineering, vol. 52, no. 1, january 2005, p. 76-
     * Calculate the standard deviation via the Median of the absolute deviation
     *  The formula for the standard deviation only holds for Gaussian random variables.
     * @returns {{mean: number, stdev: number}}
     */


    exports.robustMeanAndStdev = function robustMeanAndStdev(y) {
      var mean = 0,
          stdev = 0;
      var length = y.length,
          i = 0;

      for (i = 0; i < length; i++) {
        mean += y[i];
      }

      mean /= length;
      var averageDeviations = new Array(length);

      for (i = 0; i < length; i++) averageDeviations[i] = Math.abs(y[i] - mean);

      averageDeviations.sort(compareNumbers);

      if (length % 2 === 1) {
        stdev = averageDeviations[(length - 1) / 2] / 0.6745;
      } else {
        stdev = 0.5 * (averageDeviations[length / 2] + averageDeviations[length / 2 - 1]) / 0.6745;
      }

      return {
        mean: mean,
        stdev: stdev
      };
    };

    exports.quartiles = function quartiles(values, alreadySorted) {
      if (typeof alreadySorted === 'undefined') alreadySorted = false;

      if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
      }

      var quart = values.length / 4;
      var q1 = values[Math.ceil(quart) - 1];
      var q2 = exports.median(values, true);
      var q3 = values[Math.ceil(quart * 3) - 1];
      return {
        q1: q1,
        q2: q2,
        q3: q3
      };
    };

    exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
      return Math.sqrt(exports.pooledVariance(samples, unbiased));
    };

    exports.pooledVariance = function pooledVariance(samples, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var sum = 0;
      var length = 0,
          l = samples.length;

      for (var i = 0; i < l; i++) {
        var values = samples[i];
        var vari = exports.variance(values);
        sum += (values.length - 1) * vari;
        if (unbiased) length += values.length - 1;else length += values.length;
      }

      return sum / length;
    };

    exports.mode = function mode(values) {
      var l = values.length,
          itemCount = new Array(l),
          i;

      for (i = 0; i < l; i++) {
        itemCount[i] = 0;
      }

      var itemArray = new Array(l);
      var count = 0;

      for (i = 0; i < l; i++) {
        var index = itemArray.indexOf(values[i]);
        if (index >= 0) itemCount[index]++;else {
          itemArray[count] = values[i];
          itemCount[count] = 1;
          count++;
        }
      }

      var maxValue = 0,
          maxIndex = 0;

      for (i = 0; i < count; i++) {
        if (itemCount[i] > maxValue) {
          maxValue = itemCount[i];
          maxIndex = i;
        }
      }

      return itemArray[maxIndex];
    };

    exports.covariance = function covariance(vector1, vector2, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var mean1 = exports.mean(vector1);
      var mean2 = exports.mean(vector2);
      if (vector1.length !== vector2.length) throw 'Vectors do not have the same dimensions';
      var cov = 0,
          l = vector1.length;

      for (var i = 0; i < l; i++) {
        var x = vector1[i] - mean1;
        var y = vector2[i] - mean2;
        cov += x * y;
      }

      if (unbiased) return cov / (l - 1);else return cov / l;
    };

    exports.skewness = function skewness(values, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var theMean = exports.mean(values);
      var s2 = 0,
          s3 = 0,
          l = values.length;

      for (var i = 0; i < l; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s3 += dev * dev * dev;
      }

      var m2 = s2 / l;
      var m3 = s3 / l;
      var g = m3 / Math.pow(m2, 3 / 2.0);

      if (unbiased) {
        var a = Math.sqrt(l * (l - 1));
        var b = l - 2;
        return a / b * g;
      } else {
        return g;
      }
    };

    exports.kurtosis = function kurtosis(values, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var theMean = exports.mean(values);
      var n = values.length,
          s2 = 0,
          s4 = 0;

      for (var i = 0; i < n; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s4 += dev * dev * dev * dev;
      }

      var m2 = s2 / n;
      var m4 = s4 / n;

      if (unbiased) {
        var v = s2 / (n - 1);
        var a = n * (n + 1) / ((n - 1) * (n - 2) * (n - 3));
        var b = s4 / (v * v);
        var c = (n - 1) * (n - 1) / ((n - 2) * (n - 3));
        return a * b - 3 * c;
      } else {
        return m4 / (m2 * m2) - 3;
      }
    };

    exports.entropy = function entropy(values, eps) {
      if (typeof eps === 'undefined') eps = 0;
      var sum = 0,
          l = values.length;

      for (var i = 0; i < l; i++) sum += values[i] * Math.log(values[i] + eps);

      return -sum;
    };

    exports.weightedMean = function weightedMean(values, weights) {
      var sum = 0,
          l = values.length;

      for (var i = 0; i < l; i++) sum += values[i] * weights[i];

      return sum;
    };

    exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
      return Math.sqrt(exports.weightedVariance(values, weights));
    };

    exports.weightedVariance = function weightedVariance(values, weights) {
      var theMean = exports.weightedMean(values, weights);
      var vari = 0,
          l = values.length;
      var a = 0,
          b = 0;

      for (var i = 0; i < l; i++) {
        var z = values[i] - theMean;
        var w = weights[i];
        vari += w * (z * z);
        b += w;
        a += w * w;
      }

      return vari * (b / (b * b - a));
    };

    exports.center = function center(values, inPlace) {
      if (typeof inPlace === 'undefined') inPlace = false;
      var result = values;
      if (!inPlace) result = [].concat(values);
      var theMean = exports.mean(result),
          l = result.length;

      for (var i = 0; i < l; i++) result[i] -= theMean;
    };

    exports.standardize = function standardize(values, standardDev, inPlace) {
      if (typeof standardDev === 'undefined') standardDev = exports.standardDeviation(values);
      if (typeof inPlace === 'undefined') inPlace = false;
      var l = values.length;
      var result = inPlace ? values : new Array(l);

      for (var i = 0; i < l; i++) result[i] = values[i] / standardDev;

      return result;
    };

    exports.cumulativeSum = function cumulativeSum(array) {
      var l = array.length;
      var result = new Array(l);
      result[0] = array[0];

      for (var i = 1; i < l; i++) result[i] = result[i - 1] + array[i];

      return result;
    };
  });

  /**
   *
   * @private
   * @param {Spectrum} spectrum
   * @param {object} [options.xFilter={}]
   * @param {array} [options.xFilter.from]
   * @param {array} [options.xFilter.to]
   * @param {array} [options.xFilter.exclusions=[]]
   * @param {array} [options.yFactor=1]
   */

  function getData(spectrum, options = {}) {
    const {
      xFilter = {},
      yFactor = 1
    } = options;
    let data = {
      x: spectrum.x,
      y: spectrum.y
    };

    if (xFilter) {
      data = filterX({
        x: spectrum.x,
        y: spectrum.y
      }, xFilter);
    }

    if (yFactor && yFactor !== 1) {
      data.y = data.y.map(y => y * yFactor);
    }

    return data;
  }

  const toString$2 = Object.prototype.toString;
  function isAnyArray$2(object) {
    return toString$2.call(object).endsWith('Array]');
  }

  /**
   * Computes the mean of the given values
   * @param {Array<number>} input
   * @return {number}
   */

  function sum(input) {
    if (!src(input)) {
      throw new TypeError('input must be an array');
    }

    if (input.length === 0) {
      throw new TypeError('input must not be empty');
    }

    var sumValue = 0;

    for (var i = 0; i < input.length; i++) {
      sumValue += input[i];
    }

    return sumValue;
  }

  /**
   * Computes the norm of the given values
   * @param {Array<number>} input
   * @param {object} [options={}]
   * @param {string} [options.algorithm='absolute'] absolute, sum or max
   * @param {number} [options.maxValue=1] new max value for algo max
   * @param {number} [options.sumValue=1] new max value for algo absolute and sum
   * @param {Array} [options.output=[]] specify the output array, can be the input array for in place modification
   * @return {number}
   */

  function norm(input) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$algorithm = options.algorithm,
        algorithm = _options$algorithm === void 0 ? 'absolute' : _options$algorithm,
        _options$sumValue = options.sumValue,
        sumValue = _options$sumValue === void 0 ? 1 : _options$sumValue,
        _options$maxValue = options.maxValue,
        maxValue = _options$maxValue === void 0 ? 1 : _options$maxValue;

    if (!isAnyArray$2(input)) {
      throw new Error('input must be an array');
    }

    var output;

    if (options.output !== undefined) {
      if (!isAnyArray$2(options.output)) {
        throw new TypeError('output option must be an array if specified');
      }

      output = options.output;
    } else {
      output = new Array(input.length);
    }

    if (input.length === 0) {
      throw new Error('input must not be empty');
    }

    switch (algorithm.toLowerCase()) {
      case 'absolute':
        {
          var absoluteSumValue = absoluteSum(input) / sumValue;
          if (absoluteSumValue === 0) return input.slice(0);

          for (var i = 0; i < input.length; i++) {
            output[i] = input[i] / absoluteSumValue;
          }

          return output;
        }

      case 'max':
        {
          var currentMaxValue = max(input);
          if (currentMaxValue === 0) return input.slice(0);
          var factor = maxValue / currentMaxValue;

          for (var _i = 0; _i < input.length; _i++) {
            output[_i] = input[_i] * factor;
          }

          return output;
        }

      case 'sum':
        {
          var sumFactor = sum(input) / sumValue;
          if (sumFactor === 0) return input.slice(0);

          for (var _i2 = 0; _i2 < input.length; _i2++) {
            output[_i2] = input[_i2] / sumFactor;
          }

          return output;
        }

      default:
        throw new Error("norm: unknown algorithm: ".concat(algorithm));
    }
  }

  function absoluteSum(input) {
    var sumValue = 0;

    for (var i = 0; i < input.length; i++) {
      sumValue += Math.abs(input[i]);
    }

    return sumValue;
  }

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }
  /**
   * Fill an array with sequential numbers
   * @param {Array<number>} [input] - optional destination array (if not provided a new array will be created)
   * @param {object} [options={}]
   * @param {number} [options.from=0] - first value in the array
   * @param {number} [options.to=10] - last value in the array
   * @param {number} [options.size=input.length] - size of the array (if not provided calculated from step)
   * @param {number} [options.step] - if not provided calculated from size
   * @return {Array<number>}
   */


  function sequentialFill() {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (_typeof(input) === 'object' && !src(input)) {
      options = input;
      input = [];
    }

    if (!src(input)) {
      throw new TypeError('input must be an array');
    }

    var _options = options,
        _options$from = _options.from,
        from = _options$from === void 0 ? 0 : _options$from,
        _options$to = _options.to,
        to = _options$to === void 0 ? 10 : _options$to,
        _options$size = _options.size,
        size = _options$size === void 0 ? input.length : _options$size,
        step = _options.step;

    if (size && step) {
      throw new Error('step is defined by the array size');
    }

    if (!size) {
      if (step) {
        size = Math.floor((to - from) / step) + 1;
      } else {
        size = to - from + 1;
      }
    }

    if (!step && size) {
      step = (to - from) / (size - 1);
    }

    if (Array.isArray(input)) {
      input.length = 0; // only works with normal array

      for (var i = 0; i < size; i++) {
        input.push(from);
        from += step;
      }
    } else {
      if (input.length !== size) {
        throw new Error('sequentialFill typed array must have the correct length');
      }

      for (var _i = 0; _i < size; _i++) {
        input[_i] = from;
        from += step;
      }
    }

    return input;
  }

  /**
   * Normalize an array of zones:
   * - ensure than from < to
   * - merge overlapping zones
   *
   * The method will always check if from if lower than to and will swap if required.
   * @param {Array} [zones=[]]
   * @param {object} [options={}]
   * @param {number} [options.from=Number.NEGATIVE_INFINITY] Specify min value of a zone
   * @param {number} [options.to=Number.POSITIVE_INFINITY] Specify max value of a zone
   */
  function normalize(zones = [], options = {}) {
    if (zones.length === 0) return [];
    let {
      from = Number.NEGATIVE_INFINITY,
      to = Number.POSITIVE_INFINITY
    } = options;
    if (from > to) [from, to] = [to, from];
    zones = JSON.parse(JSON.stringify(zones)).map(zone => zone.from > zone.to ? {
      from: zone.to,
      to: zone.from
    } : zone);
    zones = zones.sort((a, b) => {
      if (a.from !== b.from) return a.from - b.from;
      return a.to - b.to;
    });
    zones.forEach(zone => {
      if (from > zone.from) zone.from = from;
      if (to < zone.to) zone.to = to;
    });
    zones = zones.filter(zone => zone.from <= zone.to);
    if (zones.length === 0) return [];
    let currentZone = zones[0];
    let result = [currentZone];

    for (let i = 1; i < zones.length; i++) {
      let zone = zones[i];

      if (zone.from <= currentZone.to) {
        currentZone.to = zone.to;
      } else {
        currentZone = zone;
        result.push(currentZone);
      }
    }

    return result;
  }

  /**
   * Convert an array of exclusions and keep only from / to
   *
   * The method will always check if from if lower than to and will swap if required.
   * @param {Array} [exclusions=[]]
   * @param {object} [options={}]
   * @param {number} [options.from=Number.NEGATIVE_INFINITY] Specify min value of zones (after inversion)
   * @param {number} [options.to=Number.POSITIVE_INFINITY] Specify max value of zones (after inversion)
   */

  function invert(exclusions = [], options = {}) {
    let {
      from = Number.NEGATIVE_INFINITY,
      to = Number.POSITIVE_INFINITY
    } = options;
    if (from > to) [from, to] = [to, from];
    exclusions = normalize(exclusions, {
      from,
      to
    });
    if (exclusions.length === 0) return [{
      from,
      to
    }];
    let zones = [];

    for (let i = 0; i < exclusions.length; i++) {
      let exclusion = exclusions[i];
      let nextExclusion = exclusions[i + 1];

      if (i === 0) {
        if (exclusion.from > from) {
          zones.push({
            from,
            to: exclusion.from
          });
        }
      }

      if (i === exclusions.length - 1) {
        if (exclusion.to < to) {
          zones.push({
            from: exclusion.to,
            to
          });
        }
      } else {
        zones.push({
          from: exclusion.to,
          to: nextExclusion.from
        });
      }
    }

    return zones;
  }

  /**
   * Add the number of points per zone to reach a specified total
   * @param {Array} [zones=[]]
   * @param {number} [numberOfPoints] Total number of points to distribute between zones
   * @param {object} [options={}]
   * @param {number} [options.from=Number.NEGATIVE_INFINITY] Specify min value of a zone
   * @param {number} [options.to=Number.POSITIVE_INFINITY] Specify max value of a zone
   */

  function zonesWithPoints(zones, numberOfPoints, options = {}) {
    if (zones.length === 0) return zones;
    zones = normalize(zones, options);
    const totalSize = zones.reduce((previous, current) => {
      return previous + (current.to - current.from);
    }, 0);
    let unitsPerPoint = totalSize / numberOfPoints;
    let currentTotal = 0;

    for (let i = 0; i < zones.length - 1; i++) {
      let zone = zones[i];
      zone.numberOfPoints = Math.min(Math.round((zone.to - zone.from) / unitsPerPoint), numberOfPoints - currentTotal);
      currentTotal += zone.numberOfPoints;
    }

    zones[zones.length - 1].numberOfPoints = numberOfPoints - currentTotal;
    return zones;
  }

  /**
   * Function that calculates the integral of the line between two
   * x-coordinates, given the slope and intercept of the line.
   * @param {number} x0
   * @param {number} x1
   * @param {number} slope
   * @param {number} intercept
   * @return {number} integral value.
   */
  function integral(x0, x1, slope, intercept) {
    return 0.5 * slope * x1 * x1 + intercept * x1 - (0.5 * slope * x0 * x0 + intercept * x0);
  }

  /**
   * function that retrieves the getEquallySpacedData with the variant "smooth"
   *
   * @param {Array<number>} x
   * @param {Array<number>} y
   * @param {number} from - Initial point
   * @param {number} to - Final point
   * @param {number} numberOfPoints
   * @return {Array} - Array of y's equally spaced with the variant "smooth"
   */

  function equallySpacedSmooth(x, y, from, to, numberOfPoints) {
    let xLength = x.length;
    let step = (to - from) / (numberOfPoints - 1);
    let halfStep = step / 2;
    let output = new Array(numberOfPoints);
    let initialOriginalStep = x[1] - x[0];
    let lastOriginalStep = x[xLength - 1] - x[xLength - 2]; // Init main variables

    let min = from - halfStep;
    let max = from + halfStep;
    let previousX = Number.MIN_VALUE;
    let previousY = 0;
    let nextX = x[0] - initialOriginalStep;
    let nextY = 0;
    let currentValue = 0;
    let slope = 0;
    let intercept = 0;
    let sumAtMin = 0;
    let sumAtMax = 0;
    let i = 0; // index of input

    let j = 0; // index of output

    function getSlope(x0, y0, x1, y1) {
      return (y1 - y0) / (x1 - x0);
    }

    let add = 0;

    main: while (true) {
      if (previousX <= min && min <= nextX) {
        add = integral(0, min - previousX, slope, previousY);
        sumAtMin = currentValue + add;
      }

      while (nextX - max >= 0) {
        // no overlap with original point, just consume current value
        add = integral(0, max - previousX, slope, previousY);
        sumAtMax = currentValue + add;
        output[j++] = (sumAtMax - sumAtMin) / step;

        if (j === numberOfPoints) {
          break main;
        }

        min = max;
        max += step;
        sumAtMin = sumAtMax;
      }

      currentValue += integral(previousX, nextX, slope, intercept);
      previousX = nextX;
      previousY = nextY;

      if (i < xLength) {
        nextX = x[i];
        nextY = y[i];
        i++;
      } else if (i === xLength) {
        nextX += lastOriginalStep;
        nextY = 0;
      }

      slope = getSlope(previousX, previousY, nextX, nextY);
      intercept = -slope * previousX + previousY;
    }

    return output;
  }

  /**
   * function that retrieves the getEquallySpacedData with the variant "slot"
   *
   * @param {Array<number>} x
   * @param {Array<number>} y
   * @param {number} from - Initial point
   * @param {number} to - Final point
   * @param {number} numberOfPoints
   * @return {Array} - Array of y's equally spaced with the variant "slot"
   */
  function equallySpacedSlot(x, y, from, to, numberOfPoints) {
    let xLength = x.length;
    let step = (to - from) / (numberOfPoints - 1);
    let halfStep = step / 2;
    let lastStep = x[x.length - 1] - x[x.length - 2];
    let start = from - halfStep;
    let output = new Array(numberOfPoints); // Init main variables

    let min = start;
    let max = start + step;
    let previousX = -Number.MAX_VALUE;
    let previousY = 0;
    let nextX = x[0];
    let nextY = y[0];
    let frontOutsideSpectra = 0;
    let backOutsideSpectra = true;
    let currentValue = 0; // for slot algorithm

    let currentPoints = 0;
    let i = 1; // index of input

    let j = 0; // index of output

    main: while (true) {
      if (previousX >= nextX) throw new Error('x must be an increasing serie');

      while (previousX - max > 0) {
        // no overlap with original point, just consume current value
        if (backOutsideSpectra) {
          currentPoints++;
          backOutsideSpectra = false;
        }

        output[j] = currentPoints <= 0 ? 0 : currentValue / currentPoints;
        j++;

        if (j === numberOfPoints) {
          break main;
        }

        min = max;
        max += step;
        currentValue = 0;
        currentPoints = 0;
      }

      if (previousX > min) {
        currentValue += previousY;
        currentPoints++;
      }

      if (previousX === -Number.MAX_VALUE || frontOutsideSpectra > 1) {
        currentPoints--;
      }

      previousX = nextX;
      previousY = nextY;

      if (i < xLength) {
        nextX = x[i];
        nextY = y[i];
        i++;
      } else {
        nextX += lastStep;
        nextY = 0;
        frontOutsideSpectra++;
      }
    }

    return output;
  }

  /**
   * Function that returns a Number array of equally spaced numberOfPoints
   * containing a representation of intensities of the spectra arguments x
   * and y.
   *
   * The options parameter contains an object in the following form:
   * from: starting point
   * to: last point
   * numberOfPoints: number of points between from and to
   * variant: "slot" or "smooth" - smooth is the default option
   *
   * The slot variant consist that each point in the new array is calculated
   * averaging the existing points between the slot that belongs to the current
   * value. The smooth variant is the same but takes the integral of the range
   * of the slot and divide by the step size between two points in the new array.
   *
   * If exclusions zone are present, zones are ignored !
   * @param {object} [arrayXY={}] - object containing 2 properties x and y (both an array)
   * @param {object} [options={}]
   * @param {number} [options.from=x[0]]
   * @param {number} [options.to=x[x.length-1]]
   * @param {string} [options.variant='smooth']
   * @param {number} [options.numberOfPoints=100]
   * @param {Array} [options.exclusions=[]] array of from / to that should be skipped for the generation of the points
   * @param {Array} [options.zones=[]] array of from / to that should be kept
   * @return {object<x: Array, y:Array>} new object with x / y array with the equally spaced data.
   */

  function equallySpaced(arrayXY = {}, options = {}) {
    let {
      x,
      y
    } = arrayXY;
    let xLength = x.length;
    let reverse = false;

    if (x.length > 1 && x[0] > x[1]) {
      x = x.slice().reverse();
      y = y.slice().reverse();
      reverse = true;
    }

    let {
      from = x[0],
      to = x[xLength - 1],
      variant = 'smooth',
      numberOfPoints = 100,
      exclusions = [],
      zones = []
    } = options;

    if (xLength !== y.length) {
      throw new RangeError("the x and y vector doesn't have the same size.");
    }

    if (typeof from !== 'number' || isNaN(from)) {
      throw new RangeError("'from' option must be a number");
    }

    if (typeof to !== 'number' || isNaN(to)) {
      throw new RangeError("'to' option must be a number");
    }

    if (typeof numberOfPoints !== 'number' || isNaN(numberOfPoints)) {
      throw new RangeError("'numberOfPoints' option must be a number");
    }

    if (numberOfPoints < 2) {
      throw new RangeError("'numberOfPoints' option must be greater than 1");
    }

    if (zones.length === 0) {
      zones = invert(exclusions, {
        from,
        to
      });
    }

    zones = zonesWithPoints(zones, numberOfPoints, {
      from,
      to
    });
    let xResult = [];
    let yResult = [];

    for (let zone of zones) {
      let zoneResult = processZone(x, y, zone.from, zone.to, zone.numberOfPoints, variant);
      xResult = xResult.concat(zoneResult.x);
      yResult = yResult.concat(zoneResult.y);
    }

    if (reverse) {
      if (from < to) {
        return {
          x: xResult.reverse(),
          y: yResult.reverse()
        };
      } else {
        return {
          x: xResult,
          y: yResult
        };
      }
    } else {
      if (from < to) {
        return {
          x: xResult,
          y: yResult
        };
      } else {
        return {
          x: xResult.reverse(),
          y: yResult.reverse()
        };
      }
    }
  }

  function processZone(x, y, from, to, numberOfPoints, variant) {
    if (numberOfPoints < 1) {
      throw new RangeError('the number of points must be at least 1');
    }

    let output = variant === 'slot' ? equallySpacedSlot(x, y, from, to, numberOfPoints) : equallySpacedSmooth(x, y, from, to, numberOfPoints);
    return {
      x: sequentialFill({
        from,
        to,
        size: numberOfPoints
      }),
      y: output
    };
  }

  /**
   *
   * @private
   * @param {*} spectrum
   * @param {*} options
   */

  function getNormalized(spectrum, options = {}) {
    if (!Array.isArray(spectrum.x) || !Array.isArray(spectrum.y)) {
      throw new Error('getNormalized: Can not get normalized data, missing original data.');
    }

    let {
      from = spectrum.x[0],
      to = spectrum.x[spectrum.x.length - 1],
      numberOfPoints = 1024,
      filters = [],
      exclusions = []
    } = options;
    let ys = spectrum.y.slice(0);

    for (let filter of filters) {
      switch (filter.name) {
        case 'centerMean':
          {
            let mean = array.mean(spectrum.y);

            let meanFct = y => y - mean;

            ys = ys.map(meanFct);
            break;
          }

        case 'scaleSD':
          {
            let std = array.standardDeviation(spectrum.y);

            let stdFct = y => y / std;

            ys = ys.map(stdFct);
            break;
          }

        case 'normalize':
          {
            ys = norm(ys);
            break;
          }

        case 'rescale':
          {
            ys = rescale(ys);
            break;
          }

        case '':
        case undefined:
          break;

        default:
          throw new Error(`Unknown process kind: ${process.kind}`);
      }
    }

    let result = equallySpaced({
      x: spectrum.x,
      y: ys
    }, {
      from,
      to,
      numberOfPoints,
      exclusions
    });
    return result;
  }

  /**
   * @private
   * @param {*} spectrum
   * @param {*} ranges
   */

  function updateRangesInfo(spectrum, ranges = []) {
    spectrum.ranges = {};

    for (let range of ranges) {
      range = JSON.parse(JSON.stringify(range));
      spectrum.ranges[range.label] = range;
      let fromToIndex = {
        fromIndex: xFindClosestIndex(spectrum.normalized.x, range.from),
        toIndex: xFindClosestIndex(spectrum.normalized.x, range.to)
      };
      range.integration = xyIntegration(spectrum.normalized, fromToIndex);
      range.maxPoint = xyMaxYPoint(spectrum.normalized, fromToIndex);
      range.minPoint = xyMinYPoint(spectrum.normalized, fromToIndex);
      range.x = spectrum.normalized.x.slice(fromToIndex.fromIndex, fromToIndex.toIndex + 1);
      range.y = spectrum.normalized.y.slice(fromToIndex.fromIndex, fromToIndex.toIndex + 1);
    }
  }

  /**
   * Class allowing manipulate one IR spectrum
   * @class spectrum
   * @param {object} [json={}] - object containing a spectrum
   * @param {Array} [json.x=[]] - x values
   * @param {Array} [json.y=[]] - y values
   */

  class Spectrum$1 {
    /**
     *
     * @param {array} x
     * @param {array} y
     * @param {string} id
     * @param {object} [options={}]
     * @param {object} [options.meta={}]
     * @param {object} [options.normalization]
     * @param {object} [options.normalized]
     */
    constructor(x, y, id, options = {}) {
      const {
        meta = {},
        normalization = {},
        normalized
      } = options;

      if (x && x.length > 1 && x[0] > x[1]) {
        this.x = x.reverse();
        this.y = y.reverse();
      } else {
        this.x = x || [];
        this.y = y || [];
      }

      this.id = id;
      this.meta = meta;
      this.normalizedBoundary = {
        x: {
          min: 0,
          max: 0
        },
        y: {
          min: 0,
          max: 0
        }
      };

      if (normalized) {
        this.normalized = normalized;
        this.updateNormalizedBoundary();
      } else {
        this.updateNormalization(normalization);
      }

      this.updateMemory();
    }

    get minX() {
      return this.x[0];
    }

    get maxX() {
      return this.x[this.x.length - 1];
    }

    updateMemory() {
      let original = (this.x && this.x.length || 0) * 16;
      let normalized = this.normalized.x.length * 16;
      this.memory = {
        original,
        normalized,
        total: original + normalized
      };
    }

    removeOriginal() {
      this.x = undefined;
      this.y = undefined;
      this.updateMemory();
    }

    getXY() {
      if (!Array.isArray(this.x) || !Array.isArray(this.y)) {
        throw new Error('Can not get normalized data');
      }

      return {
        x: this.x,
        y: this.y
      };
    }

  }

  Spectrum$1.prototype.getData = function (options) {
    return getData(this, options);
  };

  Spectrum$1.prototype.updateNormalization = function (normalization) {
    this.normalized = getNormalized(this, normalization);
    this.ranges = {};
    this.updateMemory();
    this.updateNormalizedBoundary();
  };

  Spectrum$1.prototype.updateRangesInfo = function (ranges) {
    updateRangesInfo(this, ranges);
  };

  Spectrum$1.prototype.updateNormalizedBoundary = function () {
    this.normalizedBoundary.x = {
      min: this.normalized.x[0],
      max: this.normalized.x[this.normalized.x.length - 1]
    };
    this.normalizedBoundary.y = array.minMax(this.normalized.y);
  };

  class SpectraProcessor {
    /**
     * Manager a large number of spectra with the possibility to normalize the data
     * and skip the original data.
     * @param {object} [options={}]
     * @param {boolean} [options.maxMemory=64M]
     * @param {object} [options.normalization={}] options to normalize the spectra before comparison
     * @param {number} [options.normalization.from]
     * @param {number} [options.normalization.to]
     * @param {number} [options.normalization.numberOfPoints]
     * @param {array<object>} [options.normalization.filters]
     * @param {string} [options.normalization.filters.X.name]
     * @param {object} [options.normalization.filters.X.options]
     * @param {array<object>} [options.normalization.exclusions]
     * @param {string} [options.normalization.exclusions.X.from]
     * @param {object} [options.normalization.exclusions.X.to]
     */
    constructor(options = {}) {
      this.normalization = options.normalization;
      this.maxMemory = options.maxMemory || 64 * 1024 * 1024;
      this.keepOriginal = true;
      this.spectra = [];
      this.boundaries = {
        minX: Number.MAX_VALUE,
        maxX: Number.MIN_VALUE,
        minY: Number.MAX_VALUE,
        maxY: Number.MIN_VALUE
      };
    }

    getNormalizationAnnotations() {
      return getNormalizationAnnotations(this.normalization, this.getNormalizedBoundary());
    }
    /**
     * Recalculate the normalized data using the stored original data if available
     * This will throw an error in the original data is not present
     * @param {number} [normalization.from]
     * @param {number} [normalization.to]
     * @param {number} [normalization.numberOfPoints]
     * @param {array<object>} [normalization.filters]
     * @param {string} [normalization.filters.X.name]
     * @param {object} [normalization.filters.X.options]
     * @param {array<object>} [normalization.exclusions]
     * @param {string} [normalization.exclusions.X.from]
     * @param {object} [normalization.exclusions.X.to]
     */


    setNormalization(normalization = {}) {
      if (JSON.stringify(this.normalization) === JSON.stringify(normalization)) {
        return;
      }

      this.normalization = normalization;

      for (let spectrum of this.spectra) {
        spectrum.updateNormalization(this.normalization);
      }
    }

    getNormalization() {
      return this.normalization;
    }
    /**
     * Returns an object {x:[], y:[]} containing the autocorrelation for the
     * specified index
     * @param {integer} [index|undefined] x index of the spectrum to autocorrelate
     * @param {object} [options={}]
     * @param {array} [options.ids=[]] list of ids, by default all spectra
     * @param {array} [options.x] x value if index is undefined
     */


    getAutocorrelation(index, options = {}) {
      const {
        x
      } = options;
      const normalizedData = this.getNormalizedData(options);

      if (index === undefined && x !== undefined) {
        index = xFindClosestIndex(normalizedData.x, x);
      }

      return getAutocorrelation(normalizedData, index);
    }
    /**
     * Returns a {x:[], y:[]} containg the average of specified spectra
     * @param {object} [options={}]
     * @param {array} [options.ids=[]] list of ids, by default all spectra
     */


    getMeanData(options) {
      return getMeanData(this.getNormalizedData(options));
    }
    /**
     * Returns an object contains 4 parameters with the normalized data
     * @returns {object} { ids:[], matrix:[Array], meta:[object], x:[] }
     * @param {object} [options={}]
     * @param {Array} [options.ids] List of spectra ids to export, by default all
     */


    getNormalizedData(options = {}) {
      const {
        ids
      } = options;
      let spectra = this.getSpectra(ids);
      return getNormalizedData(spectra);
    }
    /**
     * Returns a tab separated value containing the normalized data
     * @param {object} [options={}]
     * @param {Array} [options.ids] List of spectra ids to export, by default all
     * @param {string} [options.fs='\t'] field separator
     * @param {string} [options.rs='\n'] record (line) separator
     * @returns {string}
     */


    getNormalizedText(options = {}) {
      const {
        ids
      } = options;
      let spectra = this.getSpectra(ids);
      return getNormalizedText(spectra, options);
    }

    getMinMaxX() {
      let min = Number.MAX_VALUE;
      let max = Number.MIN_VALUE;

      for (let spectrum of this.spectra) {
        if (spectrum.minX < min) min = spectrum.minX;
        if (spectrum.maxX > max) max = spectrum.maxX;
      }

      return {
        min,
        max
      };
    }
    /**
      * Returns an object contains 4 parameters with the scaled data
     * @param {object} [options={}] scale spectra based on various parameters
     * @param {object} [options.range] from - to
     * @param {Array} [options.ids] ids of selected spectra, by default all
     * @param {string} [options.targetID=spectra[0].id]
     * @param {string} [options.method='max'] min, max, range, minMax
     * @param {boolean} [options.relative=false]
     * @returns {object} { ids:[], matrix:[Array], meta:[object], x:[] }
     */


    getScaledData(options) {
      return getScaledData(this, options);
    }
    /**
     * Add from text
     * By default TITLE from the jcamp will be in the meta information
     * @param {string} text
     * @param {object} [options={}]
     * @param {object} [options.parserOptions={}] XY parser options
     * @param {object} [options.meta={}]
     * @param {string} [options.meta.color]
     * @param {object} [options.id={}]
     * @param {object} [options.kind]
     * @param {boolean} [options.force=false] replace existing spectrum (same ID)
     */


    addFromText(text$1, options = {}) {
      if (options.force !== true && options.id && this.contains(options.id)) {
        return;
      }

      let parsed = text(text$1, options);
      let meta = { ...parsed.meta,
        ...(options.meta || {})
      };
      this.addFromData(parsed.data, {
        meta,
        id: options.id
      });
    }
    /**
     * Add jcamp
     * By default TITLE from the jcamp will be in the meta information
     * @param {string} jcamp
     * @param {object} [options={}]
     * @param {object} [options.meta={}]
     * @param {string} [options.meta.color]
     * @param {object} [options.id={}]
     * @param {boolean} [options.force=false] replace existing spectrum (same ID)
     */


    addFromJcamp(jcamp$1, options = {}) {
      if (options.force !== true && options.id && this.contains(options.id)) {
        return;
      }

      let parsed = jcamp(jcamp$1);
      let meta = { ...parsed.meta,
        ...(options.meta || {})
      };
      this.addFromData(parsed.data, {
        meta,
        id: options.id
      });
    }

    updateRangesInfo(options) {
      for (let spectrum of this.spectra) {
        spectrum.updateRangesInfo(options);
      }
    }

    getMetadata() {
      return getMetadata(this.spectra);
    }
    /**
     *
     * @param {object} [options={}]
     * @param {string} [options.propertyName="category"]
     */


    getClasses(options) {
      return getClasses(this.getMetadata(), options);
    }
    /**
     *
     * @param {object} [options={}]
     * @param {string} [options.propertyName="category"]
     */


    getCategoriesStats(options) {
      return getCategoriesStats(this.getMetadata(), options);
    }
    /**
     * Add a spectrum based on the data
     * @param {object} data {x, y}}
     * @param {object} [options={}]
     * @param {object} [options.meta={}]
     * @param {object} [options.id]
     * @param {object} [options.normalization={}]
     * @param {object} [options.normalized]
     * @return {Spectrum}
     */


    addFromData(data, options = {}) {
      if (this.spectra.length === 0) this.keepOriginal = true;
      const id = options.id || Math.random().toString(36).substring(2, 10);
      let index = this.getSpectrumIndex(id);
      if (index === undefined) index = this.spectra.length;
      let spectrum = new Spectrum$1(data.x, data.y, id, {
        meta: options.meta,
        normalized: options.normalized,
        normalization: this.normalization
      });
      this.spectra[index] = spectrum;

      if (!this.keepOriginal) {
        spectrum.removeOriginal();
      } else {
        let memoryInfo = this.getMemoryInfo();

        if (memoryInfo.total > this.maxMemory) {
          this.keepOriginal = false;
          this.removeOriginals();
        }
      }
    }

    removeOriginals() {
      for (let spectrum of this.spectra) {
        spectrum.removeOriginal();
      }
    }
    /**
     * Remove the spectrum from the SpectraProcessor for the specified id
     * @param {string} id
     */


    removeSpectrum(id) {
      let index = this.getSpectrumIndex(id);
      if (index === undefined) return undefined;
      return this.spectra.splice(index, 1);
    }
    /**
     * Remove all the spectra not present in the list
     * @param {Array} [ids] Array of ids of the spectra to keep
     */


    removeSpectraNotIn(ids) {
      let currentIDs = this.spectra.map(spectrum => spectrum.id);

      for (let id of currentIDs) {
        if (!ids.includes(id)) {
          this.removeSpectrum(id);
        }
      }
    }
    /**
     * Checks if the ID of a spectrum exists in the SpectraProcessor
     * @param {string} id
     */


    contains(id) {
      return !isNaN(this.getSpectrumIndex(id));
    }
    /**
     * Returns the index of the spectrum in the spectra array
     * @param {string} id
     * @returns {number}
     */


    getSpectrumIndex(id) {
      if (!id) return undefined;

      for (let i = 0; i < this.spectra.length; i++) {
        let spectrum = this.spectra[i];
        if (spectrum.id === id) return i;
      }

      return undefined;
    }
    /**
     * Returns an array of spectrum from their ids
     * @param {Array} ids
     * @returns {Array<Spectrum}
     */


    getSpectra(ids) {
      if (!ids || !Array.isArray(ids)) return this.spectra;
      let spectra = [];

      for (let id of ids) {
        let index = this.getSpectrumIndex(id);

        if (index !== undefined) {
          spectra.push(this.spectra[index]);
        }
      }

      return spectra;
    }
    /**
     * Returns the index of the spectrum in the spectra array
     * @param {string} id
     * @returns {number}
     */


    getSpectrum(id) {
      let index = this.getSpectrumIndex(id);
      if (index === undefined) return undefined;
      return this.spectra[index];
    }
    /**
     * Returns a JSGraph chart object for all the spectra
     * @returns {object}
     */


    getChart(options) {
      return getChart(this.spectra, options);
    }
    /**
     * Returns a JSGraph chart object for all the spectra
     * @returns {object}
     */


    getAutocorrelationChart(index, options) {
      return getAutocorrelationChart(this, index, options);
    }
    /**
     * Returns a JSGraph annotation object for the specified index
     * @returns {object}
     */


    getTrackAnnotation(index, options) {
      return getTrackAnnotation(this.spectra, index, options);
    }
    /**
     * Returns a JSGraph annotation object for box plot
     * @returns {object}
     */


    getBoxPlotAnnotations(options) {
      return getBoxPlotAnnotations(this.spectra, options);
    }
    /**
     * Returns a JSGraph chart object for all the normalized spectra
     * @param {object} [options={}]
     * @param {Array} [options.ids] ids of the spectra to select, by default all
     * @returns {object}
     */


    getNormalizedChart(options) {
      return getNormalizedChart(this.spectra, options);
    }
    /**
     * Returns a JSGraph chart object for all the scaled normalized spectra
     * @param {object} [options={}]
     * @param {Array} [options.ids] ids of the spectra to select, by default all
     * @param {object} [options.range] from - to
     * @param {string} [options.targetID=spectra[0].id]
     * @param {string} [options.method='max'] min, max, range, minMax
     * @param {boolean} [options.relative=false]
     * @returns {object}
     */


    getScaledChart(options) {
      return getScaledChart(this, options);
    }

    getMemoryInfo() {
      let memoryInfo = {
        original: 0,
        normalized: 0,
        total: 0
      };
      this.spectra.forEach(spectrum => {
        let memory = spectrum.memory;
        memoryInfo.original += memory.original;
        memoryInfo.normalized += memory.normalized;
        memoryInfo.total += memory.total;
      });
      memoryInfo.keepOriginal = this.keepOriginal;
      memoryInfo.maxMemory = this.maxMemory;
      return memoryInfo;
    }

    getNormalizedBoundary() {
      let boundary = {
        x: {
          min: Number.MAX_VALUE,
          max: Number.MIN_VALUE
        },
        y: {
          min: Number.MAX_VALUE,
          max: Number.MIN_VALUE
        }
      };

      for (let spectrum of this.spectra) {
        if (spectrum.normalizedBoundary.x.min < boundary.x.min) {
          boundary.x.min = spectrum.normalizedBoundary.x.min;
        }

        if (spectrum.normalizedBoundary.x.max > boundary.x.max) {
          boundary.x.max = spectrum.normalizedBoundary.x.max;
        }

        if (spectrum.normalizedBoundary.y.min < boundary.y.min) {
          boundary.y.min = spectrum.normalizedBoundary.y.min;
        }

        if (spectrum.normalizedBoundary.y.max > boundary.y.max) {
          boundary.y.max = spectrum.normalizedBoundary.y.max;
        }
      }

      return boundary;
    }
    /**
     * Create SpectraProcessor from normalized TSV
     * @param {string} text
     * @param {object} [options={}]
     * @param {object} [options.separator='\t']
     */


    static fromNormalizedMatrix(text, options = {}) {
      let parsed = matrix(text, options);

      if (!parsed) {
        throw new Error('Can not parse TSV file');
      }

      let spectraProcessor = new SpectraProcessor();
      spectraProcessor.setNormalization({
        from: parsed.x[0],
        to: parsed.x[parsed.x.length - 1],
        numberOfPoints: parsed.x.length
      });
      spectraProcessor.keepOriginal = false;

      for (let i = 0; i < parsed.ids.length; i++) {
        spectraProcessor.addFromData({
          x: [],
          y: []
        }, {
          normalized: {
            x: parsed.x,
            y: parsed.matrix[i]
          },
          id: parsed.ids[i],
          meta: parsed.meta[i]
        });
      }

      return spectraProcessor;
    }

  }

  function getFilterAnnotations(filter = {}) {
    let {
      exclusions = []
    } = filter;
    let annotations = [];
    exclusions = exclusions.filter(exclusion => !exclusion.ignore);
    annotations = exclusions.map(exclusion => {
      let annotation = {
        type: 'rect',
        position: [{
          x: exclusion.from,
          y: '0px'
        }, {
          x: exclusion.to,
          y: '2000px'
        }],
        strokeWidth: 0,
        fillColor: 'rgba(255,255,128,1)'
      };
      return annotation;
    });

    if (filter.from !== undefined) {
      annotations.push({
        type: 'rect',
        position: [{
          x: Number.MIN_SAFE_INTEGER,
          y: '0px'
        }, {
          x: filter.from,
          y: '2000px'
        }],
        strokeWidth: 0,
        fillColor: 'rgba(255,255,224,1)'
      });
    }

    if (filter.to !== undefined) {
      annotations.push({
        type: 'rect',
        position: [{
          x: filter.to,
          y: '0px'
        }, {
          x: Number.MAX_SAFE_INTEGER,
          y: '2000px'
        }],
        strokeWidth: 0,
        fillColor: 'rgba(255,255,224,1)'
      });
    }

    return annotations;
  }

  exports.SpectraProcessor = SpectraProcessor;
  exports.getFilterAnnotations = getFilterAnnotations;
  exports.xFindClosestIndex = xFindClosestIndex;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=spectra-processor.js.map
