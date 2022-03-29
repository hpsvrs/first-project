import React, { useEffect, useState, } from 'react';
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


declare global {
  interface Window {
    ethereum: any;
  }
}



// const Provider = window.ethereum;

function App() {

  const { account, activateBrowserWallet, deactivate, chainId } = useEthers()
  const isConnected = account !== undefined

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

        <BrowserRouter>
          {/* <ResponsiveAppBar1 /> */}
          {/* <Header1 /> */}

          <ResponsiveAppBar />

          {/* <h2>{account}</h2> */}
          {/* <Main /> */}
          {/* <Box >
            <Container maxWidth="md" sx={{ mt: 0 }}>
              <Balance label={`Your staked balance:`} amount={20}
                tokenImgSrc={'this'} />
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/5" element={<Header1 />} />
              </Routes>
            </Container>
          </Box> */}
        </BrowserRouter>
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

