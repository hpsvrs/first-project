import React from 'react'
import { Token } from "../Main"
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useAllocatedAmount } from '../../hooks/useAllocatedAmount';
import { useContext } from "react"
import { MyContext } from "../Header2";
import { formatUnits } from "@ethersproject/units"
import { usePurchasedBalanceEachPreSale } from "../../hooks/usePurchasedBalanceEachPreSale"

interface SupportedTokensProps {
    supportedTokens: Array<Token>
    preSaleNumber: string
}

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

export const AllocatedAmountToParticipate = ({ supportedTokens, preSaleNumber }: SupportedTokensProps) => {
    const { dappTokenAddress } = useContext(MyContext)

    const { getAllocatedPreSaleAmount } = useAllocatedAmount(dappTokenAddress, preSaleNumber)
    const fGetAllocatedPreSaleAmount: number = getAllocatedPreSaleAmount ? parseFloat(formatUnits(getAllocatedPreSaleAmount, 18)) : 0

    const { totalPurchasedPreSaleTokensEachPreSale, purchasedBalanceEachPreSale } = usePurchasedBalanceEachPreSale(dappTokenAddress, preSaleNumber)
    const fTotalPurchasedTokenBalance: number = totalPurchasedPreSaleTokensEachPreSale ? parseFloat(formatUnits(totalPurchasedPreSaleTokensEachPreSale, 18)) : 0
    const fPurchasedBalanceEachPreSale: number = purchasedBalanceEachPreSale ? parseFloat(formatUnits(purchasedBalanceEachPreSale, 18)) : 0


    return (
        <>
            <Grid container spacing={2} marginTop={1} marginBottom={2}>
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
                <Grid item xs={6} md={6}>
                    <Item sx={{ backgroundColor: '#B9B8B8' }}>
                        <h2>Allocated $BUSD Limit </h2>
                    </Item>
                    <Item>
                        <h3>
                            {fGetAllocatedPreSaleAmount}
                        </h3>
                    </Item>
                </Grid>
                <Grid item xs={6} md={6}>
                    <Item sx={{ backgroundColor: '#B9B8B8' }}>
                        <h2> Total $BUSD Spent </h2>
                    </Item>
                    <Item>
                        <h3>
                            {fPurchasedBalanceEachPreSale}
                        </h3>
                    </Item>
                </Grid>
            </Grid>
        </>
    )
}
