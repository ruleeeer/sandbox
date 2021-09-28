import {SandboxInterface, SandboxParamInterface} from "@originjs/sandbox";
import {Sandbox} from "./sandbox";


export default class ProxySandbox extends Sandbox implements SandboxInterface {
    readonly #id: string
    #isActive: boolean = false
    readonly #proxy: Window
    readonly #rawWindow: Window
    #fakeWindow: Window = Object.create(null)
    readonly #escapeReadable: Set<PropertyKey>
    readonly #escapeWritable: Set<PropertyKey>


    constructor({
                    id: id,
                    escapeReadable: escapeReadable,
                    escapeWriteable: escapeWriteable,
                    rawWindow: rawWindow,
                }: SandboxParamInterface) {
        super();
        this.#escapeReadable = escapeReadable ?? new Set<PropertyKey>();
        this.#escapeWritable = escapeWriteable ?? new Set<PropertyKey>();
        this.#rawWindow = rawWindow ?? window;
        this.#id = id ?? '';
        this.#proxy = new Proxy(this.#fakeWindow, {
            set: (_: Window, prop: string | symbol, value: any) => {
                if (this.#isActive) {
                    Reflect.set(this.#fakeWindow, prop, value);
                    if (this.#escapeWritable.has(prop)) {
                        Reflect.set(this.#rawWindow, prop, value);
                    }
                    return true;
                } else {
                    console.warn('Please activate the sandbox before using it');
                    return false;
                }
            },
            get: (_: Window, prop: string | symbol) => {
                if (this.#isActive) {
                    if (Reflect.has(this.#fakeWindow, prop)) {
                        return Reflect.get(this.#fakeWindow, prop);
                    } else if (this.#escapeReadable.has(prop)) {
                        return Reflect.get(this.#rawWindow, prop);
                    }
                } else {
                    console.warn('Please activate the sandbox before using it');
                }
            }
        })
    }

    get isActive(): boolean {
        return this.#isActive;
    }

    get id(): string {
        return this.#id
    }

    get proxy(): Window {
        return this.#proxy;
    }


    active(): void {
        if (!this.#isActive) {
            if (this.#id) {
                //    try to recovery form previous sandbox
                const previousSandbox = Sandbox._id2Sandbox.get(this.#id);
                if (previousSandbox) {
                    this.#fakeWindow = previousSandbox.#fakeWindow;
                } else {
                    Sandbox._id2Sandbox.set(this.#id, this);
                }
            }
            this.#isActive = true;
            Sandbox._activeCount++;
        }
    }

    inActive(): void {
        if (this.#isActive) {
            if (this.#id) {
                Sandbox._id2Sandbox.set(this.#id, this);
            }
            this.#isActive = false;
            Sandbox._activeCount--;
        }
    }


}
