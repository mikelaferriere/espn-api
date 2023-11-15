/** jest test file to test src/index.ts */

import { helloWorld } from '../lib/index'

describe('index module', () => {
  test('helloWorld', () => {
    expect(helloWorld()).toBe('Hello World')
  })
})
