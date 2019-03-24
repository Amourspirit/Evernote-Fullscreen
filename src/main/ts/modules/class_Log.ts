import { appSettings } from './appSettings';
import { DebugLevel } from './enums';
export class Log {

  public static message(msg: string, optionalParams?: any[]): void {
    if (appSettings.debugLevel < DebugLevel.info) {
      return;
    }
    const params = [];
    for (let i = 1; i < arguments.length; i++) {
      params[i - 1] = arguments[i];
    }
    console.log(msg, ...params);
  }

  public static warn(msg: string, optionalParams?: any[]): void {
    if (appSettings.debugLevel < DebugLevel.warn) {
      return;
    }
    const params = [];
    for (let i = 1; i < arguments.length; i++) {
      params[i - 1] = arguments[i];
    }
    console.warn(msg, ...params);
  }

  public static error(msg: any, optionalParams?: any[]): void {
    if (appSettings.debugLevel < DebugLevel.error) {
      return;
    }
    const params = [];
    for (let i = 1; i < arguments.length; i++) {
      params[i - 1] = arguments[i];
    }
    console.error(msg, ...params);
  }
  public static debug(msg: string, optionalParams?: any[]): void {
    if (appSettings.debugLevel < DebugLevel.debug) {
      return;
    }
    const params = [];
    for (let i = 1; i < arguments.length; i++) {
      params[i - 1] = arguments[i];
    }
    console.log(`${appSettings.shortName}: Debug: ${msg}`, ...params);
  }

  public static debugWarn(msg: string, optionalParams?: any[]): void {
    if (appSettings.debugLevel < DebugLevel.debug) {
      return;
    }
    const params = [];
    for (let i = 1; i < arguments.length; i++) {
      params[i - 1] = arguments[i];
    }
    console.warn(`${appSettings.shortName}: Debug: ${msg}`, ...params);
  }
}