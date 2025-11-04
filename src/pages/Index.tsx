import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ClipboardCheck, MessageSquare, QrCode, LogIn } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Toni's Kitchen</h1>
            <Button onClick={() => navigate("/auth")}>
              <LogIn className="mr-2 h-4 w-4" />
              Staff Login
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Toni's Kitchen
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your community food bank management hub. Track inventory, manage volunteers, and stay organized.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Inventory
              </CardTitle>
              <CardDescription>Track all food bank items in real-time</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                QR Scanning
              </CardTitle>
              <CardDescription>Quick shelf access via QR codes</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-secondary" />
                Volunteers
              </CardTitle>
              <CardDescription>Manage tasks and assignments</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-accent" />
                Suggestions
              </CardTitle>
              <CardDescription>Community feedback and ideas</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Submit a Suggestion
          </h3>
          <p className="text-muted-foreground mb-6">
            Have an idea to improve our operations? We'd love to hear from you!
          </p>
          <Button size="lg" onClick={() => navigate("/submit-suggestion")}>
            Share Your Ideas
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
