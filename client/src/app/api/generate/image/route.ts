import { NextResponse } from "next/server";
import OpenAI from "openai";
import { PinataSDK } from "pinata";
import sharp from "sharp";

type PinataResponse = {
  id: string;
  name: string;
  cid: string;
  size: number;
  number_of_files: number;
  mime_type: string;
  group_id: string | null;
};


async function compressImage(file: File, width: number, quality: number): Promise<File> {
  try {
    // Convert the File object to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Compress and resize the image using sharp
    const compressedBuffer = await sharp(buffer)
      .resize({ width })
      .jpeg({ quality })
      .toBuffer();

    // Create a new File object from the compressed buffer
    const compressedFile = new File(
      [compressedBuffer],
      file.name.replace(/\.[^/.]+$/, ".jpg"), // Replace the file extension with .jpg
      { type: "image/jpeg" }
    );

    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    throw new Error("Image compression failed");
  }
}

export async function POST(request: Request) {
  try {
    const { selectedWords } = await request.json();
    const selectedWordsString = selectedWords.join(", ");
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("Generating image...");
    console.log("Selected words:", selectedWordsString);
    const imagesGenerated = await client.images.generate({
      // model: "gpt-image-1",
      prompt: `Create an icon of one ${process.env.NFT_COLLECTION_CATEGORY} that is ${selectedWordsString}.`,
      n: 1,
      // quality: "low",
      // size: "256x256",
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
    const file: File = new File([blob], `${process.env.NFT_COLLECTION_CATEGORY}-icon.png`, { type: blob.type });

    const compressedImage = await compressImage(file, 200, 80); // Compress the image to 200px width and 80% quality

    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT!,
      pinataGateway: process.env.PINATA_GATEWAY!,
    });
    
    const upload: PinataResponse = await pinata.upload.public.file(compressedImage);

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
