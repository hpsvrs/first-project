import { useContractCall, useContractFunction, useEthers } from "@usedapp/core";
import TokenForm from "../chain-info/contracts/TokenFarm.json"
import { utils, BigNumber, constants } from "ethers"
import networkMapping from "../chain-info/deployments/map.json"
import { useContext, useEffect } from "react";
// import { MyContext } from "../App";
import { MyContext } from "../components/Header2";


export const useAllocatedAmount = (tokenAddress: string, preSaleNumber: string) => {
    const data = useContext(MyContext)
    const { chainIdentity, tokenFarmContractAddress, dappTokenAddress } = data
    console.log("this is in useGetValues: " + tokenAddress + " " + preSaleNumber)
    const { account, chainId } = useEthers()
    const { abi } = TokenForm
    // const tokenFarmContractAddress = (chainId ? ((String(chainId) == '42') ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero) : constants.AddressZero)
    const tokenFarmInterface = new utils.Interface(abi)

    const [getAllocatedPreSaleAmount] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "getAllocatedPreSaleAmount",
        args: [account, tokenAddress, preSaleNumber]
    }) ?? []


    return { getAllocatedPreSaleAmount }
}