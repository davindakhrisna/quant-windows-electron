import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { EditExpenseDialog } from "./EditExpenseDialog";

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: "Primary" | "Secondary" | "Tertiary";
  month: number;
  year: number;
}

interface ExpenseListProps {
  expenses: Expense[];
  onUpdate: () => void;
}

export const ExpenseList = ({ expenses, onUpdate }: ExpenseListProps) => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Primary":
        return "bg-primary/10 text-primary border-primary/20";
      case "Secondary":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "Tertiary":
        return "bg-muted text-muted-foreground border-gray-300";
      default:
        return "bg-muted text-muted-foreground border-gray-300";
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) throw error;

      toast.success("Expense deleted successfully");
      onUpdate();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  if (expenses.length === 0) {
    return (
      <Card className="mt-6 border-gray-200 bg-card">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No expenses for this month yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mx-auto mt-6 space-y-3">
        {expenses.map((expense) => (
          <Card key={expense.id} className="border-gray-200 bg-card">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-foreground">
                    {expense.name}
                  </h3>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getCategoryColor(
                      expense.category,
                    )}`}
                  >
                    {expense.category}
                  </span>
                </div>
                <p className="mt-1 text-lg font-bold text-foreground">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingExpense(expense)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(expense.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EditExpenseDialog
        expense={editingExpense}
        open={!!editingExpense}
        onOpenChange={(open) => !open && setEditingExpense(null)}
        onSuccess={() => {
          setEditingExpense(null);
          onUpdate();
        }}
      />
    </>
  );
};
