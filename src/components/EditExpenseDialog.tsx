import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const expenseSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  amount: z.number().positive("Amount must be positive"),
  category: z.enum(["Primary", "Secondary", "Tertiary"]),
});

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: "Primary" | "Secondary" | "Tertiary";
}

interface EditExpenseDialogProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditExpenseDialog = ({ expense, open, onOpenChange, onSuccess }: EditExpenseDialogProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<"Primary" | "Secondary" | "Tertiary">("Primary");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setName(expense.name);
      setAmount(expense.amount.toString());
      setCategory(expense.category);
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense) return;
    
    setLoading(true);

    try {
      const validation = expenseSchema.safeParse({
        name: name.trim(),
        amount: parseFloat(amount),
        category,
      });

      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("expenses")
        .update({
          name: name.trim(),
          amount: parseFloat(amount),
          category,
        })
        .eq("id", expense.id);

      if (error) throw error;

      toast.success("Expense updated successfully");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Expense Name</Label>
            <Input
              id="edit-name"
              placeholder="e.g., Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount (Rp)</Label>
            <Input
              id="edit-amount"
              type="number"
              placeholder="50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={loading}
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select value={category} onValueChange={(value: any) => setCategory(value)} disabled={loading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Primary">Primary (Essential)</SelectItem>
                <SelectItem value="Secondary">Secondary (Important)</SelectItem>
                <SelectItem value="Tertiary">Tertiary (Optional)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Expense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
