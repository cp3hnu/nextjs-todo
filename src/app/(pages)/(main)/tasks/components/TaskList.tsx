"use client";
import { addTask, updateTask, deleteTask } from "@/app/action";
import { useState } from "react";
import { DBTask, DBUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface TaskListProps {
  initialTasks?: DBTask[];
  currentUser?: DBUser;
}

export default function TaskList({ initialTasks: tasks = [], currentUser }: TaskListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "";

  // 处理新增
  const handleAdd = async (formData: FormData) => {
    const title = formData.get("title")?.toString().trim();
    if (title) {
      await addTask(title);
      router.refresh(); // 刷新页面以获取最新任务列表
    }
  };

  // 处理删除
  const handleDelete = async (taskId: number) => {
    await deleteTask(taskId);
    router.refresh(); // 刷新页面以获取最新任务列表
  };

  // 处理完成状态切换
  const handleToggle = async (task: DBTask) => {
    await updateTask(task.id, { completed: !task.completed });
    router.refresh(); // 刷新页面以获取最新任务列表
  };

  // 处理标题修改
  const handleEditSave = async (task: DBTask) => {
    if (editTitle.trim() && editTitle !== task.title) {
      await updateTask(task.id, { title: editTitle });
    }
    setEditingId(null);
    setEditTitle("");
    router.refresh(); // 刷新页面以获取最新任务列表
  };

  return (
    <div className="flex h-full w-full flex-col items-center pt-4">
      <h1 className="w-4/5 text-2xl font-bold flex-none">Hello, {currentUser?.username}</h1>
      <div className="my-4 flex w-4/5 flex-1 flex-col rounded-lg bg-white p-8 shadow-md">
        <form action="/tasks" method="get">
          <label htmlFor="search" className="sr-only">
            搜索
          </label>
          <input
            id="search"
            name="title"
            type="search"
            placeholder="搜索"
            defaultValue={title}
            className="input-base flex-1 rounded-lg"
          />
        </form>
        <div className="flex-1 overflow-y-auto mt-4 p-4 basis-0 min-h-20">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                checked={task.completed ?? false}
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
                <span className={`mr-4 flex-1 truncate ${task.completed ? "text-gray-400 line-through" : ""}`}>
                  {task.title}
                </span>
              )}
              {!task.completed && (
                <button
                  className="rounded px-2 py-1 text-blue-500 hover:bg-blue-100"
                  onClick={() => {
                    setEditingId(task.id);
                    setEditTitle(task.title);
                  }}
                  disabled={editingId === task.id}
                  type="button">
                  编辑
                </button>
              )}
              <button
                className="rounded px-2 py-1 text-red-500 hover:bg-red-100"
                onClick={() => handleDelete(task.id)}
                type="button">
                删除
              </button>
            </div>
          ))}
        </div>

        <form action={handleAdd}>
          <label htmlFor="add" className="sr-only">
            Add
          </label>
          <input id="add" name="title" type="text" placeholder="添加新任务" className="input-base rounded-lg" />
        </form>
      </div>
    </div>
  );
}
