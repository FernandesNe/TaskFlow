import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/categories/CategoryCard";
import CategoryForm from "@/components/categories/CategoryForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Categories() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);

  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => base44.entities.Category.list()
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list()
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Category.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowForm(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Category.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowForm(false);
      setEditingCategory(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Category.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleteCategory(null);
    }
  });

  const handleSubmit = (data) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (category) => {
    setDeleteCategory(category);
  };

  const confirmDelete = () => {
    if (deleteCategory) {
      deleteMutation.mutate(deleteCategory.id);
    }
  };

  const getTaskCountByCategory = (categoryId) => {
    return tasks.filter(t => t.category_id === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
            <p className="text-gray-500 mt-1">Organize suas tarefas em categorias</p>
          </div>
          <Button 
            onClick={() => { setEditingCategory(null); setShowForm(true); }}
            className="bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-200"
          >
            <Plus className="w-5 h-5 mr-2" /> Nova Categoria
          </Button>
        </div>

        {/* Category Form */}
        <AnimatePresence>
          {showForm && (
            <div className="mb-8">
              <CategoryForm
                category={editingCategory}
                onSubmit={handleSubmit}
                onCancel={() => { setShowForm(false); setEditingCategory(null); }}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Carregando categorias...</p>
          </div>
        ) : categories.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-gray-100"
          >
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Nenhuma categoria</h3>
            <p className="text-gray-500 mt-1">Crie categorias para organizar melhor suas tarefas</p>
            <Button 
              onClick={() => setShowForm(true)}
              className="mt-4 bg-violet-600 hover:bg-violet-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Criar Categoria
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  taskCount={getTaskCountByCategory(category.id)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A categoria "{deleteCategory?.name}" será excluída, mas as tarefas associadas serão mantidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}