import abiVault from "./Vault.json";
import abiToken from "./PtitToken.json";
import abiGame from "./NonCompetitiveGameA.json";

export const tokenContractAddress = "0x057ef64E23666F000b34aE31332854aCBd1c8544";
export const contractTokenABI = abiToken.abi;

export const vaultContractAddress = "0x261D8c5e9742e6f7f1076Fa1F560894524e19cad";
export const contractVaultABI = abiVault.abi;

export const gameContractAddress = "0xCba6b9A951749B8735C603e7fFC5151849248772";
export const contractGameABI = abiGame.abi;

export const gameCompetitiveContractAddress = "0xCE3478A9E0167a6Bc5716DC39DbbbfAc38F27623";
export const contractGameCompetitiveABI = abiGame.abi;
