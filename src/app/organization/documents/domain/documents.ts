import { BaseEntity } from '@utils/entity';

export interface DocumentsProps {
  id?: number;
  rateVat: string;
  inn: string;
  fullName: string;
  okpo: string;
  kpp: string;
  addressRegistration: string;
  ogrn: string;
  bik: string;
  correspondentAccount: string;
  bank: string;
  settlementAccount: string;
  address: string;
  documentDoc?: string;
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

  get fullName(): string {
    return this.props.fullName;
  }

  get okpo(): string {
    return this.props.okpo;
  }

  get kpp(): string {
    return this.props.kpp;
  }

  get addressRegistration(): string {
    return this.props.addressRegistration;
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

  get address(): string {
    return this.props.address;
  }

  get documentDoc(): string {
    return this.props.documentDoc;
  }

  set rateVat(rateVat: string) {
    this.props.rateVat = rateVat;
  }

  set inn(inn: string) {
    this.props.inn = inn;
  }

  set fullName(fullName: string) {
    this.props.fullName = fullName;
  }

  set okpo(okpo: string) {
    this.props.okpo = okpo;
  }

  set kpp(kpp: string) {
    this.props.kpp = kpp;
  }

  set addressRegistration(addressRegistration: string) {
    this.props.addressRegistration = addressRegistration;
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

  set address(address: string) {
    this.props.address = address;
  }

  set documentDoc(documentDoc: string) {
    this.props.documentDoc = documentDoc;
  }
}
