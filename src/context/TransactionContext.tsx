import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractGameABI, contractVaultABI, gameContractAddress, vaultContractAddress } from '../utils/constants';
import axios from "axios";

export const TransactionContext = React.createContext({});

const { ethereum } = window;

const createEthereumVaultContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsVaultContract = new ethers.Contract(vaultContractAddress, contractVaultABI, signer);

  return transactionsVaultContract;
};

const createEthereumGameContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsGameContract = new ethers.Contract(gameContractAddress, contractGameABI, signer);

  return transactionsGameContract;
};

interface ChildrenType {
  // eslint-disable-next-line
  children: any;
}

export const TransactionsProvider = (props: ChildrenType) => {
  const [depositData, setDepositData] = useState("");
  const [withdrawData, setWithdrawData] = useState("");
  const [faucetClaimData, setFaucetClaimData] = useState("");
  // eslint-disable-next-line
  const [joinGameData, setJoinGameData] = useState<any>("100");
  // eslint-disable-next-line
  const [gameId, setGameId] = useState<any>(0)

  const [wallet, setWallet] = useState({ address: "", balances: "0" });
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line
  const handleChangeDeposit = (e: any) => {
    setDepositData(() => (e.target.value));
  };

  // eslint-disable-next-line
  const handleChangeWithdraw = (e: any) => {
    setWithdrawData(() => (e.target.value));
  };

  // eslint-disable-next-line
  const handleChangeFaucetClaim = (e: any) => {
    setFaucetClaimData(() => (e.target.value));
  };

  // eslint-disable-next-line
  const handleChangeJoinGame = (e: any) => {
    console.log(e.target.value);
    setJoinGameData(() => (e.target.value));
  };

  // eslint-disable-next-line
  const handleChangeGameId = (value: any) => {
    setGameId(() => (value));
  };

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
      await callApi('updateBalance', "POST", {address: wallet.address, balance: ethers.utils.formatEther(balances)}, function () {
        return
      })
      // dispatch(doUpdateBalance({address: wallet.address, balance: wallet.balances}))
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  };

  const connectWallet = async () => {
    console.log('connectWallet');
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      console.log('1');
      const accounts = await ethereum.request({ method: "eth_requestAccounts", });
      console.log('2');

      const transactionsContract = createEthereumVaultContract();
      const balances = await transactionsContract.viewPlayersBalance();
      console.log(ethers.utils.formatEther(balances));
      setWallet({
        address: accounts[0],
        balances: ethers.utils.formatEther(balances)
      })

    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
    }
  };

  // eslint-disable-next-line
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
        console.log(ethers.utils.formatEther(balances));
        // dispatch(doUpdateBalance({address: wallet.address, balance: ethers.utils.formatEther(balances)}))
        await callApi('updateBalance', "POST", {address: wallet.address, balance: ethers.utils.formatEther(balances)}, function () {
          return
        })
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
    }
  };

  // eslint-disable-next-line
  const withdrawToken = async (e: any) => {
    e.preventDefault();
    console.log('withdrawToken');
    try {
      if (ethereum) {
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
        await callApi('updateBalance', "POST", {address: wallet.address, balance: ethers.utils.formatEther(balances)}, function () {
          return
        })
        // dispatch(doUpdateBalance({address: wallet.address, balance: wallet.balances}))

      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
    }
  };

  // eslint-disable-next-line
  const faucetClaim = async (e: any) => {
    e.preventDefault();
    console.log('faucetClaim');
    try {
      if (ethereum) {
        const transactionsContract = createEthereumVaultContract();

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

        await callApi('updateBalance', "POST", {address: wallet.address, balance: ethers.utils.formatEther(balances)}, function () {
          return
        })
        // dispatch(doUpdateBalance({address: wallet.address, balance: wallet.balances}))

      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
    }
  };

  // eslint-disable-next-line
  const callApi = async (url: any, method: any, data: any, success: any) => {
    return axios({
      url: `http://localhost:4000/${url}`,
      method: method,
      data: { data: data },
    })
      .then(function (res) {
        success(res.data.data)
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const joinGame = async () => {
    console.log('joinGame');
    let nextGameId = 1;
    // eslint-disable-next-line
    await callApi('getLastGameId', "GET", {}, function (data: any) {
      if (data) {
        nextGameId = data + 1;
      }
    })
    setGameId(nextGameId.toString())
    console.log(nextGameId);
    try {
      if (ethereum) {
        const transactionsContract = createEthereumGameContract();
        const parsedAmount = ethers.utils.parseEther(joinGameData);

        const transactionHash = await transactionsContract.joinGame(parsedAmount, nextGameId);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
    }
    await callApi('updateGame', "POST", {address: wallet.address, amount: joinGameData}, function () {
      return
    })
  };

  const winnerClaim = async () => {
    console.log('winnerClaim');
    console.log(gameId);
    try {
      if (ethereum) {
        const transactionsContract = createEthereumGameContract();
        const reward = joinGameData * 2
        const parsedAmount = ethers.utils.parseEther(reward.toString());

        const messageHash = ethers.utils.id("You win!");
        const messageHashBytes = ethers.utils.arrayify(messageHash)
        const signWallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
        const flatSig = await signWallet.signMessage(messageHashBytes);

        const transactionHash = await transactionsContract.winnerClaim(gameId, parsedAmount, flatSig, messageHash);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        await callApi('updateGame', "POST", {address: wallet.address, amount: joinGameData}, function () {
          return
        })
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        wallet,
        updateBalance,
        depositToken,
        withdrawToken,
        faucetClaim,
        joinGame,
        winnerClaim,
        isLoading,
        handleChangeDeposit,
        handleChangeWithdraw,
        handleChangeFaucetClaim,
        handleChangeJoinGame,
        depositData,
        withdrawData,
        faucetClaimData,
        joinGameData,
        handleChangeGameId
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  );
};