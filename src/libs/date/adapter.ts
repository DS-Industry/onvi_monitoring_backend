export abstract class IDateAdapter {
  abstract isExpired(timestamp: Date, expiryTime: number): boolean;
  abstract generateOtpTime(): Date;
}
