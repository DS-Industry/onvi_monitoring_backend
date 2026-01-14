import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class VerifyWebhookIpUseCase {
  private readonly logger = new Logger(VerifyWebhookIpUseCase.name);

  private readonly yookassaIpRanges = [
    '185.71.76.0/27',
    '185.71.77.0/27',
    '77.75.153.0/25',
    '77.75.156.11',
    '77.75.156.35',
    '77.75.154.128/25',
    '2a02:5180::/32',
  ];

  execute(clientIp: string): boolean {
    if (!clientIp) {
      this.logger.warn('No client IP provided for webhook verification');
      return false;
    }

    const ip = this.normalizeIp(clientIp);
    
    this.logger.debug(`Verifying webhook IP: ${clientIp} (normalized: ${ip})`);

    for (const range of this.yookassaIpRanges) {
      try {
        if (this.isIpInRange(ip, range)) {
          this.logger.debug(`IP ${ip} matched YooKassa range: ${range}`);
          return true;
        }
      } catch (error) {
        this.logger.warn(`Error checking IP ${ip} against range ${range}: ${error.message}`);
      }
    }

    this.logger.warn(`IP ${ip} does not match any YooKassa IP range`);
    return false;
  }

  private normalizeIp(ip: string): string {
    let normalized = ip.split(':').slice(0, ip.includes('::') ? -1 : undefined).join(':') || ip;
    
    if (normalized.startsWith('::ffff:')) {
      normalized = normalized.substring(7);
    }
    
    return normalized.trim();
  }

  private isIpInRange(ip: string, range: string): boolean {
    if (!range.includes('/')) {
      return ip === range;
    }

    if (this.isIPv4(ip) && range.includes('.')) {
      return this.isIPv4InRange(ip, range);
    }

    if (this.isIPv6(ip) && range.includes(':')) {
      return this.isIPv6InRange(ip, range);
    }

    return false;
  }

  private isIPv4(ip: string): boolean {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
      const num = parseInt(part, 10);
      return !isNaN(num) && num >= 0 && num <= 255;
    });
  }

  private isIPv6(ip: string): boolean {
    return ip.includes(':');
  }

  private isIPv4InRange(ip: string, cidr: string): boolean {
    const [rangeIp, prefixLength] = cidr.split('/');
    const prefix = parseInt(prefixLength, 10);
    
    if (isNaN(prefix) || prefix < 0 || prefix > 32) {
      return false;
    }

    const ipNum = this.ipv4ToNumber(ip);
    const rangeNum = this.ipv4ToNumber(rangeIp);
    const mask = (0xffffffff << (32 - prefix)) >>> 0;

    return (ipNum & mask) === (rangeNum & mask);
  }

  private ipv4ToNumber(ip: string): number {
    const parts = ip.split('.');
    return (
      (parseInt(parts[0], 10) << 24) |
      (parseInt(parts[1], 10) << 16) |
      (parseInt(parts[2], 10) << 8) |
      parseInt(parts[3], 10)
    ) >>> 0;
  }

  private isIPv6InRange(ip: string, cidr: string): boolean {
    const [rangeIp, prefixLength] = cidr.split('/');
    const prefix = parseInt(prefixLength, 10);
    
    if (isNaN(prefix) || prefix < 0 || prefix > 128) {
      return false;
    }

    const ipNum = this.ipv6ToBigInt(ip);
    const rangeNum = this.ipv6ToBigInt(rangeIp);
    const mask = (BigInt(0xffffffffffffffff) << BigInt(128 - prefix)) & BigInt('0xffffffffffffffffffffffffffffffff');

    return (ipNum & mask) === (rangeNum & mask);
  }

  private ipv6ToBigInt(ip: string): bigint {
    const expanded = this.expandIPv6(ip);
    const parts = expanded.split(':');
    
    let result = BigInt(0);
    for (let i = 0; i < 8; i++) {
      const part = parseInt(parts[i] || '0', 16);
      result = (result << BigInt(16)) | BigInt(part);
    }
    
    return result;
  }

  private expandIPv6(ip: string): string {
    if (ip.includes('::')) {
      const parts = ip.split('::');
      const leftParts = parts[0] ? parts[0].split(':') : [];
      const rightParts = parts[1] ? parts[1].split(':') : [];
      const missingParts = 8 - leftParts.length - rightParts.length;
      const expanded = [
        ...leftParts,
        ...Array(missingParts).fill('0'),
        ...rightParts,
      ];
      return expanded.join(':');
    }
    
    return ip;
  }
}
