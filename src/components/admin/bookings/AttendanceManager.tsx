
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Clock, X, Download, Ban } from "lucide-react";
import { Booking, getBookingsByEventId, updateAttendanceStatus } from "@/utils/bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AttendanceManagerProps {
  eventId: number;
}

export function AttendanceManager({ eventId }: AttendanceManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  // Mock admin email for now - in a real app this would come from context or props
  const adminEmail = "admin@maabara.co.ke";

  // Fetch bookings for this event
  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["bookings", eventId],
    queryFn: () => getBookingsByEventId(eventId),
  });

  // Apply filters to bookings
  const filteredBookings = bookings.filter((booking) => {
    // Filter by search term (name, email, phone)
    const matchesSearch =
      !searchTerm ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm);

    // Filter by attendance status
    const matchesStatus =
      !filterStatus ||
      filterStatus === "all" ||
      booking.attendance_status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Handle attendance and certificate status update
  const handleUpdateStatus = async (
    bookingId: number,
    status: "attended" | "partial" | "absent" | "unverified",
    certificateEnabled: boolean
  ) => {
    setIsUpdating(bookingId);
    try {
      const result = await updateAttendanceStatus(
        bookingId,
        status,
        certificateEnabled,
        adminEmail
      );

      if (result.success) {
        toast.success("Attendance status updated successfully");
        refetch();
      } else {
        toast.error(result.message || "Failed to update attendance status");
      }
    } catch (error) {
      console.error("Error updating attendance status:", error);
      toast.error("An error occurred while updating attendance status");
    } finally {
      setIsUpdating(null);
    }
  };

  // Helper to render attendance status badge
  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case "attended":
        return (
          <Badge className="bg-green-500">
            <Check className="w-3 h-3 mr-1" /> Attended
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="w-3 h-3 mr-1" /> Partial
          </Badge>
        );
      case "absent":
        return (
          <Badge className="bg-red-500">
            <X className="w-3 h-3 mr-1" /> Absent
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500">
            <Clock className="w-3 h-3 mr-1" /> Unverified
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Attendance & Certificates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={filterStatus || "all"}
              onValueChange={(value) =>
                setFilterStatus(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="attended">Attended</SelectItem>
                <SelectItem value="partial">Partially attended</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-eventPurple-700 rounded-full border-t-transparent"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bookings found matching your filters.
            </div>
          ) : (
            <ScrollArea className="h-[500px] border rounded-md">
              <div className="divide-y">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-medium">{booking.customer}</h3>
                        <div className="text-sm text-gray-500">
                          <div>{booking.email}</div>
                          <div>{booking.phone}</div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {renderStatusBadge(booking.attendance_status)}
                          <Badge
                            variant={
                              booking.certificate_enabled ? "default" : "outline"
                            }
                            className={
                              booking.certificate_enabled
                                ? "bg-blue-500"
                                : "text-gray-500"
                            }
                          >
                            {booking.certificate_enabled ? (
                              <Download className="w-3 h-3 mr-1" />
                            ) : (
                              <Ban className="w-3 h-3 mr-1" />
                            )}
                            {booking.certificate_enabled
                              ? "Certificate Enabled"
                              : "Certificate Disabled"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-4 md:w-1/2">
                        <div className="space-y-2 w-full">
                          <Label>Attendance Status</Label>
                          <Select
                            value={booking.attendance_status || "unverified"}
                            onValueChange={(value) =>
                              handleUpdateStatus(
                                booking.id,
                                value as any,
                                booking.certificate_enabled || false
                              )
                            }
                            disabled={isUpdating === booking.id}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="attended">
                                Fully Attended
                              </SelectItem>
                              <SelectItem value="partial">
                                Partially Attended
                              </SelectItem>
                              <SelectItem value="absent">Absent</SelectItem>
                              <SelectItem value="unverified">
                                Unverified
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`certificate-${booking.id}`}
                            checked={booking.certificate_enabled}
                            onCheckedChange={(checked) =>
                              handleUpdateStatus(
                                booking.id,
                                booking.attendance_status || "unverified",
                                checked
                              )
                            }
                            disabled={isUpdating === booking.id}
                          />
                          <Label htmlFor={`certificate-${booking.id}`}>
                            {booking.certificate_enabled
                              ? "Certificate Download Enabled"
                              : "Certificate Download Disabled"}
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Guide:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Fully Attended</strong>: Enable certificate download for attendees who completed the full event.</li>
              <li>• <strong>Partially Attended</strong>: For those who attended part of the event.</li>
              <li>• <strong>Absent</strong>: For registered users who did not attend.</li>
              <li>• <strong>Certificate Control</strong>: Toggle to enable/disable certificate download regardless of attendance.</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
