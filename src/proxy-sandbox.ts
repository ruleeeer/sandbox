import { AbstractSandbox } from './abstract-sandbox'
import { SandboxParamInterface } from '@originjs/sandbox'

export default class ProxySandbox extends AbstractSandbox {
  protected _id: string
  protected _isActive: any
  protected _proxy: Window
  protected _rawWindow: Window
  protected _fakeWindow: Window = Object.create(null)
  protected _escapeReadable: Set<PropertyKey> = new Set<PropertyKey>()
  protected _escapeWritable: Set<PropertyKey> = new Set<PropertyKey>()

  constructor(param?: SandboxParamInterface) {
    super()
    param?.escapeReadable
      ? param.escapeReadable.forEach((v) => this._escapeReadable.add(v))
      : void 0
    param?.escapeWriteable
      ? param.escapeWriteable.forEach((v) => this._escapeWritable.add(v))
      : void 0
    this._rawWindow = param?.rawWindow ?? window
    this._id = param?.id ?? ''
    // restore _fakeWindow from previous same id sandbox
    if (this._id) {
      const previousSandbox = AbstractSandbox._id2Sandbox.get(this._id)
      if (previousSandbox) {
        this._fakeWindow = (previousSandbox as ProxySandbox)._fakeWindow
      } else {
        AbstractSandbox._id2Sandbox.set(this._id, this)
      }
    }
    this._proxy = new Proxy(this._fakeWindow, {
      set: (target: Window, prop: string | symbol, value: any) => {
        if (this._isActive) {
          Reflect.set(target, prop, value)
          if (this._escapeWritable.has(prop)) {
            Reflect.set(this._rawWindow, prop, value)
          }
          return true
        } else {
          console.warn('Please activate the sandbox before using it')
          return false
        }
      },
      get: (target: Window, prop: string | symbol) => {
        if (this._isActive) {
          if (Reflect.has(target, prop)) {
            return Reflect.get(target, prop)
          } else if (this._escapeReadable.has(prop)) {
            return Reflect.get(this._rawWindow, prop)
          }
        } else {
          console.warn('Please activate the sandbox before using it')
        }
        return undefined
      },
      has: (target: Window, prop: string | symbol) => {
        return (
          Reflect.has(target, prop) ||
          (this._escapeReadable.has(prop) && Reflect.has(this._rawWindow, prop))
        )
      },
      deleteProperty: (target: Window, prop: string | symbol) => {
        if (this._isActive) {
          return (
            Reflect.deleteProperty(target, prop) &&
            (this._escapeWritable.has(prop)
              ? Reflect.deleteProperty(this._rawWindow, prop)
              : true)
          )
        } else {
          console.warn('Please activate the sandbox before using it')
          return false
        }
      },
      ownKeys: (target: Window) => {
        return Reflect.ownKeys(target).concat(Reflect.ownKeys(this._rawWindow))
      },
      defineProperty: (
        target: Window,
        prop: string | symbol,
        attributes: PropertyDescriptor
      ) => {
        if (this._isActive) {
          Reflect.set(target, prop, attributes)
          if (this._escapeWritable.has(prop)) {
            Reflect.set(this._rawWindow, prop, attributes)
          }
          return true
        } else {
          console.warn('Please activate the sandbox before using it')
          return false
        }
      },
      getOwnPropertyDescriptor: (target: Window, prop: string | symbol) => {
        if (Reflect.has(target, prop)) {
          return Reflect.getOwnPropertyDescriptor(target, prop)
        } else if (this._escapeReadable.has(prop)) {
          return Reflect.getOwnPropertyDescriptor(this._rawWindow, prop)
        }
        return undefined
      }
    })
  }

  get isActive(): boolean {
    return this._isActive
  }

  get id(): string {
    return this._id
  }

  get proxy(): Window {
    return this._proxy
  }

  activate(): void {
    if (!this._isActive) {
      this._isActive = true
      AbstractSandbox._activeCount++
    }
  }

  deactivate(): void {
    if (this._isActive) {
      this._isActive = false
      AbstractSandbox._activeCount--
    }
  }
}
