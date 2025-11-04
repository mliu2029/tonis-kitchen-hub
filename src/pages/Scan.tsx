import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, QrCode } from "lucide-react";
import { toast } from "sonner";

const Scan = () => {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState("");
  const [shelfInfo, setShelfInfo] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!qrCode.trim()) {
      toast.error("Please enter a QR code");
      return;
    }

    setLoading(true);
    
    const { data: shelf, error: shelfError } = await supabase
      .from("shelves")
      .select("*")
      .eq("qr_code", qrCode)
      .single();

    if (shelfError || !shelf) {
      toast.error("Shelf not found");
      setShelfInfo(null);
      setItems([]);
      setLoading(false);
      return;
    }

    const { data: shelfItems, error: itemsError } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("shelf_id", shelf.id);

    if (itemsError) {
      toast.error("Failed to load items");
    } else {
      setShelfInfo(shelf);
      setItems(shelfItems || []);
      toast.success("Shelf loaded!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-primary">QR Scanner</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Scan Shelf QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter QR code..."
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleScan()}
              />
              <Button onClick={handleScan} disabled={loading}>
                {loading ? "Loading..." : "Scan"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {shelfInfo && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Shelf Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium">Location:</span> {shelfInfo.location}
                </p>
                {shelfInfo.description && (
                  <p className="text-muted-foreground">
                    <span className="font-medium">Description:</span> {shelfInfo.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {items.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Items on this shelf</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Category:</span> {item.category}
                      </p>
                      {item.expiry_date && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Expires:</span>{" "}
                          {new Date(item.expiry_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {shelfInfo && items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items on this shelf</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Scan;