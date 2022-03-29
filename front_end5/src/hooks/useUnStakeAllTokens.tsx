// import { Token } from "@mui/icons-material"
import { useEthers, useContractFunction } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
// import ERC20 from "../chain-info/contracts/MockERC20.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
// import { useEffect, useState } from "react"
import { useContext } from "react"
// import { MyContext } from "../App";
import { MyContext } from "../components/Header2";


export const useUnStakeAllTokens = () => {
    //address
    // abi
    // chainId
    const { chainId } = useEthers()
    const { abi } = TokenFarm

    const data = useContext(MyContext)
    const { chainIdentity, tokenFarmContractAddress: tokenFarmAddress } = data


    // const tokenFarmAddress = (chainId ? ((String(chainId) == '42') ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero) : constants.AddressZero)
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    // const erc20ABI = ERC20.abi
    // const erc20Interface = new utils.Interface(erc20ABI)
    // const erc20Contract = new Contract(tokenAddress, erc20Interface)

    //aprove


    // const UnStakeTokens = () => {
    //     unStakeSend(tokenAddress)
    // }



    // const { send: unStakeSend, state: unStakeState } =
    //     useContractFunction(tokenFarmContract, "unstakeTokens",
    //         { transactionName: "Unstake Tokens" })

    return useContractFunction(tokenFarmContract, "unstakeAllTokens",
        { transactionName: "Unstake All Tokens" })


    //stake tokens
}