import { rank } from './rank';

describe('collection', () => {
  test('rank', () => {
    const data = [
      { exam: { score: 70 } },
      { exam: { score: 70 } },
      { exam: { score: 100 } },
      { exam: { score: 80 } },
      { exam: { score: 90 } },
      { exam: { score: 100 } },
    ];

    expect(rank(data, 'exam.score')).toEqual([
      { _rank: 1, exam: { score: 100 } },
      { _rank: 1, exam: { score: 100 } },
      { _rank: 3, exam: { score: 90 } },
      { _rank: 4, exam: { score: 80 } },
      { _rank: 5, exam: { score: 70 } },
      { _rank: 5, exam: { score: 70 } },
    ]);
  });
});
