import filterX from 'ml-array-xy-filter-x';

import { addChartDataStyle } from './addChartDataStyle';

/**
 * @param {Array<Spectrum>} spectra
 * @param {object} [options={}]
 * @param {object} [options.xFilter={}]
 * @param {array} [options.xFilter.from]
 * @param {array} [options.xFilter.to]
 * @param {array} [options.xFilter.exclusions=[]]
 */

export function getNormalizedChart(spectra, options = {}) {
  const { xFilter } = options;
  let chart = {
    data: [],
  };
  for (let spectrum of spectra) {
    let data = spectrum.normalized;
    if (xFilter) {
      data = filterX({ x: data.x, y: data.y }, xFilter);
    }
    addChartDataStyle(data, spectrum);
    chart.data.push(data);
  }
  return chart;
}
