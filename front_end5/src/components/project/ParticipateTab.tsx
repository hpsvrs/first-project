import React, { useState } from 'react'
import { Box, Tab, Typography } from '@material-ui/core'
import { Token } from "../Main"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { makeStyles } from "@material-ui/core"
import { WalletBalance } from '../yourWallet/WalletBalance'
import { PreSaleFormEachPreSale } from '../yourWallet/PreSaleFormEachPreSale'


interface SupportedTokensProps {
    supportedTokens: Array<Token>
    preSaleNumber: string
}

const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(2)
    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px",
        opacity: "0.95",
    },
    header: {
        color: "White",
        textAlign: "center",
        fontSize: "2em",
        textTransform: "uppercase",
        // overflowWrap: "break-word",
        lineHeight: "4rem"
    },
    span: {
        backgroundColor: "black",
        opacity: "0.5",
        borderRadius: "25px",
        padding: '.5em',
        overflowWrap: "break-word",

    },
    spanparticipation: {
        backgroundColor: "black",
        opacity: "0.5",
        borderRadius: "25px",
        padding: '.5em',
        overflow: "hidden",
    }
}))


export const ParticipateTab = ({ supportedTokens, preSaleNumber }: SupportedTokensProps) => {
    console.log("this is in ParticipateTab: " + preSaleNumber)
    const classes = useStyles()

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    return (
        <>
            <Box className={classes.box}>
                <TabContext value={selectedTokenIndex.toString()} >

                    <TabList onChange={handleChange} aria-label="stake form tabs">
                        {supportedTokens.map((token, index) => {

                            return (
                                <Tab label={token.name}
                                    value={index.toString()}
                                    key={index}>
                                </Tab>
                            )
                        })}
                    </TabList>

                    {supportedTokens.map((token, index) => {
                        return (
                            <TabPanel value={index.toString()} key={index}>
                                <div className={classes.tabContent}>
                                    <WalletBalance token={supportedTokens[selectedTokenIndex]} />
                                    {/* <UnStakeForm token={supportedTokens[selectedTokenIndex]} /> */}
                                    <PreSaleFormEachPreSale token={supportedTokens[selectedTokenIndex]} preSaleNumber={preSaleNumber} />
                                </div>
                            </TabPanel>
                        )
                    })}

                </TabContext>
            </Box>
        </>
    )
}
