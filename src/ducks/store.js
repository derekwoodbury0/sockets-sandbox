import reducer from './index'

import { createStore, applyMiddleware } from 'redux'
import promiseMiddeware from 'redux-promise-middleware'

export default createStore(reducer, applyMiddleware(promiseMiddeware))