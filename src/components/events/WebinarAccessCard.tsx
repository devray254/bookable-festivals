
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hasUserPaidForEvent } from "@/utils/payments";
import { getBookingByPhone } from "@/utils/bookings";
import { useToast } from "@/hooks/use-toast";

interface WebinarAccessCardProps {
  eventId: number;
  eventTitle: string;
}

export function WebinarAccessCard({ eventId, eventTitle }: WebinarAccessCardProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [webinarLink, setWebinarLink] = useState("");
  const { toast } = useToast();

  const checkAccess = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter the phone number used during payment",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);
    try {
      // Pass the phone number as a string, which matches the updated function signature
      const hasPaid = await hasUserPaidForEvent(phoneNumber, eventId);
      
      if (hasPaid) {
        const booking = await getBookingByPhone(phoneNumber, eventId);
        
        if (booking && booking.webinar_link) {
          setHasAccess(true);
          setWebinarLink(booking.webinar_link);
          toast({
            title: "Access Granted",
            description: "You have access to this webinar!"
          });
        } else {
          toast({
            title: "No webinar link available",
            description: "Your payment is confirmed but the webinar link is not yet available",
            variant: "destructive"
          });
        }
      } else {
        setHasAccess(false);
        toast({
          title: "Access Denied",
          description: "No payment found for this event with the provided phone number",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error checking webinar access:", error);
      toast({
        title: "Error checking access",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Webinar Access</CardTitle>
        <CardDescription>
          Enter your phone number to get access to the "{eventTitle}" webinar
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasAccess ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number used for payment"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the same phone number you used for M-Pesa payment
              </p>
            </div>
            <Button 
              onClick={checkAccess} 
              disabled={isChecking} 
              className="w-full bg-eventPurple-700 hover:bg-eventPurple-800"
            >
              {isChecking ? "Checking..." : "Verify Payment & Get Access"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-green-50">
              <h3 className="font-medium text-green-800 mb-2">Your webinar link is ready!</h3>
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm font-medium break-all">{webinarLink}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(webinarLink);
                    toast({
                      title: "Link copied",
                      description: "Webinar link copied to clipboard"
                    });
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Please join the webinar 5 minutes before the scheduled time.</p>
              <p>Make sure you have a stable internet connection and your device is charged.</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-xs text-muted-foreground">
          Need help? Contact our support team at support@maabara.co.ke
        </p>
      </CardFooter>
    </Card>
  );
}
