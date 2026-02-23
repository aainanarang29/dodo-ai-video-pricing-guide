interface VideoGenerationParams {
  duration: '5s' | '10s';
  quality: '480p' | '720p' | '1080p' | '4K';
  model: 'turbo' | 'standard' | 'pro';
}

// Deduct credits for video generation
export async function generateVideo(
  userId: string, 
  params: VideoGenerationParams
) {
  // Calculate credit cost
  const creditCost = calculateCreditCost(params);

  // Check balance
  const user = await db.user.findUnique({ 
    where: { id: userId } 
  });
  
  if (!user || user.credits < creditCost) {
    throw new Error('Insufficient credits');
  }

  // Deduct credits atomically
  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { 
        credits: { 
          decrement: creditCost 
        } 
      }
    }),
    
    db.creditTransaction.create({
      data: {
        userId,
        amount: -creditCost,
        type: 'video_generation',
        description: `Generated ${params.duration} video in ${params.quality}`,
        metadata: params,
      }
    })
  ]);

  // Queue video generation (background job)
  return await queueVideoGeneration(userId, params);
}

function calculateCreditCost(params: VideoGenerationParams): number {
  const baseCredits = {
    '5s': 10,
    '10s': 20,
  }[params.duration] || 10;

  const qualityMultiplier = {
    '480p': 1.0,
    '720p': 1.5,
    '1080p': 2.0,
    '4K': 3.0,
  }[params.quality] || 1.0;

  const modelMultiplier = {
    'turbo': 0.5,
    'standard': 1.0,
    'pro': 1.5,
  }[params.model] || 1.0;

  return Math.ceil(baseCredits * qualityMultiplier * modelMultiplier);
}
