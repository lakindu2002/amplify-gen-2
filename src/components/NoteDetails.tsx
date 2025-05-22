import { Note } from "@/types/note";
import { Paper, Typography, Stack, TextField, Button } from "@mui/material";
import React from "react";

export const NoteDetails: React.FC<{
  note: Note | undefined;
  onSave: (note: Note) => void;
  onCancel: () => void;
}> = ({ note, onSave, onCancel }) => {
  const [editNote, setEditNote] = React.useState<Note | undefined>(note);

  React.useEffect(() => {
    setEditNote(note);
  }, [note]);

  if (!editNote) {
    return (
      <Paper
        sx={{
          flex: 1,
          mx: 2,
          p: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Select a note to view/edit</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ flex: 1, mx: 2, p: 4 }}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          value={editNote.title}
          onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
          fullWidth
        />
        <TextField
          label="Description"
          value={editNote.description}
          onChange={(e) =>
            setEditNote({ ...editNote, description: e.target.value })
          }
          fullWidth
          multiline
          minRows={4}
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => editNote && onSave(editNote)}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
