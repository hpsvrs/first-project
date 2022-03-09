import { useContractCall, useEthers } from "@usedapp/core";
import TokenForm from "../chain-info/contracts/TokenFarm.json"
import { utils, BigNumber, constants } from "ethers"
import networkMapping from "../chain-info/deployments/map.json"


export const useStakingRewards = (address: string): BigNumber | undefined => {
    const { account, chainId } = useEthers()
    const { abi } = TokenForm
    const tokenFarmContractAddress = (chainId ? ((String(chainId) == '42') ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero) : constants.AddressZero)

    const tokenFarmInterface = new utils.Interface(abi)

    const [stakingRewards] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "getAvailableStakingRewards",
        args: [account, address]
    }) ?? []


    return stakingRewards
}