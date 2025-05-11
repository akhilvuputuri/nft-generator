import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      messages: [
        { role: "developer", content: `Give me 20 words as visual descriptors for ${process.env.NFT_COLLECTION_CATEGORY} as an array in json format with descriptors as the key` },
      ],
      model: "o4-mini",
      response_format: { "type": "json_object" }
    //   store: true,
    });

    console.log(completion)

    return NextResponse.json(JSON.parse(completion?.choices?.[0]?.message?.content ?? "")?.descriptors, {
      status: 200
    });

  } catch (error) {
    console.error("Request failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch book titles" },
      { status: 500 }
    );
  }
}
