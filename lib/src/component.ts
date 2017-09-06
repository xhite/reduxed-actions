import {
  bindActionCreators,
  ActionCreatorsMapObject,
  Dispatch
} from 'redux'
import {
  connect as defaultConnect,
  DispatchProp,
  InferableComponentEnhancer,
  InferableComponentEnhancerWithProps,
  MapDispatchToPropsParam,
  MapStateToPropsParam
} from 'react-redux'
import {
  Selector
} from 'reselect'

interface ComponentOutput {
  output: ActionCreatorsMapObject
}

interface ComponentInput {
  input: Selector<any, any>
}

export const createDispatcher = (actions: ActionCreatorsMapObject): MapDispatchToPropsParam<any, any> =>
  (dispatch: Dispatch<any>): ComponentOutput => ({
    output: bindActionCreators(actions, dispatch)
  })

export const createInput = (selector: Selector<any, any> = state => state): MapStateToPropsParam<any, any> =>
  (state: any): ComponentInput => ({
    input: selector(state)
  })

export const connect = (...args): InferableComponentEnhancer<DispatchProp<any>> =>
  defaultConnect(createInput(args[0]), createDispatcher(args[1]), ...args.slice(2))
