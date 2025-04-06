
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GmailSettingsForm } from "@/components/admin/gmail/GmailSettingsForm";
import { GmailStatus } from "@/components/admin/gmail/GmailStatus";
import { fetchGmailSettings } from "@/utils/gmail-settings";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CertificateEmailSettings } from "@/components/admin/gmail/CertificateEmailSettings";
import { GmailAuthSettings } from "@/components/admin/gmail/GmailAuthSettings";

// Create an interface that matches what the API returns
interface GmailSettingsResponse {
  enabled: boolean;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  scope?: string;
}

export default function AdminGmailSettings() {
  const { data: gmailSettings, isLoading, refetch } = useQuery<GmailSettingsResponse>({
    queryKey: ['gmail-settings'],
    queryFn: fetchGmailSettings
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gmail Settings</h1>
          <p className="text-muted-foreground">
            Configure Gmail integration for authentication and email functionality
          </p>
        </div>
        
        <Separator />
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gmail Integration</CardTitle>
              <CardDescription>
                Configure Gmail API credentials to enable Sign in with Gmail and email notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GmailStatus 
                isLoading={isLoading} 
                gmailSettings={gmailSettings} 
              />
              <GmailSettingsForm 
                existingSettings={gmailSettings} 
                onSuccess={refetch} 
              />
            </CardContent>
          </Card>

          <Tabs defaultValue="auth" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="auth">Authentication</TabsTrigger>
              <TabsTrigger value="certificates">Certificate Emails</TabsTrigger>
            </TabsList>
            
            <TabsContent value="auth">
              <Card>
                <CardHeader>
                  <CardTitle>Gmail Authentication Settings</CardTitle>
                  <CardDescription>
                    Configure settings for Sign in with Gmail functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GmailAuthSettings 
                    isEnabled={gmailSettings?.enabled} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="certificates">
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Email Settings</CardTitle>
                  <CardDescription>
                    Configure default email templates for sending certificates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CertificateEmailSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}
