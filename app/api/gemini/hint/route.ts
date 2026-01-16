import { NextRequest, NextResponse } from 'next/server'
import { generateHint } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { code, error, subject, unit } = await request.json()

    if (!code || !subject || !unit) {
      return NextResponse.json(
        { error: 'Code, subject, and unit are required' },
        { status: 400 }
      )
    }

    const hint = await generateHint(code, error || 'Runtime error or incorrect output', subject, unit)

    return NextResponse.json({ hint })
  } catch (error: any) {
    console.error('Error generating hint:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate hint' },
      { status: 500 }
    )
  }
}


