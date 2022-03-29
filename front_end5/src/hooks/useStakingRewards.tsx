import { useContractCall, useEthers } from "@usedapp/core";
import TokenForm from "../chain-info/contracts/TokenFarm.json"
import { utils, BigNumber, constants } from "ethers"
import networkMapping from "../chain-info/deployments/map.json"
import { useContext } from "react"
// import { MyContext } from "../App";
import { MyContext } from "../components/Header2";


export const useStakingRewards = (address: string): BigNumber | undefined => {
    const { account, chainId } = useEthers()
    const { abi } = TokenForm


    const data = useContext(MyContext)
    const { chainIdentity, tokenFarmContractAddress } = data

    // const tokenFarmContractAddress = (chainId ? ((String(chainId) == '42') ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero) : constants.AddressZero)

    const tokenFarmInterface = new utils.Interface(abi)

    const [stakingRewards] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "getAvailableStakingRewards",
        args: [account, address]
    }) ?? []


    return stakingRewards
}