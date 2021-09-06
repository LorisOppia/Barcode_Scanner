import _ from 'lodash'
import {
  FETCH_FEATURES_SUCCESS,
  FETCH_FEATURES_PENDING,
  FETCH_FEATURES_FAILED,
} from '../actions/types'

const initialState = {
  features: {},
  loading: false,
  error: null,
}

const featureReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_FEATURES_PENDING:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case FETCH_FEATURES_SUCCESS:
      return {
        ...state,
        features: { ..._.mapKeys(payload, 'id') },
        loading: false,
        error: null,
      }

    case FETCH_FEATURES_FAILED:
      return {
        ...state,
        loading: false,
        error: payload,
      }

    default:
      return state
  }
}

export default featureReducer
