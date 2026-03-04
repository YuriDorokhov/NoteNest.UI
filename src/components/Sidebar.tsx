import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar = ({ isOpen, toggle }: SidebarProps) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggle}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b border-slate-700 font-semibold text-lg">
          Menu
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <NavLink
            to="/notes"
            onClick={toggle}
            className={({ isActive }) =>
              `p-2 rounded transition ${
                isActive ? "bg-slate-700" : "hover:bg-slate-800"
              }`
            }
          >
            Notes List
          </NavLink>

          <NavLink
            to="/noteCard"
            onClick={toggle}
            className={({ isActive }) =>
              `p-2 rounded transition ${
                isActive ? "bg-slate-700" : "hover:bg-slate-800"
              }`
            }
          >
            Create Note Card
          </NavLink>

          <NavLink
            to="/ManageCategoriesPage"
            onClick={toggle}
            className={({ isActive }) =>
              `p-2 rounded transition ${
                isActive ? "bg-slate-700" : "hover:bg-slate-800"
              }`
            }
          >
            Manage categories
          </NavLink>

          <NavLink
            to="/ManageNoteCardsPage"
            onClick={toggle}
            className={({ isActive }) =>
              `p-2 rounded transition ${
                isActive ? "bg-slate-700" : "hover:bg-slate-800"
              }`
            }
          >
            Manage note cards
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;