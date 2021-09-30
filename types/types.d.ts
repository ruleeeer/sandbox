declare module '@originjs/sandbox' {
  interface SandboxParamInterface {
    escapeReadable?: PropertyKey[]
    escapeWriteable?: PropertyKey[]
    rawWindow?: Window
    id?: string
  }
}
