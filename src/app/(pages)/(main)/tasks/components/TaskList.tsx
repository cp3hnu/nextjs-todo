"use client";
import { addTask, updateTask, deleteTask } from "@/app/action";
import { useState } from "react";
import { DBTask } from "@/app/types";
import { useRouter } from 'next/navigation'
import { useSearchParams } from "next/navigation";

interface TaskListProps {
  initialTasks?: DBTask[];
}

export default function TaskList({ initialTasks: tasks = [] }: TaskListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const router = useRouter()
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "";

  const handleAdd = async (formData: FormData) => {
    const title = formData.get("title")?.toString().trim();
    if (title) {
      await addTask(title);
      router.refresh(); // 刷新页面以获取最新任务列表
    }
  }

  // 处理完成状态切换
  const handleToggle = async (task: DBTask) => {
    await updateTask(task.id, { completed: !task.completed });
    router.refresh(); // 刷新页面以获取最新任务列表
  };

  // 处理删除
  const handleDelete = async (taskId: number) => {
    await deleteTask(taskId);
    router.refresh(); // 刷新页面以获取最新任务列表
  };

  // 处理编辑保存
  const handleEditSave = async (task: DBTask) => {
    if (editTitle.trim() && editTitle !== task.title) {
      await updateTask(task.id, { title: editTitle });
    }
    setEditingId(null);
    setEditTitle("");
    router.refresh(); // 刷新页面以获取最新任务列表
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="bg-white p-8 my-12 rounded-lg shadow-md h-full w-4/5 space-y-4 flex flex-col">
        <form className="space-x-4" action="/tasks" method="get">
          <label htmlFor="search" className="sr-only">Search</label>
          <input
            id="search"
            name="title"
            type="search"
            placeholder="Search"
            defaultValue={title}
            className="input-base rounded-lg flex-1"
          />
        </form>
        <div className="overflow-y-auto flex-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center space-x-2 py-2"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task)}
                className="form-checkbox h-5 w-5"
              />
              {editingId === task.id ? (
                <input
                  className="input-base flex-1 rounded px-2 py-1"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onBlur={() => handleEditSave(task)}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleEditSave(task);
                    if (e.key === "Escape") {
                      setEditingId(null);
                      setEditTitle("");
                    }
                  }}
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-1 truncate mr-4 ${task.completed ? "line-through text-gray-400" : ""}`}
                >
                  {task.title}
                </span>
              )}
              {!task.completed && <button
                className="text-blue-500 px-2 py-1 rounded hover:bg-blue-100"
                onClick={() => {
                  setEditingId(task.id);
                  setEditTitle(task.title);
                }}
                disabled={editingId === task.id}
                type="button"
              >
                编辑
              </button>}
              <button
                className="text-red-500 px-2 py-1 rounded hover:bg-red-100"
                onClick={() => handleDelete(task.id)}
                type="button"
              >
                删除
              </button>
            </div>
          ))}
        </div>

        <form className="space-x-4" action={handleAdd}>
          <label htmlFor="add" className="sr-only">Add</label>
          <input
            id="add"
            name="title"
            type="text"
            placeholder="Add a new task"
            className="input-base rounded-lg"
          />
        </form>
      </div>
    </div>
  );
}