
import { useState } from "react";
import { 
  DataTable, 
  FilterBar, 
  ActionButtons, 
  StatusBadge, 
  DataCard 
} from "../ui";
import { Edit, Trash, Eye, Calendar } from "lucide-react";

// Mock data
interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  status: string;
  attendees: number;
}

export function EventsPageExample() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Mock data
  const events: Event[] = [
    { 
      id: 1, 
      title: "Tech Conference 2023", 
      date: "2023-11-15", 
      location: "Virtual", 
      category: "Tech", 
      status: "upcoming", 
      attendees: 120 
    },
    { 
      id: 2, 
      title: "Marketing Workshop", 
      date: "2023-10-05", 
      location: "New York", 
      category: "Marketing", 
      status: "completed", 
      attendees: 45 
    },
    { 
      id: 3, 
      title: "Product Launch", 
      date: "2023-12-20", 
      location: "San Francisco", 
      category: "Product", 
      status: "upcoming", 
      attendees: 200 
    },
  ];
  
  // Filtered data based on search and filters
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (categoryFilter ? event.category === categoryFilter : true) &&
    (statusFilter ? event.status === statusFilter : true)
  );
  
  // Table columns definition
  const columns = [
    {
      header: "Title",
      accessorKey: "title" as keyof Event,
    },
    {
      header: "Date",
      accessorKey: "date" as keyof Event,
      cell: (row: Event) => new Date(row.date).toLocaleDateString()
    },
    {
      header: "Location",
      accessorKey: "location" as keyof Event,
    },
    {
      header: "Category",
      accessorKey: "category" as keyof Event,
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Event,
      cell: (row: Event) => (
        <StatusBadge 
          status={row.status} 
          label={row.status === "upcoming" ? "Upcoming" : "Completed"} 
        />
      )
    },
    {
      header: "Actions",
      accessorKey: (row: Event) => (
        <ActionButtons 
          actions={[
            {
              label: "View",
              icon: <Eye className="h-4 w-4" />,
              onClick: () => console.log("View event", row.id),
              variant: "outline"
            },
            {
              label: "Edit",
              icon: <Edit className="h-4 w-4" />,
              onClick: () => console.log("Edit event", row.id),
              variant: "outline"
            },
            {
              label: "Delete",
              icon: <Trash className="h-4 w-4" />,
              onClick: () => console.log("Delete event", row.id),
              isDestructive: true,
              variant: "outline"
            }
          ]} 
        />
      )
    }
  ];
  
  // Filter options
  const categoryOptions = [
    { label: "Tech", value: "Tech" },
    { label: "Marketing", value: "Marketing" },
    { label: "Product", value: "Product" }
  ];
  
  const statusOptions = [
    { label: "Upcoming", value: "upcoming" },
    { label: "Completed", value: "completed" }
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DataCard 
          label="Total Events" 
          value={events.length} 
          icon={<Calendar className="h-6 w-6 text-primary" />}
        />
        <DataCard 
          label="Upcoming Events" 
          value={events.filter(e => e.status === "upcoming").length} 
          icon={<Calendar className="h-6 w-6 text-green-600" />}
          iconClassName="bg-green-100"
        />
        <DataCard 
          label="Total Attendees" 
          value={events.reduce((sum, event) => sum + event.attendees, 0)} 
          icon={<Calendar className="h-6 w-6 text-blue-600" />}
          iconClassName="bg-blue-100"
        />
      </div>
      
      <FilterBar 
        searchPlaceholder="Search events..." 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={() => setSearchQuery("")}
        filters={[
          {
            name: "Category",
            options: categoryOptions,
            value: categoryFilter,
            onChange: setCategoryFilter
          },
          {
            name: "Status",
            options: statusOptions,
            value: statusFilter,
            onChange: setStatusFilter
          }
        ]}
      />
      
      <DataTable 
        data={filteredEvents} 
        columns={columns} 
        emptyMessage="No events found matching your criteria"
      />
    </div>
  );
}
