import { ElementLocation, DebugLevel } from './enums';
import { appSettings } from './appSettings';
import { Log } from './class_Log';

/**
 * Arguments for ElementsCssNode
 * @param scriptLocation (required)
 * @param textContent (required)
 */
export interface IElementCssNodeArgs {
  /**
   * The location to inject the script such as head or body.
   */
  scriptLocation: ElementLocation;
  /**
   * text/html to add to the element content.
   */
  textContent: string;
}
/**
 * Adds css inline to document page
 */
export class ElementCssNode {
  private lArgs: IElementCssNodeArgs;
  public constructor(args: IElementCssNodeArgs) {
    this.lArgs = args;
  }
  public start(): void {
    // @debug start
    const methodName: string = 'ElementCssNode.addCssNode';
    // Higher price to check using enumes each time so capture the values here
    const appDebugLevel = appSettings.debugLevel;
    const levelDebug = DebugLevel.debug;

    if (appDebugLevel >= levelDebug) {
      Log.debug(`${methodName}: Entered.`);
    }
    // @debug end
    if (this.lArgs.textContent.length === 0) {
      Log.warn(`ElementCssNode.addCssNode: Not content for css injection. Empty style element will be created.`);
    }
    const D: Document = document;
    const scriptNode: HTMLStyleElement = D.createElement('style');
    scriptNode.type = 'text/css';
    scriptNode.textContent = this.lArgs.textContent;
    let targ: Element;
    switch (this.lArgs.scriptLocation) {
      case ElementLocation.body:
        // @debug start
        if (appDebugLevel >= levelDebug) { Log.debug(`${methodName}: Case body`); }
        // @debug end
        targ = D.getElementsByTagName('body')[0] || D.body;
        break;
      case ElementLocation.head:
        // @debug start
        if (appDebugLevel >= levelDebug) { Log.debug(`${methodName}: Case head`); }
        // @debug end
        targ = D.getElementsByTagName('head')[0] || D.head;
        break;
      default:
        // @debug start
        if (appDebugLevel >= levelDebug) { Log.debug(`${methodName}: Case default: body, documentelement`); }
        // @debug end
        targ = D.getElementsByTagName('body')[0] || D.body || D.documentElement;
        break;
    }
    targ.appendChild(scriptNode);
    // @debug start
    if (appDebugLevel >= levelDebug) { Log.debug(`${methodName}: Leaving`); }
    // @debug end
  }
}