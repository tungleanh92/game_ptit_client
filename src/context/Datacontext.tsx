import React from "react";
import { useState, useEffect } from "react";
import { socket } from "../Chess-client/socket/socket";
import { ethers } from "ethers";
import { contractGameCompetitiveABI, contractVaultABI, gameCompetitiveContractAddress, vaultContractAddress, tokenContractAddress, contractTokenABI } from "../utils/constants";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { customAlphabet } from 'nanoid'

const baseUrl = process.env.REACT_APP_BASE_URL;

const nanoid = customAlphabet('1234567890', 6)
const callApi = async (url: any, method: any, data: any, success: any) => {
    return axios({
        url: `${baseUrl}/chess/${url}`,
        method: method,
        data: { data: data },
    })
        .then(function (res) {
            if (success) {
                success(res)
            }
        })
        .catch(function (err) {
            console.log(err)
        });
};

export const Datacontext = React.createContext({});

const { ethereum } = window;

const createEthereumPtitTokenContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsVaultContract = new ethers.Contract(tokenContractAddress, contractTokenABI, signer);

    return transactionsVaultContract;
};

const createEthereumVaultContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsVaultContract = new ethers.Contract(vaultContractAddress, contractVaultABI, signer);

    return transactionsVaultContract;
};

const createEthereumGameContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsGameContract = new ethers.Contract(gameCompetitiveContractAddress, contractGameCompetitiveABI, signer);

    return transactionsGameContract;
};

interface ChildrenType {
    // eslint-disable-next-line
    children: any;
}

export const DatacontextProvider = (props: ChildrenType) => {
    const [username, Setusername] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [gameId, setgameId] = useState<any>();
    const [gameIdOnChain, setGameIdOnChain] = useState<any>();

    const [depositData, setDepositData] = useState("");
    const [withdrawData, setWithdrawData] = useState("");
    const [faucetClaimData, setFaucetClaimData] = useState("");
    const [joinGameData, setJoinGameData] = useState("1");
    const [joinGameBtn, setJoinGameBtn] = useState(false);

    const [wallet, setWallet] = useState({ address: "", balances: "0" });
    const [isLoading, setIsLoading] = useState(false);

    const handleChangeDeposit = (e: any) => {
        setDepositData(() => (e.target.value));
    };

    const handleChangeWithdraw = (e: any) => {
        setWithdrawData(() => (e.target.value));
    };

    const handleChangeFaucetClaim = (e: any) => {
        setFaucetClaimData(() => (e.target.value));
    };

    const handleChangeJoinGame = (e: any) => {
        setJoinGameData(() => (e.target.value));
    };

    const generateGameId = (roomId: any, amount: any) => {
        setRedirect(true);
        const data = []
        if (roomId) {
            console.log(roomId, "roomId");
            data.push(roomId)
            data.push(amount.toString())
            data.push('chess')
            const data_string = data.join('_')
            setgameId(data_string)
            setGameIdOnChain(roomId)
            socket.emit("joinGameLobby", { gameId: data_string, username });
        } else {
            const id = nanoid()
            data.push(id)
            data.push(joinGameData.toString())
            data.push('chess')
            const data_string = data.join('_')
            setgameId(data_string)
            setGameIdOnChain(id)
            socket.emit("joinGameLobby", { gameId: data_string, username });
        }
    }

    const updateBalance = async () => {
        console.log('checkIfWalletIsConnect');
        try {
            if (!ethereum) return alert("Please install MetaMask.");

            const transactionsContract = createEthereumVaultContract();

            const balances = await transactionsContract.viewPlayersBalance();

            setWallet({
                address: wallet.address,
                balances: ethers.utils.formatEther(balances)
            })
            await callApi('updateBalance', "POST", { address: wallet.address, balance: ethers.utils.formatEther(balances) }, {})
        } catch (error) {
            console.log(error)
            return
        }
    }

    const checkIfWalletIsConnect = async () => {
        console.log('checkIfWalletIsConnect');
        try {
            if (!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({ method: "eth_accounts" });

            const transactionsContract = createEthereumVaultContract();

            const balances = await transactionsContract.viewPlayersBalance();

            if (accounts.length) {
                setWallet({
                    address: accounts[0],
                    balances: ethers.utils.formatEther(balances)
                })
            } else {
                console.log("No accounts found");
            }
        } catch (error) {
            console.log(error)
            return
        }
    };

    const connectWallet = async () => {
        console.log('connectWallet');
        try {
            if (!ethereum) return alert("Please install MetaMask.");
            const accounts = await ethereum.request({ method: "eth_requestAccounts", });
            const transactionsContract = createEthereumVaultContract();
            console.log('check');
            
            const balances = await transactionsContract.viewPlayersBalance();
            setWallet({
                address: accounts[0],
                balances: ethers.utils.formatEther(balances)
            })

        } catch (error) {
            console.log(error)
            return
        }
    };

    const depositToken = async (e: any) => {
        e.preventDefault();
        console.log('depositToken');
        try {
            if (ethereum) {
                const transactionsContract = createEthereumVaultContract();
                const parsedAmount = ethers.utils.parseEther(depositData);

                const transactionHash = await transactionsContract.depositToken(parsedAmount);

                setIsLoading(true);
                console.log(`Loading - ${transactionHash.hash}`);
                await transactionHash.wait();
                console.log(`Success - ${transactionHash.hash}`);
                setIsLoading(false);

                const balances = await transactionsContract.viewPlayersBalance();

                setWallet({
                    address: wallet.address,
                    balances: ethers.utils.formatEther(balances)
                })
                await callApi('updateBalance', "POST", { address: wallet.address, balance: ethers.utils.formatEther(balances) }, {})
            } else {
                toast("Check your network")
            }
        } catch (error) {
            console.log(error)
            return
        }
    };

    const withdrawToken = async (e: any) => {
        e.preventDefault();
        console.log('withdrawToken');
        try {
            const transactionsContract = createEthereumVaultContract();
            const parsedAmount = ethers.utils.parseEther(withdrawData);

            const transactionHash = await transactionsContract.withdrawToken(parsedAmount.toString());

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setIsLoading(false);

            const balances = await transactionsContract.viewPlayersBalance();
            setWallet({
                address: wallet.address,
                balances: ethers.utils.formatEther(balances)
            })
            await callApi('updateBalance', "POST", { address: wallet.address, balance: ethers.utils.formatEther(balances) }, {})
        } catch (error) {
            console.log(error)
            return
        }
    };

    const faucetClaim = async () => {
        console.log('faucetClaim');
        try {
            const transactionsContract = createEthereumVaultContract();
            console.log(faucetClaimData);
            const transactionHash = await transactionsContract.faucetClaim(faucetClaimData);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setIsLoading(false);

            const balances = await transactionsContract.viewPlayersBalance();
            setWallet({
                address: wallet.address,
                balances: ethers.utils.formatEther(balances)
            })
            await callApi('updateBalance', "POST", { address: wallet.address, balance: ethers.utils.formatEther(balances) }, {})
        } catch (error) {
            console.log(error)
            return
        }
    };

    const joinGame = async () => {
        try {
            console.log('joinGame');
            const randomString = generateRandomString(5)

            const messageHash = ethers.utils.id(randomString);
            const messageHashBytes = ethers.utils.arrayify(messageHash)
            const signWallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
            const flatSig = await signWallet.signMessage(messageHashBytes);

            const transactionsContract = createEthereumGameContract();
            const parsedAmount = ethers.utils.parseEther(joinGameData);
            console.log(parsedAmount, 'parsedAmount');
            const transactionHash = await transactionsContract.joinGame(parsedAmount, gameIdOnChain, flatSig, messageHash);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setIsLoading(false);

            await callApi('updateGameComp', "POST", { address: wallet.address, amount: joinGameData, game_id: gameIdOnChain, message: messageHash, signature: flatSig }, {})
            updateBalance()
        } catch (error) {
            console.log(error)
            return
        }
    };

    const winnerClaim = async () => {
        console.log('winnerClaim');
        try {
            const transactionsContract = createEthereumGameContract();

            const randomString = generateRandomString(5)

            const messageHash = ethers.utils.id(randomString);
            const messageHashBytes = ethers.utils.arrayify(messageHash)
            const signWallet = new ethers.Wallet("aff0f061438b698ab29debb6d3c9efa1855edec3055e70f70751d5f6fad3c927");
            const flatSig = await signWallet.signMessage(messageHashBytes);

            const transactionHash = await transactionsContract.winnerClaim(gameIdOnChain, flatSig, messageHash, wallet.address);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setIsLoading(false);
            console.log(gameId);
            await callApi('updateGameComp', "POST", { game_id: gameIdOnChain, winner: wallet.address }, {})
            updateBalance()
        } catch (error) {
            console.log(error)
            return
        }
    };

    const playerClaimBack = async () => {
        console.log('playerClaimBack');
        try {
            const transactionsContract = createEthereumGameContract();
            const transactionHash = await transactionsContract.playerClaimBack(gameIdOnChain);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setIsLoading(false);

            console.log(joinGameData);
            await callApi('updateGameComp', "POST", { address: wallet.address, amount: joinGameData, game_id: gameIdOnChain }, {})
            updateBalance()
        } catch (error) {
            console.log(error)
            return
        }
    };

    useEffect(() => {
        checkIfWalletIsConnect();
    }, []);

    const value = {
        username,
        Setusername,
        redirect,
        setRedirect,
        gameId,
        setgameId,
        generateGameId,
        socket,
        connectWallet,
        wallet,
        updateBalance,
        depositToken,
        withdrawToken,
        faucetClaim,
        joinGame,
        winnerClaim,
        playerClaimBack,
        isLoading,
        handleChangeDeposit,
        handleChangeWithdraw,
        handleChangeFaucetClaim,
        handleChangeJoinGame,
        depositData,
        withdrawData,
        faucetClaimData,
        joinGameData,
        setJoinGameBtn
    }
    return (
        <>
            <Datacontext.Provider value={value}>
                {props.children}
            </Datacontext.Provider>
        </>
    )
}

function generateRandomString(length: any) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}