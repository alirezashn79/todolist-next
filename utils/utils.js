export function totalTodos(todos) {
  const totalLength = todos.reduce((acc, current) => {
    return acc + current.length;
  }, 0);

  return totalLength;
}
