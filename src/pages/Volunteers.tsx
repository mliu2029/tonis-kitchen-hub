import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const Volunteers = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({
    task_name: "",
    description: "",
    assigned_to: "",
    due_date: "",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("volunteer_tasks")
      .select("*")
      .order("completed", { ascending: true })
      .order("due_date", { ascending: true });

    if (error) {
      toast.error("Failed to load tasks");
    } else {
      setTasks(data || []);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from("volunteer_tasks").insert([newTask]);

    if (error) {
      toast.error("Failed to add task");
    } else {
      toast.success("Task added successfully!");
      setNewTask({ task_name: "", description: "", assigned_to: "", due_date: "" });
      setOpen(false);
      fetchTasks();
    }
  };

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("volunteer_tasks")
      .update({ completed: !currentStatus })
      .eq("id", taskId);

    if (error) {
      toast.error("Failed to update task");
    } else {
      toast.success(currentStatus ? "Task marked as incomplete" : "Task completed!");
      fetchTasks();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-primary">Volunteer Tasks</h1>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>Create a new volunteer task</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddTask} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="task_name">Task Name</Label>
                    <Input
                      id="task_name"
                      value={newTask.task_name}
                      onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assigned_to">Assigned To</Label>
                    <Input
                      id="assigned_to"
                      value={newTask.assigned_to}
                      onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">Add Task</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className={task.completed ? "opacity-60" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleComplete(task.id, task.completed)}
                  />
                  <span className={task.completed ? "line-through" : ""}>{task.task_name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {task.description && (
                    <p className="text-muted-foreground">{task.description}</p>
                  )}
                  {task.assigned_to && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Assigned to:</span> {task.assigned_to}
                    </p>
                  )}
                  {task.due_date && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Due:</span> {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks yet</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Volunteers;