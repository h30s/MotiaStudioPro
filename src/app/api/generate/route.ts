import { NextRequest, NextResponse } from "next/server";
import { generateId } from "@/lib/utils";
import { aiService } from "@/lib/ai-service";

export async function POST(request: NextRequest) {
  try {
    const { description, language = 'typescript', features = [] } = await request.json();

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: "Description must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Generate project ID
    const projectId = generateId("proj");

    console.log(`🤖 Generating code with Groq AI for: "${description}"`);

    // Use AI Service to generate code
    const files = await aiService.generateCode({
      description,
      language: language as 'typescript' | 'python' | 'go',
      features,
    });

    // Validate generated code
    const validation = await aiService.validateCode(files);
    if (!validation.valid) {
      console.warn('Generated code validation warnings:', validation.errors);
    }

    // Extract project name from description or first file
    const name = extractProjectName(description, files);

    const response = {
      projectId,
      name,
      description: `AI-generated ${name} based on your description`,
      files: files.map((f) => ({ path: f.path, language: f.language, content: f.content })),
      code: files[0]?.content || '', // Return first file content for backwards compat
      fileCount: files.length,
    };

    console.log(`✅ Generated ${files.length} files successfully`);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate code. Please check your GROQ_API_KEY and try again.",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function extractProjectName(description: string, files: any[]): string {
  const lowerDesc = description.toLowerCase();

  // Try to extract name from description keywords
  if (lowerDesc.includes("payment") || lowerDesc.includes("stripe")) {
    return "Payment Processing System";
  } else if (lowerDesc.includes("todo") || lowerDesc.includes("task")) {
    return "Todo API";
  } else if (lowerDesc.includes("webhook")) {
    return "Webhook Handler";
  } else if (lowerDesc.includes("ai") || lowerDesc.includes("agent")) {
    return "AI Agent Workflow";
  } else if (lowerDesc.includes("ecommerce") || lowerDesc.includes("shop")) {
    return "E-commerce Backend";
  } else if (lowerDesc.includes("auth") || lowerDesc.includes("login")) {
    return "Authentication Service";
  } else if (lowerDesc.includes("notification") || lowerDesc.includes("email")) {
    return "Notification Service";
  } else {
    return "Custom Backend API";
  }
}
