import './App.css'
import NotesList from './pages/NotesList';
import NoteCardPage from './pages/NoteCardPage';
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import CategoriesPage from './pages/ManageCategoriesPage';
import ManageNoteCardsPage from './pages/ManageNoteCardsPage';

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-0">

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggle={toggleSidebar} />

       <div
    onClick={toggleSidebar}
    className="fixed top-0 left-0 h-full w-2 bg-slate-900 z-50 cursor-pointer"
    title="Open Sidebar"
  />

      {/* Page Content */}
      <main className="p-6">
        <Routes>
          <Route path="/notes" element={<NotesList />} />
          <Route path="/noteCard" element={<NoteCardPage />} />
          <Route path="/ManageCategoriesPage" element={<CategoriesPage />} />
          <Route path="/ManageNoteCardsPage" element={<ManageNoteCardsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App
