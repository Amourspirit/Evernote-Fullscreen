import { DebugLevel } from './enums';
import { IKeyValueGeneric } from './interfaces';
// see // https://blog.neufund.org/why-we-have-banned-default-exports-and-you-should-do-the-same-d51fdc2cf2ad
/* export class AppSettings {
  public static readonly debugLevel: DebugLevel = DebugLevel.Info;
  public static readonly shortName: string = 'ENFS';
  public static readonly buttonPlacementSelector: string = 'div.note-view-content-container';
  public static readonly buttonId: string = 'enote-btn-id';
} */
export interface IappSettings {
  debugLevel: DebugLevel;
  shortName: string;
  buttonPlacementSelector: string;
  buttonId: string;
  iframeSelector: string;
  fsIframeID: string;
}

export const appSettings: IKeyValueGeneric<any> & IappSettings  = {
  debugLevel: DebugLevel.info,
  shortName: 'ENFS',
  buttonPlacementSelector: 'body',
  buttonId: 'enote-btn-id',
  iframeSelector: '#container iframe',
  fsIframeID: 'enote-iframe-id'
};

export const updateAppSetting = (key: string, value: any): void => {
  if (appSettings.hasOwnProperty(key)) {
    appSettings[key] = value;
  }
};