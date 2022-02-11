import React, { useEffect, useState } from 'react';

import WalletBalance from './WalletBalance';

import FunkBoings from '../artifacts/contracts/FunkBoings.sol/FunkBoings.json';
import { ethers } from 'ethers';

import hiddenImg from '../assets/hidden.png';

import useWallet from '../hooks/useWallet';

const contractAddress = "0xD7B965c6d48B8228c7BEdEf3e864c84Bbc24615a";

const Home = () => {
    const wallet = useWallet();
    const [totalMinted, setTotalMinted] = useState(0);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, FunkBoings.abi, signer);

    useEffect(() => {
        getCount();
    }, [wallet.walletAccount])

    const getCount = async () => {
        const count = await contract.count();
        setTotalMinted(parseInt(count));
    }

    return (
        <div>
            <WalletBalance />
            <div className='container'>
                <h1 className="mt-4">Funk Boings</h1>
                <div className="container mt-4">
                    <div className="row">
                        {Array(totalMinted + 1)
                            .fill(0)
                            .map((_, i) => (
                                <div key={i} className="col-4">
                                    <NFTImage tokenId={i + 1} getCount={getCount} contract={contract} signer={signer} totalMinted={totalMinted} />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const NFTImage = ({ tokenId, getCount, contract, signer, totalMinted }) => {
    const wallet = useWallet();
    const contentMetadataId = "QmVTAmSTLYB7C82vHKJ2nJGHTpVwMMExSg8uSpbxRT3dqg";
    const contentImageId = "QmcXXLheayMbCyPRzr5uY8NXLrb4kFUeqq7y8s4aKBdmRa";
    const metadataURI = `${contentMetadataId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentImageId}/${tokenId}.png`;

    const [isMinted, setIsMinted] = useState(false);

    const getMintedStatus = async () => {
        const result = await contract.isContentOwned(metadataURI);
        setIsMinted(result);
    }

    useEffect(() => {
        getMintedStatus();
    }, [isMinted, totalMinted])

    const mintToken = async () => {
        const address = await signer.getAddress();
        const result = await contract.payToMint(address, metadataURI, {
            value: ethers.utils.parseEther("0.05"),
        });

        await result.wait();
        getMintedStatus();
        getCount();
    }

    async function getURI() {
        const uri = await contract.tokenURI(tokenId - 1);
        alert(uri);
    }

    return (
        <div className="card mt-4" style={{ width: '18rem' }}>
            <img className="card-img-top" src={isMinted ? imageURI : hiddenImg}></img>
            <div className="card-body">
                <h5 className="card-title">ID #{tokenId}</h5>
                {wallet.walletAccount ? (
                    <React.Fragment>
                        {!isMinted ? (
                            <button className="btn btn-primary" onClick={mintToken}>
                                Mint
                            </button>
                        ) : (
                            <button className="btn btn-secondary" onClick={getURI}>
                                Taken! Show URI
                            </button>
                        )}
                    </React.Fragment>
                ) : (
                    <button className="btn btn-primary" onClick={wallet.connectWallet}>
                        Connect Wallet to Mint
                    </button>
                )}

            </div>
        </div>
    );

}

export default Home;