import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  contractGameCompetitiveABI,
  contractVaultABI,
  gameContractAddress,
  vaultContractAddress,
  tokenContractAddress,
  contractTokenABI,
  gameCompetitiveContractAddress,
} from "../utils/constants";
import axios from "axios";

export const TransactionContext = React.createContext<any>({});

const { ethereum } = window;
const baseUrl = process.env.REACT_APP_BASE_URL;

const createEthereumPtitTokenContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsVaultContract = new ethers.Contract(
    tokenContractAddress,
    contractTokenABI,
    signer
  );

  return transactionsVaultContract;
};

const createEthereumVaultContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsVaultContract = new ethers.Contract(
    vaultContractAddress,
    contractVaultABI,
    signer
  );

  return transactionsVaultContract;
};

const createEthereumGameContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsGameContract = new ethers.Contract(
    gameCompetitiveContractAddress,
    contractGameCompetitiveABI,
    signer
  );

  return transactionsGameContract;
};

interface ChildrenType {
  // eslint-disable-next-line
  children: any;
}

export const TransactionsProviderCaro = (props: ChildrenType) => {
  const [depositData, setDepositData] = useState("");
  const [withdrawData, setWithdrawData] = useState("");
  const [faucetClaimData, setFaucetClaimData] = useState("");
  const [joinGameData, setJoinGameData] = useState("0.1");
  const [gameId, setGameId] = useState("");
  const [gameIdName, setGameIdName] = useState("");

  const [wallet, setWallet] = useState({ address: "", balances: "0" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeDeposit = (e: any) => {
    setDepositData(() => e.target.value);
  };

  const handleChangeWithdraw = (e: any) => {
    setWithdrawData(() => e.target.value);
  };

  const handleChangeFaucetClaim = (e: any) => {
    setFaucetClaimData(() => e.target.value);
  };

  const handleChangeJoinGame = (e: any) => {
    setJoinGameData(() => e.target.value);
  };

  const handleChangeGameId = (e: any) => {
    const value = e.target.value;
    const regex = new RegExp(/^((?!_).)*$/gm);
    if (regex.test(value)) {
      setGameIdName(() => e.target.value);
    }
  };

  const updateBalance = async () => {
    console.log("checkIfWalletIsConnect");
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const transactionsContract = createEthereumVaultContract();

      const balances = await transactionsContract.viewPlayersBalance();

      setWallet({
        address: wallet.address,
        balances: ethers.utils.formatEther(balances),
      });
      await callApi(
        "updateBalance",
        "POST",
        {
          address: wallet.address,
          balance: ethers.utils.formatEther(balances),
        },
        undefined
      );
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    console.log("checkIfWalletIsConnect");
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      const transactionsContract = createEthereumVaultContract();

      const balances = await transactionsContract.viewPlayersBalance();

      if (accounts.length) {
        setWallet({
          address: accounts[0],
          balances: ethers.utils.formatEther(balances),
        });
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    console.log("connectWallet");
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const transactionsContract = createEthereumVaultContract();
      const balances = await transactionsContract.viewPlayersBalance();
      setWallet({
        address: accounts[0],
        balances: ethers.utils.formatEther(balances),
      });
    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
    }
  };

  const depositToken = async (e: any) => {
    e.preventDefault();
    console.log("depositToken");
    try {
      if (ethereum) {
        const transactionsContract = createEthereumVaultContract();
        const parsedAmount = ethers.utils.parseEther(depositData);

        const transactionHash = await transactionsContract.depositToken(
          parsedAmount
        );

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const balances = await transactionsContract.viewPlayersBalance();

        setWallet({
          address: wallet.address,
          balances: ethers.utils.formatEther(balances),
        });
        await callApi(
          "updateBalance",
          "POST",
          {
            address: wallet.address,
            balance: ethers.utils.formatEther(balances),
          },
          undefined
        );
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
    }
  };

  const withdrawToken = async (e: any) => {
    e.preventDefault();
    console.log("withdrawToken");
    try {
      const transactionsContract = createEthereumVaultContract();
      const parsedAmount = ethers.utils.parseEther(withdrawData);

      const transactionHash = await transactionsContract.withdrawToken(
        parsedAmount.toString()
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      setIsLoading(false);

      const balances = await transactionsContract.viewPlayersBalance();
      setWallet({
        address: wallet.address,
        balances: ethers.utils.formatEther(balances),
      });
      await callApi(
        "updateBalance",
        "POST",
        {
          address: wallet.address,
          balance: ethers.utils.formatEther(balances),
        },
        undefined
      );
    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
    }
  };

  const faucetClaim = async (e: any) => {
    e.preventDefault();
    console.log("faucetClaim");
    try {
      const transactionsContract = createEthereumVaultContract();
      console.log(faucetClaimData);
      const transactionHash = await transactionsContract.faucetClaim(
        faucetClaimData
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      setIsLoading(false);

      const balances = await transactionsContract.viewPlayersBalance();
      setWallet({
        address: wallet.address,
        balances: ethers.utils.formatEther(balances),
      });
      await callApi(
        "updateBalance",
        "POST",
        {
          address: wallet.address,
          balance: ethers.utils.formatEther(balances),
        },
        undefined
      );
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  };

  const callApi = async (
    url: any,
    method: any,
    data: any,
    success?: (data: any) => void
  ) => {
    return axios({
      url: `${baseUrl}/caro/${url}`,
      method: method,
      data: { data: data },
    })
      .then(function (res) {
        if (success) {
          success(res);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const joinGame = async (amount: any, roomIdName: any) => {
    try {
      console.log("joinGame");
      setIsLoading(true);
      const randomString = generateRandomString(5);

      const messageHash = ethers.utils.id(randomString);
      const messageHashBytes = ethers.utils.arrayify(messageHash);
      const signWallet = new ethers.Wallet(
        "82f2875d49e8c831c611db7b7203d5f2b6ae97f730486859fcc9babe1baa954d"
      );
      const flatSig = await signWallet.signMessage(messageHashBytes);

      let nextGameId = 0;
      if (roomIdName) {
        await callApi(
          "getGameByIdName",
          "POST",
          { gameId: roomIdName },
          function (data: any) {
            if (data) {
              console.log(data.data.data);
              nextGameId = data.data.data.id;
            }
          }
        );
      } else {
        await callApi("getLastGameId", "GET", {}, function (data: any) {
          console.log(data);

          if (data) {
            nextGameId = data.data.data + 1;
          }
        });
      }

      setGameId(nextGameId.toString());
      console.log(nextGameId);
      const transactionsContract = createEthereumGameContract();
      let parsedAmount;
      if (amount != "") {
        parsedAmount = ethers.utils.parseEther(`${amount}`);
      } else {
        parsedAmount = ethers.utils.parseEther(`${joinGameData}`);
      }
      console.log(parsedAmount, "parsedAmount");
      const transactionHash = await transactionsContract.joinGame(
        parsedAmount,
        nextGameId,
        flatSig,
        messageHash
      );

      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);

      await callApi(
        "updateGameComp",
        "POST",
        {
          address: wallet.address,
          amount: joinGameData,
          game_id: nextGameId,
          message: messageHash,
          signature: flatSig,
        },
        undefined
      );

      setIsLoading(false);
      return { nextGameId };
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      throw new Error();
    }
  };

  const winnerClaim = async () => {
    console.log("winnerClaim");
    try {
      setIsLoading(true);
      const transactionsContract = createEthereumGameContract();
      const randomString = generateRandomString(5);
      const messageHash = ethers.utils.id(randomString);
      const messageHashBytes = ethers.utils.arrayify(messageHash);
      const signWallet = new ethers.Wallet(
        "82f2875d49e8c831c611db7b7203d5f2b6ae97f730486859fcc9babe1baa954d"
      );
      const flatSig = await signWallet.signMessage(messageHashBytes);
      console.log(flatSig, gameId);
      const transactionHash = await transactionsContract.winnerClaim(
        gameId,
        wallet.address
      );

      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      console.log(gameId);
      await callApi(
        "updateGameComp",
        "POST",
        { game_id: gameId, winner: wallet.address },
        undefined
      );
      updateBalance();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      // throw new Error("No ethereum object");
    }
  };

  const playerClaimBack = async () => {
    console.log("playerClaimBack");
    console.log(gameId);
    try {
      const transactionsContract = createEthereumGameContract();

      const transactionHash = await transactionsContract.playerClaimBack(
        gameId
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      setIsLoading(false);

      await callApi(
        "updateGameComp",
        "POST",
        { address: wallet.address, amount: joinGameData, game_id: gameId },
        undefined
      );
      updateBalance();
    } catch (error) {
      console.log(error);
      throw error;
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
        playerClaimBack,
        isLoading,
        handleChangeDeposit,
        handleChangeWithdraw,
        handleChangeFaucetClaim,
        handleChangeJoinGame,
        gameIdName,
        depositData,
        withdrawData,
        faucetClaimData,
        joinGameData,
        handleChangeGameId,
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  );
};

function generateRandomString(length: any) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
