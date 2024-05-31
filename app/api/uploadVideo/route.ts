import { NextRequest, NextResponse } from "next/server";
import cloudinary from 'cloudinary';

// Configure your Cloudinary account
cloudinary.v2.config({
  cloud_name: 'dlqcwi0te',
  api_key: '235634228739685',
  api_secret: 'p_0NcPsQTFt1r30QBVacv1gmA_c'
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const videoUrl = body.url;

    if (!videoUrl) {
      throw new Error('Video URL is required');
    }

    // Upload the video to Cloudinary if not already hosted there
    const uploadResponse = await cloudinary.v2.uploader.upload(videoUrl, {
      resource_type: 'video',
      folder: 'sample_folder'
    });

    if (!uploadResponse.public_id) {
      throw new Error('Failed to upload video to Cloudinary');
    }

    // Assuming a maximum duration of 20 seconds for demonstration
    const maxDuration = 20; // You may adjust based on your needs or video metadata
    const times = Array.from({ length: maxDuration }, (_, i) => i + 1);

    const screenshots = times.map(time => cloudinary.v2.url(uploadResponse.public_id, {
      resource_type: 'video',
      format: 'jpg',
      transformation: [
        { width: 300, height: 500, crop: "fill" }, 
        { start_offset: `${time}s`, duration: 0.1 }
      ]
    }));

    return NextResponse.json({ status: 'success', data: screenshots });
  } catch (error) {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof SyntaxError) {
      errorMessage = 'Invalid JSON in request body';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      if ('message' in error) {
        errorMessage = (error as { message: string }).message;
      }
      // Handle specific error structure from your example
      if ('code' in error && 'syscall' in error && 'path' in error) {
        const { errno, code, syscall, path } = error as { errno: number; code: string; syscall: string; path: string };
        errorMessage = `Error ${code} (${errno}): ${syscall} on ${path}`;
      }
    }

    return NextResponse.json({ status: 'error', message: errorMessage });
  }
}
