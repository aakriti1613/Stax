import { NextRequest, NextResponse } from 'next/server'
import { generateCodingProblem } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { subject, unit, difficulty } = await request.json()

    if (!subject || !unit || !difficulty) {
      return NextResponse.json(
        { error: 'Subject, unit, and difficulty are required' },
        { status: 400 }
      )
    }

    if (!['Basic', 'Medium', 'Advanced'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Difficulty must be Basic, Medium, or Advanced' },
        { status: 400 }
      )
    }

    const problem = await generateCodingProblem(subject, unit, difficulty)

    return NextResponse.json({ problem })
  } catch (error: any) {
    console.error('Error generating coding problem:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate coding problem' },
      { status: 500 }
    )
  }
}


