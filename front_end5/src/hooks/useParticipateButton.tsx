import { useEthers, useContractFunction } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import { utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import { useContext } from "react"
import { MyContext } from "../components/Header2";



export const useParticipationButton = () => {
    //address
    // abi
    // chainId
    const { chainId } = useEthers()
    const { abi } = TokenFarm


    const data = useContext(MyContext)
    const { tokenFarmContractAddress, dappTokenAddress } = data

    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmContractAddress, tokenFarmInterface)

    const participateInPreSaleAllocationSendFunction = (preSaleNumber: string) => {

        return participateInPreSaleAllocationSend(preSaleNumber, dappTokenAddress)
    }
    const { send: participateInPreSaleAllocationSend, state: participateInPreSaleAllocationState } =
        useContractFunction(tokenFarmContract, "participateInPreSaleAllocation",
            { transactionName: "Participating in PreSale Allocation" })

    return { participateInPreSaleAllocationSendFunction, participateInPreSaleAllocationState }

}