import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { generateRandomString } from "../utils/utils";

export const AppContext = React.createContext<any>({});

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

export const AppProvider = (props: ChildrenType) => {
  const [depositData, setDepositData] = useState("");
  const [withdrawData, setWithdrawData] = useState("");
  const [faucetClaimData, setFaucetClaimData] = useState("");
  const [joinGameData, setJoinGameData] = useState("100");
  const [gameId, setGameId] = useState("");
  const [gameIdName, setGameIdName] = useState("");

  const [wallet, setWallet] = useState({ address: "", balances: "0" });
  const [balanceToken, setBalanceToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balanceApprove, setBalanceApprove] = useState("");

  const handleChangeDeposit = (value: string) => {
    setDepositData(value);
  };

  const handleChangeWithdraw = (value: string) => {
    setWithdrawData(value);
  };

  const handleChangeFaucetClaim = (e: any) => {
    setFaucetClaimData(() => e.target.value);
  };

  const handleChangeJoinGame = (e: any) => {
    setJoinGameData(() => e.target.value);
  };

  const handleChangeGameId = (e: any) => {
    setGameIdName(() => e.target.value);
  };

  const updateBalance = async () => {
    console.log("checkIfWalletIsConnect", "Appprovider");
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
        {}
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

  const updateBalanceToken = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      const tokenContract = createEthereumPtitTokenContract();
      const balances = await tokenContract.balanceOf(accounts[0]);

      if (accounts.length) {
        setBalanceToken(ethers.utils.formatEther(balances));
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
          {}
        );
        updateAccount();
        getBalanceAllowance();
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
        {}
      );
      updateAccount();
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
        {}
      );
    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
    }
  };

  const callApi = async (url: any, method: any, data: any, success: any) => {
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
      const randomString = generateRandomString(5);

      const messageHash = ethers.utils.id(randomString);
      const messageHashBytes = ethers.utils.arrayify(messageHash);
      const signWallet = new ethers.Wallet(
        "82f2875d49e8c831c611db7b7203d5f2b6ae97f730486859fcc9babe1baa954d"
      );
      const flatSig = await signWallet.signMessage(messageHashBytes);

      let nextGameId = 1;
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
        parsedAmount = ethers.utils.parseEther(amount);
      } else {
        parsedAmount = ethers.utils.parseEther(joinGameData);
      }
      console.log(parsedAmount, "parsedAmount");
      const transactionHash = await transactionsContract.joinGame(
        parsedAmount,
        nextGameId,
        flatSig,
        messageHash
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      setIsLoading(false);

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
        {}
      );
    } catch (error) {
      console.log(error);
      // throw new Error("No ethereum object");
    }
  };

  const winnerClaim = async () => {
    console.log("winnerClaim");
    try {
      const transactionsContract = createEthereumGameContract();

      const randomString = generateRandomString(5);

      const messageHash = ethers.utils.id(randomString);
      const messageHashBytes = ethers.utils.arrayify(messageHash);
      const signWallet = new ethers.Wallet(
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
      );
      const flatSig = await signWallet.signMessage(messageHashBytes);

      const transactionHash = await transactionsContract.winnerClaim(
        gameId,
        flatSig,
        messageHash,
        wallet.address
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      setIsLoading(false);
      console.log(gameId);
      await callApi(
        "updateGameComp",
        "POST",
        { game_id: gameId, winner: wallet.address },
        {}
      );
      updateBalance();
    } catch (error) {
      console.log(error);

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
        {}
      );
      updateBalance();
    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
    }
  };

  const getBalanceAllowance = useCallback(async () => {
    try {
      if (ethereum && wallet.address) {
        const tContract = createEthereumPtitTokenContract();
        const balances = await tContract.allowance(
          wallet.address,
          vaultContractAddress
        );

        const balanceFormat = ethers.utils.formatEther(balances);
        setBalanceApprove(balanceFormat);
      } else {
        console.log("No ethereum object");
        setBalanceApprove("");
      }
    } catch (error) {
      console.log(error);
      // throw new Error("No ethereum object");
    }
  }, [wallet.address, vaultContractAddress]);

  const approveBalance = async (e: any) => {
    e.preventDefault();
    try {
      if(!balanceToken){
        console.log("No balance token");
        return;
      }
      if (ethereum && wallet.address) {
        const tContract = createEthereumPtitTokenContract();

        const balanceTokenApprove = ethers.utils.parseEther(balanceToken);
        const transactionHash = await tContract.approve(
          vaultContractAddress,
          balanceTokenApprove
        );
        setIsLoading(true);
        await transactionHash.wait();
        setIsLoading(false);
        await getBalanceAllowance();
      } else {
        console.log("No ethereum object");
        return 0;
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      // throw new Error("No ethereum object");
    }
  };

  const updateAccount = () => {
    checkIfWalletIsConnect();
    updateBalanceToken();
  };

  useEffect(() => {
    if (wallet.address) {
      getBalanceAllowance();
    }
  }, [wallet.address]);

  useEffect((): any => {
    updateAccount();
    if (ethereum && ethereum.on) {
      ethereum.on("accountsChanged", updateAccount);
      return () => {
        ethereum.removeListener("accountsChanged", updateAccount);
      };
    }
  }, [ethereum]);

  return (
    <AppContext.Provider
      value={{
        connectWallet,
        balanceToken,
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
        balanceApprove,
        approveBalance,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
