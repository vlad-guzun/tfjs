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
    const { reels } = body;

    if (!reels || !Array.isArray(reels) || reels.length === 0) {
      return NextResponse.json({ status: 'error', message: 'Reels array is required' }, { status: 400 });
    }

    const screenshotsData = await Promise.all(reels.map(async (reel: { url: string, video_id: string }) => {
      const videoUrl = reel.url;
      const uploadResponse = await cloudinary.uploader.upload(videoUrl, {
        resource_type: 'video',
        folder: 'sample_folder'
      });

      const maxDuration = 5;
      const times = Array.from({ length: maxDuration }, (_, i) => i + 1);

      const screenshots = times.map(time => cloudinary.url(uploadResponse.public_id, {
        resource_type: 'video',
        format: "jpg",
        transformation: [
          { width: 200, height: 400, crop: 'fill' },
          { start_offset: `${time}s`, duration: 0.1 }
        ]
      }));
      console.log(screenshots);
      return { videoId: reel.video_id, screenshots };
    }));

    return NextResponse.json({ status: 'success', data: screenshotsData });
  } catch (error) {
    console.error('Error generating screenshots:', error);
    return NextResponse.json({ status: 'error', message: error }, { status: 500 });
  }
}
