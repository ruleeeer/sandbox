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

test('escapeReadable test', () => {
  const sandbox = new ProxySandbox({
    escapeReadable: ['__test__'],
    rawWindow: window
  })
  ;(window as any).__test__ = 1
  sandbox.activate()
  const proxy = sandbox.proxy
  expect('__test__' in proxy).toEqual(true)
  expect(Reflect.has(proxy, '__test__')).toEqual(true)
  expect('__test__' in (sandbox as any)._fakeWindow).toEqual(false)
  expect('__test__' in (sandbox as any)._rawWindow).toEqual(true)
  sandbox.deactivate()
})

test('escapeWritable test', () => {
  const sandbox = new ProxySandbox({ escapeWriteable: ['__test__'] })
  sandbox.activate()
  const proxy = sandbox.proxy
  proxy['__test__'] = 1
  expect(proxy['__test__']).toEqual(1)
  expect((sandbox as any)._fakeWindow['__test__']).toEqual(1)
  expect((sandbox as any)._rawWindow['__test__']).toEqual(1)
  sandbox.deactivate()
})

test('deleteProperty test', () => {
  const sandbox = new ProxySandbox({ escapeWriteable: ['__test__'] })
  sandbox.activate()
  const proxy = sandbox.proxy
  proxy['__test__'] = 1
  delete proxy['__test__']
  expect(proxy['__test__']).toEqual(undefined)
  expect((sandbox as any)['_fakeWindow']['__test__']).toEqual(undefined)
  expect((sandbox as any)['_rawWindow']['__test__']).toEqual(undefined)
})
