import { Token } from "../Main"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { Button, CircularProgress, Input, Snackbar, Typography } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import React, { useState, useEffect } from "react"
import { usePreSaleEachPreSale } from "../../hooks/usePreSaleEachPreSale"
import { useWithdrawPreSaleBalance } from "../../hooks/useWithdrawPreSaleBalance"
import { utils } from "ethers"
import { BalanceMsg } from "../BalanceMsg"
import { usePurchasedBalanceEachPreSale } from "../../hooks/usePurchasedBalanceEachPreSale"
import { AddModerator, MarginRounded } from "@mui/icons-material"
import TextField from '@mui/material/TextField';
import { useGetValues } from "../../hooks/useGetValues"


export interface StakeFormProps {
    token: Token
    preSaleNumber: string
}

export const PreSaleFormEachPreSale = ({ token, preSaleNumber }: StakeFormProps) => {
    const { image, address: tokenAddress, name } = token
    const { account } = useEthers()
    const { timesEachPreSale } = useGetValues(tokenAddress, preSaleNumber)

    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)

    const { notifications } = useNotifications()

    const fTimesEachPreSale: number = timesEachPreSale ? parseFloat(timesEachPreSale) : 0

    const { totalPurchasedPreSaleTokensEachPreSale } = usePurchasedBalanceEachPreSale(tokenAddress, preSaleNumber)
    const formattedBalance: number = totalPurchasedPreSaleTokensEachPreSale ? parseFloat(formatUnits(totalPurchasedPreSaleTokensEachPreSale, 18)) : 0

    var [numbervalue, setnumbervalue] = useState(0);

    console.log('pre')
    console.log(numbervalue * 2)
    console.log('sale')

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event?.target.value)
        setnumbervalue(Number(event.target.value))
        setAmount(newAmount)
        // console.log(newAmount)
    }

    const { approveAndPreSale, state: approveAndStakeErc20State } = usePreSaleEachPreSale(tokenAddress, preSaleNumber)
    const { send: withdrawBalance, state: withdrawBalanceState } = useWithdrawPreSaleBalance()

    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        // console.log(amountAsWei)
        // console.log('bcd')
        return approveAndPreSale(amountAsWei.toString())
    }


    const handleWithdrawPreSaleSubmit = () => {
        return withdrawBalance(tokenAddress)
    }

    const isWithdrawing = withdrawBalanceState.status === "Mining"
    const isMining = approveAndStakeErc20State.status === "Mining"
    const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = useState(false)
    const [showStakeTokensSuccess, setShowStakeTokensSuccess] = useState(false)
    const handleCloseSnack = () => {
        setShowErc20ApprovalSuccess(false)
        setShowStakeTokensSuccess(false)
    }
    useEffect(() => {
        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Approve ERC20 Transfer"
        ).length > 0) {
            console.log("Approved!")
            setShowErc20ApprovalSuccess(true)
            setShowStakeTokensSuccess(false)
        }
        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Stake Tokens"
        ).length > 0) {
            console.log("Tokens Staked!")
            setShowErc20ApprovalSuccess(false)
            setShowStakeTokensSuccess(true)
        }
    }, [notifications, showErc20ApprovalSuccess, showStakeTokensSuccess])

    return (
        <>
            <BalanceMsg label={`Your participated ${name} count:`} amount={formattedBalance}
                tokenImgSrc={image} />
            <h4> 1 $BUSD = {fTimesEachPreSale} x ${name}</h4>
            <div className="form">

                <Input className="form-input" onChange={handleInputChange} />
                <span >
                    <button onClick={handleStakeSubmit}
                        color="primary"
                        // size="large"
                        disabled={isMining}
                        // variant="contained"
                        className="btn"
                    >
                        {isMining ? <CircularProgress size={26} /> : "Buy!!"}

                    </button>

                </span>
                <h3>You will get {numbervalue * fTimesEachPreSale} tokens.</h3>

                <button className="btn" onClick={handleWithdrawPreSaleSubmit}

                    disabled={isMining}
                >
                    {isMining ? <CircularProgress size={26} /> : "Withdraw!!"}

                </button>
            </div>
            <Snackbar open={showErc20ApprovalSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack} >
                <Alert onClose={handleCloseSnack} severity="success" >
                    ERC-20 token transfer approved! Now approve the 2nd transaction!
                </Alert>

            </Snackbar>
            <Snackbar open={showStakeTokensSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack} >
                <Alert onClose={handleCloseSnack} severity="success" >
                    Tokens Purchased!
                </Alert>
            </Snackbar>
        </>
    )
}