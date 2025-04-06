// src/pages/api/upload-banner.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { uploadFile } from '@uploadthing/middleware/server'; // adjust to your setup

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fileUrl } = await uploadFile(req, {
      route: 'bannerUploader',
    });

    if (!fileUrl) return res.status(400).json({ error: 'Upload failed' });

    return res.status(200).json({ url: fileUrl });
  } catch (err) {
    console.error('Upload API error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
