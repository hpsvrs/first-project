import { Token } from "../Main"
import Box from '@mui/material/Box';
import React, { useState } from "react"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { tokenToString } from "typescript";
import { Button, Tab } from "@material-ui/core"
import { WalletBalance } from "./WalletBalance";
import { UnStakeForm } from "./UnStakeForm"
import { makeStyles } from "@material-ui/core"
import { CheckpointsPreSale } from "../CheckpointsPreSale";
import { useEthers } from "@usedapp/core";

import { GridTotalStaking } from "./GridTotalStaking";
import { useContext } from "react";
// import { MyContext } from "../../App";
import { MyContext } from "../Header2";

import { GridStakingUnstaking } from "./GridStakingUnstaking";
import { GridClaimRewards } from "./GridClaimRewards"

const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(4)
    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px",
        opacity: "0.95",
    },
    header: {
        color: "white"
    }
}))

interface YourWalletProps {
    supportedTokens: Array<Token>
}


export const UnStakeYourWallet = ({ supportedTokens }: YourWalletProps) => {
    const { dappTokenAddress } = useContext(MyContext)

    const { account } = useEthers()
    const isConnected = account !== undefined


    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)

    const [number, setNumber] = useState<number>(0)

    const changeNumber = () => {
        setNumber(number + 1)
    }


    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }
    const classes = useStyles()
    return (
        <>
            <div>
                <h1 className="section-heading">UnStake! Tokens</h1>
                <GridTotalStaking tokenAddress={dappTokenAddress} />
                <GridStakingUnstaking tokenAddress={dappTokenAddress} />
                <GridClaimRewards tokenAddress={dappTokenAddress} />
            </div>
            {(isConnected) ?
                (
                    <Box sx={{ mt: 4 }}>
                        {/* {(number < 25) ? (<Button onClick={(() => setNumber(number + 2))}>Less {number}</Button>) : (number >= 25 && number <= 30)
                ? (<Button onClick={changeNumber}>greater {number}</Button>) : (<Button onClick={changeNumber}>greatest {number}</Button>)}
            <Button onClick={changeNumber}>Click Here {number}</Button> */}
                        {/* <CheckpointsPreSale /> */}

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
                                                <UnStakeForm token={supportedTokens[selectedTokenIndex]} />
                                            </div>
                                        </TabPanel>
                                    )
                                })}

                            </TabContext>
                        </Box>
                    </Box>
                ) : (
                    <h1 className="section-heading"> Connect to Wallet...</h1>
                )}
        </>


    )
}