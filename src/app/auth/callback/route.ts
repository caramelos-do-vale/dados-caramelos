import { NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';
import { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;
    const next = searchParams.get('next') ?? '/set-password';

    const supabase = await createClient();

    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type });
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
        console.error('verifyOtp error:', error);
    }

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
        console.error('exchangeCodeForSession error:', error);
    }

    return NextResponse.redirect(`${origin}/login`);
}
