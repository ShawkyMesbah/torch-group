interface ErrorDetails {
  message: string;
  stack?: string;
  context?: Record<string, any>;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: ErrorDetails[] = [];
  private readonly MAX_ERRORS = 100;

  private constructor() {}

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  public log(error: Error, context?: Record<string, any>) {
    const errorDetails: ErrorDetails = {
      message: error.message,
      stack: error.stack,
      context,
    };

    // Add to local storage
    this.errors.push(errorDetails);
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error);
      if (context) {
        console.error('Context:', context);
      }
    }

    // Send to your error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(errorDetails);
    }
  }

  private async sendToErrorService(errorDetails: ErrorDetails) {
    try {
      // Replace with your error tracking service
      await fetch('/api/log-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorDetails),
      });
    } catch (e) {
      console.error('Failed to send error to tracking service:', e);
    }
  }

  public getErrors(): ErrorDetails[] {
    return [...this.errors];
  }

  public clearErrors(): void {
    this.errors = [];
  }
}

export const errorLogger = ErrorLogger.getInstance(); 