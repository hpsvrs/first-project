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
        // paddingLeft: theme.spacing(4),
        // paddingRight: theme.spacing(4),
        // paddingTop: theme.spacing(1),
        // display: "flex",
        // justifyContent: "flex-end",
        // gap: theme.spacing(1)
    },
    top: {

    }
}))

export const ResponsiveAppBar1 = () => {
    const classes = useStyles()



    return (
        <div >
            {/* <div><h3>Account: {account}</h3> </div> */}

        </div>
    )
}