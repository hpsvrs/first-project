import { useContractCall, useContractFunction, useEthers } from "@usedapp/core";
import TokenForm from "../chain-info/contracts/TokenFarm.json"
import { utils, BigNumber, constants } from "ethers"
import networkMapping from "../chain-info/deployments/map.json"
import { useContext, useEffect } from "react";
// import { MyContext } from "../App";
import { MyContext } from "../components/Header2";


export const useGetValues = (tokenAddress: string, preSaleNumber: string) => {
    const data = useContext(MyContext)
    const { chainIdentity, tokenFarmContractAddress, dappTokenAddress } = data
    console.log("this is in useGetValues: " + tokenAddress + " " + preSaleNumber)
    const { account, chainId } = useEthers()
    const { abi } = TokenForm
    // const tokenFarmContractAddress = (chainId ? ((String(chainId) == '42') ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero) : constants.AddressZero)
    const tokenFarmInterface = new utils.Interface(abi)

    const [availableToClaim] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "getAvailablePreSaleTokensToWithdrawEachPreSale",
        args: [tokenAddress, account, preSaleNumber]
    }) ?? []

    const [totalClaimed] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "totalWithdrawnPreSaleTokensEachPreSale",
        args: [preSaleNumber, account]
    }) ?? []

    const [participateInPreSaleAllocationStatus] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "participateInPreSaleAllocationStatus",
        args: [preSaleNumber]
    }) ?? []

    const [preSaleAllocationStatus] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "preSaleAllocationStatus",
        args: [preSaleNumber]
    }) ?? []

    const [preSaleFundEachPreSaleNumberStatus] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "preSaleFundEachPreSaleNumberStatus",
        args: [preSaleNumber]
    }) ?? []

    const [preSaleFundFCFSEachPreSaleNumberStatus] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "preSaleFundFCFSEachPreSaleNumberStatus",
        args: [preSaleNumber]
    }) ?? []

    const [preSaleFundEachPreSaleNumberWithoutStakingStatus] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "preSaleFundEachPreSaleNumberWithoutStakingStatus",
        args: [preSaleNumber]
    }) ?? []

    const [claimTokensEachPreSaleStatus] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "claimTokensEachPreSaleStatus",
        args: [preSaleNumber]
    }) ?? []

    const [timesEachPreSale] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "TIMESeachPreSale",
        args: [preSaleNumber]
    }) ?? []

    const [times] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "TIMES",
        args: []
    }) ?? []


    return {
        availableToClaim, totalClaimed,
        participateInPreSaleAllocationStatus, preSaleAllocationStatus,
        preSaleFundEachPreSaleNumberStatus,
        preSaleFundFCFSEachPreSaleNumberStatus,
        preSaleFundEachPreSaleNumberWithoutStakingStatus,
        claimTokensEachPreSaleStatus, timesEachPreSale,
        times
    }
}