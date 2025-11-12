import { BaseEntity } from '@utils/entity';

export interface DocumentsProps {
  id?: number;
  rateVat: string;
  inn: string;
  okpo: string;
  kpp?: string;
  ogrn: string;
  bik: string;
  correspondentAccount: string;
  bank: string;
  settlementAccount: string;
  addressBank: string;
  documentDoc?: string;
  certificateNumber?: string;
  dateCertificate?: Date;
}

export class Documents extends BaseEntity<DocumentsProps> {
  constructor(props: DocumentsProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get rateVat(): string {
    return this.props.rateVat;
  }

  get inn(): string {
    return this.props.inn;
  }

  get okpo(): string {
    return this.props.okpo;
  }

  get kpp(): string {
    return this.props.kpp;
  }

  get ogrn(): string {
    return this.props.ogrn;
  }

  get bik(): string {
    return this.props.bik;
  }

  get correspondentAccount(): string {
    return this.props.correspondentAccount;
  }

  get bank(): string {
    return this.props.bank;
  }

  get settlementAccount(): string {
    return this.props.settlementAccount;
  }

  get addressBank(): string {
    return this.props.addressBank;
  }

  get documentDoc(): string {
    return this.props.documentDoc;
  }

  get certificateNumber(): string {
    return this.props.certificateNumber;
  }

  get dateCertificate(): Date {
    return this.props.dateCertificate;
  }

  set rateVat(rateVat: string) {
    this.props.rateVat = rateVat;
  }

  set inn(inn: string) {
    this.props.inn = inn;
  }

  set okpo(okpo: string) {
    this.props.okpo = okpo;
  }

  set kpp(kpp: string) {
    this.props.kpp = kpp;
  }

  set ogrn(ogrn: string) {
    this.props.ogrn = ogrn;
  }

  set bik(bik: string) {
    this.props.bik = bik;
  }

  set correspondentAccount(correspondentAccount: string) {
    this.props.correspondentAccount = correspondentAccount;
  }

  set bank(bank: string) {
    this.props.bank = bank;
  }

  set settlementAccount(settlementAccount: string) {
    this.props.settlementAccount = settlementAccount;
  }

  set addressBank(addressBank: string) {
    this.props.addressBank = addressBank;
  }

  set documentDoc(documentDoc: string) {
    this.props.documentDoc = documentDoc;
  }

  set certificateNumber(certificateNumber: string) {
    this.props.certificateNumber = certificateNumber;
  }

  set dateCertificate(dateCertificate: Date) {
    this.props.dateCertificate = dateCertificate;
  }
}
