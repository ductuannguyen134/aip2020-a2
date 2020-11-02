import React, { useContext, useState } from 'react'

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

