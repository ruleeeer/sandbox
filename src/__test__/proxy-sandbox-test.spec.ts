import ProxySandbox from '../proxy-sandbox'

test('please activate the sandbox before using it', () => {
  const sandbox = new ProxySandbox({ id: 'test', rawWindow: window })
  const proxyWindow: any = sandbox.proxy
  expect(() => (proxyWindow.a = 1)).toThrow(TypeError)
})

test('Properties restored after reactivating the sandbox', () => {
  const sandbox = new ProxySandbox({ id: 'test', rawWindow: window })
  sandbox.active()
  const proxyWindow: any = sandbox.proxy
  proxyWindow.b = 1
  sandbox.inActive()

  sandbox.active()
  expect(proxyWindow.b).toEqual(1)
  sandbox.inActive()
})

test('Use id to restore sandbox', () => {
  const sandbox = new ProxySandbox({ id: 'test', rawWindow: window })
  sandbox.active()
  const proxyWindow: any = sandbox.proxy
  proxyWindow.a = 1
  sandbox.inActive()

  //    new sandbox but id is same
  const sameSandbox = new ProxySandbox({ id: 'test' })
  sameSandbox.active()
  const sameProxyWindow: any = sameSandbox.proxy
  expect(sameProxyWindow.a).toEqual(1)
  sandbox.inActive()
  sameSandbox.inActive()
})

test('record the active sandbox count', () => {
  const sandboxOne = new ProxySandbox()
  const sandboxTwo = new ProxySandbox()
  expect(sandboxOne.activeCount).toEqual(0)
  expect(sandboxTwo.activeCount).toEqual(0)
  sandboxOne.active()
  expect(sandboxOne.activeCount).toEqual(1)
  expect(sandboxTwo.activeCount).toEqual(1)
  sandboxTwo.active()
  expect(sandboxOne.activeCount).toEqual(2)
  expect(sandboxTwo.activeCount).toEqual(2)
  sandboxOne.inActive()
  expect(sandboxOne.activeCount).toEqual(1)
  expect(sandboxTwo.activeCount).toEqual(1)
  sandboxTwo.inActive()
})
