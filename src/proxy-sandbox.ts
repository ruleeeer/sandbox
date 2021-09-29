import { SandboxInterface, SandboxParamInterface } from '@originjs/sandbox'
import { Sandbox } from './sandbox'

export default class ProxySandbox extends Sandbox implements SandboxInterface {
  readonly #id: string
  #isActive = false
  readonly #proxy: Window
  readonly #rawWindow: Window
  #fakeWindow: Window = Object.create(null)
  readonly #escapeReadable: Set<PropertyKey>
  readonly #escapeWritable: Set<PropertyKey>

  constructor(param?: SandboxParamInterface) {
    super()
    this.#escapeReadable = param?.escapeReadable ?? new Set<PropertyKey>()
    this.#escapeWritable = param?.escapeWriteable ?? new Set<PropertyKey>()
    this.#rawWindow = param?.rawWindow ?? window
    this.#id = param?.id ?? ''
    this.#proxy = new Proxy(this.#fakeWindow, {
      set: (_: Window, prop: string | symbol, value: any) => {
        if (this.#isActive) {
          Reflect.set(this.#fakeWindow, prop, value)
          if (this.#escapeWritable.has(prop)) {
            Reflect.set(this.#rawWindow, prop, value)
          }
          return true
        } else {
          console.warn('Please activate the sandbox before using it')
          return false
        }
      },
      get: (_: Window, prop: string | symbol) => {
        if (this.#isActive) {
          if (Reflect.has(this.#fakeWindow, prop)) {
            return Reflect.get(this.#fakeWindow, prop)
          } else if (this.#escapeReadable.has(prop)) {
            return Reflect.get(this.#rawWindow, prop)
          }
        } else {
          console.warn('Please activate the sandbox before using it')
        }
        return undefined
      }
    })
  }

  get isActive(): boolean {
    return this.#isActive
  }

  get id(): string {
    return this.#id
  }

  get proxy(): Window {
    return this.#proxy
  }

  activate(): void {
    if (!this.#isActive) {
      if (this.#id) {
        //    try to recovery form previous sandbox
        const previousSandbox = ProxySandbox._id2Sandbox.get(this.#id)
        if (previousSandbox) {
          this.#fakeWindow = previousSandbox.#fakeWindow
        } else {
          Sandbox._id2Sandbox.set(this.#id, this)
        }
      }
      this.#isActive = true
      Sandbox._activeCount++
    }
  }

  deactivate(): void {
    if (this.#isActive) {
      if (this.#id) {
        Sandbox._id2Sandbox.set(this.#id, this)
      }
      this.#isActive = false
      Sandbox._activeCount--
    }
  }
}
