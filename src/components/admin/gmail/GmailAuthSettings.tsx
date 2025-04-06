
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface GmailAuthSettingsProps {
  isEnabled?: boolean;
}

export function GmailAuthSettings({ isEnabled }: GmailAuthSettingsProps) {
  const [allowSignIn, setAllowSignIn] = useState(true);
  const [autoCreateAccount, setAutoCreateAccount] = useState(true);
  
  const handleSaveSettings = () => {
    // Future implementation: Save auth settings
    console.log('Auth settings:', { allowSignIn, autoCreateAccount });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="allow-signin"
            checked={allowSignIn}
            onCheckedChange={setAllowSignIn}
            disabled={!isEnabled}
          />
          <Label htmlFor="allow-signin">Allow Sign in with Gmail</Label>
        </div>
        <p className="text-sm text-muted-foreground pl-7">
          Allow users to sign in to your application using their Gmail accounts
        </p>
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-create"
            checked={autoCreateAccount}
            onCheckedChange={setAutoCreateAccount}
            disabled={!isEnabled}
          />
          <Label htmlFor="auto-create">Auto-create new accounts</Label>
        </div>
        <p className="text-sm text-muted-foreground pl-7">
          Automatically create a new user account when someone signs in with Gmail for the first time
        </p>
      </div>
      
      <div className="pt-4">
        <Button 
          onClick={handleSaveSettings}
          disabled={!isEnabled}
        >
          Save Authentication Settings
        </Button>
      </div>
    </div>
  );
}
