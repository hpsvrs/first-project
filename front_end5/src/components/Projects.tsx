import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { GridTotalStaking } from "./yourWallet/GridTotalStaking";
import { useContext } from "react";
// import { MyContext } from "../App";
import { MyContext } from "./Header2";

import { GridStakingUnstaking } from "./yourWallet/GridStakingUnstaking";
import { Outlet } from "react-router-dom";


const Item = styled('div')(({ theme }) => ({
    // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,

    textAlign: "center",
    // color: theme.palette.text.secondary
}));

export const Projects = () => {
    const { dappTokenAddress } = useContext(MyContext)

    return (
        <>
            <Outlet />
            <div>
                <h1 className="section-heading"> Projects!</h1>
                <GridTotalStaking tokenAddress={dappTokenAddress} />
                {/* <GridStakingUnstaking tokenAddress={dappTokenAddress} /> */}
            </div>

            <Box className="projects" sx={{ mt: 5, mb: 5 }}>
                <Grid
                    container
                    direction="column"
                    // justifyContent="center"
                    alignItems="center"
                    spacing={3}
                >
                    <Grid item xs>
                        <h1>PROJECTS OPEN NOW</h1>
                    </Grid>
                    <Grid item md >
                        <h3>No Project Currently Open.</h3>
                    </Grid>
                    <Grid item xs={6}>
                        {/* <Item>xs=6</Item> */}
                        <h1>PROJECTS COMING SOON</h1>
                    </Grid>
                    <Grid item md >
                        <h3>Get ready for the exciting projects...</h3>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}