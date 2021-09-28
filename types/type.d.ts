export interface SandboxParamInterface {
    localProps?: Set<PropertyKey>
    escapeProps?: Set<PropertyKey>
    rawWindow?: Window
    id?: string
}

export abstract class SandBox {
    abstract readonly id: string
    abstract isActive: boolean
    abstract readonly proxyWindow: Window
    abstract rawWindow: Window
    abstract readonly fakeWindow: Window
    abstract readonly localProps: Set<PropertyKey>
    abstract readonly escapeProps: Set<PropertyKey>
    static activeCount: number
    static id2Sandbox: Map<String, SandBox>

    abstract active(): void;

    abstract inActive(): void;
}
