import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';


cloudinary.v2.config({
  cloud_name: "dlqcwi0te",  
  api_key: "235634228739685",        
  api_secret: "p_0NcPsQTFt1r30QBVacv1gmA_c"   
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const videoUrl = "https://utfs.io/f/a4af4211-74d7-4bb3-9afb-94a1ac808759-nz8k0.mp4";
    const uploadResponse = await cloudinary.v2.uploader.upload(videoUrl, {
      resource_type: 'video',
      folder: 'sample_folder'
    });

    const maxDuration = 10; 
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
    return NextResponse.json({ status: 'error', message: error });
  }
}