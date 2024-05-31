import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const videoUrl = body.url;

    if (!videoUrl) {
      return NextResponse.json({ status: 'error', message: 'Video URL is required' }, { status: 400 });
    }

    // Upload the video to Cloudinary if not already hosted there
    const uploadResponse = await cloudinary.uploader.upload(videoUrl, {
      resource_type: 'video',
      folder: 'sample_folder'
    });

    // Assuming a maximum duration of 20 seconds for demonstration
    const maxDuration = 20; // You may adjust based on your needs or video metadata
    const times = Array.from({ length: maxDuration }, (_, i) => i + 1);

    const screenshots = times.map(time => cloudinary.url(uploadResponse.public_id, {
      resource_type: 'video',
      format: 'jpg',
      transformation: [
        { width: 300, height: 500, crop: 'fill' },
        { start_offset: `${time}s`, duration: 0.1 }
      ]
    }));

    return NextResponse.json({ status: 'success', data: screenshots });
  } catch (error) {
    console.error('Error generating screenshots:', error);
    return NextResponse.json({ status: 'error', message: error }, { status: 500 });
  }
}
