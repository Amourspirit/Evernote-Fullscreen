/**
 * Determins the debug level of the project
 * @param none Nothing will be logged
 * @param debug Everyting will be loged
 * @param error Everything but debug info will be logged
 * @param warn Warnings and info will be logged
 * @param info Only info will be logged
 */
export enum DebugLevel {
  /**
   * Everyting will be loged
   */
  debug,
  /**
   * Everything but debug info will be logged
   */
  error,
  /**
   * Warnings and info will be logged
   */
  warn,
  /**
   * Only info will be logged
   */
  info,
  /**
   * Nothing will be logged
   */
  none,
}

export enum ScriptLinkType {
  css,
  cssLink,
  linkedJs
}

export enum ElementLocation {
  head,
  body,
  other
}