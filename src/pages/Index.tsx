import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Calendar, MessageSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-primary text-center">Toni's Kitchen</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Nourishing Our Community with Love
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Toni's Kitchen is dedicated to providing nutritious meals and support to those in need.
            Together, we're building a stronger, healthier community.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Providing food, dignity, and hope to our neighbors facing food insecurity.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Distribution Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monday-Friday: 10AM-2PM<br />
                Saturday: 9AM-12PM
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Have questions? We're here to help and answer your inquiries.
              </CardDescription>
            </CardContent>
          </Card>
        </section>

        <section className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Share Your Thoughts</CardTitle>
              <CardDescription>
                Your feedback helps us serve our community better
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/submit-suggestion")} size="lg" className="w-full">
                Submit a Suggestion
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2024 Toni's Kitchen. Serving our community with compassion.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
