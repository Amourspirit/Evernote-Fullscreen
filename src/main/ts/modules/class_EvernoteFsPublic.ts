// import jQ from 'jquery';
import { Log } from './class_Log';
import { IntervalManual } from './class_InternalManual';
import { appSettings } from './app_settings';
import { DebugLevel } from './enums';
import { elementCreate } from './ElementHelper';
import { BaseEvernoteFullscreen } from './abstract_class_EvernoteFullScreen';
import { IKeyValueGeneric } from './interfaces';
// import * as jQ from 'jquery';
declare const jQ: any;
// see: https://stackoverflow.com/questions/33768509/how-to-make-an-iframe-to-go-fullscreen-on-a-button-click
export class EvernoteFsPubilc extends BaseEvernoteFullscreen {
  private lprevSet: IKeyValueGeneric<string> = {
    class: '',
    scrolling: 'yes',
    style: '',
    frameborder: '0'
  };
  public init(): void {
    super.init();
    this.injectButton();
    this.addBtnClick();
  }
  protected toggleDisplay(): void {
    // @debug start
    const methodName: string = 'resetIframe';
    const appDebugLevel = appSettings.debugLevel;
    const levelDebug = DebugLevel.debug;
    if (appDebugLevel >= levelDebug) { Log.debug(`${methodName}: Entered`); }
    // @debug end
    const ifrmElment = document.querySelector(appSettings.iframeSelector);
    if (!ifrmElment) {
      // @debug start
      Log.debugWarn('addBtnClick: unable to find iframe: ' + appSettings.iframeSelector);
      // @debug end
      return;
    }
    if (this.inFullScreen === true) {
      this.lprevSet.class = ifrmElment.getAttribute('class') || '';
      this.lprevSet.scrolling = ifrmElment.getAttribute('scrolling') || '';
      this.lprevSet.style = ifrmElment.getAttribute('style') || '';
      this.lprevSet.frameborder = ifrmElment.getAttribute('frameborder') || '';
      ifrmElment.setAttribute('class', 'enfs-if-show');
      ifrmElment.setAttribute('scrolling', 'yes');
      ifrmElment.setAttribute('style', '');
      ifrmElment.setAttribute('frameborder', '0');
    } else {
      ifrmElment.setAttribute('class', this.lprevSet.class);
      ifrmElment.setAttribute('scrolling', this.lprevSet.scrolling);
      ifrmElment.setAttribute('style', this.lprevSet.style);
      ifrmElment.setAttribute('frameborder', this.lprevSet.frameborder);
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
        class: 'enfs-button-pub'
      }
    });
    btnDiv.appendChild(innerSpan);
    return btnDiv;
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
        const ifrmElment = document.querySelector(appSettings.iframeSelector);
        if (!ifrmElment) {
          // @debug start
          Log.debugWarn('addBtnClick: unable to find iframe with selector of: ' + appSettings.iframeSelector);
          // @debug end
          return;
        }
        if (ifrmElment !== null) {

          if (ifrmElment.requestFullscreen) {
            ifrmElment.requestFullscreen();
          } else if ((ifrmElment as any).webkitRequestFullscreen) {
            (ifrmElment as any).webkitRequestFullscreen();
          } else if ((ifrmElment as any).mozRequestFullScreen) {
            (ifrmElment as any).mozRequestFullScreen();
          } else if ((ifrmElment as any).msRequestFullscreen) {
            (ifrmElment as any).msRequestFullscreen();
          }
/* // does not work in chorme
          const reqF = (ifrmElment as any).requestFullScreen
            || (ifrmElment as any).webkitRequestFullScreen
            || (ifrmElment as any).mozRequestFullScreen
            || (ifrmElment as any).msRequestFullscreen;
          reqF.call(ifrmElment); */
        }
      });
    });
    intTick.onExpired().subscribe((): void => {
      Log.warn(`Unable to find button ${appSettings.buttonId}`);
    });
    intTick.start();
  }
}