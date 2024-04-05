export function totalTodos(todos) {
  const totalLength = todos.reduce((acc, current) => {
    return acc + current.length;
  }, 0);

  return totalLength;
}

export function listedTodosForAdmin(todos) {
  const users = [...new Set(todos.map((todo) => todo.user._id))];
  const listedTodos = users.map((user) =>
    todos.filter((todo) => todo.user._id === user)
  );
  return listedTodos;
}
