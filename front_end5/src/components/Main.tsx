/* eslint-disable spaced-comment */
/// <reference types="react-scripts" />
import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import brownieConfig from "../brownie-config.json"
import dapp from "../dapp.png"
import dai from "../dai.png"
import eth from "../eth.png"
import { YourWallet } from "./yourWallet"
import { UnStakeYourWallet } from "./yourWallet/UnStakeYourWallet"
import { makeStyles } from "@material-ui/core"
import { textAlign } from "@mui/system"
import { PreSale } from "./PreSale"
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import { Container } from "@mui/material"
import { Balance } from "./Balance"
import { Projects } from "./Projects"
import { Project } from "./Project"
import { GridPurchasedPreSaleBalance } from "./yourWallet/GridPurchasedPreSaleBalance"
import { GridWethBusdBalance } from "./yourWallet/GridWethBusdBalance"
import { GridTotalStaking } from "./yourWallet/GridTotalStaking"
import { GridStakingUnstaking } from "./yourWallet/GridStakingUnstaking"
import { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
// import { MyContext } from "../App";
import { MyContext } from "./Header2";

export type Token = {
    image: string
    address: string
    name: string
}

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.common.white,
        textAlign: "center",
        padding: theme.spacing(4)
    }
}))

interface elementNumber {
    elementNumber: number
}

const pathList = ["/", "/staking", "/unstaking-rewards", "/pre-sale"]

export const Main = ({ elementNumber }: elementNumber) => {

    const { dappTokenAddress: dapp_token_address } = useContext(MyContext)
    const classes = useStyles()
    const eNumber = elementNumber
    console.log('You are in main eNumber: ' + eNumber)

    const { chainId } = useEthers()

    const [chainNumber, setChainNumber] = useState<number | undefined>(42)

    useEffect(() => {
        setChainNumber(chainId)
    }, [chainId])

    console.log('this is chainNUmber: ' + chainNumber)
    const networkName = (chainId ? ((String(chainId) == '42') ? helperConfig[chainId] : "dev") : "dev")

    const dappTokenAddress = dapp_token_address

    // const dappTokenAddress = '0x759b7741065cAa8dd699e45892F452228faBe58B'
    const wethTokenAddress = (chainId ? ((String(chainId) == '42') ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero) : constants.AddressZero)
    //    const wethTokenAddress = '0xd0a1e359811322d97991e03f863a0c30c2cf029c'
    const fauTokenAddress = (chainId ? ((String(chainId) == '42') ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero) : constants.AddressZero)
    // const fauTokenAddress = '0xFab46E002BbF0b4509813474841E0716E6730136'
    const supportedTokens: Array<Token> = [
        {
            image: dapp,
            address: dappTokenAddress,
            name: "DAPP"
        }, {
            image: eth,
            address: wethTokenAddress,
            name: "WETH"
        }, {
            image: dai,
            address: fauTokenAddress,
            name: "DAI"
        }

    ]

    const supportedPreSaleTokens: Array<Token> = [
        {
            image: dapp,
            address: dappTokenAddress,
            name: "DAPP"
        },
        // {
        //     image: eth,
        //     address: wethTokenAddress,
        //     name: "WETH"
        // }, 
        {
            image: dai,
            address: fauTokenAddress,
            name: "DAI"
        }
    ]

    console.log("You are in main: " + window.location.href)

    return (<>

        <Container maxWidth="md" sx={{ mt: 0 }}>
            <GridWethBusdBalance tokenAddress={dappTokenAddress} />
            <Routes>
                <Route path="/" element={<Projects />} />
                <Route path="projects" element={<Projects />}>
                </Route>
                <Route path='projects/:id' element={<Project supportedTokens={supportedPreSaleTokens} />}></Route>

                <Route path="/stake" element={<YourWallet supportedTokens={supportedTokens} />} />
                <Route path="/unstake-rewards" element={<UnStakeYourWallet supportedTokens={supportedTokens} />} />
                <Route path="/presale" element={<PreSale supportedTokens={supportedPreSaleTokens} />} />
                {/* <Route path="*" element={<Projects />} /> */}
            </Routes>
            {/* <Outlet /> */}
        </Container>
    </>
    )
}