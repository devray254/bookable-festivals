
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import LogoManager from "@/components/admin/site/LogoManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SiteSettings = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Site Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LogoManager />
          
          <Card>
            <CardHeader>
              <CardTitle>Other Site Settings</CardTitle>
              <CardDescription>
                Configure general settings for your website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Additional site settings will be available here in future updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SiteSettings;
