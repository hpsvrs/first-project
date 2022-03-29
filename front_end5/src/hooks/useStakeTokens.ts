// import { Token } from "@mui/icons-material"
import { useEthers, useContractFunction } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import { useEffect, useState, useContext } from "react"
// import { MyContext } from "../App";
import { MyContext } from "../components/Header2";


export const useStakeTokens = (tokenAddress: string) => {
    //address
    // abi
    // chainId
    const { chainId } = useEthers()
    const { abi } = TokenFarm

    const data = useContext(MyContext)
    const { chainIdentity, tokenFarmContractAddress: tokenFarmAddress } = data


    // const tokenFarmAddress = (chainId ? ((String(chainId) == '42') ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero) : constants.AddressZero)
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)

    //aprove
    const { send: approveErc20Send, state: approveAndStakeErc20State } =
        useContractFunction(erc20Contract, "approve",
            { transactionName: "Approve ERC20 Transfer" })

    const approveAndStake = (amount: string) => {
        setAmountToStake(amount)
        return approveErc20Send(tokenFarmAddress, amount)
    }


    const { send: stakeSend, state: stakeState } =
        useContractFunction(tokenFarmContract, "stakeTokens",
            { transactionName: "Stake Tokens" })



    const [amountToStake, setAmountToStake] = useState("0")

    //useEffect
    useEffect(() => {
        if (approveAndStakeErc20State.status === "Success") {
            stakeSend(amountToStake, tokenAddress)
        }
    }, [approveAndStakeErc20State, amountToStake, tokenAddress])

    const [state, setState] = useState(approveAndStakeErc20State)

    useEffect(() => {
        if (approveAndStakeErc20State.status === "Success") {
            setState(stakeState)
        }
        else {
            setState(approveAndStakeErc20State)
        }
    }, [approveAndStakeErc20State, stakeState])




    return { approveAndStake, state }

    //stake tokens
}