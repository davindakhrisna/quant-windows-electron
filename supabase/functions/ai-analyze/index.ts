const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: "Primary" | "Secondary" | "Tertiary";
  month: number;
  year: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { expenses, monthlyIncome } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Prepare expense summary
    const totalExpenses = expenses.reduce(
      (sum: number, exp: Expense) => sum + exp.amount,
      0,
    );
    const categoryBreakdown = expenses.reduce((acc: any, exp: Expense) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    const prompt = `You are a financial advisor analyzing someone's spending habits. Here's their financial data:

Monthly Income: Rp ${monthlyIncome.toLocaleString("id-ID")}
Total Expenses: Rp ${totalExpenses.toLocaleString("id-ID")}
Remaining: Rp ${(monthlyIncome - totalExpenses).toLocaleString("id-ID")}

Category Breakdown:
- Primary (Essential): Rp ${(categoryBreakdown.Primary || 0).toLocaleString("id-ID")}
- Secondary (Important): Rp ${(categoryBreakdown.Secondary || 0).toLocaleString("id-ID")}
- Tertiary (Optional): Rp ${(categoryBreakdown.Tertiary || 0).toLocaleString("id-ID")}

Expenses List:
${expenses.map((exp: Expense) => `- ${exp.name}: Rp ${exp.amount.toLocaleString("id-ID")} (${exp.category})`).join("\n")}

Please provide:
1. A brief assessment of their spending habits
2. Specific actionable advice to improve their financial health
3. Praise for good habits or warnings for concerning patterns
4. Suggestions on how to better allocate their budget

Keep the response concise, friendly, and encouraging. Use Indonesian Rupiah format.`;

    console.log("Sending request to Gemini API...");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get AI analysis" }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();
    console.log("Gemini API response received");

    const analysis =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate analysis";

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-analyze function:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
