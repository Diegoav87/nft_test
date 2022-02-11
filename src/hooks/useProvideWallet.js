import { useState, useEffect } from "react";

const useProvideWallet = () => {
    const [walletAccount, setWalletAccount] = useState();

    const connectWallet = async () => {
        try {
            const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
            setWalletAccount(account);
        } catch (err) {
            console.log("Error connecting wallet");
        }
    }

    const getCurrentWalletConnected = async () => {
        try {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });

            if (accounts.length > 0) {
                setWalletAccount(accounts[0]);
            }
        } catch (err) {
            console.log("Error getting your account");
        }
    }

    const addWalletListener = () => {
        window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
                setWalletAccount(accounts[0]);
            } else {
                setWalletAccount(null);
            }
        })
    }

    useEffect(() => {
        getCurrentWalletConnected();
        addWalletListener();
    }, [])

    return {
        walletAccount,
        connectWallet
    }
}

export default useProvideWallet;