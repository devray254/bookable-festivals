
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail, Loader2, Save } from "lucide-react";

interface EmailSettings {
  enableAutomaticEmails: boolean;
  emailSubject: string;
  emailTemplate: string;
  senderName: string;
  ccAdmins: boolean;
}

export function CertificateEmailSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<EmailSettings>({
    defaultValues: {
      enableAutomaticEmails: false,
      emailSubject: "Your Certificate for {event_name}",
      emailTemplate: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<h2>Your Certificate from {event_name}</h2>
<p>Dear {user_name},</p>
<p>Thank you for participating in our event. Please find your certificate attached to this email.</p>
<p>You can also download your certificate directly from our website.</p>
<p>Best regards,<br>Maabara Online Team</p>
</div>`,
      senderName: "Maabara Online",
      ccAdmins: true
    }
  });
  
  const watchEnableEmails = watch("enableAutomaticEmails");
  
  const onSubmit = async (data: EmailSettings) => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call an API to save the settings
      console.log("Saving email settings:", data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Certificate email settings saved successfully");
    } catch (error) {
      console.error("Error saving email settings:", error);
      toast.error("Failed to save email settings");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const sendTestEmail = async () => {
    setIsTesting(true);
    
    try {
      const emailData = watch();
      console.log("Sending test email with settings:", emailData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Test email sent successfully");
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Failed to send test email");
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="enableAutomaticEmails"
            checked={watchEnableEmails}
            onCheckedChange={(checked) => setValue("enableAutomaticEmails", checked)}
          />
          <Label htmlFor="enableAutomaticEmails">
            Automatically email certificates when generated
          </Label>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="senderName">Sender Name</Label>
          <Input
            id="senderName"
            {...register("senderName", { required: "Sender name is required" })}
            placeholder="Maabara Online"
          />
          {errors.senderName && (
            <p className="text-sm text-red-500">{errors.senderName.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="emailSubject">Email Subject</Label>
          <Input
            id="emailSubject"
            {...register("emailSubject", { required: "Email subject is required" })}
            placeholder="Your Certificate for {event_name}"
          />
          <p className="text-xs text-muted-foreground">
            Available variables: {"{event_name}"}, {"{user_name}"}, {"{certificate_id}"}
          </p>
          {errors.emailSubject && (
            <p className="text-sm text-red-500">{errors.emailSubject.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="emailTemplate">Email Template (HTML)</Label>
          <Textarea
            id="emailTemplate"
            {...register("emailTemplate", { required: "Email template is required" })}
            rows={10}
          />
          <p className="text-xs text-muted-foreground">
            Available variables: {"{event_name}"}, {"{user_name}"}, {"{event_date}"}, 
            {"{certificate_id}"}, {"{certificate_date}"}
          </p>
          {errors.emailTemplate && (
            <p className="text-sm text-red-500">{errors.emailTemplate.message}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="ccAdmins"
            checked={watch("ccAdmins")}
            onCheckedChange={(checked) => setValue("ccAdmins", checked)}
          />
          <Label htmlFor="ccAdmins">
            Send a copy to admin email addresses
          </Label>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
        
        <Button 
          type="button"
          variant="outline"
          onClick={sendTestEmail}
          disabled={isTesting}
          className="flex items-center gap-2"
        >
          {isTesting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              Send Test Email
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
