'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addSale(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.error("User not verified.")
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('transactions')
    .insert([
      {
        user_id: user.id,
        type: 'sale',
        category: 'Sale',
        description: formData.get('description'),
        amount: formData.get('selling_price'), // Store selling_price as amount for compatibility
        cost_price: formData.get('cost_price'),
        selling_price: formData.get('selling_price'),
        quantity: formData.get('quantity') || 1,
        date: formData.get('date'),
      }
    ])

  if (error) {
    console.error('Error inserting sale:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function addExpense(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('transactions')
    .insert([
      {
        user_id: user.id,
        type: 'expense',
        category: formData.get('category'),
        description: formData.get('description'),
        amount: formData.get('amount'),
        date: formData.get('date'),
      }
    ])

  if (error) {
    console.error('Error inserting expense:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/history')
  return { success: true }
}

export async function deleteTransaction(transactionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting transaction:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/history')
  return { success: true }
}

export async function updateTransaction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const updateData: any = {
    category: formData.get('category'),
    description: formData.get('description'),
    amount: formData.get('amount'),
    date: formData.get('date'),
  }

  // Add optional fields if they exist
  if (formData.has('cost_price')) updateData.cost_price = formData.get('cost_price');
  if (formData.has('selling_price')) updateData.selling_price = formData.get('selling_price');

  const { error } = await supabase
    .from('transactions')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating transaction:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/history')
  return { success: true }
}
