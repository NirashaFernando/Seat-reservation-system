import React from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Box,
  styled,
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";

// Styled Components
const SeatButton = styled(Button)(({ theme, status }) => {
  const getColors = () => {
    switch (status) {
      case "Available":
        return {
          background: theme.palette.success.light,
          border: theme.palette.success.main,
          color: theme.palette.success.dark,
        };
      case "Occupied":
        return {
          background: theme.palette.error.light,
          border: theme.palette.error.main,
          color: theme.palette.error.dark,
        };
      default:
        return {
          background: theme.palette.grey[200],
          border: theme.palette.grey[400],
          color: theme.palette.grey[700],
        };
    }
  };

  const colors = getColors();
  return {
    minWidth: 60,
    width: 60,
    height: 60,
    fontSize: "0.8rem",
    fontWeight: "bold",
    borderRadius: theme.spacing(1),
    border: `2px solid ${colors.border}`,
    backgroundColor: colors.background,
    color: colors.color,
    "&:hover": {
      backgroundColor: colors.background,
      opacity: 0.8,
    },
  };
});

const ManualAssignmentTab = ({ groupedSeats, handleManualAssign }) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Manual Seat Assignment
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Click on any available seat to manually assign it to an intern.
        </Typography>
      </Grid>

      {Object.entries(groupedSeats).map(([area, areaSeats]) => (
        <Grid size={{ xs: 12 }} key={area}>
          <Card elevation={2}>
            <CardHeader
              title={`${area} - Available Seats`}
              avatar={<PersonAdd color="primary" />}
              titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
            />
            <CardContent>
              <Grid container spacing={2}>
                {areaSeats
                  .filter((seat) => seat.dynamicStatus === "Available")
                  .map((seat) => (
                    <Grid size="auto" key={seat._id}>
                      <Box sx={{ textAlign: "center" }}>
                        <SeatButton
                          status={seat.dynamicStatus}
                          onClick={() => handleManualAssign(seat)}
                        >
                          {seat.seatNumber}
                        </SeatButton>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ mt: 1 }}
                        >
                          Click to assign
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
              {areaSeats.filter((seat) => seat.dynamicStatus === "Available")
                .length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  No available seats in this area
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ManualAssignmentTab;
