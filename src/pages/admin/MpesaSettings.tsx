
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { MpesaSettingsCard } from "@/components/admin/mpesa/MpesaSettingsCard";
import { getMpesaSettings, type MpesaSettings } from "@/utils/mpesa-settings";

export default function MpesaSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<MpesaSettings | null>(null);

  // Load existing settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await getMpesaSettings();
        setSettings(data);
      } catch (error) {
        console.error("Error loading M-Pesa settings:", error);
        toast({
          title: "Error",
          description: "Failed to load M-Pesa settings",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">M-Pesa Settings</h1>
          <p className="text-muted-foreground">Configure your M-Pesa integration settings</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        ) : (
          <MpesaSettingsCard settings={settings} />
        )}
      </div>
    </AdminLayout>
  );
}
