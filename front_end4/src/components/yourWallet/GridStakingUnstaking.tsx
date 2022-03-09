import { useEthers, useTokenBalance, useEtherBalance } from "@usedapp/core"
import { useStakingBalance } from "../../hooks/useStakingBalance"
import { useStakingRewards } from "../../hooks/useStakingRewards"
import { useClaimStakingRewards } from "../../hooks/useClaimStakingRewards"

// import { Token } from "../Main"
import { formatUnits } from "@ethersproject/units"

import { Button, makeStyles } from "@material-ui/core"
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
    tokenAddress: string
}


export const GridStakingUnstaking = ({ tokenAddress }: BalanceMsgProps) => {

    const dAppTokenAddress = tokenAddress
    const classes = useStyles()
    const { account } = useEthers()

    const unStakedTokenBalance = useTokenBalance(dAppTokenAddress, account)
    const formattedUnStakedTokenBalance: number = unStakedTokenBalance ? parseFloat(formatUnits(unStakedTokenBalance, 18)) : 0

    const { stakingBalance } = useStakingBalance(tokenAddress)
    const FstakedTokenBalance: number = stakingBalance ? parseFloat(formatUnits(stakingBalance, 18)) : 0

    const stakingRewards = useStakingRewards(tokenAddress)
    const FstakingRewards: number = stakingRewards ? parseFloat(formatUnits(stakingRewards, 18)) : 0

    const { send: claimStakingRewards, state: stateClaimStakingRewards } = useClaimStakingRewards()
    const handleClaimStakingRewards = () => { return claimStakingRewards(tokenAddress) }

    return (
        <Box >
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} marginTop={1}>
                    <Grid item xs={12} md={3}>
                        <Item sx={{ backgroundColor: '#B9B8B8' }}>
                            <h2>Unstaked Balance</h2>
                        </Item>
                        <Item>
                            <h3> {formattedUnStakedTokenBalance}</h3>
                        </Item>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Item sx={{ backgroundColor: '#B9B8B8' }}>
                            <h2>Staked</h2>
                        </Item>
                        <Item>
                            <h3>{FstakedTokenBalance}</h3>
                        </Item>
                    </Grid>

                    <Grid item xs={6} md={6}>
                        <Item sx={{ backgroundColor: '#B9B8B8' }}>

                            <Button onClick={handleClaimStakingRewards}>
                                Rewards
                            </Button>

                        </Item>
                        <Item>
                            <h3>{FstakingRewards}</h3>
                        </Item>
                    </Grid>


                </Grid>

            </Box>
        </Box>

    )
}