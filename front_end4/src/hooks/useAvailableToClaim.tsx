import { useContractCall, useContractFunction, useEthers } from "@usedapp/core";
import TokenForm from "../chain-info/contracts/TokenFarm.json"
import { utils, BigNumber, constants } from "ethers"
import networkMapping from "../chain-info/deployments/map.json"
import { useEffect } from "react";

export const useAvailableToClaim = (address: string) => {
    const { account, chainId } = useEthers()
    const { abi } = TokenForm
    const tokenFarmContractAddress = (chainId ? ((String(chainId) == '42') ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero) : constants.AddressZero)

    const tokenFarmInterface = new utils.Interface(abi)

    const [availableToClaim] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "getAvailablePreSaleTokensToWithdraw",
        args: [address, account]
    }) ?? []

    const [totalClaimed] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "totalWithdrawnPreSaleTokens",
        args: [account]
    }) ?? []


    return { availableToClaim, totalClaimed }
}