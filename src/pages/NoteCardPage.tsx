import React, { useState, useRef, useEffect } from "react";
import { createNoteCard } from '../services/NoteCardService';
import { translateNoteCard } from '../services/NoteCardService';
import type { NoteCard as NoteCardType } from '../types/NoteCard';
import type { TranslateNoteCardRequest } from '../types/TranslateNoteCardRequest';
import type { Category as CategoryType } from '../types/Category';
import { getCategories } from "../services/CategoryService";

const NoteCardPage: React.FC = () => {
    const [noteCard, setNoteCard] = useState<NoteCardType>({
        id: "",
        text: "",
        translatedText: "",
        categoryId: "",
    });

    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categoryCollapsed, setCategoryCollapsed] = useState(false);

    const textRef = useRef<HTMLTextAreaElement>(null);

    // Load categories
    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch {
            setError("Failed to load categories");
        }
    };

    useEffect(() => {
        loadCategories();
        textRef.current?.focus();
    }, []);

    const handleTranslate = async () => {
        if (!noteCard.text.trim()) return;

        try {
            setLoading(true);
            const req: TranslateNoteCardRequest = {
                noteCard: noteCard,
                sourceLanguage: "en",
                targetLanguage: "ru"
            };
            const translatedNoteCard = await translateNoteCard(req);
            setNoteCard((prev) => ({ ...prev, translatedText: translatedNoteCard.translatedText }));
        } catch (error) {
            console.error("Translation failed", error);
        } finally {
            setLoading(false);
            textRef.current?.focus();
        }
    };

    const handleSave = async () => {
        if (!noteCard.categoryId) {
            alert("Please select a category before saving");
            return;
        }

        try {
            setLoading(true);
            await createNoteCard(noteCard);
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setLoading(false);
            textRef.current?.focus();
        }
    };

    const handleClear = () => {
        setNoteCard({
            id: "",
            text: "",
            translatedText: "",
            categoryId: noteCard.categoryId,
        });
        textRef.current?.focus();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-0">
            <div className="min-h-screen bg-gray-100 p-0">
                {/* Text Input */}
                <div>
                    <textarea
                        ref={textRef}
                        value={noteCard.text}
                        onChange={(e) => setNoteCard((prev) => ({ ...prev, text: e.target.value }))}
                        placeholder="Type your text here..."
                        className="w-full h-[120px] p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>

                {/* Translated Text */}
                <div className="mt-3">
                    <textarea
                        value={noteCard.translatedText}
                        readOnly
                        placeholder="Translated text will appear here..."
                        className="w-full h-[180px] p-2 border bg-gray-50 resize-none"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 justify-end mt-4">
                    <button
                        onClick={handleTranslate}
                        disabled={loading}
                        className="rounded-2xl px-6 py-2.5 bg-blue-500 text-white disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Translate"}
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="rounded-2xl px-6 py-2.5 bg-green-500 text-white disabled:opacity-50"
                    >
                        Save
                    </button>

                    <button
                        onClick={handleClear}
                        className="rounded-2xl px-6 py-2.5 border border-gray-300"
                    >
                        Clear
                    </button>
                </div>

                

                {/* Collapsible Category Section */}
                <div className="mt-3 border rounded p-2">
                    <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setCategoryCollapsed(!categoryCollapsed)}
                    >
                        <span className="text-sm font-medium">Category</span>
                        <span className="text-gray-500">{categoryCollapsed ? "▼" : "▲"}</span>
                    </div>

                    {!categoryCollapsed && (
                        <div className="mt-2">
                            <select
                                value={noteCard.categoryId}
                                onChange={(e) => setNoteCard((prev) => ({ ...prev, categoryId: e.target.value }))}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NoteCardPage;