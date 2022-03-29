import { useEthers, useTokenBalance, useEtherBalance, useNotifications } from "@usedapp/core"
import { usePurchasedBalanceEachPreSale } from "../../hooks/usePurchasedBalanceEachPreSale"
import { useAvailableToClaimEachPreSale } from "../../hooks/useAvailableToClaimEachPreSale"
import { useClaimPreSaleTokensEachPreSale } from "../../hooks/useClaimPreSaleTokensEachPreSale"
// import { Token } from "../Main"
import { formatUnits } from "@ethersproject/units"

import { Button, makeStyles, CircularProgress, Snackbar } from "@material-ui/core"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material"
import Alert from "@material-ui/lab/Alert"
import { useState, useEffect, useContext } from "react"
import { MyContext } from "../Header2"

// import { ThemeProvider } from '@material-ui/core/styles';

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

const useStyles = makeStyles(theme => ({
    container: {
        display: "inline-grid",
        gridTemplateColumns: "auto auto auto",
        gap: theme.spacing(1),
        alignItems: "center",
    },
    tokenImg: {
        width: "32px"
    },
    amount: {
        fontWeight: 700
    },
    bold: {
        fontWeight: 900,
    }
}))


interface BalanceMsgProps {
    // tokenAddress: string
    preSaleNumber: string
}


export const GridEachPreSalePurchasedBalance = ({ preSaleNumber }: BalanceMsgProps) => {

    const { dappTokenAddress } = useContext(MyContext)
    const classes = useStyles()
    const { account } = useEthers()

    const { claimAllTokensEachPreSaleSendFunction: claimTokens, claimAllTokensEachPreSaleState: claimPreSaleTokensState } = useClaimPreSaleTokensEachPreSale()

    const { totalPurchasedPreSaleTokensEachPreSale } = usePurchasedBalanceEachPreSale(dappTokenAddress, preSaleNumber)
    const fTotalPurchasedTokenBalance: number = totalPurchasedPreSaleTokensEachPreSale ? parseFloat(formatUnits(totalPurchasedPreSaleTokensEachPreSale, 18)) : 0

    const { availableToClaim, totalClaimed } = useAvailableToClaimEachPreSale(dappTokenAddress, preSaleNumber)
    const fAvailableToClaim: number = availableToClaim ? parseFloat(formatUnits(availableToClaim, 18)) : 0
    const fTotalClaimed: number = totalClaimed ? parseFloat(formatUnits(totalClaimed, 18)) : 0

    const handleClaimTokens = () => { return claimTokens(preSaleNumber) }

    const isClaiming = claimPreSaleTokensState.status === "Mining"
    const [showClaimingSuccess, setClaimingSuccess] = useState(false)
    const { notifications } = useNotifications()

    useEffect(() => {
        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Claiming Pre Sale Tokens Each PreSale"
        ).length > 0) {
            console.log("Tokens Claimed!")
            setClaimingSuccess(true)
        }
    }, [notifications, claimPreSaleTokensState])

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
                                <h2>Total Tokens Purchased</h2>
                            </Item>
                            <Item>
                                <h3>
                                    {fTotalPurchasedTokenBalance}
                                </h3>
                            </Item>
                        </Grid>
                        <div >

                        </div>

                        <Grid item xs={12} md={12}>
                            <h1 className="section-heading"> Claim Pre-Sale Tokens...</h1>

                            {/* <Item sx={{ backgroundColor: 'black', color: 'white', opacity: '0.5' }}>
                            <h2>Withdraw Pre Sale Tokens</h2>
                        </Item> */}
                            {/* <Item> */}


                            <Grid container spacing={1} marginTop={0}>

                                <Grid item xs={12} md={6}>
                                    <Item sx={{ backgroundColor: '#B9B8B8' }}>
                                        <h2> Available to Claim</h2>
                                    </Item>
                                    <Item>
                                        <h3>{fAvailableToClaim}</h3>
                                    </Item>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Item sx={{ backgroundColor: '#B9B8B8' }}>
                                        <h2> Total Claimed</h2>
                                    </Item>
                                    <Item>
                                        <h3>{fTotalClaimed}</h3>
                                    </Item>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Item sx={{ backgroundColor: '#B9B8B8' }}>
                                        <Typography variant="h6">
                                            <button className='btn btn-shadow' onClick={handleClaimTokens}>
                                                {(isClaiming) ? <CircularProgress size={26} /> : "Claim Tokens!"}
                                            </button>
                                        </Typography>
                                    </Item>

                                </Grid>
                            </Grid>
                            {/* </Item> */}

                        </Grid>
                    </Grid>
                </Box>
            </Box >
            <Snackbar open={showClaimingSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack} >
                <Alert onClose={handleCloseSnack} severity="success" >
                    PreSale Tokens Claimed!
                </Alert>
            </Snackbar>
        </>


    )
}