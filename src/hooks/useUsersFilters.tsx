import { useMemo } from 'react';
import { FilterValue } from 'antd/es/table/interface';
import { IUser } from '@/types/User';

export function useUsersFilters(
    users: IUser[],
    search: string,
    tableFilters: Record<string, FilterValue>
) {
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [users, search, tableFilters]);

    return {
        filteredUsers,
    };
}
