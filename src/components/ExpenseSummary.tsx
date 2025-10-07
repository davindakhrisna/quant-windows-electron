import { Card, CardContent } from "@/components/ui/card";

interface ExpenseSummaryProps {
  monthlyIncome: number;
  totalExpenses: number;
  remainingMoney: number;
}

export const ExpenseSummary = ({
  monthlyIncome,
  totalExpenses,
  remainingMoney,
}: ExpenseSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-gray-300 bg-card">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Monthly Income</div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {formatCurrency(monthlyIncome)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-300 bg-card">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Total Expenses</div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {formatCurrency(totalExpenses)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-300 bg-card">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Remaining</div>
          <div
            className={`mt-2 text-2xl font-bold ${remainingMoney < 0 ? "text-destructive" : "text-primary"}`}
          >
            {formatCurrency(remainingMoney)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
