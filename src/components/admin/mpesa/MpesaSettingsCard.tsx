
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MpesaSettingsForm } from "./MpesaSettingsForm";
import { type MpesaSettings } from "@/utils/mpesa-settings";

interface MpesaSettingsCardProps {
  settings: MpesaSettings | null;
}

export function MpesaSettingsCard({ settings }: MpesaSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>M-Pesa API Configuration</CardTitle>
        <CardDescription>
          Enter your Safaricom M-Pesa API credentials for payment processing.
          You can use test credentials for the sandbox environment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MpesaSettingsForm initialData={settings} />
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground">
          Note: These settings will be used for all M-Pesa transactions. Make sure your credentials are correct.
        </p>
      </CardFooter>
    </Card>
  );
}
