import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { TodoActions } from '../db/actions';

function Index() {
  const [todos, setTodos] = React.useState<
    Array<{ id: string; title: string; completed: boolean }>
  >([]);
  const [title, setTitle] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingTitle, setEditingTitle] = React.useState("");

  React.useEffect(() => {
    let active = true;

    (async() => {
      // Loading data todos
      try {
        console.log("Index: Loading todos");
        const data = await TodoActions.getAll();
        console.log("Index: Todos loaded", data);
        if (active) {
          setTodos(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Index: Failed to load todos", err);
        if (active) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    }
  }, [])

  // add todos
  // mengambil dari formEvent -> formulir
  const handleAdd = async(e: React.FormEvent) => {
    e.preventDefault();
    // periksa apakah User sudah memasukan string walaupun minimal 1 karakter
    if (title.trim()) {
      try {
        await TodoActions.add(title);
        setTodos(await TodoActions.getAll());
        setTitle("");
      } catch (err) {
        console.error("Failed to add todo:", err);
        setError(err as Error);
      }
    }
  }

  const handleToggle = async(id: string) => {
    try {
      await TodoActions.toggle(id);
      setTodos(await TodoActions.getAll())
    } catch (err) {
      console.error("Failed to toggle todo:", err);
    }
  }
  const handleRemove = async(id: string) => {
    try {
      await TodoActions.remove(id);
      setTodos(await TodoActions.getAll());
    } catch (err) {
      console.error("Failed to remove todo:", err)
    }
  }

  const startEdit = (todo: {id: string; title: string}) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  }

  const saveEdit = async() => {
    // periksa apakah ada todos yang sedang diedit
    if (!editingId) {
      return;
    }

    const newTitle = editingTitle.trim();
    if (!newTitle) {
      return;
    }

    try {
      await TodoActions.update(editingId, { title: newTitle });
      setTodos(await TodoActions.getAll());
      // clear editing
      setEditingId(null);
      setEditingTitle("");
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  if (isLoading) {
    return (
      <main className='p-6 max-w-lg mx-auto'>
        <div className="text-center">Loading database...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="p-6 max-w-lg mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error.message}</span>
          <details className="mt-2">
            <summary className="cursor-pointer">Show details</summary>
            <pre className="mt-2 text-xs overflow-auto">{error.stack}</pre>
          </details>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">TanStack CRUD (RxDB)</h1>
      <form onSubmit={ handleAdd } className="flex gap-2 mb-4">
        <input value={ title } 
        onChange={ (e) => setTitle(e.target.value) }
        placeholder="Add a new task"
        className="border rounded px-3 py-2 flex-1"
        />
        <button
        type='submit' className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add
        </button>
      </form>

      <ul>
        { todos.length === 0 ? (
          <li className="text-gray-500 text-center py-4">No todos yet</li>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center py-2 border-b"
            >
              { editingId === todo.id ? (
                <div className="flex w-full items-center gap-2">
                  <input value={ editingTitle }
                  onChange={ (e) => setEditingTitle(e.target.value) } 
                  className="border rounded px-2 py-1 flex-1"
                  />
                  <button
                  onClick={ saveEdit }
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 rounded border"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                <span
                onClick={() => handleToggle(todo.id)}
                className={
                      todo.completed
                        ? "line-through cursor-pointer"
                        : "cursor-pointer"
                    }
                >
                  {todo.title}
                </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => startEdit(todo)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemove(todo.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </>
              ) }
            </li>
          ))
        ) }
      </ul>
    </main>
  )
}

export const Route = createFileRoute("/")({
  component: Index,
});
