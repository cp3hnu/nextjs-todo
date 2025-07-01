"use server";

import { DBUser, DBTask } from "@app/types";
import {
  dbInsertUser,
  dbGetUserByUsername,
  dbInsertTask,
  dbGetTasks,
  dbUpdateTask,
  dbDeleteTask,
  dbGetUserByEmail,
  dbGetUserById,
} from "../db";
import { createSession, deleteSession } from "@app/utils/session";
import { verifySession } from "@app/utils/dal";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export type RegisterFormState = {
  success: boolean;
  message: string;
  user?: DBUser | null;
};

// 注册
export async function register(
  _prevState: RegisterFormState | undefined,
  formData: FormData,
): Promise<RegisterFormState> {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (!username || !email || !password) {
    return {
      success: false,
      user: null,
      message: "所有字段都是必填的",
    };
  }
  if (password.length < 6) {
    return {
      success: false,
      user: null,
      message: "密码长度不能少于6位",
    };
  }

  try {
    const existingUsername = (await dbGetUserByUsername(username)) as DBUser | null;
    if (existingUsername) {
      return {
        success: false,
        user: null,
        message: "用户名已存在",
      };
    }

    const existingEmail = (await dbGetUserByEmail(email)) as DBUser | null;
    if (existingEmail) {
      return {
        success: false,
        user: null,
        message: "邮箱已被注册",
      };
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = (await dbInsertUser(username, email, hashedPassword)) as DBUser;
    return {
      success: true,
      message: "注册成功，即将跳转到登录页",
      user,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      user: null,
      message: "注册失败",
    };
  }
}

// 登录
export async function login(_prevState: RegisterFormState | undefined, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  if (!username || !password) {
    return {
      success: false,
      user: null,
      message: "用户名和密码都是必填的",
    };
  }
  const user = (await dbGetUserByUsername(username)) as DBUser;
  if (!user) {
    return {
      success: false,
      user: null,
      message: "用户不存在",
    };
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return {
      success: false,
      user: null,
      message: "密码错误",
    };
  }

  await createSession(user.id);

  // 登录成功，返回用户信息
  return {
    success: true,
    user,
    message: "登录成功，即将跳转到任务列表页",
  };
}

export async function getUser() {
  const { userId } = (await verifySession()) || {};
  if (!userId) {
    return Promise.reject(new Error("用户未登录"));
  }
  try {
    const user = await dbGetUserById(userId);
    return user;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return Promise.reject(new Error("获取任务列表失败"));
  }
}

// 退出登录
export async function logout() {
  await deleteSession();
  redirect("/login");
}

// 获取任务列表
export async function getTasks(title: string | undefined): Promise<DBTask[]> {
  const { userId } = (await verifySession()) || {};
  if (!userId) {
    return Promise.reject(new Error("用户未登录"));
  }
  try {
    const tasks = await dbGetTasks(Number(userId), title);
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return Promise.reject(new Error("获取任务列表失败"));
  }
}

// 添加任务
export async function addTask(title?: string): Promise<DBTask | null> {
  const { userId } = (await verifySession()) || {};
  if (!userId) {
    return Promise.reject(new Error("用户未登录"));
  }

  if (!title) {
    return Promise.reject(new Error("任务标题不能为空"));
  }
  try {
    const task = (await dbInsertTask(Number(userId), title.trim())) as DBTask;
    return task;
  } catch (error) {
    console.error("Error adding task:", error);
    return Promise.reject(new Error("添加任务失败"));
  }
}

// 更新任务，包括完成状态和标题
export async function updateTask(taskId: number, content: { completed?: boolean; title?: string }): Promise<DBTask> {
  const { userId } = (await verifySession()) || {};
  if (!userId) {
    return Promise.reject(new Error("用户未登录"));
  }
  if (!taskId) {
    return Promise.reject(new Error("任务ID不能为空"));
  }
  try {
    const task = await dbUpdateTask(Number(taskId), content);
    return task;
  } catch (error) {
    console.error("Error updating task status:", error);
    return Promise.reject(new Error("任务状态更新失败"));
  }
}

// 删除任务
export async function deleteTask(taskId: number): Promise<number> {
  const { userId } = (await verifySession()) || {};
  if (!userId) {
    return Promise.reject(new Error("用户未登录"));
  }
  if (!taskId) {
    return Promise.reject(new Error("任务ID不能为空"));
  }
  try {
    await dbDeleteTask(taskId);
    return taskId;
  } catch (error) {
    console.error("Error deleting task:", error);
    return Promise.reject(new Error("任务删除失败"));
  }
}
