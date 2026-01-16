import { NextRequest, NextResponse } from 'next/server'
import { generateTheory } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { subject, unit } = await request.json()

    if (!subject || !unit) {
      return NextResponse.json(
        { error: 'Subject and unit are required' },
        { status: 400 }
      )
    }

    const theory = await generateTheory(subject, unit)

    return NextResponse.json({ theory })
  } catch (error: any) {
    console.error('Error generating theory:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate theory' },
      { status: 500 }
    )
  }
}


