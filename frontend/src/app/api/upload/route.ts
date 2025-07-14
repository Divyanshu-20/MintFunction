// Optional server-side API route for secure uploads
// Use this if you want to keep your Pinata JWT secret on the server

import { NextRequest, NextResponse } from 'next/server';
import { PinataSDK } from 'pinata';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const attributes = JSON.parse(formData.get('attributes') as string || '[]');

    if (!file || !name || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload image
    const imageUpload = await pinata.upload.public.file(file);
    const imageUrl = `ipfs://${imageUpload.cid}`;

    // Create and upload metadata
    const metadata = {
      name,
      description,
      image: imageUrl,
      attributes,
    };

    const metadataUpload = await pinata.upload.public.json(metadata);
    const tokenURI = `ipfs://${metadataUpload.cid}`;

    return NextResponse.json({
      success: true,
      tokenURI,
      imageUrl,
      metadata
    });

  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
