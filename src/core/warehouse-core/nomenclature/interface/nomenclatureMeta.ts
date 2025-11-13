export enum PurposeType {
  SALE = 'SALE',
  INTERNAL_USE = 'INTERNAL_USE',
}

export interface NomenclatureMeta {
  description?: string;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  purpose?: PurposeType;
}
