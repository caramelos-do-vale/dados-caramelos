'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/supabase/server';
import { createAdminClient } from '@/supabase/admin';
import { SignInWithPasswordCredentials } from '@supabase/supabase-js';

export async function login(user: SignInWithPasswordCredentials) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword(user);

    if (error) {
        console.log(error);
        return {
            success: false,
            status: error.status,
            message: error.message,
        };
    }

    return {
        success: true,
    };
}

export async function logout() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.log(error);
    }

    revalidatePath('/login', 'layout');
    redirect('/login');
}

export async function inviteUser(email: string, role: string, name: string) {
    const supabase = createAdminClient();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${siteUrl}/auth/callback?next=/set-password`,
    });

    if (error) {
        console.error('Erro ao enviar convite:', error);
        throw error;
    }

    const { error: insertError } = await supabase.from('users').insert({
        id: data.user.id,
        email,
        name,
        role,
        active: false,
    });

    if (insertError) {
        console.error('Erro ao criar registro do usuário:', insertError);
        throw insertError;
    }

    return data;
}
