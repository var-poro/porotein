import { TextInput, Select, Group, Button, Flex } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { FiSearch, FiFilter, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  roleFilter: string | null;
  onRoleFilterChange: (value: string | null) => void;
  statusFilter: string | null;
  onStatusFilterChange: (value: string | null) => void;
  dateRange: [Date | null, Date | null];
  onDateRangeChange: (range: [Date | null, Date | null]) => void;
  selectedUsersCount: number;
  onBulkDelete: () => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  selectedUsersCount,
  onBulkDelete,
  onBulkActivate,
  onBulkDeactivate,
}) => {
  return (
    <Flex gap="md" mb="md" wrap="wrap">
      <TextInput
        placeholder="Search users..."
        leftSection={<FiSearch size={16} />}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ flex: 1, minWidth: 200 }}
      />
      <Select
        placeholder="Filter by role"
        leftSection={<FiFilter size={16} />}
        value={roleFilter}
        onChange={onRoleFilterChange}
        data={[
          { value: 'admin', label: 'Admin' },
          { value: 'user', label: 'User' },
        ]}
        clearable
        style={{ minWidth: 150 }}
      />
      <Select
        placeholder="Filter by status"
        leftSection={<FiFilter size={16} />}
        value={statusFilter}
        onChange={onStatusFilterChange}
        data={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]}
        clearable
        style={{ minWidth: 150 }}
      />
      <DatePickerInput
        placeholder="Start date"
        value={dateRange[0]}
        onChange={(date: Date | null) => onDateRangeChange([date, dateRange[1]])}
        clearable
        leftSection={<FiFilter size={16} />}
        valueFormat="DD/MM/YYYY"
        popoverProps={{ position: 'bottom' }}
      />
      <DatePickerInput
        placeholder="End date"
        value={dateRange[1]}
        onChange={(date: Date | null) => onDateRangeChange([dateRange[0], date])}
        clearable
        leftSection={<FiFilter size={16} />}
        valueFormat="DD/MM/YYYY"
        popoverProps={{ position: 'bottom' }}
      />
      {selectedUsersCount > 0 && (
        <Group gap="xs">
          <Button
            color="red"
            variant="light"
            leftSection={<FiTrash2 size={16} />}
            onClick={onBulkDelete}
          >
            Delete Selected
          </Button>
          <Button
            color="green"
            variant="light"
            leftSection={<FiCheckCircle size={16} />}
            onClick={onBulkActivate}
          >
            Activate Selected
          </Button>
          <Button
            color="yellow"
            variant="light"
            leftSection={<FiXCircle size={16} />}
            onClick={onBulkDeactivate}
          >
            Deactivate Selected
          </Button>
        </Group>
      )}
    </Flex>
  );
}; 