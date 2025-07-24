import React from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  styled,
} from "@mui/material";
import { EventSeat, Add, Edit, Delete } from "@mui/icons-material";

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

const SeatManagementTab = ({
  groupedSeats,
  handleAddSeat,
  handleManualAssign,
  handleEditSeat,
  handleDeleteSeat,
}) => {
  return (
    <>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Seat Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddSeat}
          sx={{ borderRadius: 2 }}
        >
          Add New Seat
        </Button>
      </Box>

      <Grid container spacing={3}>
        {Object.entries(groupedSeats).map(([area, areaSeats]) => (
          <Grid size={{ xs: 12 }} key={area}>
            <Card elevation={2}>
              <CardHeader
                title={`${area} (${areaSeats.length} seats)`}
                avatar={<EventSeat color="primary" />}
                titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  {areaSeats.map((seat) => (
                    <Grid size="auto" key={seat._id}>
                      <Box sx={{ textAlign: "center" }}>
                        <SeatButton
                          status={seat.dynamicStatus}
                          onClick={() => handleManualAssign(seat)}
                          disabled={seat.dynamicStatus === "Occupied"}
                        >
                          {seat.seatNumber}
                        </SeatButton>
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            justifyContent: "center",
                            gap: 0.5,
                          }}
                        >
                          <Tooltip title="Edit Seat">
                            <IconButton
                              size="small"
                              onClick={() => handleEditSeat(seat)}
                              color="primary"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Seat">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteSeat(seat)}
                              color="error"
                              disabled={seat.dynamicStatus === "Occupied"}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default SeatManagementTab;
