
import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GmailSettingsForm } from "@/components/admin/gmail/GmailSettingsForm";
import { GmailStatus } from "@/components/admin/gmail/GmailStatus";
import { CertificateEmailSettings } from "@/components/admin/gmail/CertificateEmailSettings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";
import { logActivity } from "@/utils/logs";
import { fetchGmailSettings } from "@/utils/gmail-settings";

// Define the type for Gmail settings
interface GmailSettings {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  enabled: boolean;
}

const GmailSettings = () => {
  const [settings, setSettings] = useState<GmailSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch Gmail settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const settingsData = await fetchGmailSettings();
        
        // Transform the data to match our interface
        const transformedSettings: GmailSettings = {
          clientId: settingsData.clientId || '',
          clientSecret: settingsData.clientSecret || '',
          redirectUri: settingsData.redirectUri || window.location.origin + '/auth/callback',
          enabled: settingsData.enabled || false
        };
        
        setSettings(transformedSettings);
        setError(null);
      } catch (error) {
        console.error("Error loading Gmail settings:", error);
        setError("Failed to load Gmail settings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleSuccess = async () => {
    // Log activity after successful update
    await logActivity({
      action: "gmail_settings_updated",
      user: "admin@maabara.co.ke",
      details: "Gmail API settings were updated",
      level: "info"
    });
    
    // Reload settings
    const settingsData = await fetchGmailSettings();
    
    // Transform the data to match our interface
    const transformedSettings: GmailSettings = {
      clientId: settingsData.clientId || '',
      clientSecret: settingsData.clientSecret || '',
      redirectUri: settingsData.redirectUri || window.location.origin + '/auth/callback',
      enabled: settingsData.enabled || false
    };
    
    setSettings(transformedSettings);
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gmail Integration Settings</h1>
        
        <Alert className="mb-6">
          <MailCheck className="h-4 w-4" />
          <AlertTitle>Gmail Integration</AlertTitle>
          <AlertDescription>
            Configure Gmail API settings to enable email notifications, certificate sending, and other email-based features.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Gmail API Configuration</CardTitle>
              <CardDescription>
                Enter your Gmail API credentials to enable email functionality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <p>Loading settings...</p>
                </div>
              ) : error ? (
                <div className="text-red-500 p-4 border border-red-200 rounded-md bg-red-50">
                  {error}
                </div>
              ) : (
                <GmailSettingsForm 
                  existingSettings={settings || undefined} 
                  onSuccess={handleSuccess} 
                />
              )}
            </CardContent>
          </Card>
          
          <GmailStatus settings={settings} />
        </div>
        
        <div className="mb-6">
          <CertificateEmailSettings />
        </div>
      </div>
    </AdminLayout>
  );
};

export default GmailSettings;
