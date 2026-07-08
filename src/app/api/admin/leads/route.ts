import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireAdmin, resolveBranch } from '@/lib/auth'

const TABLES = {
  gift: 'gift_requests',
  membership: 'membership_requests',
  contact: 'contact_messages',
} as const

type Kind = keyof typeof TABLES

export async function GET(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth
  const { searchParams } = new URL(request.url)
  const kind = searchParams.get('type') as Kind | null
  const status = searchParams.get('status') || ''

  if (!kind || !(kind in TABLES)) {
    return Response.json({ error: 'Invalid type' }, { status: 400 })
  }

  const branch = resolveBranch(request, auth)
  let query = getSupabase().from(TABLES[kind]).select('*').eq('branch', branch).order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)

  const { data, error } = await query.limit(200)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ items: data || [] })
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth
  try {
    const { type, id, branch: branchOverride } = await request.json()

    if (!type || !(type in TABLES) || !id) {
      return Response.json({ error: 'type and id required' }, { status: 400 })
    }

    const branch = resolveBranch(request, auth, branchOverride)
    const { error } = await getSupabase()
      .from(TABLES[type as Kind])
      .delete()
      .eq('id', id)
      .eq('branch', branch)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth
  try {
    const { type, id, status, notes, branch: branchOverride } = await request.json()

    if (!type || !(type in TABLES) || !id) {
      return Response.json({ error: 'type and id required' }, { status: 400 })
    }

    const updateData: Record<string, string> = {}
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: 'No fields to update' }, { status: 400 })
    }

    const branch = resolveBranch(request, auth, branchOverride)
    const { error } = await getSupabase()
      .from(TABLES[type as Kind])
      .update(updateData)
      .eq('id', id)
      .eq('branch', branch)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
