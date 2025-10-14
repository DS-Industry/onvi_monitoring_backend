export interface ITransactionService {
  executeTransaction<T>(callback: (tx: any) => Promise<T>): Promise<T>;
}
