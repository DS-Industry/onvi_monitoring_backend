export interface IClientRepository {
  findById(id: number): Promise<any | null>;
  updateStatus(id: number, status: string, tx?: any): Promise<void>;
}
