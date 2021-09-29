declare module '@originjs/sandbox' {
  interface SandboxParamInterface {
    escapeReadable?: Set<PropertyKey>
    escapeWriteable?: Set<PropertyKey>
    rawWindow?: Window
    id?: string
  }

  interface SandboxInterface {
    get isActive(): boolean

    get id(): string

    get proxy(): Window

    activate(): void

    deactivate(): void
  }
}
