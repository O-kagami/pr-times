/** RDSから一度に読み取る行数の共通上限。 */
export const MAX_DB_READ_ROWS = 100;

/** 呼び出し側が大きな件数を指定しても、共通上限を超えないようにする。 */
export const clampDbReadLimit = (limit: number): number =>
  Math.min(MAX_DB_READ_ROWS, Math.max(1, Math.trunc(limit)));
