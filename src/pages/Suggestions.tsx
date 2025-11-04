import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Suggestions = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load suggestions");
    } else {
      setSuggestions(data || []);
    }
  };

  const handleStatusChange = async (suggestionId: string, newStatus: string) => {
    const { error } = await supabase
      .from("suggestions")
      .update({ status: newStatus })
      .eq("id", suggestionId);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated!");
      fetchSuggestions();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "reviewed":
        return "text-blue-600";
      case "implemented":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-primary">Suggestions</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{suggestion.name || "Anonymous"}</span>
                  <Select
                    value={suggestion.status}
                    onValueChange={(value) => handleStatusChange(suggestion.id, value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="implemented">Implemented</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-foreground">{suggestion.suggestion}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {suggestion.email && <span>{suggestion.email}</span>}
                    <span>{new Date(suggestion.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className={`text-sm font-medium ${getStatusColor(suggestion.status)}`}>
                    Status: {suggestion.status}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {suggestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No suggestions yet</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Suggestions;