import * as types from './ActionTypes';
import api from '@/Api/api';

// Get JWT token from Redux state or localStorage
const getAuthToken = (getState) => {
  return getState().auth?.jwt || localStorage.getItem('jwt');
};

// Action Creators
export const getUserWatchlist = () => async (dispatch, getState) => {
  dispatch({ type: types.GET_USER_WATCHLIST_REQUEST });

  try {
    const jwt = getAuthToken(getState);
    const response = await api.get('/api/watchlist/user', {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    dispatch({
      type: types.GET_USER_WATCHLIST_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error("Error fetching watchlist:", error.response?.data || error.message);
    dispatch({
      type: types.GET_USER_WATCHLIST_FAILURE,
      error: error.message,
    });
    return Promise.reject(error);
  }
};

export const addItemToWatchlist = (coinId) => async (dispatch, getState) => {
  dispatch({ type: types.ADD_COIN_TO_WATCHLIST_REQUEST });

  try {
    const jwt = getAuthToken(getState);
    const response = await api.patch(
      `/api/watchlist/add/coin/${coinId}`,
      {},
      { headers: { Authorization: `Bearer ${jwt}` } }
    );

    dispatch({
      type: types.ADD_COIN_TO_WATCHLIST_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error("Error adding to watchlist:", error.response?.data || error.message);
    dispatch({
      type: types.ADD_COIN_TO_WATCHLIST_FAILURE,
      error: error.message,
    });
    return Promise.reject(error);
  }
};

export const removeItemFromWatchlist = (coinId) => async (dispatch, getState) => {
  dispatch({ type: types.REMOVE_COIN_FROM_WATCHLIST_REQUEST });

  try {
    const jwt = getAuthToken(getState);
    const response = await api.patch(
      `/api/watchlist/remove/coin/${coinId}`,
      {},
      { headers: { Authorization: `Bearer ${jwt}` } }
    );

    dispatch({
      type: types.REMOVE_COIN_FROM_WATCHLIST_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error("Error removing from watchlist:", error.response?.data || error.message);
    dispatch({
      type: types.REMOVE_COIN_FROM_WATCHLIST_FAILURE,
      error: error.message,
    });
    return Promise.reject(error);
  }
};