/* eslint-disable no-console */
export default class Logger {
  name;

  constructor(name: string) {
    this.name = name;
  }

  log = (...params: string[]) => {
    console.log(`[${this.name}] ${params.join(" ")}`);
  };

  info = (...params: string[]) => {
    console.info(`[${this.name}] ${params.join(" ")}`);
  };

  warn = (...params: string[]) => {
    console.warn(`[${this.name}] ${params.join(" ")}`);
  };

  error = (...params: string[]) => {
    console.error(`[${this.name}] ${params.join(" ")}`);
  };
}
