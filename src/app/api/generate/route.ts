import { NextRequest, NextResponse } from "next/server";
import { generateId } from "@/lib/utils";

// This is a mock implementation. In production, you would:
// 1. Call OpenAI/Anthropic API with the description
// 2. Parse the response and extract code
// 3. Save to database
// 4. Return project ID and generated files

export async function POST(request: NextRequest) {
    try {
        const { description } = await request.json();

        if (!description || description.trim().length < 10) {
            return NextResponse.json(
                { error: "Description must be at least 10 characters" },
                { status: 400 }
            );
        }

        // Simulate AI processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Generate project ID
        const projectId = generateId("proj");

        // Mock generated code based on description keywords
        const name = extractProjectName(description);
        const files = generateMockFiles(description);

        const response = {
            projectId,
            name,
            description: `Generated a ${name} with production-ready code`,
            files: files.map((f) => ({ path: f.path, language: f.language })),
            code: files[0].content, // Return first file content
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate code" },
            { status: 500 }
        );
    }
}

function extractProjectName(description: string): string {
    const lowerDesc = description.toLowerCase();

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
    } else {
        return "Custom Backend API";
    }
}

function generateMockFiles(description: string) {
    const lowerDesc = description.toLowerCase();

    if (lowerDesc.includes("payment")) {
        return [
            {
                path: "src/api/payment.ts",
                language: "typescript",
                content: `import { Step, workflow } from 'motia';

// Payment processing endpoint
export const processPayment = Step({
  name: 'process-payment',
  async handler(request) {
    const { amount, cardToken, customerId } = request.body;
    
    // Validate input
    if (!amount || !cardToken) {
      throw new Error('Missing required fields');
    }
    
    // Process payment
    const result = await chargeCard(cardToken, amount);
    
    // Save transaction
    await saveTransaction({
      customerId,
      amount,
      status: result.success ? 'completed' : 'failed',
      timestamp: new Date(),
    });
    
    return {
      success: result.success,
      transactionId: result.id,
    };
  }
});

async function chargeCard(token: string, amount: number) {
  // Stripe integration would go here
  return { success: true, id: 'txn_' + Date.now() };
}

async function saveTransaction(data: any) {
  // Database save logic
  console.log('Saving transaction:', data);
}`,
            },
            {
                path: "src/workflows/fraud-detection.ts",
                language: "typescript",
                content: `import { workflow, Step } from 'motia';

export const fraudDetectionWorkflow = workflow({
  name: 'fraud-detection',
  steps: [
    Step({
      name: 'analyze-risk',
      async handler(transaction) {
        const riskScore = await calculateRisk(transaction);
        return { riskScore };
      }
    }),
    Step({
      name: 'decide-action',
      async handler({ riskScore }) {
        if (riskScore > 0.8) {
          return { action: 'block', reason: 'High risk' };
        }
        return { action: 'approve' };
      }
    })
  ]
});

async function calculateRisk(transaction: any): Promise<number> {
  // AI risk calculation
  return Math.random();
}`,
            },
        ];
    }

    // Default REST API template
    return [
        {
            path: "src/api/items.ts",
            language: "typescript",
            content: `import { Step } from 'motia';

// CREATE
export const createItem = Step({
  name: 'create-item',
  async handler(request) {
    const { body } = request;
    const item = await db.items.create(body);
    return { success: true, data: item };
  }
});

// READ
export const getItems = Step({
  name: 'get-items',
  async handler(request) {
    const items = await db.items.findMany();
    return { success: true, data: items };
  }
});

// UPDATE
export const updateItem = Step({
  name: 'update-item',
  async handler(request) {
    const { id } = request.params;
    const { body } = request;
    const item = await db.items.update(id, body);
    return { success: true, data: item };
  }
});

// DELETE
export const deleteItem = Step({
  name: 'delete-item',
  async handler(request) {
    const { id } = request.params;
    await db.items.delete(id);
    return { success: true };
  }
});`,
        },
    ];
}
