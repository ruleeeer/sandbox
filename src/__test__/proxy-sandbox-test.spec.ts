import ProxySandbox from '../proxy-sandbox'

test('please activate the sandbox before using it', () => {
  const sandbox = new ProxySandbox({ id: 'test', rawWindow: window })
  const proxyWindow: any = sandbox.proxy
  expect(() => (proxyWindow.a = 1)).toThrow(TypeError)
})

test('Properties restored after reactivating the sandbox', () => {
  const sandbox = new ProxySandbox({ id: 'test', rawWindow: window })
  sandbox.activate()
  const proxyWindow: any = sandbox.proxy
  proxyWindow.b = 1
  sandbox.deactivate()

  sandbox.activate()
  expect(proxyWindow.b).toEqual(1)
  sandbox.deactivate()
})

test('Use id to restore sandbox', () => {
  const sandbox = new ProxySandbox({ id: 'test', rawWindow: window })
  sandbox.activate()
  const proxyWindow: any = sandbox.proxy
  proxyWindow.a = 1
  sandbox.deactivate()

  //    new sandbox but id is same
  const sameSandbox = new ProxySandbox({ id: 'test' })
  sameSandbox.activate()
  const sameProxyWindow: any = sameSandbox.proxy
  expect(sameProxyWindow.a).toEqual(1)
  sandbox.deactivate()
  sameSandbox.deactivate()
})

test('record the active sandbox count', () => {
  const sandboxOne = new ProxySandbox()
  const sandboxTwo = new ProxySandbox()
  expect(sandboxOne.activeCount).toEqual(0)
  expect(sandboxTwo.activeCount).toEqual(0)
  sandboxOne.activate()
  expect(sandboxOne.activeCount).toEqual(1)
  expect(sandboxTwo.activeCount).toEqual(1)
  sandboxTwo.activate()
  expect(sandboxOne.activeCount).toEqual(2)
  expect(sandboxTwo.activeCount).toEqual(2)
  sandboxOne.deactivate()
  expect(sandboxOne.activeCount).toEqual(1)
  expect(sandboxTwo.activeCount).toEqual(1)
  sandboxTwo.deactivate()
})
