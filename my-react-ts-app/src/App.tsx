import { useEffect, useState } from "react";
import "./App.css";
import { getTodos, type Todo } from "./test";

type ToggleTodo = Omit<Todo, "title">;

function App() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  useEffect(() => {
    getTodos().then((data) => setTodoList(data.data));
  }, []);

  const [title, setTitle] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  //추가
  const handleAddTodo = async () => {
    if (title === "") {
      return;
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };

    fetch("http://localhost:4000/todos", {
      method: "POST",
      body: JSON.stringify(newTodo),
    });
    setTodoList((prev) => [...prev, newTodo]);
    setTitle("");
  };

  //삭제
  const handleDeleteTodo = async (id: Todo["id"]) => {
    await fetch(`http://localhost:4000/todos/${id}`, {
      method: "DELETE",
    });
    setTodoList((prev) => prev.filter((todo) => todo.id !== id));
  };

  //업데이트
  const handleToggleTodo = async ({ id, completed }: ToggleTodo) => {
    await fetch(`http://localhost:4000/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        completed: !completed,
      }),
    });
    setTodoList((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !completed,
          };
        }
        return todo;
      })
    );
  };

  return (
    <>
      <div>
        <input type="text" value={title} onChange={handleTitleChange} />
        <button onClick={handleAddTodo}>등록</button>
      </div>
      <hr />
      <TodoList
        todoList={todoList}
        onDeleteClick={handleDeleteTodo}
        onToggleClick={handleToggleTodo}
      />
    </>
  );
}

type TodoListProps = {
  todoList: Todo[];
  onDeleteClick: (id: Todo["id"]) => void;
  onToggleClick: (toggleTodo: ToggleTodo) => void;
};
function TodoList({ todoList, onDeleteClick, onToggleClick }: TodoListProps) {
  return (
    <div>
      {todoList.map((todo) => (
        <TodoItem
          key={todo.id}
          {...todo}
          onDeleteClick={onDeleteClick}
          onToggleClick={onToggleClick}
        />
      ))}
    </div>
  );
}

type TodoIetmProps = Todo & {
  onDeleteClick: (id: Todo["id"]) => void;
  onToggleClick: (toggleTodo: ToggleTodo) => void;
};

function TodoItem({
  id,
  title,
  completed,
  onDeleteClick,
  onToggleClick,
}: TodoIetmProps) {
  return (
    <div>
      <div>
        {/* <div>id: {id}.</div> */}
        <div
          style={{
            textDecoration: completed ? "line-through" : "none",
          }}
          onClick={() =>
            onToggleClick({
              id,
              completed,
            })
          }
        >
          title: {title}
        </div>
        {/* <div>completed: {`${completed}`}</div> */}
        <button
          onClick={() =>
            onToggleClick({
              id,
              completed,
            })
          }
        >
          {completed ? "취소" : "완료"}
        </button>
        <button onClick={() => onDeleteClick(id)}>삭제</button>
      </div>
    </div>
  );
}
export default App;
