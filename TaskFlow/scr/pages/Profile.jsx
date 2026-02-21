import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Shield, LogOut, Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function Profile() {
  const [userData, setUserData] = useState(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me()
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list()
  });

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handleLogout = () => {
    base44.auth.logout();
  };

  const userTasks = tasks.filter(t => t.created_by === user?.email);
  const completedTasks = userTasks.filter(t => t.status === "completed").length;
  const completionRate = userTasks.length > 0 
    ? Math.round((completedTasks / userTasks.length) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-500 mt-1">Gerencie suas informações e configurações</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
              <CardContent className="relative pt-0">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                  <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center">
                    <User className="w-12 h-12 text-indigo-600" />
                  </div>
                  <div className="flex-1 pb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{user?.full_name || "Usuário"}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 self-start sm:self-center">
                    <Shield className="w-3 h-3 mr-1" />
                    {user?.role === "admin" ? "Administrador" : "Usuário"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-indigo-600">{userTasks.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Total de Tarefas</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-emerald-600">{completedTasks}</p>
                  <p className="text-sm text-gray-500 mt-1">Concluídas</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-violet-600">{completionRate}%</p>
                  <p className="text-sm text-gray-500 mt-1">Taxa de Conclusão</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
                <CardDescription>Detalhes da sua conta no sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nome Completo</p>
                      <p className="font-medium text-gray-900">{user?.full_name || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user?.email || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Membro desde</p>
                      <p className="font-medium text-gray-900">
                        {user?.created_date 
                          ? format(new Date(user.created_date), "d 'de' MMMM, yyyy", { locale: ptBR })
                          : "—"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Shield className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Função</p>
                      <p className="font-medium text-gray-900">
                        {user?.role === "admin" ? "Administrador" : "Usuário"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-rose-100">
              <CardHeader>
                <CardTitle className="text-rose-600">Sair da Conta</CardTitle>
                <CardDescription>Encerrar sua sessão atual</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="border-rose-200 text-rose-600 hover:bg-rose-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sair
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}