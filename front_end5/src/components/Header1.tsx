import { useEthers } from "@usedapp/core"
import { Button, makeStyles } from "@material-ui/core"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { useState } from "react"
import { Tab } from "@material-ui/core"
import { Chip } from "@material-ui/core";




const useStyles = makeStyles((theme) => ({
    container: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        paddingTop: theme.spacing(1),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1)
    },
    top: {

    }
}))

export const Header1 = () => {
    const classes = useStyles()

    const { account, activateBrowserWallet, deactivate } = useEthers()

    const isConnected = account !== undefined

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    return (
        <div >
            {/* <div><h3>Account: {account}</h3> </div> */}
            <div className={classes.container}>
                {isConnected ? (
                    <Button
                        onClick={deactivate}>
                        {account}
                    </Button>
                ) : (
                    <Button color="secondary"
                        onClick={() => activateBrowserWallet()}>
                        Accont Not Connected
                    </Button>

                )}
            </div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />

                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            MoonPad
                        </Typography>
                        {/* <Button color="inherit">Login</Button> */}
                        <TabContext value="0" >
                            <TabList onChange={handleChange} aria-label="stake form tabs">
                                {/* {supportedTokens.map((token, index) => {

                                    return (
                                        <Tab label={token.name}
                                            value={index.toString()}
                                            key={index}>

                                        </Tab>
                                    )
                                })} */}
                                <Tab label="this" value="0" key="0"></Tab>
                                <Tab label="this" value="1" key="1"></Tab>
                                <Tab label="this" value="2" key="2"></Tab>

                            </TabList>

                        </TabContext>

                        <div className={classes.container} >
                            {isConnected ? (
                                <Button color="primary" variant="contained"
                                    onClick={deactivate}>
                                    Disconnect1
                                </Button>
                            ) : (
                                <>
                                    <Button color="primary" variant="contained"
                                        onClick={() => activateBrowserWallet()}>
                                        Connect Wallet
                                    </Button>
                                    <div></div>
                                </>
                            )}
                        </div>
                        <Box>
                            {isConnected ? (
                                <Chip label="Disconnect!"
                                    component="a"
                                    // href="/5"
                                    onClick={deactivate}
                                    clickable
                                    color='primary' />
                            ) : (
                                <Chip label="Connect Wallet!"
                                    component="a"
                                    // href="/5"
                                    onClick={() => activateBrowserWallet()}
                                    color='primary'
                                    clickable />
                            )}
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box sx={{
                    flexGrow: 1,
                    justifyContent: "flex-end",
                    display: { xs: 'none', mb: 'flex' },
                }}>
                    <Typography variant="subtitle1" gutterBottom component="div">
                        <Chip label={account}
                            component="a"
                            // href="/5"
                            onClick={() => activateBrowserWallet()}
                            color='primary'
                            clickable />
                    </Typography>
                </Box>
            </Box>

        </div>
    )
}