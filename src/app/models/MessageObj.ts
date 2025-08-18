type MessageSeverity = 'error' | 'warning' | 'info' | 'success';

export class MessageObj {
  severity: MessageSeverity;
  colorType: MessageSeverity;
  title: string;
  description: string;

  constructor(
    severity: MessageSeverity = 'info',
    title: string = '',
    description: string = '',
    colorType?: MessageSeverity
  ) {
    this.severity = severity;
    this.title = title;
    this.description = description;
    this.colorType = colorType ?? severity;
  }
}