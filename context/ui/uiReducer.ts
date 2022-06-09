import { UiState } from './';

type UiActionType = 
    | { type: '[UI] - Toggle menu' }

export const uiReducer = (state: UiState,  action: UiActionType): UiState => {
    switch(action.type) {
        case '[UI] - Toggle menu':
            return {
                ...state,
                isMenuOpen: !state.isMenuOpen
            }
        default:
            return state;
    }
}