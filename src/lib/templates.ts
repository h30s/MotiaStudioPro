// Motia Studio Pro - Template Library
// Complete production-ready backend templates

export interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    files: TemplateFile[];
    features: string[];
    deployTime: string;
}

export interface TemplateFile {
    path: string;
    content: string;
    language: string;
}

export const templates: Template[] = [
    // Template 1: REST API with CRUD
    {
        id: "rest-api-crud",
        name: "REST API with CRUD",
        description: "Full-featured REST API with database operations, validation, error handling, and authentication",
        category: "API",
        difficulty: "beginner",
        deployTime: "10s",
        features: ["CRUD Operations", "Input Validation", "Error Handling", "JWT Auth"],
        files: [
            {
                path: "src/api/items.ts",
                language: "typescript",
                content: `import { Step } from 'motia';
import { z } from 'zod';

// Validation schemas
const ItemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().positive(),
  quantity: z.number().int().nonnegative(),
});

// CREATE - Add new item
export const createItem = Step({
  name: 'create-item',
  async handler(request) {
    try {
      // Validate request body
      const validatedData = ItemSchema.parse(request.body);
      
      // Save to database
      const item = await db.items.create({
        data: {
          ...validatedData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      
      return {
        success: true,
        data: item,
        message: 'Item created successfully',
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        };
      }
      throw error;
    }
  },
});

// READ - Get all items with pagination
export const getItems = Step({
  name: 'get-items',
  async handler(request) {
    const { page = 1, limit = 10, search } = request.query;
    
    const where = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};
    
    const [items, total] = await Promise.all([
      db.items.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.items.count({ where }),
    ]);
    
    return {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },
});

// READ ONE - Get item by ID
export const getItem = Step({
  name: 'get-item',
  async handler(request) {
    const { id } = request.params;
    
    const item = await db.items.findUnique({
      where: { id },
    });
    
    if (!item) {
      return {
        success: false,
        error: 'Item not found',
      };
    }
    
    return {
      success: true,
      data: item,
    };
  },
});

// UPDATE - Update item
export const updateItem = Step({
  name: 'update-item',
  async handler(request) {
    const { id } = request.params;
    const validatedData = ItemSchema.partial().parse(request.body);
    
    const item = await db.items.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });
    
    return {
      success: true,
      data: item,
      message: 'Item updated successfully',
    };
  },
});

// DELETE - Delete item
export const deleteItem = Step({
  name: 'delete-item',
  async handler(request) {
    const { id } = request.params;
    
    await db.items.delete({
      where: { id },
    });
    
    return {
      success: true,
      message: 'Item deleted successfully',
    };
  },
});`,
            },
            {
                path: "src/middleware/auth.ts",
                language: "typescript",
                content: `import { Step } from 'motia';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticate = Step({
  name: 'authenticate',
  async handler(request) {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return {
        success: false,
        error: 'No token provided',
        statusCode: 401,
      };
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      request.user = decoded;
      return { success: true, user: decoded };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid token',
        statusCode: 401,
      };
    }
  },
});`,
            },
        ],
    },

    // Template 2: AI Agent Workflow
    {
        id: "ai-agent-workflow",
        name: "AI Agent Workflow",
        description: "Multi-step AI processing pipeline with OpenAI integration, state management, and retry logic",
        category: "AI",
        difficulty: "intermediate",
        deployTime: "12s",
        features: ["OpenAI Integration", "Durable Workflows", "State Management", "Error Recovery"],
        files: [
            {
                path: "src/workflows/ai-analysis.ts",
                language: "typescript",
                content: `import { workflow, Step } from 'motia';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Step 1: Fetch data to analyze
const fetchData = Step({
  name: 'fetch-data',
  async handler({ documentId }) {
    const document = await db.documents.findUnique({
      where: { id: documentId },
    });
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    return {
      documentId,
      content: document.content,
      metadata: document.metadata,
    };
  },
});

// Step 2: AI analysis
const analyzeWithAI = Step({
  name: 'analyze-with-ai',
  retries: 3,
  backoff: 'exponential',
  async handler({ content, metadata }) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert data analyst. Analyze the provided content and extract key insights.',
        },
        {
          role: 'user',
          content: \`Analyze this content: \${content}\`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const analysis = response.choices[0].message.content;
    
    return {
      analysis,
      model: response.model,
      tokens: response.usage?.total_tokens,
      metadata,
    };
  },
});

// Step 3: Extract actionable items
const extractActions = Step({
  name: 'extract-actions',
  async handler({ analysis }) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Extract actionable items from the analysis. Return as JSON array.',
        },
        {
          role: 'user',
          content: analysis,
        },
      ],
      response_format: { type: 'json_object' },
    });
    
    const actions = JSON.parse(response.choices[0].message.content || '[]');
    
    return { actions };
  },
});

// Step 4: Save results
const saveResults = Step({
  name: 'save-results',
  async handler({ documentId, analysis, actions, tokens }) {
    await db.analysisResults.create({
      data: {
        documentId,
        analysis,
        actions,
        tokensUsed: tokens,
        completedAt: new Date(),
      },
    });
    
    return {
      success: true,
      documentId,
      actionsCount: actions.length,
    };
  },
});

// Step 5: Send notification
const sendNotification = Step({
  name: 'send-notification',
  async handler({ documentId, actionsCount }) {
    // Send email/slack notification
    await notificationService.send({
      message: \`Analysis complete for document \${documentId}. Found \${actionsCount} action items.\`,
      channel: 'analysis-updates',
    });
    
    return { notified: true };
  },
});

// Complete workflow
export const aiAnalysisWorkflow = workflow({
  name: 'ai-analysis-workflow',
  steps: [
    fetchData,
    analyzeWithAI,
    extractActions,
    saveResults,
    sendNotification,
  ],
});`,
            },
        ],
    },

    // Template 3: Background Job Queue
    {
        id: "job-queue",
        name: "Background Job Queue",
        description: "Async task processing with exponential backoff, job scheduling, and comprehensive monitoring",
        category: "Jobs",
        difficulty: "intermediate",
        deployTime: "8s",
        features: ["Async Processing", "Retry Logic", "Job Scheduling", "Dead Letter Queue"],
        files: [
            {
                path: "src/jobs/email-processor.ts",
                language: "typescript",
                content: `import { backgroundJob, Step } from 'motia';

// Email sending job with retry logic
export const processEmailJob = backgroundJob({
  name: 'process-email',
  retries: 5,
  backoff: 'exponential',
  backoffDelay: 1000, // Start with 1 second
  deadLetterQueue: 'failed-emails',
  async handler(job) {
    const { to, subject, body, templateId } = job.data;
    
    try {
      // Render email template
      const html = await renderTemplate(templateId, job.data);
      
      // Send email via service
      const result = await emailService.send({
        to,
        subject,
        html,
      });
      
      // Log successful send
      await db.emailLogs.create({
        data: {
          jobId: job.id,
          to,
          subject,
          status: 'sent',
          messageId: result.messageId,
          sentAt: new Date(),
        },
      });
      
      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      // Log failure
      await db.emailLogs.create({
        data: {
          jobId: job.id,
          to,
          subject,
          status: 'failed',
          error: error.message,
          attemptedAt: new Date(),
        },
      });
      
      throw error; // Will trigger retry
    }
  },
});

// Scheduled job for daily reports
export const dailyReportJob = backgroundJob({
  name: 'daily-report',
  schedule: '0 9 * * *', // Every day at 9 AM
  async handler() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Generate report
    const stats = await db.analytics.aggregate({
      where: {
        createdAt: {
          gte: yesterday,
          lt: new Date(),
        },
      },
      _count: true,
      _sum: {
        revenue: true,
      },
    });
    
    // Send report to stakeholders
    await processEmailJob.enqueue({
      to: 'team@company.com',
      subject: 'Daily Report - ' + yesterday.toDateString(),
      templateId: 'daily-report',
      stats,
    });
    
    return { reportSent: true, date: yesterday };
  },
});

// Batch processing job
export const batchProcessJob = backgroundJob({
  name: 'batch-process',
  concurrency: 5, // Process 5 items at a time
  async handler(job) {
    const { items } = job.data;
    
    const results = await Promise.allSettled(
      items.map(item => processItem(item))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    return {
      total: items.length,
      successful,
      failed,
    };
  },
});

async function processItem(item: any) {
  // Process individual item
  return await someProcessing(item);
}

async function renderTemplate(templateId: string, data: any): Promise<string> {
  // Template rendering logic
  return \`<html>...</html>\`;
}`,
            },
        ],
    },

    // Template 4: E-commerce Backend
    {
        id: "ecommerce",
        name: "E-commerce Backend",
        description: "Complete e-commerce system with cart, checkout, Stripe payments, and inventory management",
        category: "E-commerce",
        difficulty: "advanced",
        deployTime: "15s",
        features: ["Product Catalog", "Cart Management", "Stripe Integration", "Inventory Tracking"],
        files: [
            {
                path: "src/workflows/checkout.ts",
                language: "typescript",
                content: `import { workflow, Step } from 'motia';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Step 1: Validate cart
const validateCart = Step({
  name: 'validate-cart',
  async handler({ cartId, userId }) {
    const cart = await db.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });
    
    if (!cart || cart.userId !== userId) {
      throw new Error('Invalid cart');
    }
    
    // Check inventory for all items
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new Error(\`Insufficient stock for \${item.product.name}\`);
      }
    }
    
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    
    return { cart, total };
  },
});

// Step 2: Create Stripe payment intent
const createPaymentIntent = Step({
  name: 'create-payment-intent',
  async handler({ total, userId }) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      metadata: { userId },
    });
    
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  },
});

// Step 3: Process payment
const processPayment = Step({
  name: 'process-payment',
  retries: 3,
  async handler({ paymentIntentId, paymentMethodId }) {
    const paymentIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      { payment_method: paymentMethodId }
    );
    
    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment failed');
    }
    
    return {
      paid: true,
      transactionId: paymentIntent.id,
    };
  },
});

// Step 4: Update inventory
const updateInventory = Step({
  name: 'update-inventory',
  async handler({ cart }) {
    await Promise.all(
      cart.items.map(item =>
        db.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        })
      )
    );
    
    return { inventoryUpdated: true };
  },
});

// Step 5: Create order
const createOrder = Step({
  name: 'create-order',
  async handler({ cart, transactionId, total }) {
    const order = await db.order.create({
      data: {
        userId: cart.userId,
        total,
        status: 'confirmed',
        transactionId,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: true },
    });
    
    // Clear cart
    await db.cart.update({
      where: { id: cart.id },
      data: { items: { deleteMany: {} } },
    });
    
    return { order };
  },
});

// Step 6: Send confirmation
const sendConfirmation = Step({
  name: 'send-confirmation',
  async handler({ order, userId }) {
    const user = await db.user.findUnique({ where: { id: userId } });
    
    await emailService.send({
      to: user.email,
      subject: \`Order Confirmation #\${order.id}\`,
      template: 'order-confirmation',
      data: { order, user },
    });
    
    return { emailSent: true };
  },
});

// Complete checkout workflow
export const checkoutWorkflow = workflow({
  name: 'checkout-workflow',
  steps: [
    validateCart,
    createPaymentIntent,
    processPayment,
    updateInventory,
    createOrder,
    sendConfirmation,
  ],
});`,
            },
        ],
    },

    // Template 5: Webhook Handler
    {
        id: "webhook-handler",
        name: "Webhook Handler",
        description: "Secure webhook receiver with signature validation, event processing, and retry mechanisms",
        category: "Events",
        difficulty: "beginner",
        deployTime: "8s",
        features: ["Signature Validation", "Event Processing", "Idempotency", "Error Recovery"],
        files: [
            {
                path: "src/api/webhooks.ts",
                language: "typescript",
                content: `import { Step, workflow } from 'motia';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;

// Webhook receiver with signature validation
export const receiveWebhook = Step({
  name: 'receive-webhook',
  async handler(request) {
    const signature = request.headers['x-webhook-signature'];
    const payload = request.body;
    
    // Verify signature
    const isValid = verifySignature(payload, signature);
    if (!isValid) {
      return {
        success: false,
        error: 'Invalid signature',
        statusCode: 401,
      };
    }
    
    // Check idempotency key
    const idempotencyKey = request.headers['x-idempotency-key'];
    const existing = await db.webhookEvents.findUnique({
      where: { idempotencyKey },
    });
    
    if (existing) {
      return {
        success: true,
        message: 'Event already processed',
        duplicate: true,
      };
    }
    
    // Store event
    const event = await db.webhookEvents.create({
      data: {
        idempotencyKey,
        type: payload.type,
        payload,
        status: 'pending',
        receivedAt: new Date(),
      },
    });
    
    // Process in background
    await webhookProcessingWorkflow.start({ eventId: event.id });
    
    return {
      success: true,
      eventId: event.id,
      message: 'Webhook received',
    };
  },
});

// Webhook processing workflow
const webhookProcessingWorkflow = workflow({
  name: 'webhook-processing',
  steps: [
    Step({
      name: 'parse-event',
      async handler({ eventId }) {
        const event = await db.webhookEvents.findUnique({
          where: { id: eventId },
        });
        
        return {
          eventId,
          type: event.payload.type,
          data: event.payload.data,
        };
      },
    }),
    
    Step({
      name: 'route-event',
      retries: 3,
      async handler({ type, data }) {
        switch (type) {
          case 'user.created':
            await handleUserCreated(data);
            break;
          case 'payment.succeeded':
            await handlePaymentSucceeded(data);
            break;
          case 'subscription.updated':
            await handleSubscriptionUpdated(data);
            break;
          default:
            console.log('Unknown event type:', type);
        }
        
        return { processed: true, type };
      },
    }),
    
    Step({
      name: 'update-status',
      async handler({ eventId }) {
        await db.webhookEvents.update({
          where: { id: eventId },
          data: {
            status: 'processed',
            processedAt: new Date(),
          },
        });
        
        return { updated: true };
      },
    }),
  ],
});

function verifySignature(payload: any, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

async function handleUserCreated(data: any) {
  // Handle user creation event
  await db.user.update({
    where: { id: data.userId },
    data: { webhookProcessed: true },
  });
}

async function handlePaymentSucceeded(data: any) {
  // Handle successful payment
  await db.payment.update({
    where: { id: data.paymentId },
    data: { status: 'confirmed' },
  });
}

async function handleSubscriptionUpdated(data: any) {
  // Handle subscription update
  await db.subscription.update({
    where: { id: data.subscriptionId },
    data: { status: data.status },
  });
}`,
            },
        ],
    },
];
