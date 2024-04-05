import { client } from "@/configs/client";
import { Trash2, SquarePen } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function TodoCard({
  todo: { _id, title, isComplete, user, writer },
  getAllTodos,
}) {
  // states
  const [isChecked, setIsChecked] = useState(isComplete || false);
  const [titleText, setTitleText] = useState(title);
  const [openEdit, setOpenEdit] = useState(false);

  // handlers
  const onChange = async (e) => {
    try {
      e.preventDefault();
      const res = await client.patch(`/todos/${_id}`, {
        id: _id,
        title: titleText,
        isComplete: e.target.checked,
      });
      if (res.status === 200) {
        if (e.target.type === "checkbox") {
          setIsChecked((prev) => !prev);
          getAllTodos();
        }

        setOpenEdit(false);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const onDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      customClass: "alert",
      icon: "warning",
      iconColor: "#e11d48",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#e11d48",
      color: "#f8fafc",
      background: "#1e293b",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        client
          .delete(`/todos/${_id}`)
          .then((res) => {
            getAllTodos();
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          })
          .catch((err) => console.log(err.response.data));
      }
    });
  };

  return (
    <div
      className={`card ${isChecked ? "card-completed" : "card-incompleted"}`}
    >
      <input
        type="checkbox"
        className="shrink-0 w-5 h-5 shadow-none"
        onChange={(e) => onChange(e)}
        checked={isChecked}
      />

      {openEdit ? (
        <form onSubmit={onChange}>
          <input
            type="text"
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            className="text-slate-100 ml-4 bg-transparent border-b outline-none text-base"
            placeholder="todo name"
            autoFocus={true}
          />
          <button
            type="submit"
            className="text-slate-100 bg-sky-500 p-0.5 ml-1"
          >
            submit
          </button>
        </form>
      ) : (
        <p
          className={`text-pretty text-base mx-4 line-clamp-2 ${
            isChecked && "line-through"
          } transition-all`}
        >
          {titleText}
        </p>
      )}

      <div className="ml-auto">
        {!isChecked && (
          <button
            onClick={() => setOpenEdit((prev) => !prev)}
            className="mx-auto text-slate-50 bg-sky-800 p-2  rounded-l-3xl mr-1"
          >
            <SquarePen className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={onDelete}
          className="mx-auto text-slate-50 bg-rose-500 p-2  rounded-r-3xl"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
