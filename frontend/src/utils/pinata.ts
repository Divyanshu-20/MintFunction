import { PinataSDK } from "pinata";

// Configuration - Replace with your Pinata credentials
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "YOUR_PINATA_JWT_HERE";
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "YOUR_GATEWAY.mypinata.cloud";

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: PINATA_GATEWAY,
});

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  external_url?: string;
  background_color?: string;
}

export async function uploadToPinata(
  imageFile: File,
  name: string,
  description: string,
  attributes: NFTAttribute[] = []
): Promise<string> {
  try {
    // Step 1: Upload the image file to Pinata
    console.log("Uploading image to Pinata...");
    const imageUpload = await pinata.upload.public.file(imageFile);
    const imageUrl = `ipfs://${imageUpload.cid}`;
    
    console.log("Image uploaded:", imageUrl);

    // Step 2: Create ERC-721/ERC-1155 compliant metadata
    const metadata: NFTMetadata = {
      name,
      description,
      image: imageUrl,
      attributes,
      external_url: "", // You can add a website URL here
      background_color: "", // Optional background color for OpenSea
    };

    // Step 3: Upload metadata JSON to Pinata
    console.log("Uploading metadata to Pinata...");
    const metadataUpload = await pinata.upload.public.json(metadata);
    const metadataUrl = `ipfs://${metadataUpload.cid}`;
    
    console.log("Metadata uploaded:", metadataUrl);
    
    return metadataUrl;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw new Error("Failed to upload to Pinata. Please check your API keys and try again.");
  }
}

export async function getGatewayUrl(cid: string): Promise<string> {
  try {
    // Create gateway URL manually since convert method doesn't exist
    return `https://${PINATA_GATEWAY}/ipfs/${cid}`;
  } catch (error) {
    console.error("Error getting gateway URL:", error);
    return `https://${PINATA_GATEWAY}/ipfs/${cid}`;
  }
}
