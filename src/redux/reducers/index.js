import { combineReducers } from 'redux'
import mapReducer from './map'
import featureReducer from './features'

export default combineReducers({
  map: mapReducer,
  feature: featureReducer,
})
