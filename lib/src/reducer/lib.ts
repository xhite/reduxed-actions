import {
  ActionCreatorsMapObject,
} from 'redux'
import {
  handleActions,
  Action,
  Reducer,
  ReducerMap
} from 'redux-actions'
import { combineWrapperActions } from '../actions'

export interface ReducerActions {
  actions: ActionCreatorsMapObject
  reducer: Reducer<any, any>
}

export interface ReducerActionsMapObject {
  [name: string]: ReducerActions
}

export const createReducer = (reducerMap: ReducerMap<any, any>, defaultState: any, childReducerMap: ReducerActionsMapObject = {}): Reducer<any, any> =>
  handleActions({
    ...reducerMap,
    ...Object.keys(childReducerMap)
      .reduce((res, name: string) => ({
        ...res,
        [ combineWrapperActions(childReducerMap[name].actions) ]: (state, action) => ({
          ...state,
          [name]: childReducerMap[name].reducer(state[name], action)
        })
      }), {})
    },
    {
    ...defaultState,
      ...Object.keys(childReducerMap)
    .reduce((res, name: string) => ({
      ...res,
      [name]: getInitialState(childReducerMap[name].reducer)
    }), {})
  })

export const getInitialState = (reducer: Reducer<any, any>): any => reducer(undefined, { type: '' })

export const createReducerMap = (args: Array<ReducerActions>): ReducerMap<any, any> =>
  args.reduce((acc, { reducer, actions }) => ({
    ...acc,
    [ combineWrapperActions(actions) ]: (state, action: Action<any>) =>
      reducer(state, { ...action, type: action.type.split('/').slice(1).join('/') })
  }),{})

export const createInitialState = (args: Array<ReducerActions>): any =>
  args.reduce((acc, { reducer }) => ({
    ...acc,
    ...getInitialState(reducer)
  }), {})

export const createWrapperReducer = (...args: Array<ReducerActions>): Reducer<any, any> =>
  handleActions(createReducerMap(args), createInitialState(args))
