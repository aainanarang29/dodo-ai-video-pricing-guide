import { db } from '../../../lib/database';

// Export button with watermark upsell
export async function handleExport(
  userId: string, 
  videoId: string
) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { subscription: true }
  });

  // Check if user has watermark-free access
  const hasWatermarkFree = 
    user.subscription?.metadata?.watermark_free === true;

  if (hasWatermarkFree) {
    // Direct export without watermark
    return await exportVideo(videoId, { watermark: false });
  }

  // Free user - offer watermark removal options
  return {
    needsUpgrade: true,
    options: [
      {
        type: 'subscription',
        name: 'Basic Plan',
        price: '$12/month',
        description: 'Unlimited watermark-free exports',
        cta: 'Start Monthly Plan',
        recommended: true,
      },
      {
        type: 'one_time',
        name: 'This Video Only',
        price: '$5',
        description: 'Remove watermark from this video',
        cta: 'Pay $5',
      },
      {
        type: 'free',
        name: 'Export with Watermark',
        price: 'Free',
        description: '720p with VEED.io watermark',
        cta: 'Download',
      }
    ]
  };
}

async function exportVideo(videoId: string, options: { watermark: boolean }) {
  // Your video export logic here
  return { success: true, videoId, watermark: options.watermark };
}
