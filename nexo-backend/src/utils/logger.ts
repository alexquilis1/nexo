/**
 * Sistema de logging profesional
 */

enum LogLevel {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CONTRACT = 'CONTRACT',
}

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = this.getTimestamp();
    let formatted = `[${timestamp}] ${level}: ${message}`;
    
    if (data) {
      formatted += `\n${JSON.stringify(data, null, 2)}`;
    }
    
    return formatted;
  }

  info(message: string, data?: any) {
    console.log(this.formatMessage(LogLevel.INFO, message, data));
  }

  success(message: string, data?: any) {
    console.log(this.formatMessage(LogLevel.SUCCESS, message, data));
  }

  warning(message: string, data?: any) {
    console.warn(this.formatMessage(LogLevel.WARNING, message, data));
  }

  error(message: string, data?: any) {
    console.error(this.formatMessage(LogLevel.ERROR, message, data));
  }

  contract(contractName: string, action: string, data?: any) {
    const message = `${contractName} - ${action}`;
    console.log(this.formatMessage(LogLevel.CONTRACT, message, data));
  }
}

const logger = new Logger();
export default logger;