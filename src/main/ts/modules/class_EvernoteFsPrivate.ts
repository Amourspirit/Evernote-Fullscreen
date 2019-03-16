// import jQ from 'jquery';
import { Log } from './class_Log';
import { IntervalManual } from './class_InternalManual';
import { appSettings } from './app_settings';
import { DebugLevel } from './enums';
import { elementCreate } from './ElementHelper';
import { BaseEvernoteFullscreen } from './abstract_class_EvernoteFullScreen';
// import * as jQ from 'jquery';
declare const jQ: any;
// see: https://stackoverflow.com/questions/33768509/how-to-make-an-iframe-to-go-fullscreen-on-a-button-click
export class EvernoteFsPrivate extends BaseEvernoteFullscreen {

  public init(): void {
    super.init();
    this.injectButton();
    this.injectIframe();
    this.addBtnClick();
  }
  protected toggleDisplay(): void {
    // @debug start
    const methodName: string = 'resetIframe';
    const appDebugLevel = appSettings.debugLevel;
    const levelDebug = DebugLevel.debug;
    if (appDebugLevel >= levelDebug) { Log.debug(`${methodName}: Entered`); }
    // @debug end
    const fsIframe = document.getElementById(appSettings.fsIframeID);
    if (!fsIframe) {
      // @debug start
      Log.debugWarn('resetIframe: unable to find iframe with id of: ' + appSettings.fsIframeID);
      // @debug end
      return;
    }
    if (this.inFullScreen === true) {
      const ifrmElment = document.querySelector(appSettings.iframeSelector);
      if (!ifrmElment) {
        // @debug start
        Log.debugWarn('addBtnClick: unable to find iframe: ' + appSettings.iframeSelector);
        // @debug end
        return;
      }
      const ifrmSrc = ifrmElment.getAttribute('src');
      if (fsIframe !== null) {
        fsIframe.setAttribute('class', 'enfs-if-show');
        fsIframe.setAttribute('src', ifrmSrc || '');
      }
    } else {
      if (fsIframe !== null) {
        fsIframe.setAttribute('class', 'enfs-if-noshow');
        fsIframe.setAttribute('src', '');
      }
    }
    // @debug start
    if (appDebugLevel >= levelDebug) { Log.debug(`${methodName}: Leaving`); }
    // @debug end
  }
  private injectButton(): void {
    const divBtnHolder: JQuery<HTMLElement> = jQ(appSettings.buttonPlacementSelector);
    if (!divBtnHolder.length) {
      Log.error(`${appSettings.shortName} could not find where to place button: selector: ${appSettings.buttonPlacementSelector}`);
      return;
    }
    const btnHtml = this.getButton();
    // Log.message(`${appSettings.shortName} Button HTML: ${btnHtml}`);
    divBtnHolder.append(btnHtml);
  }
  private injectIframe(): void {
    const divBtnHolder: JQuery<HTMLElement> = jQ(appSettings.buttonPlacementSelector);
    if (!divBtnHolder.length) {
      Log.error(`${appSettings.shortName} could not find where to place button: selector: ${appSettings.buttonPlacementSelector}`);
      return;
    }
    const ifrm = this.getIFrame();
    divBtnHolder.append(ifrm);
  }
  private getButton(): HTMLElement {
    /* let html: string = `<div id="${appSettings.buttonId}"`;
    html += ' class="enfs-button"><span class="enfs-btntooltip">Click to open note in full screen view</span></div>';
    return html; */

    const innerSpan: HTMLElement = elementCreate({
      elementTag: 'span',
      elementAttributes: {
        class: 'enfs-btntooltip'
      },
      elementText: 'Click to open note in full screen view'
    });
    const btnDiv: HTMLElement = elementCreate({
      elementTag: 'div',
      elementAttributes: {
        id: appSettings.buttonId,
        class: 'enfs-button-priv'
      }
    });
    btnDiv.appendChild(innerSpan);
    return btnDiv;
  }
  private getIFrame(): HTMLElement {
    const ifrm: HTMLElement = elementCreate({
      elementTag: 'iframe',
      elementAttributes: {
        id: appSettings.fsIframeID,
        class: 'enfs-if-noshow',
        scrolling: 'yes',
        frameborder: '0',
        src: ''
      }
    });
    return ifrm;
  }
  private addBtnClick(): void {
    const intTick = new IntervalManual(500, 30);
    intTick.onTick().subscribe((): void => {
      const divBtn: JQuery<HTMLElement> = jQ(`#${appSettings.buttonId}`);
      if (!divBtn.length) {
        Log.message(`try no: ${intTick.count} looking for button: ${appSettings.buttonId}`);
        return;
      }
      Log.message(`Found button ${appSettings.buttonId} on try ${intTick.count}`);
      intTick.dispose();
      divBtn.on('click', (): void => {
        // @debug start
        Log.message('Button onclick fired');
        // @debug end
        const fsIframe = document.getElementById(appSettings.fsIframeID);
        if (!fsIframe) {
          // @debug start
          Log.debugWarn('addBtnClick: unable to find iframe with id of: ' + appSettings.fsIframeID);
          // @debug end
          return;
        }
        if (fsIframe.requestFullscreen) {
          fsIframe.requestFullscreen();
        } else if ((fsIframe as any).webkitRequestFullscreen) {
          (fsIframe as any).webkitRequestFullscreen();
        } else if ((fsIframe as any).mozRequestFullScreen) {
          (fsIframe as any).mozRequestFullScreen();
        } else if ((fsIframe as any).msRequestFullscreen) {
          (fsIframe as any).msRequestFullscreen();
        }
/* // does not work in chorme
        if (fsIframe !== null) {
          const reqF = (fsIframe as any).requestFullScreen
            || (fsIframe as any).webkitRequestFullScreen
            || (fsIframe as any).mozRequestFullScreen
            || (fsIframe as any).msRequestFullscreen;
          reqF.call(fsIframe);
        } */
      });
    });
    intTick.onExpired().subscribe((): void => {
      Log.warn(`Unable to find button ${appSettings.buttonId}`);
    });
    intTick.start();
  }
}