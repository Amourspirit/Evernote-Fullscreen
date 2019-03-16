// import jQ from 'jquery';
import { Log } from './class_Log';
import { appSettings } from './app_settings';
import { DebugLevel } from './enums';
// import * as jQ from 'jquery';
// see: https://stackoverflow.com/questions/33768509/how-to-make-an-iframe-to-go-fullscreen-on-a-button-click
export abstract class BaseEvernoteFullscreen {
  protected inFullScreen: boolean = false;

  protected init(): void {
    this.addDoucmentEvent();
  }
  protected toggleDisplay(): void {
    throw new Error('Must be overriden in extended classes');
  }

  private addDoucmentEvent(): void {
    // @debug start
    const methodName: string = 'addDoucmentEvent';
    const appDebugLevel = appSettings.debugLevel;
    const levelDebug = DebugLevel.debug;
    if (appDebugLevel >= levelDebug) { Log.debug(`${methodName}: Entered`); }
    // @debug end
    if (document.fullscreenEnabled) {
      document.addEventListener('fullscreenchange', this.fullScreenChange);
    } else if ((document as any).webkitExitFullscreen) {
      document.addEventListener('webkitfullscreenchange', this.fullScreenChange);
    } else if ((document as any).mozRequestFullScreen) {
      document.addEventListener('mozfullscreenchange', this.fullScreenChange);
    } else if ((document as any).msRequestFullscreen) {
      document.addEventListener('MSFullscreenChange', this.fullScreenChange);
    }
    // @debug start
    if (appDebugLevel >= levelDebug) { Log.debug(`${methodName}: Leaving`); }
    // @debug end
  }

  private fullScreenChange = (): void => {
    // @debug start
    const methodName: string = 'fullScreenChange';
    const appDebugLevel = appSettings.debugLevel;
    const levelDebug = DebugLevel.debug;
    if (appDebugLevel >= levelDebug) { Log.debug(`${methodName}: Entered`); }
    // @debug end
    if (document.fullscreenEnabled ||
      (document as any).webkitIsFullScreen ||
      (document as any).mozFullScreen ||
      (document as any).msFullscreenElement) {
      this.inFullScreen = !this.inFullScreen;
      // @debug start
      if (appDebugLevel >= levelDebug) { Log.debug(`${methodName}: In Fullscreen`); }
      // @debug end
    } else {
      // @debug start
      if (appDebugLevel >= levelDebug) { Log.debug(`${methodName}: Not in Fullscreen`); }
      // @debug end
    }
    this.toggleDisplay();
    // @debug start
    if (appDebugLevel >= levelDebug) { Log.debug(`${methodName}: Leaving`); }
    // @debug end
  }
}