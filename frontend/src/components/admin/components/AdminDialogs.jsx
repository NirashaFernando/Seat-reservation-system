import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const AdminDialogs = ({
  seatDialog,
  setSeatDialog,
  seatForm,
  setSeatForm,
  handleSeatFormSubmit,
  deleteDialog,
  setDeleteDialog,
  handleSeatDelete,
  assignDialog,
  setAssignDialog,
  assignForm,
  setAssignForm,
  handleAssignmentSubmit,
  areas,
  timeSlots,
}) => {
  return (
    <>
      {/* Add/Edit Seat Dialog */}
      <Dialog
        open={seatDialog.open}
        onClose={() => setSeatDialog({ open: false, mode: "add", seat: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {seatDialog.mode === "add" ? "Add New Seat" : "Edit Seat"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Seat Number"
              value={seatForm.seatNumber}
              onChange={(e) =>
                setSeatForm({ ...seatForm, seatNumber: e.target.value })
              }
              fullWidth
              required
              helperText="e.g., A1, B2, C3"
            />
            <TextField
              label="Row"
              value={seatForm.row}
              onChange={(e) =>
                setSeatForm({ ...seatForm, row: e.target.value })
              }
              fullWidth
              required
              helperText="e.g., A, B, C"
            />
            <FormControl fullWidth required>
              <InputLabel>Floor</InputLabel>
              <Select
                value={seatForm.area}
                onChange={(e) =>
                  setSeatForm({ ...seatForm, area: e.target.value })
                }
                label="Floor"
              >
                {areas.map((area) => (
                  <MenuItem key={area} value={area}>
                    {area}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Location"
              value={seatForm.location}
              onChange={(e) =>
                setSeatForm({ ...seatForm, location: e.target.value })
              }
              fullWidth
              helperText="Default: Main Hall"
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={seatForm.status}
                onChange={(e) =>
                  setSeatForm({ ...seatForm, status: e.target.value })
                }
                label="Status"
              >
                <MenuItem value="Available">Available</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setSeatDialog({ open: false, mode: "add", seat: null })
            }
          >
            Cancel
          </Button>
          <Button onClick={handleSeatFormSubmit} variant="contained">
            {seatDialog.mode === "add" ? "Add Seat" : "Update Seat"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Seat Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, seat: null })}
      >
        <DialogTitle>Delete Seat</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete seat {deleteDialog.seat?.seatNumber}
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, seat: null })}>
            Cancel
          </Button>
          <Button onClick={handleSeatDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manual Assignment Dialog */}
      <Dialog
        open={assignDialog.open}
        onClose={() => setAssignDialog({ open: false, seat: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Assign Seat {assignDialog.seat?.seatNumber}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Intern Email"
              type="email"
              value={assignForm.internEmail}
              onChange={(e) =>
                setAssignForm({ ...assignForm, internEmail: e.target.value })
              }
              fullWidth
              required
              helperText="Enter the email of the intern to assign this seat to"
            />
            <TextField
              type="date"
              label="Date"
              value={
                assignForm.date
                  ? assignForm.date.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setAssignForm({
                  ...assignForm,
                  date: e.target.value ? new Date(e.target.value) : new Date(),
                })
              }
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth required>
              <InputLabel>Time Slot</InputLabel>
              <Select
                value={assignForm.timeSlot}
                onChange={(e) =>
                  setAssignForm({ ...assignForm, timeSlot: e.target.value })
                }
                label="Time Slot"
              >
                {timeSlots.map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog({ open: false, seat: null })}>
            Cancel
          </Button>
          <Button onClick={handleAssignmentSubmit} variant="contained">
            Assign Seat
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminDialogs;
