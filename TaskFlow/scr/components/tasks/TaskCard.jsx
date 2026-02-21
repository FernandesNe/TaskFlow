import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  MoreHorizontal, 
  CheckCircle2, 
  Circle, 
  ArrowUpCircle,
  Trash2,
  Edit
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const statusConfig = {
  pending: { label: "Pendente", color: "bg-gray-100 text-gray-700", icon: Circle },
  in_progress: { label: "Em Progresso", color: "bg-blue-100 text-blue-700", icon: Clock },
  completed: { label: "Concluída", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  cancelled: { label: "Cancelada", color: "bg-rose-100 text-rose-700", icon: Circle }
};

const priorityConfig = {
  low: { label: "Baixa", color: "bg-slate-100 text-slate-600" },
  medium: { label: "Média", color: "bg-amber-100 text-amber-700" },
  high: { label: "Alta", color: "bg-orange-100 text-orange-700" },
  urgent: { label: "Urgente", color: "bg-red-100 text-red-700" }
};

export default function TaskCard({ task, category, onStatusChange, onEdit, onDelete }) {
  const status = statusConfig[task.status] || statusConfig.pending;
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const StatusIcon = status.icon;

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "completed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white rounded-xl p-5 shadow-sm border transition-all hover:shadow-md ${
        isOverdue ? "border-rose-200" : "border-gray-100"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={() => onStatusChange(task, task.status === "completed" ? "pending" : "completed")}
            className="mt-0.5 flex-shrink-0"
          >
            <StatusIcon className={`w-5 h-5 ${
              task.status === "completed" ? "text-emerald-500" : "text-gray-400 hover:text-indigo-500"
            } transition-colors`} />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 truncate ${
              task.status === "completed" ? "line-through text-gray-400" : ""
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant="secondary" className={priority.color}>
                {priority.label}
              </Badge>
              {category && (
                <Badge 
                  variant="outline" 
                  style={{ borderColor: category.color, color: category.color }}
                >
                  {category.name}
                </Badge>
              )}
              {task.due_date && (
                <Badge 
                  variant="secondary" 
                  className={isOverdue ? "bg-rose-100 text-rose-700" : "bg-gray-100 text-gray-600"}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  {format(new Date(task.due_date), "d MMM", { locale: ptBR })}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onStatusChange(task, "pending")}>
              <Circle className="w-4 h-4 mr-2 text-gray-400" /> Pendente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(task, "in_progress")}>
              <Clock className="w-4 h-4 mr-2 text-blue-500" /> Em Progresso
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(task, "completed")}>
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Concluída
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="w-4 h-4 mr-2" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task)} className="text-rose-600">
              <Trash2 className="w-4 h-4 mr-2" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}