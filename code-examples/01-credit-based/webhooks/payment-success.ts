// Webhook handler - add credits on successful payment
export async function handlePaymentWebhook(event: any) {
  if (event.type === 'payment.succeeded') {
    const { user_id } = event.data.payment.metadata;
    const product = event.data.payment.line_items[0];
    const { total_credits } = product.metadata;

    // Add credits atomically
    await db.$transaction([
      // Update user balance
      db.user.update({
        where: { id: user_id },
        data: {
          credits: {
            increment: total_credits
          }
        }
      }),
      
      // Log transaction
      db.creditTransaction.create({
        data: {
          userId: user_id,
          amount: total_credits,
          type: 'purchase',
          paymentId: event.data.payment.payment_id,
          description: `Purchased ${product.name}`,
        }
      })
    ]);
  }
}
