import { useEthers, useTokenBalance, useEtherBalance } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"

import { Token } from "./Main"
import Box from '@mui/material/Box';
import { Grid } from "@material-ui/core";
import React, { useState, createContext, useContext, useEffect } from "react"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { tokenToString } from "typescript";
import { Tab, Typography } from "@material-ui/core"
import { WalletBalance } from "./yourWallet/WalletBalance";
import { UnStakeForm } from "./yourWallet/UnStakeForm"
import { PreSaleForm } from "./yourWallet/PreSaleForm";
import { makeStyles } from "@material-ui/core"
// import { GridPurchasedPreSaleBalance } from "./yourWallet/GridPurchasedPreSaleBalance"
import { CompleteGridPurchasedPreSaleBalance } from "./yourWallet/CompleteGridPurchasedPreSaleBalance"

import { CheckpointsPreSale } from "./CheckpointsPreSale"
import { findByLabelText } from "@testing-library/react";
// import { MyContext } from "../App";
import { MyContext } from "./Header2";



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
        opacity: "0.9",
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

interface YourWalletProps {
    supportedTokens: Array<Token>
}


export const PreSale = ({ supportedTokens }: YourWalletProps) => {
    const data = useContext(MyContext)
    const { chainIdentity, tokenFarmContractAddress, dappTokenAddress: dapp_token_address } = data

    console.log("You are in PreSale Context: chainIdentity " + chainIdentity + " tokenFarmL " + tokenFarmContractAddress)
    const { account } = useEthers()

    const connectedToMetaMask = account !== undefined

    const busdTokenAddress = '0x4Fabb145d64652a948d72533023f6E7A623C7C53'

    const busdTokenBalance = useTokenBalance(busdTokenAddress, account)
    const formattedBusdTokenBalance: number = busdTokenBalance ? parseFloat(formatUnits(busdTokenBalance, 18)) : 0

    let ethBalance = useEtherBalance(account)
    const formattedEthBalance: number = ethBalance ? parseFloat(formatUnits(ethBalance, 18)) : 0

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const dappTokenAddress = supportedTokens[0].address
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }
    const classes = useStyles()
    return (
        <>
            <div>
                <h1 className="section-heading">Pre-Sale! is Now Open</h1>
            </div>
            <Box>
                <CompleteGridPurchasedPreSaleBalance tokenAddress={dappTokenAddress} />

                <CheckpointsPreSale />

                {/* <h2 className={classes.header}><span className={classes.spanparticipation}>Participation...</span></h2> */}
                <h1 className="section-heading"> Participate...</h1>
                {(connectedToMetaMask && (formattedEthBalance > 0)
                    && (formattedBusdTokenBalance == 0)) ? (
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
                                            <PreSaleForm token={supportedTokens[selectedTokenIndex]} />
                                        </div>
                                    </TabPanel>
                                )
                            })}

                        </TabContext>
                    </Box>
                ) : (
                    <Box className="participationDirection" alignItems="center"
                        justifyContent="center"
                        display="flex" >
                        <div>
                            <h3>Once met the checkpoints pre-sale will display here...</h3>
                        </div>

                    </Box>)
                }

            </Box>
        </>

    )
}