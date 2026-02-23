import { Dodo } from '@dodopayments/dodo-ts-sdk';

const dodo = new Dodo({
  bearerToken: process.env.DODO_API_KEY!,
});

// Handle credit purchase
export async function purchaseCredits(
  userId: string, 
  productId: string
) {
  const user = await db.user.findUnique({ 
    where: { id: userId } 
  });

  // Create payment session
  const payment = await dodo.payments.create({
    payment_link: true,
    product_cart: [
      { product_id: productId, quantity: 1 }
    ],
    customer: {
      email: user.email,
      name: user.name,
    },
    billing: {
      country: user.country || 'US',
    },
    return_url: `${process.env.APP_URL}/dashboard?purchase=success`,
    metadata: {
      user_id: userId,
      purchase_type: 'credit_package',
    },
  });

  return payment.payment_link;
}
