'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, Input } from 'antd';
import { supabase } from '@/supabase/client';

export default function SetPasswordPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const disabled = !name || !password || !confirmPassword;

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;
            supabase
                .from('users')
                .select('name')
                .eq('id', user.id)
                .single()
                .then(({ data }) => {
                    if (data?.name) setName(data.name);
                });
        });
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true);

        const { data: { user }, error: updateError } = await supabase.auth.updateUser({
            password,
        });

        if (updateError || !user) {
            console.error('updateUser error:', updateError);
            setError(updateError?.message || 'Sessão não encontrada. Acesse o link do email novamente.');
            setLoading(false);
            return;
        }

        const { error: activateError } = await supabase
            .from('users')
            .update({ active: true, name })
            .eq('id', user.id);

        if (activateError) {
            setError('Erro ao ativar o usuário. Tente novamente.');
            setLoading(false);
            return;
        }

        router.push('/');
    }

    return (
        <main className="w-screen h-screen max-w-3xl mx-auto flex flex-col gap-4 md:gap-6 justify-center p-10">
            <h1 className="text-xl md:text-2xl font-semibold">Configurar conta</h1>
            <p className="text-darktext">Confirme seu nome e crie uma senha para acessar o sistema.</p>
            {error && <Alert description={error} type="error" showIcon />}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <div>
                    <label className="block mb-1 font-medium">Nome</label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Digite seu nome"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Senha</label>
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite sua senha"
                        type="password"
                        autoComplete="new-password"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Confirmar senha</label>
                    <Input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita sua senha"
                        type="password"
                        autoComplete="new-password"
                        required
                    />
                </div>
                <Button
                    htmlType="submit"
                    type="primary"
                    className="w-full"
                    loading={loading}
                    disabled={disabled}
                >
                    Confirmar
                </Button>
            </form>
        </main>
    );
}
