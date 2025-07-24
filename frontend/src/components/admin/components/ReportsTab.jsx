import React from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Assessment, History, GetApp } from "@mui/icons-material";

const ReportsTab = ({ stats, generateReport }) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Seat Usage Reports
        </Typography>
      </Grid>

      {/* Report Summary Cards */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Assessment color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {((stats.occupiedSeats / stats.totalSeats) * 100).toFixed(1)}%
                </Typography>
                <Typography color="text.secondary">Utilization Rate</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                <History color="primary" sx={{ fontSize: 40 }} />
                <Box sx={{ width: 20, height: 20 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalReservations}
                </Typography>
                <Typography color="text.secondary">
                  Total Reservations
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card elevation={2}>
          <CardHeader
            title="Generate PDF Report"
            avatar={<GetApp color="primary" />}
            action={
              <Button
                variant="contained"
                startIcon={<GetApp />}
                onClick={generateReport}
                sx={{ borderRadius: 2 }}
              >
                Download PDF Report
              </Button>
            }
          />
          <CardContent>
            <Typography variant="body1" paragraph>
              Generate a comprehensive seat usage report including:
            </Typography>
            <ul>
              <li>Total seat utilization statistics</li>
              <li>Reservations by floor breakdown</li>
              <li>Time slot usage patterns</li>
              <li>Recent reservations table</li>
              <li>Current system status</li>
            </ul>
            <Typography variant="body2" color="text.secondary">
              Report will be downloaded as a PDF file with timestamp and
              detailed analytics.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ReportsTab;
