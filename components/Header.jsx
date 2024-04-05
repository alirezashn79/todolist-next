import { useState } from "react";
import { User, ClipboardPlus, LogOut } from "lucide-react";
import AddForm from "./AddForm";
import Profile from "./Profile";

export default function Header({ user, getAllTodos }) {
  // states
  const [openAddTodoForm, setOpenAddTodoForm] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-700 h-16">
      <div className="relative container h-full">
        <div className="w-full h-full flex items-center justify-between">
          {/* name and avatar */}
          <Profile user={user} />
          {/* name and avatar end */}

          {/* heading text */}
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
            Todo List
          </h2>
          {/* heading text end */}

          {/* add btn */}
          <button
            onClick={() => setOpenAddTodoForm((prev) => !prev)}
            className={`flex items-center gap-2 border px-3 py-1.5 rounded-lg  transition-colors ${
              openAddTodoForm
                ? "bg-slate-50 text-slate-800"
                : "bg-transparent text-slate-50"
            }`}
          >
            <span className="text-sm md:text-base">add todo</span>
            <ClipboardPlus className="icon" />
          </button>
          {/* add btn end */}
          {openAddTodoForm && <AddForm getAllTodos={getAllTodos} />}
        </div>
      </div>
    </header>
  );
}
