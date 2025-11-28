export enum PaymentSubject {
  COMMODITY = 'commodity',
  EXCISE = 'excise',
  JOB = 'job',
  SERVICE = 'service',
  GAMBLING_BET = 'gambling_bet',
  GAMBLING_PRIZE = 'gambling_prize',
  LOTTERY = 'lottery',
  LOTTERY_PRIZE = 'lottery_prize',
  INTELLECTUAL_ACTIVITY = 'intellectual_activity',
  PAYMENT = 'payment',
  AGENT_COMMISSION = 'agent_commission',
  COMPOSITE = 'composite',
  ANOTHER = 'another',
}

export enum PaymentMode {
  FULL_PAYMENT = 'full_payment',
  FULL_PREPAYMENT = 'full_prepayment',
  ADVANCE = 'advance',
  PARTIAL_PREPAYMENT = 'partial_prepayment',
  CREDIT = 'credit',
  CREDIT_PAYMENT = 'credit_payment',
}
