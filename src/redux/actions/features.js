import axios from 'axios'
import { url } from '../../config/config'
import {
  FETCH_FEATURES_SUCCESS,
  FETCH_FEATURES_PENDING,
  FETCH_FEATURES_FAILED,
} from './types'

export const fetchFeatures = () => async dispatch => {
  try {
    dispatch({ type: FETCH_FEATURES_PENDING })
    const res = await axios.get(url)
    dispatch({
      type: FETCH_FEATURES_SUCCESS,
      payload: res.data.features,
    })
  } catch (err) {
    dispatch({
      type: FETCH_FEATURES_FAILED,
      payload: err,
    })
  }
}
