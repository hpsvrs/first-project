import { useEthers, useTokenBalance, useEtherBalance } from "@usedapp/core"
import { useStakingBalance } from "../hooks/useStakingBalance"
import { usePurchasedBalance } from "../hooks/usePurchasedBalance"
import { Token } from "./Main"
import { formatUnits } from "@ethersproject/units"

import { makeStyles } from "@material-ui/core"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material"
import { ThemeProvider } from '@material-ui/core/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
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
    tokenAddress: string
}


export const Balance = ({ tokenAddress }: BalanceMsgProps) => {

    const dAppTokenAddress = tokenAddress
    const classes = useStyles()
    const { account } = useEthers()
    const busdTokenAddress = '0x4Fabb145d64652a948d72533023f6E7A623C7C53'

    const busdTokenBalance = useTokenBalance(busdTokenAddress, account)
    const formattedBusdTokenBalance: number = busdTokenBalance ? parseFloat(formatUnits(busdTokenBalance, 18)) : 0

    const unStakedTokenBalance = useTokenBalance(dAppTokenAddress, account)
    const formattedUnStakedTokenBalance: number = unStakedTokenBalance ? parseFloat(formatUnits(unStakedTokenBalance, 18)) : 0

    const { stakingBalance } = useStakingBalance(tokenAddress)
    const FstakedTokenBalance: number = stakingBalance ? parseFloat(formatUnits(stakingBalance, 18)) : 0

    const purchasedTokenBalance = usePurchasedBalance(tokenAddress)
    const FPurchasedTokenBalance: number = purchasedTokenBalance ? parseFloat(formatUnits(purchasedTokenBalance, 18)) : 0

    const ethBalance = useEtherBalance(account)
    const formattedEthBalance: number = ethBalance ? parseFloat(formatUnits(ethBalance, 18)) : 0

    console.log("you are here")
    console.log((window as any).ethereum)
    console.log("here")


    return (
        <Box >
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} marginTop={1}>
                    <Grid item xs={12}
                        sx={{ display: { xs: 'block', sm: 'block' }, }}
                        md={6}>
                        <Item sx={{ backgroundColor: '#B9B8B8' }}>
                            <Typography className={classes.bold} variant="h6">
                                Number of Stakers
                            </Typography>
                        </Item>
                        <Item >
                            <div className={classes.bold}>
                                123
                            </div>
                        </Item>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Item sx={{ backgroundColor: '#B9B8B8' }}>
                            <Typography variant="h6">
                                Total $Moon Staked
                            </Typography>
                        </Item>
                        <Item>
                            <div className={classes.bold}>
                                Fill this
                            </div>
                        </Item>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Item sx={{ backgroundColor: '#B9B8B8' }}>
                            <Typography variant="h6">
                                APY

                            </Typography>
                        </Item>
                        <Item>
                            {/* 15% */}
                            <div className={classes.bold}>
                                15%
                            </div>
                        </Item>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Item sx={{ backgroundColor: '#B9B8B8' }}>
                            <Typography variant="h6">
                                Unstaked Balance
                            </Typography>
                        </Item>
                        <Item>
                            <div className={classes.bold}>
                                {formattedUnStakedTokenBalance}
                            </div>
                        </Item>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Item sx={{ backgroundColor: '#B9B8B8' }}>
                            <Typography variant="h6">
                                Staked
                            </Typography>
                        </Item>
                        <Item>
                            <div className={classes.bold}>
                                {FstakedTokenBalance}
                            </div>
                        </Item>
                    </Grid>

                    <Grid item xs={6} md={6}>
                        <Item sx={{ backgroundColor: '#B9B8B8' }}>
                            <Typography variant="h6">
                                Rewards
                            </Typography>
                        </Item>
                        <Item>
                            <div className={classes.bold}>
                                Fill this
                            </div>
                        </Item>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Item sx={{ backgroundColor: '#B9B8B8' }}>
                            <Typography variant="h6">
                                WETH
                            </Typography>
                        </Item>
                        <Item>
                            <div className={classes.bold}>
                                {formattedEthBalance}
                            </div>
                        </Item>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Item sx={{ backgroundColor: '#B9B8B8' }}>
                            <Typography variant="h6">
                                BUSD
                            </Typography>
                        </Item>
                        <Item>
                            <div className={classes.bold}>
                                {formattedBusdTokenBalance}
                            </div>
                        </Item>
                    </Grid>

                </Grid>
                <Grid container spacing={2} marginTop={1}>
                    <Grid item xs={12} md={12}>
                        <Item sx={{ backgroundColor: '#B9B8B8' }}>
                            <Typography variant="h6">
                                Pre-Sale Purchased
                            </Typography>
                        </Item>
                        <Item>
                            <div className={classes.bold}>
                                {FPurchasedTokenBalance}
                            </div>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </Box>

    )
}