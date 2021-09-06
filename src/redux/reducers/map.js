import {
  SHOW_LOCATION_MODAL,
  DISMISS_LOCATION_MODAL,
  SET_CURRENT_POSITION,
} from '../actions/types'

const initialState = {
  center: [45.438351, 10.99171],
  zoom: 12,
  position: [],
  feature: {},
  showModal: false,
}

const mapReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_POSITION:
      return {
        ...state,
        position: payload,
      }
    case SHOW_LOCATION_MODAL:
      return {
        ...state,
        feature: payload,
        showModal: true,
      }
    case DISMISS_LOCATION_MODAL:
      return { ...state, showModal: false }
    default:
      return state
  }
}

export default mapReducer
