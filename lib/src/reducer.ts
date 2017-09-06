import {
  ActionCreatorsMapObject,
  bindActionCreators
} from 'redux'
import {
  handleActions,
  combineActions,
  Action,
  Reducer,
  ReducerMap
} from 'redux-actions'
import {
  createSelector,
  Selector
} from 'reselect'
import { ActionCreator } from 'react-redux'

export interface SelectorsMapObject {
  [key: string]: Selector<any, any>
}

export interface ReducerActions {
  actions: ActionCreatorsMapObject
  reducer: Reducer<any, any>
}

export interface ReducerActionsMapObject {
  [name: string]: ReducerActions
}

/* creates wrapper selectors:
  * inputs: parent selector, object containing root selector functions
  * output: object containing selectors children of parent selector with key: selector name, value: selector function
  * */

export const createWrapperSelectors = (parent: Selector<any, any>, selectors: SelectorsMapObject): SelectorsMapObject =>
  Object.keys(selectors)
    .reduce((acc, key: string) => ({
        ...acc,
        [key]: createSelector(parent, selectors[key])
    }), {})

/* creates multiple selectors:
 * inputs: parent selector, array containing prop names
 * output: object containing selectors children of parent selector with key: selector name, value: selector function
 * */
export const createGetters = (...props: Array<string>): SelectorsMapObject =>
  props.map((prop: any) => ({ prop, value: ({ [prop]: value }) => value }))
    .map(({ prop: [ first, ...rest ], value }) => ({ prop: `${ first.toUpperCase() }${ rest }`, value }))
    .reduce((acc, { prop, value }) => ({ ...acc, [`get${prop}`]: value  }), {})

export const createSelectors = (parent: Selector<any, any>, props: Array<string>): SelectorsMapObject =>
  createWrapperSelectors(parent, createGetters(...props))


export const createWrapperActions = (creators: ActionCreatorsMapObject, name:  string): ActionCreatorsMapObject =>
  bindActionCreators(creators, (action: any) => ({ ...action, type: `${name}/${action.type}` }))

export const combineWrapperActions = (creators: ActionCreatorsMapObject): string =>
  combineActions(
    ...Object.keys(creators)
      .map((id: string) => creators[id])
      .map((creator: ActionCreator<any>) => creator())
      .map(({ type }: Action<any>) => type)
  )


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

export const createWrapperReducer = (reducer: Reducer<any, any>, creators: ActionCreatorsMapObject): Reducer<any, any> =>
  handleActions({
    [ combineWrapperActions(creators) ]: (state, action: Action<any>) =>
      reducer(state, { ...action, type: action.type.split('/').slice(1).join('/') })
  }, getInitialState(reducer))
