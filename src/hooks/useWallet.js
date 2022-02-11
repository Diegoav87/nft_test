import { useContext } from "react";

import { WalletContext } from "../context/wallet";

const useWallet = () => {
    return useContext(WalletContext);
}

export default useWallet;