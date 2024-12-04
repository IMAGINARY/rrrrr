import type { Record } from './circular-economy-model';

class Scores {
  static circularity(record: Record) {
    return record.variables.circularityScore;
  }

  static coverage(record: Record) {
    return record.variables.coverageScore;
  }

  static all(record: Record) {
    const circularity = Scores.circularity(record);
    const coverage = Scores.coverage(record);

    return { circularity, coverage };
  }
}

export { Scores };
