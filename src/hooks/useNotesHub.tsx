import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import type { Note } from "../types/Note";

export function useNotesHub(
  onNoteCreated: (note: Note) => void,
  onNoteUpdated: (note: Note) => void,
  onNoteDeleted: (note: string) => void) {
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7078/notesHub", { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    connection.on("NoteAdded", onNoteCreated);
    connection.on("NoteUpdated", onNoteUpdated);
    connection.on("NoteDeleted", onNoteDeleted);

    connection.start().catch(err => console.error(err));

    return () => {
      connection.stop();
    };
  }, [onNoteCreated]);
}