import React, { useContext, createContext, useEffect, useReducer, useState } from 'react'
import reducer, {initialState} from './reducer'

const LoadingContext = React.createContext();

export const LoadingProvider = ({children}) => {

    const [isLoading, setIsLoading] = useState(false);

    return(
        <LoadingContext.Provider value={[isLoading,setIsLoading]}>
                {children}
        </LoadingContext.Provider>
    )
}

export const useLoading = () => {
    return useContext(LoadingContext);
}

