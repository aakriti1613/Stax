import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not set in environment variables' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    // Test with different models in order
    const modelsToTest = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash-exp',
      'gemini-pro',
      'gemini-1.0-pro',
      'models/gemini-1.5-flash',
      'models/gemini-1.5-pro'
    ]

    const results: Array<{ model: string; status: string; error?: string }> = []
    let workingModel: string | null = null

    for (const modelName of modelsToTest) {
      try {
        console.log(`Testing model: ${modelName}`)
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent('Say "Hello" in one word')
        const response = await result.response
        const text = response.text()
        
        if (text && text.trim().length > 0) {
          workingModel = modelName
          results.push({ model: modelName, status: '✅ Works' })
          
          return NextResponse.json({
            success: true,
            workingModel: modelName,
            testResponse: text,
            message: `✅ ${modelName} model is working!`,
            allTestedModels: modelsToTest,
            testResults: results
          })
        } else {
          results.push({ model: modelName, status: '⚠️ Empty response' })
        }
      } catch (modelError: any) {
        const errorMsg = modelError.message || 'Unknown error'
        console.log(`❌ ${modelName} failed:`, errorMsg)
        results.push({ 
          model: modelName, 
          status: '❌ Failed',
          error: errorMsg.substring(0, 200)
        })
        continue
      }
    }

    // If all models failed
    return NextResponse.json({
      success: false,
      error: 'All models failed',
      testedModels: modelsToTest,
      testResults: results,
      suggestion: 'Please check: 1) API key is valid, 2) API key has access to Gemini models, 3) Billing is enabled, 4) Visit https://aistudio.google.com/ to see available models'
    }, { status: 500 })
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message || 'Failed to test Gemini API',
        details: 'Check your GEMINI_API_KEY in .env.local'
      },
      { status: 500 }
    )
  }
}

