import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthGuard } from "@/components/AuthGuard";

interface MonthData {
  month: number;
  year: number;
  total: number;
  count: number;
}

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("expenses")
        .select("month, year, amount")
        .eq("user_id", user.id)
        .order("year", { ascending: false })
        .order("month", { ascending: false });

      if (data) {
        const grouped = data.reduce(
          (acc: Record<string, MonthData>, expense) => {
            const key = `${expense.year}-${expense.month}`;
            if (!acc[key]) {
              acc[key] = {
                month: expense.month,
                year: expense.year,
                total: 0,
                count: 0,
              };
            }
            acc[key].total += Number(expense.amount);
            acc[key].count += 1;
            return acc;
          },
          {},
        );

        setHistory(Object.values(grouped));
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMonthName = (month: number, year: number) => {
    return new Date(year, month - 1).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const filteredHistory = history.filter((item) => {
    const monthName = getMonthName(item.month, item.year).toLowerCase();
    return (
      monthName.includes(searchQuery.toLowerCase()) ||
      item.year.toString().includes(searchQuery) ||
      item.month.toString().includes(searchQuery)
    );
  });

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
          <div className="container mx-auto flex items-center gap-4 px-4 py-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Expense History</h1>
          </div>
        </header>

        <main className="container mx-auto max-w-2xl px-4 py-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by month, year, or amount."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {history.length === 0 ? (
            <Card className="border-gray-300 bg-card">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No expense history yet.</p>
              </CardContent>
            </Card>
          ) : filteredHistory.length === 0 ? (
            <Card className="border-gray-300 bg-card">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No results found for "{searchQuery}".
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <Card
                  key={`${item.year}-${item.month}`}
                  className="border-gray-300 bg-card"
                >
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {getMonthName(item.month, item.year)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.count} expense{item.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(item.total)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
};

export default History;
