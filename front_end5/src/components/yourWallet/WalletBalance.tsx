import { useEthers, useTokenBalance, useEtherBalance } from "@usedapp/core"
import { Token } from "../Main"
import { formatUnits } from "@ethersproject/units"
import { BalanceMsg } from "../../components/BalanceMsg"
import { useContext } from "react"
import { MyContext } from "../Header2"

export interface WalletBalanceProps {
    token: Token
}

export const WalletBalance = ({ token }: WalletBalanceProps) => {
    const { image, address, name } = token
    const { account } = useEthers()
    const { formattedDappTokenBalance } = useContext(MyContext)

    const ethBalance = useEtherBalance(account)
    // useTokenBalance(address, account)
    // console.log(tokenBalance?.toString())
    const formattedEthBalance: number = ethBalance ? parseFloat(formatUnits(ethBalance, 18)) : 0
    const tokenBalance = useTokenBalance(address, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    console.log("This is in WalletBalance.tsx: " + formattedDappTokenBalance)

    return ((name == "WETH") ?
        (<BalanceMsg label={`Your ${name} balance:`} tokenImgSrc={image} amount={formattedEthBalance} />)
        : (<BalanceMsg label={`Your ${name} balance:`} tokenImgSrc={image} amount={formattedDappTokenBalance} />))

}