export interface AuditLogObj {
  action: string;
  message: string;
  userId: number;
  username: string;
  timestamp: Date;
}
