import { useEthers, useContractFunction } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import { utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import { useContext } from "react"
import { MyContext } from "../components/Header2";


export const useClaimStakingRewards = () => {
    //address
    // abi
    // chainId
    const { chainId } = useEthers()
    const { abi } = TokenFarm

    const data = useContext(MyContext)
    const { chainIdentity, tokenFarmContractAddress } = data


    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmContractAddress, tokenFarmInterface)

    return useContractFunction(tokenFarmContract, "claimStakingRewards",
        { transactionName: "Claiming Staking Rewards" })

}