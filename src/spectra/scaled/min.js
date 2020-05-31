import { xyMinYPoint, xMultiply } from 'ml-spectra-processing';

import { getFromToIndex } from './getFromToIndex';

export function min(spectra, targetSpectrum, range = {}) {
  let fromToIndex = getFromToIndex(targetSpectrum.normalized.x, range);

  let targetValue = xyMinYPoint(targetSpectrum.normalized, fromToIndex).y;

  let values = spectra.map(
    (spectrum) => xyMinYPoint(spectrum.normalized, fromToIndex).y,
  );

  let matrix = [];
  for (let i = 0; i < spectra.length; i++) {
    let spectrum = spectra[i];
    let factor = targetValue / values[i];
    matrix.push(xMultiply(spectrum.normalized.y, factor));
  }

  return matrix;
}
