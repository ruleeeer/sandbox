import ProxySandbox from "../ProxySandbox";

test('which keys should return proxyWindow in sandbox', () => {
    const proxyWindow = new ProxySandbox({id: 'test'})
    // @ts-ignore
    proxyWindow.x = 2;
    // @ts-ignore
    expect(proxyWindow.x, 2)
})
