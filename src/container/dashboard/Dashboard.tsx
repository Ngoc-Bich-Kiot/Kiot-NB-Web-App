import { colors } from "@/styles/config-file";
import { Box, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";

const Dashboard = () => {
  return (
    <Box>
      <Stack spacing={4}>
        <Grid container spacing={3}>
          <Grid size={4}>
            <div style={{ backgroundColor: colors.bgCardColor }}>card 1</div>
          </Grid>
          <Grid size={4}>
            <div style={{ backgroundColor: colors.bgCardColor }}>card 2</div>
          </Grid>
          <Grid size={4}>
            <div style={{ backgroundColor: colors.bgCardColor }}>card 3</div>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid style={{ backgroundColor: colors.bgCardColor }} size={4}>
            <div>Box1</div>
          </Grid>
          <Grid style={{ backgroundColor: colors.bgCardColor }} size={8}>
            <div>Box2</div>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default Dashboard;
