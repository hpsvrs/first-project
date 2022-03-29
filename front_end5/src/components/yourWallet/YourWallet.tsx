import { Token } from "../Main"
import Box from '@mui/material/Box';
import React, { useState } from "react"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { tokenToString } from "typescript";
import { Tab } from "@material-ui/core"
import { WalletBalance } from "./WalletBalance";
import { StakeForm } from "./StakeForm"
import { makeStyles } from "@material-ui/core"
import { useEthers, useEtherBalance } from "@usedapp/core";

import { GridTotalStaking } from "./GridTotalStaking";
import { useContext } from "react";
// import { MyContext } from "../../App";
import { GridStakingUnstaking } from "./GridStakingUnstaking";
import { MyContext } from "../Header2";
import { CheckpointsStake } from "../CheckpointsStake";
import { formatUnits } from "@ethersproject/units"


const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(0)
    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px",
        opacity: "0.95",
        marginTop: "1em",
    },
    header: {
        color: "white"
    }
}))

interface YourWalletProps {
    supportedTokens: Array<Token>
}



export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
    const { dappTokenAddress, formattedDappTokenBalance } = useContext(MyContext)

    const { account } = useEthers()
    const isConnected = account !== undefined

    const ethBalance = useEtherBalance(account)
    const formattedEthBalance: number = ethBalance ? parseFloat(formatUnits(ethBalance, 18)) : 0


    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    console.log("supported tokens")
    console.log(supportedTokens[1].address)

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }
    const classes = useStyles()
    return (
        <>
            <div>
                <h1 className="section-heading"> Stake! Tokens</h1>
                <GridTotalStaking tokenAddress={dappTokenAddress} />
                <GridStakingUnstaking tokenAddress={dappTokenAddress} />
            </div>
            <Box className="" sx={{ mt: 4 }}>
                <CheckpointsStake />

                {(isConnected && (formattedEthBalance > 0) && (formattedDappTokenBalance > 0)) ? (
                    <Box className={classes.box}>
                        <TabContext value={selectedTokenIndex.toString()}>
                            <TabList onChange={handleChange} aria-label="stake form tabs">
                                {supportedTokens.map((token, index) => {
                                    return (
                                        <Tab label={token.name}
                                            value={index.toString()}
                                            key={index} />
                                    )
                                })}
                            </TabList>
                            {supportedTokens.map((token, index) => {
                                return (
                                    <TabPanel value={index.toString()} key={index.toString()}>
                                        <div className={classes.tabContent}>
                                            <WalletBalance token={supportedTokens[selectedTokenIndex]} />
                                            <StakeForm token={supportedTokens[selectedTokenIndex]} />
                                        </div>

                                    </TabPanel>
                                )
                            })}
                        </TabContext>
                    </Box>
                ) : (<h1 className="section-heading">The above checkpoints must be met to Stake!</h1>)}

            </Box>
        </>

    )
}