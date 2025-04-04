
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface User {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  organization_type?: string | null;
}

interface UsersListProps {
  filteredUsers: User[];
  selectedUsers: number[];
  onUserSelect: (userId: number) => void;
  isLoading: boolean;
}

export function UsersList({
  filteredUsers,
  selectedUsers,
  onUserSelect,
  isLoading,
}: UsersListProps) {
  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-1 p-4 font-medium border-b">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1"></div>
          <div className="col-span-4">Name</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-3">Phone</div>
        </div>
      </div>
      
      <div className="divide-y">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-eventPurple-700" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No users found
          </div>
        ) : (
          filteredUsers.map(user => (
            <UserRow 
              key={user.id}
              user={user}
              isSelected={selectedUsers.includes(user.id)}
              onSelect={() => onUserSelect(user.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface UserRowProps {
  user: User;
  isSelected: boolean;
  onSelect: () => void;
}

function UserRow({ user, isSelected, onSelect }: UserRowProps) {
  return (
    <div 
      className={`p-4 hover:bg-gray-50 ${
        isSelected ? 'bg-gray-50' : ''
      }`}
    >
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
          />
        </div>
        <div className="col-span-4 truncate">{user.name}</div>
        <div className="col-span-4 truncate">{user.email}</div>
        <div className="col-span-3 truncate">{user.phone}</div>
      </div>
    </div>
  );
}
