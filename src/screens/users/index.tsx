'use client';
import { useState } from 'react';
import { useDataList } from '@/hooks/useDataList';

import { Table, Empty, Input, Button, Modal } from 'antd';
import { ProductForm } from '@/screens/products/ProductModal';
import { deleteProduct } from '@/services/productsService';
import { toggleProductAvailability as toggleService } from '@/services/productsService';
import { ProductsMobileList } from '@/screens/products/ProductsMobileList';
import { useProductsFilters } from '@/hooks/useProductsFilters';
import { useProductsColumns } from '@/hooks/useProductsColumns';
import { IProduct } from '@/types/Product';
import { UserPlus } from 'lucide-react';
import { IUser } from '@/types/User';
import { useUsersColumns } from '@/hooks/useUsersColumns';
import { useUsersFilters } from '@/hooks/useUsersFilters';

const { Search } = Input;

export function UsersPage() {
    const users = useDataList<IUser>({ table: 'users' });
    console.log(users);

    const [search, setSearch] = useState('');
    const [tableFilters, setTableFilters] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { filteredUsers } = useUsersFilters(users.list, search, tableFilters);

    const columns = useUsersColumns();

    function handleOpenInviteModal() {
        setIsModalOpen(true);
    }

    // function handleOpenEditModal(product: IProduct) {
    //     setSelectedProduct(product);
    //     setIsModalOpen(true);
    // }

    // function handleCloseModal() {
    //     setIsModalOpen(false);
    //     setSelectedProduct(null);
    // }

    // function handleOpenDeleteModal(product: IProduct) {
    //     Modal.confirm({
    //         title: 'Confirmar exclusão',
    //         content: (
    //             <>
    //                 Você realmente deseja excluir o produto <strong>{product.name}</strong>? Essa
    //                 ação não poderá ser desfeita.
    //             </>
    //         ),
    //         okText: 'Excluir',
    //         okType: 'danger',
    //         cancelText: 'Cancelar',
    //         centered: true,
    //         async onOk() {
    //             const result = await deleteProduct(product);
    //             if (!result) return;

    //             products.refresh();
    //         },
    //     });
    // }

    // async function toggleProductAvailability(product: IProduct) {
    //     const result = await toggleService(product);
    //     if (result) {
    //         products.refresh();
    //     }
    // }

    return (
        <>
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
            {/* <ProductsMobileList
                products={filteredProducts}
                typeColors={typeColors}
                handleOpenEditModal={handleOpenEditModal}
                handleOpenDeleteModal={handleOpenDeleteModal}
                toggleProductAvailability={toggleProductAvailability}
            /> */}
        </>
    );
}
