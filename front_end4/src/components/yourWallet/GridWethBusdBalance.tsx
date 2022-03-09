import { useEthers, useTokenBalance, useEtherBalance } from "@usedapp/core"
// import { useStakingBalance } from "../../hooks/useStakingBalance"
// import { Token } from "../Main"
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


export const GridWethBusdBalance = ({ tokenAddress }: BalanceMsgProps) => {

    const dAppTokenAddress = tokenAddress
    const classes = useStyles()
    const { account } = useEthers()
    const busdTokenAddress = '0x4Fabb145d64652a948d72533023f6E7A623C7C53'

    const busdTokenBalance = useTokenBalance(busdTokenAddress, account)
    const formattedBusdTokenBalance: number = busdTokenBalance ? parseFloat(formatUnits(busdTokenBalance, 18)) : 0

    const ethBalance = useEtherBalance(account)
    const formattedEthBalance: number = ethBalance ? parseFloat(formatUnits(ethBalance, 18)) : 0

    console.log("you are here")
    console.log((window as any).ethereum)
    console.log("here")


    return (
        <Box >
            <Box sx={{ flexGrow: 1, mb: 6 }}>
                <Grid container spacing={2} marginTop={1} >
                    <Grid item xs={6} md={6}>
                        <Item sx={{ backgroundColor: '#6b6e70' }}>
                            <h2>WETH</h2>
                        </Item>
                        <Item>
                            <h3> {formattedEthBalance}</h3>
                        </Item>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Item sx={{ backgroundColor: '#6b6e70' }}>
                            <h2>BUSD</h2>
                        </Item>
                        <Item>
                            <h3> {formattedBusdTokenBalance}</h3>
                        </Item>
                    </Grid>

                </Grid>

            </Box>
        </Box >

    )
}