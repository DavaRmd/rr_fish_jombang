import { createClient } from '@/lib/supabase/server'
import WAFloatButtonClient from './WAFloatButtonClient'

async function getWhatsAppNumber() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'whatsapp_number')
    .single()

  return data?.value ?? '6287846799603'
}

export default async function WAFloatButton() {
  const waNumber = await getWhatsAppNumber()

  return <WAFloatButtonClient waNumber={waNumber} />
}
