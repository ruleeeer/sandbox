import ProxySandbox from './proxy-sandbox'

export class Sandbox {
  protected static _activeCount = 0
  protected static _id2Sandbox: Map<string, AnySandbox> = new Map<
    string,
    AnySandbox
  >()

  get activeCount(): number {
    return Sandbox._activeCount
  }
}

export type AnySandbox = ProxySandbox
