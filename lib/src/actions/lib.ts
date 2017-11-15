import { ActionCreator } from 'react-redux'
import {
  ActionCreatorsMapObject,
  bindActionCreators
} from 'redux'
import {
  Action,
  combineActions
} from 'redux-actions'


export const createWrapperActions = (creators: ActionCreatorsMapObject, name:  string): ActionCreatorsMapObject =>
  bindActionCreators(creators, (action: any) => ({ ...action, type: `${name}/${action.type}` }))

export const combineWrapperActions = (creators: ActionCreatorsMapObject): string =>
  combineActions(
    ...Object.keys(creators)
      .map((id: string) => creators[id])
      .map((creator: ActionCreator<any>) => creator())
      .map(({ type }: Action<any>) => type)
  )
