import { Token } from "@mui/icons-material"
import { useEthers, useContractFunction } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import { createContext, useContext, useEffect, useState } from "react"
// import { MyContext } from "../App";
import { MyContext } from "../components/Header2";
import { useGetValues } from "./useGetValues"

// const MyContext = createContext('')

export const usePreSaleEachPreSale = (tokenAddress: string, preSaleNumber: string) => {
    //address
    // abi
    // chainId
    const data = useContext(MyContext)
    const { chainIdentity, tokenFarmContractAddress } = data

    console.log('this is the value of context chainId in usePreSale: ' + data + ' Number ' + chainIdentity + ' TokenAddress ' + tokenFarmContractAddress)

    useEffect(() => {
        console.log('in usePreSale chainNumber and tokenFarmAddress changed.')
    }, [chainIdentity, tokenFarmContractAddress])

    const { chainId } = useEthers()
    const { abi } = TokenFarm

    // const tokenFarmAddress = tokenFarmContractAddress
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmContractAddress, tokenFarmInterface)

    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)

    const { participateInPreSaleAllocationStatus, preSaleAllocationStatus, preSaleFundEachPreSaleNumberStatus, preSaleFundFCFSEachPreSaleNumberStatus, preSaleFundEachPreSaleNumberWithoutStakingStatus, claimTokensEachPreSaleStatus } = useGetValues(tokenAddress, preSaleNumber)
    console.log("You are in Hook usePreSaleEachPreSale: and this is participateInPreSaleAllocationStatus, preSaleAllocationStatus, preSaleFundEachPreSaleNumberStatus, preSaleFundFCFSEachPreSaleNumberStatus, preSaleFundEachPreSaleNumberWithoutStakingStatus, claimTokensEachPreSaleStatus: " + participateInPreSaleAllocationStatus + preSaleAllocationStatus + preSaleFundEachPreSaleNumberStatus + preSaleFundFCFSEachPreSaleNumberStatus + preSaleFundEachPreSaleNumberWithoutStakingStatus + claimTokensEachPreSaleStatus)

    //aprove
    const { send: approveErc20Send, state: approveAndPreSaleErc20State } =
        useContractFunction(erc20Contract, "approve",
            { transactionName: "Approve ERC20 Transfer" })

    const approveAndPreSale = (amount: string) => {
        setAmountForPreSale(amount)
        return approveErc20Send(tokenFarmContractAddress, amount)
    }




    const { send: preSaleFundSend, state: preSaleFundState } =
        useContractFunction(tokenFarmContract, "preSaleFundEachPreSaleNumber",
            { transactionName: "preSaleFundEachPreSaleNumber" })

    const { send: preSaleFundFCFSSend, state: preSaleFundFCFSState } =
        useContractFunction(tokenFarmContract, "preSaleFundFCFSEachPreSaleNumber",
            { transactionName: "preSaleFundEachPreSaleNumber" })

    const { send: preSaleFundWithoutStakingSend, state: preSaleFundWithoutStakingState } =
        useContractFunction(tokenFarmContract, "preSaleFundEachPreSaleNumberWithoutStaking",
            { transactionName: "preSaleFundEachPreSaleNumber" })


    const [AmountForPreSale, setAmountForPreSale] = useState("0")

    //useEffect
    useEffect(() => {
        if (approveAndPreSaleErc20State.status === "Success") {
            if (preSaleFundEachPreSaleNumberStatus == true) {
                preSaleFundSend(AmountForPreSale, tokenAddress, tokenAddress, preSaleNumber)
            } else if (preSaleFundFCFSEachPreSaleNumberStatus == true) {
                preSaleFundFCFSSend(AmountForPreSale, tokenAddress, tokenAddress, preSaleNumber)
            } else {
                preSaleFundWithoutStakingSend(AmountForPreSale, tokenAddress, tokenAddress, preSaleNumber)
            }
        }
    }, [approveAndPreSaleErc20State, AmountForPreSale, tokenAddress])

    const [state, setState] = useState(approveAndPreSaleErc20State)

    useEffect(() => {
        if (approveAndPreSaleErc20State.status === "Success") {
            if (preSaleFundEachPreSaleNumberStatus == true) {
                setState(preSaleFundState)
            } else if (preSaleFundFCFSEachPreSaleNumberStatus == true) {
                setState(preSaleFundFCFSState)
            } else {
                setState(preSaleFundWithoutStakingState)
            }
        }
        else {
            setState(approveAndPreSaleErc20State)
        }
    }, [approveAndPreSaleErc20State, preSaleFundState, preSaleFundFCFSState, preSaleFundWithoutStakingState])




    return { approveAndPreSale, state }

    //stake tokens
}