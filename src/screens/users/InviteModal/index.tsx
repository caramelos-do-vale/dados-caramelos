'use client';
import { useState } from 'react';
import { inviteUser } from '@/supabase/auth';
import { Modal, Button, Input, Select, Alert } from 'antd';
import { SendHorizonal } from 'lucide-react';
import { UserRole } from '@/types/User';

interface InviteModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void> | void;
}

const roleOptions = Object.values(UserRole).map((value) => ({
    label: value,
    value: value,
}));

export function InviteModal({ open, onClose, onSuccess }: InviteModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleInviteUser() {
        setError(null);
        try {
            setLoading(true);
            await inviteUser(email, role, name);
            await onSuccess();
            onClose();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro ao enviar convite.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            open={open}
            title="Convidar novo usuário"
            onCancel={onClose}
            width={600}
            destroyOnHidden
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancelar
                </Button>,
                <Button
                    key="save"
                    type="primary"
                    loading={loading}
                    onClick={handleInviteUser}
                    icon={<SendHorizonal size={16} />}
                    iconPlacement="end"
                >
                    Convidar
                </Button>,
            ]}
        >
            <div className="flex flex-col gap-4 mt-4">
                {error && <Alert description={error} type="error" showIcon />}
                <div>
                    <label className="block mb-1 font-medium">Nome</label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Digite o nome do novo usuário"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">E-mail</label>
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite o e-mail do novo usuário"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Cargo</label>
                    <Select
                        value={role}
                        onChange={setRole}
                        options={roleOptions}
                        className="w-full"
                    />
                </div>
            </div>
        </Modal>
    );
}
