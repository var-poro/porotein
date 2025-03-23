import { useState } from 'react';

export const useUserSelection = (users: string[]) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  return {
    selectedUsers,
    handleSelectAll,
    handleSelectUser,
    clearSelection,
  };
}; 