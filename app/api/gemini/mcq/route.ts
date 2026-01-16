import { NextRequest, NextResponse } from 'next/server'
import { generateMCQs } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { subject, unit, concept } = await request.json()

    if (!subject || !unit || !concept) {
      return NextResponse.json(
        { error: 'Subject, unit, and concept are required' },
        { status: 400 }
      )
    }

    const mcqs = await generateMCQs(subject, unit, concept)

    return NextResponse.json({ mcqs })
  } catch (error: any) {
    console.error('Error generating MCQs:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate MCQs' },
      { status: 500 }
    )
  }
}


