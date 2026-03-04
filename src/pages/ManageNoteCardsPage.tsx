import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion, AnimatePresence } from "framer-motion";

import { getCategories } from "../services/CategoryService";
import {
  getCategoryNoteCards,
  deleteNoteCard,
} from "../services/NoteCardService";

interface Category {
  id: string;
  name: string;
}

interface NoteCard {
  id: string;
  text: string;
  translatedText: string;
  categoryId: string;
}

type DisplayMode = "both" | "text" | "translated";

const ManageNoteCardsPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [noteCards, setNoteCards] = useState<NoteCard[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [displayMode, setDisplayMode] = useState<DisplayMode>("both");
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) return;

    const fetchNoteCards = async () => {
      setLoading(true);
      const data = await getCategoryNoteCards(selectedCategoryId);
      setNoteCards(data);
      setLoading(false);
      setRevealedCards(new Set()); // reset reveals on category change
    };

    fetchNoteCards();
  }, [selectedCategoryId]);

  const handleDelete = async (id: string) => {
    await deleteNoteCard(id);
    setNoteCards((prev) => prev.filter((card) => card.id !== id));
  };

  const toggleReveal = (id: string) => {
    setRevealedCards((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const shouldShowText = (cardId: string) =>
    displayMode === "both" ||
    displayMode === "text" ||
    (displayMode === "translated" && revealedCards.has(cardId));

  const shouldShowTranslated = (cardId: string) =>
    displayMode === "both" ||
    displayMode === "translated" ||
    (displayMode === "text" && revealedCards.has(cardId));

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
      {/* Category selector */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategoryId}
          label="Category"
          onChange={(e) => setSelectedCategoryId(e.target.value as string)}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Display mode selector */}
      <ToggleButtonGroup
        value={displayMode}
        exclusive
        onChange={(_, value) => value && setDisplayMode(value)}
        sx={{ mb: 4 }}
      >
        <ToggleButton value="both">Text + Translation</ToggleButton>
        <ToggleButton value="text">Text Only</ToggleButton>
        <ToggleButton value="translated">Translation Only</ToggleButton>
      </ToggleButtonGroup>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={3}>
          <AnimatePresence mode="popLayout">
            {noteCards.map((card) => {
              const isRevealed = revealedCards.has(card.id);

              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent>
                      {shouldShowText(card.id) && (
                        <Box mb={2}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Text
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {card.text}
                          </Typography>
                        </Box>
                      )}

                      {shouldShowTranslated(card.id) && (
                        <Box mb={2}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Translated Text
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {card.translatedText}
                          </Typography>
                        </Box>
                      )}

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        {(displayMode === "text" ||
                          displayMode === "translated") && (
                          <Button
                            size="small"
                            onClick={() => toggleReveal(card.id)}
                          >
                            {isRevealed ? "Hide" : "Reveal"}
                          </Button>
                        )}

                        <IconButton
                          color="error"
                          onClick={() => handleDelete(card.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Stack>
      )}
    </Box>
  );
};

export default ManageNoteCardsPage;