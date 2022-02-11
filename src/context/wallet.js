import React, { useState, createContext } from "react";

import useProvideWallet from "../hooks/useProvideWallet";

export const WalletContext = createContext();

export const WalletProvider = (props) => {
    const wallet = useProvideWallet();

    return (
        <WalletContext.Provider value={wallet}>
            {props.children}
        </WalletContext.Provider>
    )
}