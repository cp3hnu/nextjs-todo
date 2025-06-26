import TaskList from "./components/TaskList";
import { getTasks, getUser } from "@/app/action";
import { PageProps } from "@/app/types";

export default async function TasksPage({ searchParams }: PageProps) {
  const _searchParams = await searchParams;
  const title = _searchParams?.title;
  const tasks = await getTasks(title as string | undefined).catch(() => {
    return [];
  });
  const user = await getUser().catch(() => undefined);

  return (<TaskList initialTasks={tasks} currentUser={user}></TaskList>)
}