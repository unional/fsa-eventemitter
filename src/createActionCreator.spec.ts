import { test } from 'ava'
import { isFSA, isError, FSA } from 'flux-standard-action'

import { createActionCreator } from './index'

test('empty actionCreator creates FSA compliant action', t => {
  const blip = createActionCreator('blip')

  // want undefined parameters optional
  // waiting for https://github.com/Microsoft/TypeScript/issues/12400
  t.true(isFSA(blip(undefined, undefined)))
})

test('actionCreator with payload creates FSA compliant action', t => {
  const count = createActionCreator<number>('count')
  t.true(isFSA(count(1, undefined)))
})

test('actionCreator with payload and meta creates FSA compliant action', t => {
  const withMeta = createActionCreator<number, string>('withMeta')
  t.true(isFSA(withMeta(2, 'abc')))
})

test('Error payload creates Error FSA', t => {
  const withMeta = createActionCreator<Error, string>('withMeta')
  t.true(isError(withMeta(new Error('err'), 'abc')))
})

test('isError: true to create Error FSA', t => {
  const customError = createActionCreator<{ x: number, err: Error }>('customError', true)
  t.true(isError(customError({ x: 1, err: new Error() }, undefined)))
})

test(`isError predicate to create Error FSA`, t => {
  const mayError = createActionCreator<{ x: number, err?: Error }>('mayError', (payload) => !!payload.err)
  t.false(isError(mayError({ x: 1 }, undefined)))
  t.true(isError(mayError({ x: 1, err: new Error() }, undefined)))
})

test('match should type guard an action', t => {
  const withMeta = createActionCreator<{ a: string }>('withMeta')
  const action = withMeta({ a: 'a' }, undefined) as FSA<any, any>

  if (withMeta.match(action)) {
    // `payload.a` is properly typed as `string`
    t.is(action.payload.a, 'a')
  }
})
