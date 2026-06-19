import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client for build-time operations (generateStaticParams, generateMetadata).
 * These functions run at build time without an HTTP request, so they cannot use cookies().
 * Uses the anon key — only public data is accessible.
 */
export function createBuildClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
