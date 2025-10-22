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
        ownerOrganizationId: number;
        connectedPoses: number;
        engagedClients: number;
    }
}

export function mapLoyaltyProgramToParticipantResponse(
  program: LTYProgram,
  participantId: number,
  connectedPoses?: number,
  engagedClients?: number,
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
        ownerOrganizationId: program.ownerOrganizationId,
        connectedPoses: connectedPoses ?? 0,
        engagedClients: engagedClients ?? 0,
    }
  };
}
