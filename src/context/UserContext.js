import React, { useState, createContext } from 'react'

const UserContext = createContext([{}, () => {}])

const UserProvider = (props) => {
    const [state, setState] = useState({
        darkMode: false,
        symbol: '',
        symbolBefore: '',
        valuta: '',
        fullname: '',
        username: '',
        email: '',
        uid: '',
        isLoggedIn: null,
        profilePictureUrl: "default",
    })

    return (
        <UserContext.Provider value={[state, setState]}>
            {props.children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }