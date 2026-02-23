import { db } from '../../../lib/database';

async function exportVideo(videoId: string, options: { watermark: boolean }) {
  // Your video export logic here
  return { success: true, videoId, watermark: options.watermark };
}

// Handle successful payments
export async function handleWatermarkPayment(event: any) {
  if (event.type === 'payment.succeeded') {
    const { user_id, video_id, type } = event.data.payment.metadata;

    if (type === 'watermark_removal') {
      // One-time removal - mark specific video
      await db.video.update({
        where: { id: video_id },
        data: { 
          watermarkFree: true,
          purchaseId: event.data.payment.payment_id,
        }
      });

      // Export video without watermark
      await exportVideo(video_id, { watermark: false });
    }
  }

  if (event.type === 'subscription.active') {
    const { user_id } = event.data.subscription.metadata;

    // Grant watermark-free access to all videos
    await db.user.update({
      where: { id: user_id },
      data: {
        watermarkFree: true,
        subscriptionId: event.data.subscription.subscription_id,
      }
    });
  }
}
