'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getInventory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('farmer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Failed to load inventory: ' + error.message)
  return data || []
}

export async function addItem(formData: {
  item_type: string
  item_name: string
  quantity: number | null
  unit: string | null
  purchase_price: number | null
  storage_location: string | null
  expiry_date: string | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('inventory').insert({ farmer_id: user.id, ...formData })
  if (error) throw new Error('Failed to add item: ' + error.message)
  revalidatePath('/dashboard/inventory')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateItem(id: string, formData: Record<string, any>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('inventory').update(formData).eq('id', id).eq('farmer_id', user.id)
  if (error) throw new Error('Failed to update: ' + error.message)
  revalidatePath('/dashboard/inventory')
  return { success: true }
}

export async function deleteItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('inventory').delete().eq('id', id).eq('farmer_id', user.id)
  if (error) throw new Error('Failed to delete: ' + error.message)
  revalidatePath('/dashboard/inventory')
  revalidatePath('/dashboard')
  return { success: true }
}
