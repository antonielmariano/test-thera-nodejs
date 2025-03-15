import { PrismaClient, CategoryType, OrderStatusType } from '@prisma/client';

const prisma = new PrismaClient();


// create db initial rows for each model in the schema

async function main() {
  console.log('Seeding database...');

  // Seed Users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      name: 'User One',
      email: 'user1@example.com',
      password: 'password123',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      name: 'User Two',
      email: 'user2@example.com',
      password: 'password456',
    },
  });

  // Seed Categories
  const electronicCategory = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: { type: CategoryType.ELECTRONICS },
    create: { 
      name: 'Electronics',
      type: CategoryType.ELECTRONICS
    },
  });

  const clothingCategory = await prisma.category.upsert({
    where: { name: 'Clothing' },
    update: { type: CategoryType.CLOTHING },
    create: { 
      name: 'Clothing',
      type: CategoryType.CLOTHING
    },
  });

  const booksCategory = await prisma.category.upsert({
    where: { name: 'Books' },
    update: { type: CategoryType.BOOKS },
    create: { 
      name: 'Books',
      type: CategoryType.BOOKS
    },
  });

  // Seed Products
  const smartphone = await prisma.product.upsert({
    where: { id: BigInt(1) },
    update: {
      name: 'Smartphone X',
      categoryId: electronicCategory.id,
      description: 'Latest smartphone with amazing features',
      price: 999.99,
      stockQuantity: 50,
    },
    create: {
      name: 'Smartphone X',
      categoryId: electronicCategory.id,
      description: 'Latest smartphone with amazing features',
      price: 999.99,
      stockQuantity: 50,
    },
  });

  const tshirt = await prisma.product.upsert({
    where: { id: BigInt(2) },
    update: {
      name: 'Cotton T-Shirt',
      categoryId: clothingCategory.id,
      description: 'Comfortable cotton t-shirt',
      price: 29.99,
      stockQuantity: 100,
    },
    create: {
      name: 'Cotton T-Shirt',
      categoryId: clothingCategory.id,
      description: 'Comfortable cotton t-shirt',
      price: 29.99,
      stockQuantity: 100,
    },
  });

  const book = await prisma.product.upsert({
    where: { id: BigInt(3) },
    update: {
      name: 'Programming Guide',
      categoryId: booksCategory.id,
      description: 'Comprehensive programming guide',
      price: 45.50,
      stockQuantity: 75,
    },
    create: {
      name: 'Programming Guide',
      categoryId: booksCategory.id,
      description: 'Comprehensive programming guide',
      price: 45.50,
      stockQuantity: 75,
    },
  });

  const pendingStatus = await prisma.status.upsert({
    where: { name: 'Pending' },
    update: {
      type: OrderStatusType.PENDING,
      description: 'Order has been created but not processed',
      isFinal: false,
    },
    create: {
      name: 'Pending',
      type: OrderStatusType.PENDING,
      description: 'Order has been created but not processed',
      isFinal: false,
    },
  });

  const processingStatus = await prisma.status.upsert({
    where: { name: 'Processing' },
    update: {
      type: OrderStatusType.PROCESSING,
      description: 'Order is being processed',
      isFinal: false,
    },
    create: {
      name: 'Processing',
      type: OrderStatusType.PROCESSING,
      description: 'Order is being processed',
      isFinal: false,
    },
  });

  const shippedStatus = await prisma.status.upsert({
    where: { name: 'Shipped' },
    update: {
      type: OrderStatusType.SHIPPED,
      description: 'Order has been shipped',
      isFinal: false,
    },
    create: {
      name: 'Shipped',
      type: OrderStatusType.SHIPPED,
      description: 'Order has been shipped',
      isFinal: false,
    },
  });

  const deliveredStatus = await prisma.status.upsert({
    where: { name: 'Delivered' },
    update: {
      type: OrderStatusType.DELIVERED,
      description: 'Order has been delivered',
      isFinal: false,
    },
    create: {
      name: 'Delivered',
      type: OrderStatusType.DELIVERED,
      description: 'Order has been delivered',
      isFinal: false,
    },
  });

  const completedStatus = await prisma.status.upsert({
    where: { name: 'Completed' },
    update: {
      type: OrderStatusType.COMPLETED,
      description: 'Order has been completed',
      isFinal: true,
    },
    create: {
      name: 'Completed',
      type: OrderStatusType.COMPLETED,
      description: 'Order has been completed',
      isFinal: true,
    },
  });

  const canceledStatus = await prisma.status.upsert({
    where: { name: 'Canceled' },
    update: {
      type: OrderStatusType.CANCELED,
      description: 'Order has been canceled',
      isFinal: true,
    },
    create: {
      name: 'Canceled',
      type: OrderStatusType.CANCELED,
      description: 'Order has been canceled',
      isFinal: true,
    },
  });

  const refundedStatus = await prisma.status.upsert({
    where: { name: 'Refunded' },
    update: {
      type: OrderStatusType.REFUNDED,
      description: 'Order has been refunded',
      isFinal: true,
    },
    create: {
      name: 'Refunded',
      type: OrderStatusType.REFUNDED,
      description: 'Order has been refunded',
      isFinal: true,
    },
  });

  await prisma.status.update({
    where: { id: pendingStatus.id },
    data: { nextStatusId: processingStatus.id }
  });

  await prisma.status.update({
    where: { id: processingStatus.id },
    data: { nextStatusId: shippedStatus.id }
  });

  await prisma.status.update({
    where: { id: shippedStatus.id },
    data: { nextStatusId: deliveredStatus.id }
  });

  await prisma.status.update({
    where: { id: deliveredStatus.id },
    data: { nextStatusId: completedStatus.id }
  });

  // Seed Orders
  const order1 = await prisma.order.upsert({
    where: { id: BigInt(1) },
    update: {
      totalAmount: 1059.97,
      statusId: pendingStatus.id,
      userId: user1.id
    },
    create: {
      totalAmount: 1059.97,
      statusId: pendingStatus.id,
      userId: user1.id,
      orderProducts: {
        create: [
          {
            productId: smartphone.id,
            quantity: 1,
          },
          {
            productId: tshirt.id,
            quantity: 2,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.upsert({
    where: { id: BigInt(2) },
    update: {
      totalAmount: 91.00,
      statusId: processingStatus.id,
      userId: user1.id
    },
    create: {
      totalAmount: 91.00,
      statusId: processingStatus.id,
      userId: user1.id,
      orderProducts: {
        create: [
          {
            productId: book.id,
            quantity: 2,
          },
        ],
      },
    },
  });

  const order3 = await prisma.order.upsert({
    where: { id: BigInt(3) },
    update: {
      totalAmount: 999.99,
      statusId: completedStatus.id,
      userId: user2.id
    },
    create: {
      totalAmount: 999.99,
      statusId: completedStatus.id,
      userId: user2.id,
      orderProducts: {
        create: [
          {
            productId: smartphone.id,
            quantity: 1,
          },
        ],
      },
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding the database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });