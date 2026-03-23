'use client';
import { useState } from 'react';
import { inviteUser } from '@/supabase/auth';
import { Modal, Button, Input } from 'antd';
import { SendHorizonal } from 'lucide-react';

interface InviteModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void> | void;
}

export function InviteModal({ open, onClose, onSuccess }: InviteModalProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleInviteUser() {
        try {
            setLoading(true);
            await inviteUser(email);
            await onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
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
                <div>
                    <label className="block mb-1 font-medium">E-mail</label>
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite o e-mail do novo usuário"
                    />
                </div>
            </div>
        </Modal>
    );
}
