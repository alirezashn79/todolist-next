import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import TodoCard from "../TodoCard";

export default function Accordion({ todoList, setReload }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="transition-all">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${
          isOpen ? "bg-slate-700 rounded-t-lg" : "bg-slate-500 rounded-lg"
        } h-16  flex items-center justify-between px-5 cursor-pointer font-semibold text-lg`}
      >
        <div className="flex items-center gap-x-4 ">
          <p>
            {todoList[0].user.firstname}
            {todoList[0].user.role === "ADMIN" && (
              <span className="ml-2 bg-green-300 text-black p-1 font-bold text-sm rounded-full">
                Me
              </span>
            )}
          </p>
          <div className="bg-orange-400 p-1 min-w-8  text-xs text-center rounded-md">
            All Tasks {todoList.length}
          </div>

          <div className="bg-green-500 p-1 min-w-8  text-xs text-center rounded-md">
            completed Tasks {todoList.filter((todo) => todo.isComplete).length}
          </div>
        </div>
        <ChevronDown
          className={`h-6 w-6 duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      {isOpen && (
        <div className="p-2 space-y-2 bg-slate-800">
          {todoList.map((todo) => (
            <TodoCard todo={todo} setReload={setReload} />
          ))}
        </div>
      )}
    </div>
  );
}
