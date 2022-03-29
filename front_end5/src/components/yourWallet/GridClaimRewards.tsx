import { useEthers, useNotifications } from "@usedapp/core"
import { useStakingBalance } from "../../hooks/useStakingBalance"
import { useStakingRewards } from "../../hooks/useStakingRewards"
import { useClaimStakingRewards } from "../../hooks/useClaimStakingRewards"

// import { Token } from "../Main"
import { formatUnits } from "@ethersproject/units"

import { Button, makeStyles, CircularProgress, Snackbar } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material"
import { ThemeProvider } from '@material-ui/core/styles';
import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    h2: {
        margin: 10,
        overflowWrap: "break-word",
    },
    h3: {
        margin: 5,
        fontSize: 20,
        overflow: "hidden",
    },
    span: {
        fontSize: 20
    }
}));


interface BalanceMsgProps {
    tokenAddress: string
    // eNumber: number
}


export const GridClaimRewards = ({ tokenAddress }: BalanceMsgProps) => {

    const dAppTokenAddress = tokenAddress
    const { account } = useEthers()
    const { notifications } = useNotifications()

    const { send: claimStakingRewards, state: stateClaimStakingRewards } = useClaimStakingRewards()
    const handleClaimStakingRewards = () => { return claimStakingRewards(tokenAddress) }

    const isClaiming = stateClaimStakingRewards.status === "Mining"
    const [showClaimingSuccess, setClaimingSuccess] = useState(false)

    useEffect(() => {
        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Claiming Staking Rewards"
        ).length > 0) {
            console.log("Tokens Claimed!")
            setClaimingSuccess(true)
        }
    }, [notifications, stateClaimStakingRewards])

    const handleCloseSnack = () => {
        setClaimingSuccess(false)
    }

    return (
        <>
            <Box >
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} marginTop={1}>
                        <Grid item xs={12} md={12}>
                            <Item sx={{ backgroundColor: '#B9B8B8' }}>
                                <Typography variant="h6">
                                    <button className='btn-unstake btn-shadow' onClick={handleClaimStakingRewards}>
                                        {(isClaiming) ? <CircularProgress size={26} /> : "Claim Rewards!"}
                                    </button>
                                </Typography>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Snackbar open={showClaimingSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack} >
                <Alert onClose={handleCloseSnack} severity="success" >
                    Rewards Claimed!
                </Alert>
            </Snackbar>
        </>
    )
}