import { updateNormalized } from '../updateNormalized';

describe('updateNormalized', () => {
  it('SNV', () => {
    let x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let y = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0];
    let result = updateNormalized(
      {
        x,
        y
      },
      {
        from: 1,
        to: 9,
        numberOfPoints: 5
      }
    );

    expect(result.x).toStrictEqual([1, 3, 5, 7, 9]);
    expect(result.y).toStrictEqual([1, 3, 4.5, 3, 1]);
  });
  it('with SNV', () => {
    let x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let y = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0];
    let result = updateNormalized(
      {
        x,
        y
      },
      {
        from: 1,
        to: 9,
        numberOfPoints: 5,
        processes: [{ kind: 'centerMean' }, { kind: 'scaleSD' }]
      }
    );

    expect(result.x).toStrictEqual([1, 3, 5, 7, 9]);
    expect(result.y).toStrictEqual([
      -0.7581425055034354,
      0.4332242888591059,
      1.3267493846310112,
      0.4332242888591029,
      -0.7581425055034343
    ]);
  });
});