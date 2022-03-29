import { Token } from "../Main"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { Button, CircularProgress, Input, Snackbar } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import React, { useState, useEffect } from "react"
import { useUnStakeAllTokens } from "../../hooks/useUnStakeAllTokens"
import { useUnStakeTokens } from "../../hooks/useUnStakeTokens"
import { useStakeTokens } from "../../hooks/useStakeTokens"
import { useStakingBalance } from "../../hooks/useStakingBalance"
import { utils } from "ethers"
import { BalanceMsg } from "../BalanceMsg"

export interface StakeFormProps {
    token: Token
}

export const UnStakeForm = ({ token }: StakeFormProps) => {
    const { image, address: tokenAddress, name } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const { notifications } = useNotifications()
    const { stakingBalance } = useStakingBalance(tokenAddress)
    const formattedBalance: number = stakingBalance ? parseFloat(formatUnits(stakingBalance, 18)) : 0


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event?.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }

    const { send: unstakeAllTokensSend, state: unstakeAllTokensState } = useUnStakeAllTokens()

    const { approveAndStake, state: approveAndStakeErc20State } = useStakeTokens(tokenAddress)

    const { unStakeTokens, unStakeState: unstakeTokensState } = useUnStakeTokens(tokenAddress)

    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }

    const handleUnStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return unStakeTokens(amountAsWei.toString())
    }

    const handleUnStakeAllSubmit = () => {
        return unstakeAllTokensSend(tokenAddress)
    }

    const isMining = approveAndStakeErc20State.status === "Mining"
    const isUnStaking = unstakeTokensState.status === "Mining"
    const isUnStakingAll = unstakeAllTokensState.status === "Mining"
    const [btnDisable, setBtnDisable] = useState('')
    console.log(isUnStaking)

    // const isUnStaking = unstakeTokensState.status = "UnStakings"
    const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = useState(false)
    const [showStakeTokensSuccess, setShowStakeTokensSuccess] = useState(false)
    const [showUnStakeTokensSuccess, setShowUnStakeTokensSuccess] = useState(false)

    const handleCloseSnack = () => {
        setShowErc20ApprovalSuccess(false)
        setShowStakeTokensSuccess(false)
        setShowUnStakeTokensSuccess(false)
    }

    useEffect(() => {
        if (isMining || isUnStaking || isUnStakingAll) {
            setBtnDisable('disabled')
        } else {
            setBtnDisable('')
        }
    }, [isMining, isUnStaking, isUnStakingAll])

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
        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Unstake Tokens"
        ).length > 0) {
            console.log("Tokens Staked!")
            setShowUnStakeTokensSuccess(true)
        }
    }, [notifications, showErc20ApprovalSuccess, showStakeTokensSuccess, showUnStakeTokensSuccess])

    return (
        <>  <div className="form">
            <BalanceMsg label={`Your staked ${name} balance:`} amount={formattedBalance}
                tokenImgSrc={image} />

            {/* This is a stake <div> */}
            {/* <div>

                <Input onChange={handleInputChange} />
                <Button onClick={handleStakeSubmit}
                    color="primary" size="large"
                    disabled={isMining || isUnStaking}
                >
                    {isMining ? <CircularProgress size={26} /> : "Stake!!"}

                </Button>
            </div> */}
            <div className="">
                <Input className="form-input" onChange={handleInputChange} />
                <button className="btn-unstake"
                    onClick={handleUnStakeSubmit}
                    disabled={isUnStakingAll || isUnStaking}
                >
                    {isUnStaking ? <CircularProgress size={26} /> : "Unstake Tokens!"}

                </button>
                <div>
                    <button className="btn" onClick={handleUnStakeAllSubmit}
                        disabled={isUnStaking || isUnStakingAll}
                    >
                        {(isUnStaking) ? <CircularProgress size={26} /> : "Unstake All!"}

                    </button>
                </div>


            </div>
            <div>

            </div>
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
                    Tokens Staked!
                </Alert>
            </Snackbar>
            <Snackbar open={showUnStakeTokensSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack} >
                <Alert onClose={handleCloseSnack} severity="success" >
                    Tokens UnStaked!
                </Alert>
            </Snackbar>
        </>
    )
}