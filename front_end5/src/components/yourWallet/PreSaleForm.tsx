import { Token } from "../Main"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { Button, CircularProgress, Input, Snackbar, Typography } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import React, { useState, useEffect } from "react"
import { usePreSale } from "../../hooks/usePreSale"
import { useWithdrawPreSaleBalance } from "../../hooks/useWithdrawPreSaleBalance"
import { utils } from "ethers"
import { BalanceMsg } from "../BalanceMsg"
import { usePurchasedBalance } from "../../hooks/usePurchasedBalance"
import { AddModerator, MarginRounded } from "@mui/icons-material"
import TextField from '@mui/material/TextField';
import { useGetValues } from "../../hooks/useGetValues"


export interface StakeFormProps {
    token: Token
}

export const PreSaleForm = ({ token }: StakeFormProps) => {
    const { image, address: tokenAddress, name } = token
    const { account } = useEthers()
    const { times } = useGetValues(tokenAddress, '0')
    const fTimes: number = times ? parseFloat(times) : 0

    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)

    const { notifications } = useNotifications()


    const balance = usePurchasedBalance(tokenAddress)
    const formattedBalance: number = balance ? parseFloat(formatUnits(balance, 18)) : 0

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

    const { approveAndPreSale, state: approveAndStakeErc20State } = usePreSale(tokenAddress)
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
            <h4> 1 $BUSD = {fTimes} x ${name}</h4>

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
                <h3>You will get {numbervalue * fTimes} tokens.</h3>

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