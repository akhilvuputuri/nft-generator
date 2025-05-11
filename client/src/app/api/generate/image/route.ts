import { NextResponse } from "next/server";
import OpenAI from "openai";
import { PinataSDK } from "pinata";

type PinataResponse = {
  id: string;
  name: string;
  cid: string;
  size: number;
  number_of_files: number;
  mime_type: string;
  group_id: string | null;
};

export async function GET() {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("Generating image...");
    const imagesGenerated = await client.images.generate({
    //   model: "gpt-image-1",
      prompt: `Create an icon of a random Pokémon.`,
      n: 1,
    //   quality: "low",
    //   size: "256x256",
    });
    console.log("Image generated");
    const url = imagesGenerated?.data?.[0].url;
    if (!url) {
      return NextResponse.json(
        { error: "No image URL found" },
        { status: 500 }
      );
    }

    // Fetch the image from the URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch the image");
    }
    const blob = await response.blob();

    // Convert the Blob into a File object
    const file: File = new File([blob], "pokemon-icon.png", { type: blob.type });

    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT!,
      pinataGateway: process.env.PINATA_GATEWAY!,
    });
    
    const upload: PinataResponse = await pinata.upload.public.file(file);

    console.log("Uploaded to Pinata:", upload);
    return NextResponse.json({
      imageUrl: `https://gateway.pinata.cloud/ipfs/${upload.cid}`,
      cid: upload.cid,
    });
  } catch (error) {
    console.error("Request failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch book titles" },
      { status: 500 }
    );
  }
}
