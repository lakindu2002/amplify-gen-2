import { Note } from "@/types/note";
import { Paper, List, ListItem, ListItemButton, ListItemText, Divider } from "@mui/material";
import React from "react";

export const NotesList: React.FC<{
  notes: Note[];
  selectedNoteId: string | null;
  onSelect: (id: string) => void;
}> = ({ notes, selectedNoteId, onSelect }) => (
  <Paper sx={{ width: 300, height: "80vh", overflowY: "auto" }}>
    {notes.length === 0 ? (
      <List sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ListItem>
          <ListItemText primary="It looks empty out here..." />
        </ListItem>
      </List>
    ) : (
      <List>
        {notes.map((note) => (
          <React.Fragment key={note.id}>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedNoteId === note.id}
                onClick={() => onSelect(note.id)}
              >
                <ListItemText primary={note.title} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    )}
  </Paper>
);