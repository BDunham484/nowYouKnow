import { useReducer } from 'react'

import {
  UPDATE_CURRENT_CATEGORY,
  TOGGLE_GAME
} from '../utils/actions';

  
  export const reducer = (state, action) => {
    switch (action.type) {
      // if action type value is the value of `UPDATE_CURRENT_CATEGORY, return a new state object with an updated current category
      case UPDATE_CURRENT_CATEGORY:
        return {
          ...state,
          currentCategory: action.category,
        };

      case TOGGLE_GAME:
        return {
          ...state,
          gameOpen: !state.gameOpen
        };

      // if it's none of these actions, do not update state at all and keep things the same!
      default:
        return state;
      }
  };

  export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
  }