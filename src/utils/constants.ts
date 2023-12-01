import abiVault from "./Vault.json";
import abiToken from "./PtitToken.json";
import abiGame from "./NonCompetitiveGameA.json";
import abiCompetitveGame from "./TwoPlayersV1.json"

export const tokenContractAddress = "0x70293179EA063Ddb12bF7fF8b8A375f023Eb2270";
export const contractTokenABI = abiToken.abi;

export const vaultContractAddress = "0xdB2070DD615d4CE105cB69C811DAFE0115c04D39";
export const contractVaultABI = abiVault.abi;

export const gameContractAddress = "0xEcb1e6e4d44EeB24a6a41443ABd70090ac871E75";
export const contractGameABI = abiGame.abi;

export const gameCompetitiveContractAddress = "0x02Ed01167Edb727E2C9cF75ef2f405E1E3C92AAf";
export const contractGameCompetitiveABI = abiCompetitveGame.abi;


// Rinkerby
// PtitToken address:  0xe529B80745e997f4a72453c4c1b2A01eBb29aA02
// Vault address:  0x93344d455F7cA42558a402033cAF92B930CC9f2e
// Game address:  0x504dd4054839caDF215E9a9cAC91feCb61e2EAFD
// Game NonCompetitive address:  0x7ad81b49892Ea3228dAE7da7C260698e1d329264

// Goerli
// PtitToken address:  0x8b68682965ce74f96a504D779FE38aD8B33B417E
// Vault address:  0xa75A1e72C2C30590119234cde3c6117AC8060D24
// Game address:  0xFB3F85c4fC405030e158AAB91c26883DeA45655B
// Game NonCompetitive address:  0xe680C19a6c3A407ae3aEc2569166D13B1104C7e7