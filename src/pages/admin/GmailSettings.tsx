
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

export default function AdminGmailSettings() {
  const { data: gmailSettings, isLoading, refetch } = useQuery({
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
        </div>
      </div>
    </AdminLayout>
  );
}
