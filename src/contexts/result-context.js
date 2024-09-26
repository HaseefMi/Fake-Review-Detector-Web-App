import { createContext, useState } from 'react'

export const Result = createContext();

export const ResultProvider = ({ children }) => {
    const [result, setResult] = useState(null);
    return (
        <Result.Provider value={{ result, setResult }}>{children}</Result.Provider>
    )
}