import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, LogOut, Settings, TrendingUp, Bot, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ExpenseList } from "@/components/ExpenseList";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { ExpenseSummary } from "@/components/ExpenseSummary";
import { AuthGuard } from "@/components/AuthGuard";
import { getCurrentMonth, getCurrentYear, getCurrentDate } from "@/utils/dateUtils";

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("monthly_income")
        .eq("id", user.id)
        .single();

      if (profile) {
        setMonthlyIncome(Number(profile.monthly_income));
      }

      // Fetch current month expenses
      const { data: expensesData } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", currentMonth)
        .eq("year", currentYear)
        .order("created_at", { ascending: false });

      if (expensesData) {
        setExpenses(expensesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0,
  );
  const remainingMoney = monthlyIncome - totalExpenses;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="border-b border-gray-300 bg-card">
          <div className="container mx-auto flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-bold text-foreground">
              Quant Expense
            </h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/history")}
                title="History"
              >
                <TrendingUp className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/ai-consultation")}
                title="AI Consultation"
              >
                <span className="text-lg">
                  <Bot className="h-5 w-5" />
                </span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/settings")}
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <ExpenseSummary
            monthlyIncome={monthlyIncome}
            totalExpenses={totalExpenses}
            remainingMoney={remainingMoney}
          />

          <div className="mt-8 max-w-6xl mx-auto border border-gray-300 rounded-xl py-4 px-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {getCurrentDate().toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add Expense
              </Button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses by name or category."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <ExpenseList expenses={filteredExpenses} onUpdate={fetchData} />

            <AddExpenseDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onSuccess={fetchData}
              currentMonth={currentMonth}
              currentYear={currentYear}
            />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Dashboard;
