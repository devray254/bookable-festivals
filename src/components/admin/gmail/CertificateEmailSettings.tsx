
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export function CertificateEmailSettings() {
  const [subjectTemplate, setSubjectTemplate] = useState("Your Maabara Online Certificate");
  const [bodyTemplate, setBodyTemplate] = useState(
    "Dear {{NAME}},\n\nCongratulations on completing the course: {{COURSE_NAME}}!\n\nAttached is your certificate of completion. We hope to see you at more of our events in the future.\n\nBest regards,\nMaabara Online Team"
  );
  
  const handleSaveTemplate = () => {
    // Future implementation: Save email template
    console.log('Email template:', { subjectTemplate, bodyTemplate });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject-template">Email Subject Template</Label>
        <Input
          id="subject-template"
          value={subjectTemplate}
          onChange={(e) => setSubjectTemplate(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="body-template">Email Body Template</Label>
        <Textarea
          id="body-template"
          value={bodyTemplate}
          onChange={(e) => setBodyTemplate(e.target.value)}
          className="min-h-32"
        />
        <p className="text-sm text-muted-foreground">
          Available variables: {`{{NAME}}, {{COURSE_NAME}}, {{EVENT_DATE}}, {{CERTIFICATE_ID}}`}
        </p>
      </div>
      
      <Button 
        onClick={handleSaveTemplate}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        Save Email Template
      </Button>
    </div>
  );
}
