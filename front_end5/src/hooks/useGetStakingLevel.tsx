import { useContractCall, useContractFunction, useEthers } from "@usedapp/core";
import TokenForm from "../chain-info/contracts/TokenFarm.json"
import { utils, BigNumber, constants } from "ethers"
import networkMapping from "../chain-info/deployments/map.json"
import { useContext, useEffect } from "react";
// import { MyContext } from "../App";
import { MyContext } from "../components/Header2";


export const useGetStakingLevel = () => {
    const data = useContext(MyContext)
    // const { chainIdentity, tokenFarmContractAddress } = data

    const { account, chainId } = useEthers()
    const tokenFarmContractAddress = (
        chainId ?
            (((String(chainId) == '42') || (String(chainId) == '97')) ?
                networkMapping[String(chainId)]["TokenFarm"][0] :
                constants.AddressZero) :
            constants.AddressZero)
    const dappTokenAddress = (
        chainId ?
            (((String(chainId) == '42') || (String(chainId) == '97')) ?
                networkMapping[String(chainId)]["DappToken"][0] :
                constants.AddressZero) :
            constants.AddressZero)

    const { abi } = TokenForm
    // const tokenFarmContractAddress = (chainId ? ((String(chainId) == '42') ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero) : constants.AddressZero)
    const tokenFarmInterface = new utils.Interface(abi)

    const [getStakingLevel] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "getStakingLevel",
        args: [account, dappTokenAddress]
    }) ?? []

    return { getStakingLevel }
}