import {
  createAction
} from 'redux-actions'

import {
  createWrapperActions,
  combineWrapperActions
} from '../actions'
import {
  createInitialState,
  createReducer,
  createReducerMap,
  createWrapperReducer,
  getInitialState
} from './lib'

const defaultState = { country: 'France' }

const move1: any = createAction('MOVE1')

const r1 = createReducer({
  [move1]: state => ({ ...state, country: 'Italy' })
}, defaultState)


test('reduce to nextState', () => {
  const nextState = r1({}, move1())
  expect(nextState.country).toBe('Italy')
  expect(Object.keys(nextState).length).toBe(1)
})

const creators2 = createWrapperActions({ move: move1 }, 'second')
const creators3 = createWrapperActions({ move: move1 }, 'third')
const r2 = createWrapperReducer({ reducer: r1, actions: creators2 })

test('reduce to defaultState when no action and no state', () => {
  const nextState = r2(undefined, move1())
  expect(nextState.country).toBe(defaultState.country)
  expect(Object.keys(nextState).length).toBe(1)
})

const { move: move2 } = creators2
const { move: move3 } = creators3

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

test('createInitialState', () => {
  const initialState = getInitialState(r1)
  expect(initialState).toEqual(defaultState)
})

test('createInitialState', () => {
  const initialState = createInitialState([ { reducer: r1, actions: creators2 } ])
  expect(initialState).toEqual(defaultState)
})

test('createReducerMap', () => {
  const reducerMap = createReducerMap([ { reducer: r1, actions: creators2 } ])
  const reducer: any = reducerMap[combineWrapperActions(creators2)]
  expect(reducer({}, creators2.move())).toEqual(r1({}, move1()))
})
