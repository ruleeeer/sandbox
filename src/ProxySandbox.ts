import {SandBox, SandboxParamInterface} from "./type";

export default class ProxySandbox extends SandBox {
    isActive: boolean = false;
    escapeProps: Set<PropertyKey>;
    localProps: Set<PropertyKey>;
    proxyWindow: Window;
    rawWindow: Window;
    fakeWindow: Window = {} as Window;
    id: string;

    constructor({
                    id: id,
                    escapeProps: escapeProps,
                    localProps: localProps,
                    rawWindow: rawWindow,
                }: SandboxParamInterface) {
        super();
        const global = ['window', 'globalThis'];

        this.escapeProps = escapeProps ?? new Set<PropertyKey>();
        this.localProps = localProps ?? new Set<PropertyKey>();
        this.rawWindow = rawWindow ?? window;
        this.id = id ?? '';
        this.proxyWindow = new Proxy(this.fakeWindow, {
            set: (_: Window, prop: string | symbol, value: any) => {
                if (this.isActive) {
                    Reflect.set(this.fakeWindow, prop, value);
                    if (this.escapeProps.has(prop)) {
                        Reflect.set(this.rawWindow, prop, value);
                    }
                    return true;
                } else {
                    console.warn('Please set properties in active sandbox');
                    return false;
                }
            },
            get: (_: Window, prop: string | symbol) => {
                if (this.isActive) {
                    const key = String(prop);
                    if (global.includes(key)) {
                        return this.proxyWindow;
                    }
                    if (Reflect.has(this.fakeWindow, prop)) {
                        return Reflect.get(this.fakeWindow, prop);
                    } else {
                        return Reflect.get(this.rawWindow, prop);
                    }
                } else {
                    console.warn('Please get properties in active sandbox');
                }
            }
        })
    }

    active(): void {
        if (!this.isActive) {
            if (this.id && SandBox.id2Sandbox.has(this.id)) {
                //    try to recovery form previous sandbox
                const previousSandbox = SandBox.id2Sandbox.get(this.id);
                if (previousSandbox) {
                    this.fakeWindow = previousSandbox.fakeWindow;
                }
            }
            this.isActive = true;
            SandBox.activeCount++;
        }
    }

    inActive(): void {
        if (this.isActive) {
            if (this.id) {
                SandBox.id2Sandbox.set(this.id, this);
            }
            this.isActive = false;
            SandBox.activeCount--;
        }
    }


}
