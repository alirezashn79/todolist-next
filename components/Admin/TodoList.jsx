import Accordion from "./Accordion";

export default function TodoList({ todos, setReload, getAllTodos }) {
  // const users = [...new Set(todos?.map((todo) => todo.user._id))];

  // const todosList = users.map((user) => {
  //   return todos?.filter((todo) => todo.user._id === user);
  // });
  return (
    <div className="space-y-4">
      {todos.map((todoList) => (
        <Accordion
          key={todoList._id}
          setReload={setReload}
          todoList={todoList}
          getAllTodos={getAllTodos}
        />
      ))}
    </div>
  );
}
