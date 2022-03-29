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

// const MyContext = createContext('')

export const usePreSale = (tokenAddress: string) => {
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


    //aprove
    const { send: approveErc20Send, state: approveAndPreSaleErc20State } =
        useContractFunction(erc20Contract, "approve",
            { transactionName: "Approve ERC20 Transfer" })

    const approveAndPreSale = (amount: string) => {
        setAmountForPreSale(amount)
        return approveErc20Send(tokenFarmContractAddress, amount)
    }




    const { send: preSaleFundSend, state: preSaleFundState } =
        useContractFunction(tokenFarmContract, "preSaleFund",
            { transactionName: "Stake Tokens" })



    const [AmountForPreSale, setAmountForPreSale] = useState("0")

    //useEffect
    useEffect(() => {
        if (approveAndPreSaleErc20State.status === "Success") {
            preSaleFundSend(AmountForPreSale, tokenAddress)
        }
    }, [approveAndPreSaleErc20State, AmountForPreSale, tokenAddress])

    const [state, setState] = useState(approveAndPreSaleErc20State)

    useEffect(() => {
        if (approveAndPreSaleErc20State.status === "Success") {
            setState(preSaleFundState)
        }
        else {
            setState(approveAndPreSaleErc20State)
        }
    }, [approveAndPreSaleErc20State, preSaleFundState])




    return { approveAndPreSale, state }

    //stake tokens
}