'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/supabase/auth';
import { Alert, Button, Input } from 'antd';
import { supabase } from '@/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [auth, setAuth] = useState({
        email: '',
        password: '',
    });

    const disabled = !auth.email || !auth.password;

    useEffect(() => {
        const hash = window.location.hash;
        if (!hash.includes('type=invite')) return;

        const params = new URLSearchParams(hash.substring(1));
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (!access_token || !refresh_token) return;

        supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
            if (!error) {
                router.push('/set-password');
            }
        });
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        const res = await login(auth);

        if (res.success) {
            router.push('/');
        } else {
            setError(
                'Não conseguimos entrar na sua conta. Verifique seu email e senha e tente novamente.'
            );
        }

        setLoading(false);
    }
    return (
        <main className="w-screen h-screen max-w-3xl mx-auto flex flex-col gap-4 md:gap-6 justify-center p-10">
            <h1 className="text-xl md:text-2xl font-semibold">Entrar</h1>
            {error && <Alert title="Erro ao entrar" description={error} type="error" showIcon />}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <Input
                        value={auth.email}
                        onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                        placeholder="Digite o email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Senha</label>
                    <Input
                        value={auth.password}
                        onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                        placeholder="Digite a senha"
                        name="password"
                        type="password"
                        autoComplete="current-password"
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
                    Entrar
                </Button>
            </form>
        </main>
    );
}
