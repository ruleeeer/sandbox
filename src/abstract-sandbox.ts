export abstract class AbstractSandbox {
  protected static _activeCount = 0
  protected static _id2Sandbox: Map<string, AbstractSandbox> = new Map<
    string,
    AbstractSandbox
  >()
  protected abstract readonly _id: string
  protected abstract _isActive
  protected abstract readonly _proxy: Window
  protected abstract readonly _rawWindow: Window
  protected abstract _fakeWindow: Window
  protected abstract readonly _escapeReadable: Set<PropertyKey>
  protected abstract readonly _escapeWritable: Set<PropertyKey>

  get activeCount(): number {
    return AbstractSandbox._activeCount
  }

  abstract executeJS(src: string): void

  abstract get isActive(): boolean

  abstract get id(): string

  abstract get proxy(): Window

  abstract activate(): void

  abstract deactivate(): void
}
