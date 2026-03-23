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

export async function inviteUser(email: string) {
    const supabase = createAdminClient();

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: '',
    });

    if (error) {
        console.error('Erro ao enviar convite:', error);
        throw error;
    }

    return data;
}
