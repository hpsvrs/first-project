import { useEthers, useTokenBalance, useEtherBalance } from "@usedapp/core"
import { usePurchasedBalance } from "../../hooks/usePurchasedBalance"
// import { Token } from "../Main"
import { formatUnits } from "@ethersproject/units"

import { makeStyles } from "@material-ui/core"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material"
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
    tokenAddress: string
}


export const GridPurchasedPreSaleBalance = ({ tokenAddress }: BalanceMsgProps) => {

    const dAppTokenAddress = tokenAddress
    const classes = useStyles()
    const { account } = useEthers()

    const purchasedTokenBalance = usePurchasedBalance(tokenAddress)
    const FPurchasedTokenBalance: number = purchasedTokenBalance ? parseFloat(formatUnits(purchasedTokenBalance, 18)) : 0

    return (
        <Box >
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} marginTop={1}>
                    <Grid item xs={12} md={12}>
                        <Item sx={{ backgroundColor: '#B9B8B8' }}>

                            <h2>Your Pre-sale purchased tokens</h2>
                        </Item>
                        <Item>
                            <h3>{FPurchasedTokenBalance}</h3>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </Box>

    )
}