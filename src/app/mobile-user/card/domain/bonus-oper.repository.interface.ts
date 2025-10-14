export interface IBonusOperRepository {
  create(data: {
    cardId: number;
    operDate: Date;
    loadDate: Date;
    sum: number;
    comment: string;
    creatorId: number;
    typeId: number;
  }, tx?: any): Promise<void>;
}
