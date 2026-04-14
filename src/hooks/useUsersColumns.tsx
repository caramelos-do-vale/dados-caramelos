import { IUser } from '@/types/User';
import { ColumnsType } from 'antd/es/table';

export function useUsersColumns(): ColumnsType<IUser> {
    return [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email',
        },
    ];
}
