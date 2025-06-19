import { Table, Box, Text, Pagination, Group } from '@mantine/core';
import { User } from '../../services/userService';
import { UserTableHeader } from './UserTableHeader';
import { UserTableRow } from './UserTableRow';
import { SortField } from '../../hooks/useUserFilters';

interface UserTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedUsers: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectUser: (userId: string) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onRestore: (userId: string) => void;
  onResendActivation: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  emailLoading: string | null;
  emailSuccess: string | null;
  deletedUsers: { [key: string]: User };
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentPage,
  totalPages,
  onPageChange,
  selectedUsers,
  onSelectAll,
  onSelectUser,
  onEdit,
  onDelete,
  onRestore,
  onResendActivation,
  onResetPassword,
  onSort,
  sortField,
  sortDirection,
  emailLoading,
  emailSuccess,
  deletedUsers,
}) => {
  return (
    <>
      <Box style={{ 
        overflowX: 'auto',
        position: 'relative',
      }}>
        <Table 
          striped 
          stickyHeader 
          highlightOnHover
          horizontalSpacing="xs"
          verticalSpacing="xs"
          style={{
            minWidth: 800,
          }}
        >
          <UserTableHeader
            onSelectAll={onSelectAll}
            isAllSelected={selectedUsers.length === users.length}
            onSort={onSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
          <Table.Tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <UserTableRow
                  key={user._id}
                  user={user}
                  isSelected={selectedUsers.includes(user._id)}
                  onSelect={onSelectUser}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onRestore={onRestore}
                  onResendActivation={onResendActivation}
                  onResetPassword={onResetPassword}
                  emailLoading={emailLoading}
                  emailSuccess={emailSuccess}
                  isDeleting={!!deletedUsers[user._id]}
                  isDeleted={!!deletedUsers[user._id]}
                />
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text ta="center">No users found</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            value={currentPage}
            onChange={onPageChange}
            total={totalPages}
            size="sm"
          />
        </Group>
      )}
    </>
  );
}; 