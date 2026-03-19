'use client';
import { useState } from 'react';
import { useDataList } from '@/hooks/useDataList';
import { useUsersColumns } from '@/hooks/useUsersColumns';
import { useUsersFilters } from '@/hooks/useUsersFilters';
import { UserPlus } from 'lucide-react';
import { Table, Empty, Input, Button } from 'antd';
import { IUser } from '@/types/User';
import { InviteModal } from '@/screens/users/InviteModal';

const { Search } = Input;

export function UsersPage() {

    const users = useDataList<IUser>({ table: 'users' });

    const [search, setSearch] = useState('');
    const [tableFilters, setTableFilters] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { filteredUsers } = useUsersFilters(users.list, search, tableFilters);

    const columns = useUsersColumns();

    function handleOpenInviteModal() {
        setIsModalOpen(true);
    }

    function handleCloseInviteModal() {
        setIsModalOpen(false);
    }

    return (
        <>
            <InviteModal
                open={isModalOpen}
                onClose={handleCloseInviteModal}
                onSuccess={users.refresh}
            />
            <h1 className="text-xl md:text-2xl font-semibold">Usuários</h1>
            <div className="w-full flex gap-4 md:gap-8">
                <Search
                    placeholder="Buscar usuário"
                    allowClear
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                />
                <Button
                    onClick={handleOpenInviteModal}
                    type="primary"
                    icon={<UserPlus size={16} />}
                    iconPlacement="end"
                >
                    Convidar
                </Button>
            </div>
            <Table
                rowKey="id"
                dataSource={filteredUsers}
                columns={columns}
                loading={users.loading}
                pagination={{ pageSize: 10 }}
                onChange={(_, filters) => {
                    setTableFilters(filters);
                }}
                locale={{
                    emptyText: <Empty description="Nenhum usuário encontrado" />,
                }}
                className="w-full hidden md:table"
            />
        </>
    );
}
