import { Token } from "@mui/icons-material"
import { useEthers, useContractFunction } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import { useEffect, useState, useContext } from "react"
import PreSale from "../chain-info/contracts/PreSale.json"
// import { MyContext } from "../App";
import { MyContext } from "../components/Header2";



export const useClaimPreSaleTokensEachPreSale = () => {
    //address
    // abi
    // chainId
    const { chainId } = useEthers()
    const { abi } = TokenFarm


    const data = useContext(MyContext)
    const { chainIdentity, tokenFarmContractAddress } = data

    // const tokenFarmAddress = (chainId ? ((String(chainId) == '42') ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero) : constants.AddressZero)


    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmContractAddress, tokenFarmInterface)



    // return useContractFunction(tokenFarmContract, "unstakeTokens",
    //     { transactionName: "Unstake Tokens" })
    const claimAllTokensEachPreSaleSendFunction = (preSaleNumber: string) => {

        return claimAllTokensEachPreSaleSend(preSaleNumber)
    }
    const { send: claimAllTokensEachPreSaleSend, state: claimAllTokensEachPreSaleState } =
        useContractFunction(tokenFarmContract, "claimAllTokensEachPreSale",
            { transactionName: "Claiming Pre Sale Tokens Each PreSale" })

    return { claimAllTokensEachPreSaleSendFunction, claimAllTokensEachPreSaleState }

}