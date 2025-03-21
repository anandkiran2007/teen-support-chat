import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return new NextResponse("Message is required", { status: 400 });
    }

    // Get or create conversation for the user
    let conversation = await prisma.conversation.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        messages: true,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
        },
        include: {
          messages: true,
        },
      });
    }

    // Add user message to database
    await prisma.message.create({
      data: {
        content: message,
        role: "user",
        conversationId: conversation.id,
      },
    });

    // Prepare conversation history for OpenAI
    const messages = conversation.messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    // Add system message
    messages.unshift({
      role: "system",
      content: `You are a supportive and empathetic AI counselor for teens. Your responses should be:
- Short and conversational (2-3 sentences max)
- Warm and gentle, like talking to a friend
- Show genuine care and understanding
- Include gentle follow-up questions
- Use simple, everyday language
- Avoid clinical or formal language
- Be encouraging but not overly optimistic
- End with a gentle reminder that they're not alone

Example responses:
"That sounds really hard. Would you like to talk more about what's making you feel this way? 💜"
"I hear you. It's okay to feel like this sometimes. Want to share what happened today? 💜"
"I'm here for you. What do you think would help you feel better right now? 💜"`,
    });

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages as any,
      temperature: 0.8,
      max_tokens: 150,
    });

    const response = completion.choices[0].message.content;

    // Add assistant response to database
    await prisma.message.create({
      data: {
        content: response || "I'm here to support you. 💜",
        role: "assistant",
        conversationId: conversation.id,
      },
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.log("[CHAT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 