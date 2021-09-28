import ProxySandbox from "./proxy-sandbox";

export class Sandbox {
    static _activeCount: number = 0;
    static _id2Sandbox: Map<string, AnySandbox> = new Map<string, AnySandbox>();

    get activeCount(): number {
        return Sandbox._activeCount;
    }

    get id2Sandbox(): Map<string, AnySandbox> {
        return Sandbox._id2Sandbox;
    }
}

export type AnySandbox = ProxySandbox;
