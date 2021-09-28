import ProxySandbox from "../proxy-sandbox";


test('please activate the sandbox before using it', () => {
    // @ts-ignore
    const proxyWindow: any = new ProxySandbox({id: 'test', rawWindow: window}).proxyWindow;
    expect(() => proxyWindow.a = 1).toThrow(TypeError)
})


test('Properties restored after reactivating the sandbox', () => {
    // @ts-ignore
    const sandbox = new ProxySandbox({id: 'test', rawWindow: window});
    sandbox.active();
    let proxyWindow = sandbox.proxy;
    // @ts-ignore
    proxyWindow.b = 1;
    sandbox.inActive();

    sandbox.active();
    // @ts-ignore
    expect(proxyWindow.b).toEqual(1)
})

test('Use id to restore sandbox',()=>{

    // @ts-ignore
    const sandbox = new ProxySandbox({id: 'test', rawWindow: window});
    sandbox.active();
    let proxyWindow = sandbox.proxy;
    // @ts-ignore
    proxyWindow.a = 1;
    sandbox.inActive();

//    new sandbox but id is same
    const sameSandbox=  new ProxySandbox({id:'test'});
    sameSandbox.active();
    let sameProxyWindow = sameSandbox.proxy;
    // @ts-ignore
    expect(sameProxyWindow.a).toEqual(1);
})

