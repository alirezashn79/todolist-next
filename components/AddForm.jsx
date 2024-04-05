import { client } from "@/configs/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddForm({ setReload }) {
  // states
  const [inputData, setInputData] = useState("");

  // handlers
  const onAddTodo = async (e) => {
    e.preventDefault();
    if (inputData.trim()) {
      try {
        const res = await client.post("/todo", { title: inputData });
        console.log(res);
        if (res.status === 201) {
          setInputData("");
          setReload((prev) => !prev);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="absolute min-h-10 p-1 bg-slate-700 top-full right-4 left-4 lg:right-24 lg:left-24 mt-1 rounded-lg">
      <form onSubmit={onAddTodo}>
        <div className="flex gap-x-2">
          <input
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="flex-1 p-2 bg-transparent outline-none border border-slate-50 rounded-md"
            autoFocus
            placeholder="write todo"
            type="text"
            required
          />
          <button
            type="submit"
            className="bg-slate-50 text-slate-800 border border-slate-800 rounded-md px-4 py-2"
          >
            add task
          </button>
        </div>
      </form>
    </div>
  );
}