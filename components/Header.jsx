import { useState } from "react";
import { User, ClipboardPlus, LogOut } from "lucide-react";
import AddForm from "./AddForm";
import Profile from "./Profile";
import Link from "next/link";

export default function Header({ user, getAllTodos }) {
  // states
  const [openAddTodoForm, setOpenAddTodoForm] = useState(false);

  return (
    <header className="header">
      <div className="relative container h-full">
        <div className="w-full h-full flex items-center justify-between">
          {/* name and avatar */}
          <Profile user={user} />
          {/* name and avatar end */}

          {/* heading text */}
          <div className="self-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
              Todo List
            </h2>
          </div>
          {/* heading text end */}

          <div className="flex items-center flex-wrap gap-4">
            {/* add btn */}
            <button
              onClick={() => setOpenAddTodoForm((prev) => !prev)}
              className={`flex items-center gap-2 border px-3 py-1.5 rounded-lg  transition-colors ${
                openAddTodoForm
                  ? "bg-slate-50 dark:text-slate-800"
                  : "bg-transparent dark:text-slate-50"
              }`}
            >
              <span className="text-sm md:text-base">add todo</span>
              <ClipboardPlus className="icon" />
            </button>
            {/* add btn end */}
            {openAddTodoForm && <AddForm getAllTodos={getAllTodos} />}

            {/* add todo by admin */}
            {user.role === "ADMIN" && (
              <>
                <Link className="border p-2 rounded-lg" href="/admin/add-todo">
                  Add Todo for a User
                </Link>
                <Link className="border p-2 rounded-lg" href="/admin/users">
                  users
                </Link>
              </>
            )}
            {/* add todo by admin end */}
          </div>
        </div>
      </div>
    </header>
  );
}
