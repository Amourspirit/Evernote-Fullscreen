import { EvernoteFsPrivate } from './modules/class_EvernoteFsPrivate';
import { Log } from './modules/class_Log';
import { appSettings } from './modules/app_settings';
import { ElementJsNode } from './modules/class_ElementJsNode';
import { ElementLocation } from './modules/enums';
import { ElementCssNode } from './modules/class_ElementCssNode';
import { EvernoteFsPubilc } from './modules/class_EvernoteFsPublic';

const validateIfTop = (): boolean => {
  return window.top === window.self;
};

const main = () => {
  Log.message(appSettings.shortName + ': Start loading...');
  // @debug start
  Log.debug(`Current url: ${window.location.href}`);
  // @debug end
  const url = window.location.href;
  if (url.indexOf('/client/') > 0) {
    Log.debug('found client in url');
    const enPub: EvernoteFsPubilc = new EvernoteFsPubilc();
    enPub.init();
  } else {
    Log.debug('client not found in url');
    const enPriv: EvernoteFsPrivate = new EvernoteFsPrivate();
    enPriv.init();
  }
  Log.message(appSettings.shortName + ': End loading...');
};

if (validateIfTop()) {
  const elBtn = new ElementCssNode({
    scriptLocation: ElementLocation.body,
    textContent: `// BUILD_INCLUDE('./scratch/css/style.min.css')[asjsstring]`
  });
  elBtn.start();
  // add JQuery();
  const loadJs = new ElementJsNode({
    scriptLocation: ElementLocation.body,
    functionToRun: 'window.jQ=jQuery.noConflict(true);',
    tyepName: 'jQ',
    src: '//cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js'
  });
  loadJs.onTick().subscribe((sender, args) => {
    Log.message(`ScriptJsNode Tick ${args.count}`);
  });
  loadJs.onExpired().subscribe((sender, args) => {
    Log.message(`ScriptJsNode Tick Expired ${args.count}`);
  });
  loadJs.onScriptLoaded().subscribe((sender, args) => {
    Log.message(`ScriptJsNode Found Script for jquery count was ${args.count}`);
    main();
  });
  loadJs.start();
}
