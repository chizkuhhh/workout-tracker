import { createContext, useReducer } from "react";

export const WorkoutContext = createContext();

export const workoutsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_WORKOUTS':
            return {
                workouts: action.payload
            }
        case 'CREATE_WORKOUT':
            return {
                workouts: [action.payload, ...state.workouts]
            }
        case 'DELETE_WORKOUT':
            return {
                // keep the workouts whose ids arent equal to the selected one to delete in the array
                workouts: state.workouts.filter((w) => w._id !== action.payload._id)
            }
        default: 
            return state
    }
}

export const WorkoutContextProvider = ({children}) => { // children is whatever WorkoutContentProvider 'wraps' (App in index.js)
    const [state, dispatch] = useReducer(workoutsReducer, {
        workouts: null
    });

    return (
        <WorkoutContext.Provider value={{...state, dispatch}}>
            {/* should update app without needing to manually */}
            {children}
        </WorkoutContext.Provider>
    )
}