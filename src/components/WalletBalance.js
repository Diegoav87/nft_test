import { useState } from "react";
import { ethers } from "ethers";

import useWallet from "../hooks/useWallet";

const WalletBalance = () => {
    const wallet = useWallet();

    const [balance, setBalance] = useState();

    const getBalance = async () => {
        if (balance) {
            setBalance(null);
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const etherBalance = await provider.getBalance(wallet.walletAccount);
        setBalance(ethers.utils.formatEther(etherBalance));
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body d-flex justify-content-between">
                    <button className="btn btn-primary" onClick={wallet.connectWallet}>
                        {wallet.walletAccount ? (
                            "Connected: " + String(wallet.walletAccount).substring(0, 6) + "..." + String(wallet.walletAccount).substring(38)
                        ) : (
                            "Connect Wallet"
                        )}
                    </button>
                    {wallet.walletAccount && (
                        <button className="btn btn-success" onClick={() => getBalance()}>{balance ? balance : "Show Balance"}</button>
                    )}

                </div>
            </div>
        </div>
    );
}

export default WalletBalance;
