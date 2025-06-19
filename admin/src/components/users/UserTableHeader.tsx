import { Table, Group, Checkbox } from '@mantine/core';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { SortField } from '../../hooks/useUserFilters';

interface UserTableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  isAllSelected: boolean;
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
}

export const UserTableHeader: React.FC<UserTableHeaderProps> = ({
  onSelectAll,
  isAllSelected,
  onSort,
  sortField,
  sortDirection,
}) => {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <FiArrowUp size={16} /> : <FiArrowDown size={16} />;
  };

  return (
    <Table.Thead style={{
      backgroundColor: 'var(--background-color)',
      zIndex: 1,
    }}>
      <Table.Tr>
        <Table.Th style={{ width: 40 }}>
          <Checkbox
            checked={isAllSelected}
            onChange={(event) => onSelectAll(event.currentTarget.checked)}
          />
        </Table.Th>
        <Table.Th style={{ width: 120, minWidth: 120 }}>Status</Table.Th>
        <Table.Th style={{ width: 200, cursor: 'pointer' }} onClick={() => onSort('username')}>
          <Group gap="xs" justify="flex-start">
            Username
            <SortIcon field="username" />
          </Group>
        </Table.Th>
        <Table.Th style={{ width: 200, minWidth: 200, cursor: 'pointer' }} onClick={() => onSort('email')}>
          <Group gap="xs" justify="flex-start">
            Email
            <SortIcon field="email" />
          </Group>
        </Table.Th>
        <Table.Th style={{ width: 100 }}>Role</Table.Th>
        <Table.Th style={{ width: 200, cursor: 'pointer' }} onClick={() => onSort('createdAt')}>
          <Group gap="xs" justify="flex-start">
            Created At
            <SortIcon field="createdAt" />
          </Group>
        </Table.Th>
        <Table.Th style={{ width: 200, cursor: 'pointer' }} onClick={() => onSort('lastLoginAt')}>
          <Group gap="xs" justify="flex-start">
            Last Login
            <SortIcon field="lastLoginAt" />
          </Group>
        </Table.Th>
        <Table.Th style={{ width: 120, textAlign: 'right' }}>Actions</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}; 