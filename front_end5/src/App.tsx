import React, { useEffect, useState, createContext } from 'react';
import './App.scss';


import { DAppProvider, ChainId } from "@usedapp/core"
import { useEthers } from "@usedapp/core";

import { Header } from "./components/Header"
import { Container } from "@mui/material"
import { Main } from "./components/Main"
import { Header1 } from "./components/Header1"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ResponsiveAppBar from './components/Header2';
import { ResponsiveAppBar1 } from './components/Header3';
import Box from '@mui/material/Box';
import { Balance } from "./components/Balance"
import { Button, Chip } from '@material-ui/core';
import { InformationPage } from './components/InformationPage'
import networkMapping from "./chain-info/deployments/map.json"
import { constants } from "ethers"
import { Footer } from './components/Footer';




declare global {
  interface Window {
    ethereum: any;
  }
}
// export const MyContext = createContext({ chainIdentity: 0, tokenFarmContractAddress: '0x7db58Fa9330c68e1cFA28753E013c2098557Bf9c', dappTokenAddress: '0x7db58Fa9330c68e1cFA28753E013c2098557Bf9c' })



// const Provider = window.ethereum;

function App() {

  const { account, activateBrowserWallet, deactivate, chainId } = useEthers()
  const isConnected = account !== undefined
  const numberMain = 0

  const chainIdentity = chainId ? (String(chainId) == '42') ? 42 : (String(chainId) == '97') ? 97 : 0 : 0
  const tokenFarmContractAddress = (
    chainId ?
      (((String(chainId) == '42') || (String(chainId) == '97')) ?
        networkMapping[String(chainId)]["TokenFarm"][0] :
        constants.AddressZero) :
      constants.AddressZero)

  console.log("This is in Header2 tokenFarmContractAddress: " + tokenFarmContractAddress)

  const dappTokenAddress = (
    chainId ?
      (((String(chainId) == '42') || (String(chainId) == '97')) ?
        networkMapping[String(chainId)]["DappToken"][0] :
        constants.AddressZero) :
      constants.AddressZero)


  return (
    <>
      {/* <div className="hero-img"></div> */}
      <DAppProvider config={{
        // supportedChains: [ChainId.Kovan],
        // multicallVersion: 2,
        notifications: {
          expirationPeriod: 1000,
          checkInterval: 1000
        }
      }}>
        {/* <MyContext.Provider value={{ chainIdentity, tokenFarmContractAddress, dappTokenAddress }}> */}

        <BrowserRouter>
          {/* <ResponsiveAppBar1 /> */}
          {/* <Header1 /> */}
          <div className='header'>
            <ResponsiveAppBar />
          </div>

          <Footer />
          {/* <section>
            <Main elementNumber={numberMain} />
          </section> */}

        </BrowserRouter>
        {/* </MyContext.Provider> */}
      </DAppProvider>


    </>



  );
}

export default App;


//<Container maxWidth="md">
  //      {/* <h1 className="App" >
    //      DApp
      //  </h1> */}
       // <Main />
      //</Container>

