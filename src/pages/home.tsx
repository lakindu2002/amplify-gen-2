import { withAuthGuard } from "@/hocs/withAuthGuard";
import { NextPage } from "next";
import React, { useEffect } from "react";
import { Box, Button, Stack, CircularProgress } from "@mui/material";
import { Navbar } from "@/components/Navbar";
import { NotesList } from "@/components/NotesList";
import { Note } from "@/types/note";
import { NoteDetails } from "@/components/NoteDetails";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../../amplify/data/resource";

const Home: NextPage = () => {
  const client = generateClient<Schema>();
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const apiResponse = client.models.Notes.list({
      limit: 100,
      authMode: "userPool",
    });
    apiResponse
      .then((response) => {
        setNotes(
          response.data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const [selectedNoteId, setSelectedNoteId] = React.useState<string | null>(
    null
  );
  const [editingNote, setEditingNote] = React.useState<Note | undefined>(
    undefined
  );
  const [isCreating, setIsCreating] = React.useState(false);

  React.useEffect(() => {
    if (!isCreating) {
      setEditingNote(notes.find((n) => n.id === selectedNoteId));
    }
  }, [selectedNoteId, isCreating]);

  const handleNew = () => {
    setIsCreating(true);
    setEditingNote({ id: "", title: "", description: "" });
    setSelectedNoteId(null);
  };

  const handleSave = async (updatedNote: Note) => {
    // Implement save logic here (e.g., update state or call API)
    if (updatedNote.id) {
      const newNote = await client.models.Notes.update(
        {
          id: updatedNote.id,
          title: updatedNote.title,
          description: updatedNote.description,
          updatedAt: new Date().toISOString(),
        },
        {
          authMode: "userPool",
        }
      );

      setNotes((prev) =>
        prev.map((note) =>
          note.id === updatedNote.id
            ? {
                id: (newNote.data as Note).id,
                title: (newNote.data as Note).title,
                description: (newNote.data as Note).description,
              }
            : note
        )
      );
    } else {
      const newNote = await client.models.Notes.create(
        {
          title: updatedNote.title,
          description: updatedNote.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { authMode: "userPool" }
      );
      setNotes((prev) => [
        ...prev,
        {
          id: (newNote.data as Note).id,
          title: (newNote.data as Note).title,
          description: (newNote.data as Note).description,
        },
      ]);
    }
    setEditingNote(undefined);
    setSelectedNoteId(null);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingNote(undefined);
    setSelectedNoteId(null);
    setIsCreating(false);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ marginTop: 5 }}>
        <Box display="flex" flexDirection="row" height="calc(100vh - 64px)">
          <Stack>
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 2, width: 300 }}
              onClick={handleNew}
            >
              + New
            </Button>
            {loading ? (
              <Box
                width={300}
                height="80vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <CircularProgress />
              </Box>
            ) : (
              <NotesList
                notes={notes}
                selectedNoteId={selectedNoteId}
                onSelect={(id) => {
                  setSelectedNoteId(id);
                  setIsCreating(false);
                }}
              />
            )}
          </Stack>
          <NoteDetails
            note={editingNote}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </Box>
      </Box>
    </>
  );
};

export default withAuthGuard(Home);
