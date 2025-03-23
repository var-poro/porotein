import { useState, useMemo } from 'react';
import { User } from '../services/userService';

export type SortField = keyof User;
export type SortDirection = 'asc' | 'desc';

interface UserFilters {
  searchQuery: string;
  roleFilter: string | null;
  statusFilter: string | null;
  dateRange: [Date | null, Date | null];
  sortField: SortField;
  sortDirection: SortDirection;
}

export const useUserFilters = (users: User[]) => {
  const [filters, setFilters] = useState<UserFilters>({
    searchQuery: '',
    roleFilter: null,
    statusFilter: null,
    dateRange: [null, null],
    sortField: 'username',
    sortDirection: 'asc',
  });

  const filteredUsers = useMemo(() => {
    return users
      .filter(user => {
        const matchesSearch = 
          user.username.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.searchQuery.toLowerCase());
        const matchesRole = !filters.roleFilter || user.role === filters.roleFilter;
        const matchesStatus = !filters.statusFilter || 
          (filters.statusFilter === 'active' && user.isActive) || 
          (filters.statusFilter === 'inactive' && !user.isActive);
        
        const userCreatedAt = new Date(user.createdAt);
        const matchesDateRange = (!filters.dateRange[0] || userCreatedAt >= filters.dateRange[0]) &&
                               (!filters.dateRange[1] || userCreatedAt <= filters.dateRange[1]);
        
        return matchesSearch && matchesRole && matchesStatus && matchesDateRange;
      })
      .sort((a, b) => {
        const aValue = a[filters.sortField];
        const bValue = b[filters.sortField];
        const direction = filters.sortDirection === 'asc' ? 1 : -1;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * direction;
        }
        if (aValue instanceof Date && bValue instanceof Date) {
          return (aValue.getTime() - bValue.getTime()) * direction;
        }
        return 0;
      });
  }, [users, filters]);

  const updateFilter = <K extends keyof UserFilters>(
    key: K,
    value: UserFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (field: SortField) => {
    setFilters(prev => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  return {
    filters,
    filteredUsers,
    updateFilter,
    handleSort,
  };
}; 