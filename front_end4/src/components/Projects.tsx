import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';



const Item = styled('div')(({ theme }) => ({
    // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,

    textAlign: "center",
    // color: theme.palette.text.secondary
}));

export const Projects = () => {
    return (
        <>
            <div>

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