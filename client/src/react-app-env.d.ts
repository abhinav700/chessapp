declare module 'process' {
    global {
      namespace NodeJS {
        interface ProcessEnv extends Partial<Record<string, string>> {
          readonly REACT_APP_VARIABLE_NAME: string;
          // Add your other environment variables here
        }
      }
    }
  }
declare module '*.mp3'; 