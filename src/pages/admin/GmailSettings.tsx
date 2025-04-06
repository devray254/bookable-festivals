
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GmailSettingsForm } from '@/components/admin/gmail/GmailSettingsForm';
import GmailStatus from '@/components/admin/gmail/GmailStatus';
import { CertificateEmailSettings } from '@/components/admin/gmail/CertificateEmailSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { fetchGmailSettings, updateGmailSettings, GmailSettings } from '@/utils/gmail-settings';

const initialSettings: GmailSettings = {
  client_id: '',
  client_secret: '',
  redirect_uri: '',
  certificate_sender_email: '',
  certificate_email_subject: 'Your Certificate from Maabara Online',
  certificate_email_body: 'Dear {{name}},\n\nThank you for participating in our event. Please find your certificate attached.\n\nBest regards,\nMaabara Online Team',
  is_connected: false,
  access_token: '',
  refresh_token: '',
  token_expiry: '',
};

const GmailSettingsPage = () => {
  const [settings, setSettings] = useState<GmailSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('auth');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await fetchGmailSettings();
        
        if (data) {
          setSettings({
            ...initialSettings,
            ...data,
          });
        }
      } catch (error) {
        console.error('Error loading Gmail settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load Gmail settings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSettingsSave = async (newSettings: GmailSettings) => {
    try {
      setSaving(true);
      await updateGmailSettings(newSettings, 'admin@example.com');
      setSettings(newSettings);
      toast({
        title: 'Success',
        description: 'Gmail settings saved successfully',
      });
    } catch (error) {
      console.error('Error saving Gmail settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save Gmail settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Gmail Settings</h1>
          <p className="text-muted-foreground">Configure Gmail integration for sending certificates and notifications</p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="certificates">Certificate Emails</TabsTrigger>
          </TabsList>

          <TabsContent value="auth">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Gmail API Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <GmailSettingsForm 
                    existingSettings={settings} 
                    onSuccess={() => {
                      toast({
                        title: 'Success',
                        description: 'Gmail settings saved successfully',
                      });
                    }} 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connection Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <GmailStatus settings={settings} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>Certificate Email Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <CertificateEmailSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default GmailSettingsPage;
