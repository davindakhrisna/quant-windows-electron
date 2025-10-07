import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthGuard } from "@/components/AuthGuard";

const Settings = () => {
  const navigate = useNavigate();
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("monthly_income")
        .eq("id", user.id)
        .single();

      if (data) {
        setMonthlyIncome(data.monthly_income.toString());
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const income = parseFloat(monthlyIncome);
      if (isNaN(income) || income < 0) {
        toast.error("Please enter a valid amount");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ monthly_income: income })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Monthly income updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update monthly income");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-gray-300 bg-card w-full">
          <div className="container mx-auto flex items-center gap-4 px-4 py-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Monthly Income</h1>
          </div>
        </header>

        <main className="container mx-auto max-w-2xl px-4 py-8 flex-1 flex items-center justify-center">
          <Card className="border-gray-300">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Set your monthly income to track your expenses better
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income (Rp)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="5000000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    required
                    disabled={loading}
                    min="0"
                    step="0.01"
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Settings;
