import { LTYProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';

export class LoyaltyProgramParticipantResponseDto {
    props:{
        id: number;
        name: string;
        status: string;
        startDate: Date;
        isHub: boolean;
        isHubRequested: boolean;
        isHubRejected: boolean;
        lifetimeDays?: number;
        participantId: number; 
    }
}

export function mapLoyaltyProgramToParticipantResponse(
  program: LTYProgram,
  participantId: number,
): LoyaltyProgramParticipantResponseDto {
  return {
    props: {
        id: program.id,
        name: program.name,
        status: program.status,
        startDate: program.startDate,
        isHub: program.isHub,
        isHubRequested: program.isHubRequested,
        isHubRejected: program.isHubRejected,
        lifetimeDays: program.lifetimeDays,
        participantId: participantId,
    }
  };
}
