import {
  Action,
  ActionFunctionAny,
  createAction
} from 'redux-actions'

import {
  createReducer,
  createSelectors,
  createWrapperActions,
  createWrapperReducer
} from './reducer'

const defaultState = { country: 'France' }
const move1: ActionFunctionAny<any> = createAction('MOVE')
const r1 = createReducer({
  [move1]: state => ({ ...state, country: 'Italy' })
}, defaultState)

test('createSelectors', () => {
  const parentSelector = () => ({
    a: 'a',
    b: 'b',
    aa: 'aa'
  })
  const selectors = createSelectors(parentSelector, [
    'a',
    'b',
    'aa'
  ])
  expect(selectors.getA()).toBe('a')
  expect(selectors.getB()).toBe('b')
  expect(selectors.getAa()).toBe('aa')
})

test('reduce to nextState', () => {
  const nextState = r1({}, move1())
  expect(nextState.country).toBe('Italy')
  expect(Object.keys(nextState).length).toBe(1)
})

const creators2 = createWrapperActions({ move: move1 }, 'second')
const r2 = createWrapperReducer(r1, creators2)

test('reduce to defaultState when no action and no state', () => {
  const nextState = r2(undefined, move1())
  expect(nextState.country).toBe(defaultState.country)
  expect(Object.keys(nextState).length).toBe(1)
})

const { move: move2 } = creators2

test('wrapper reducer change state', () => {
  const nextState = r2({}, move2())
  expect(nextState.country).toBe('Italy')
  expect(Object.keys(nextState).length).toBe(1)
})

const r = createReducer({}, {}, {
  toto: { actions: creators2, reducer: r2 }
})

test('wrapper reducer change state', () => {
  const nextState = r({}, move2())
  expect(Object.keys(nextState).length).toBe(1)
  expect(Object.keys(nextState.toto).length).toBe(1)
  expect(nextState.toto.country).toBe('Italy')
})
