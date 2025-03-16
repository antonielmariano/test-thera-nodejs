import { PrismaClient, User, Category, Status, Product } from '@prisma/client';
import { CategoriesEnum } from '../src/modules/categories/enums/categories.enum'
import { StatusEnum } from '../src/modules/status/enums/status.enum'
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  try {
    console.log('Populating users...');
    const users = await seedUsers();
    console.log(`✅ ${users.length} users created/updated successfully.`);

    console.log('Populating categories...');
    const categories = await seedCategories();
    console.log(`✅ ${categories.length} categories created/updated successfully.`);

    console.log('Populating products...');
    const products = await seedProducts();
    console.log(`✅ ${products.length} products created/updated successfully.`);

    console.log('Populating statuses...');
    const statuses = await seedStatuses();
    console.log(`✅ ${statuses.length} statuses created/updated successfully.`);

    console.log('Configuring status flow...');
    await setupStatusFlow();
    console.log('✅ Status flow configured successfully.');

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error during seed process:', error);
    throw error;
  }
}

/**
 * Creates a hashed password using bcrypt
 * @param plainPassword Password in plain text
 * @returns Hashed password
 */
async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(plainPassword, saltRounds);
}

/**
 * Creates or updates users in the database
 * @returns Array of created/updated users
 */
async function seedUsers(): Promise<User[]> {
  const usersData = [
    {
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'admin123',
      isAdmin: true,
    },
    {
      email: 'user1@example.com',
      name: 'User One',
      password: 'password123',
      isAdmin: false,
    },
    {
      email: 'user2@example.com',
      name: 'User Two',
      password: 'password456',
      isAdmin: false,
    },
  ];

  const users: User[] = [];

  for (const userData of usersData) {
    const hashedPassword = await hashPassword(userData.password);

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      const updateData: any = {
        name: userData.name,
        isAdmin: userData.isAdmin,
      };
      
      const user = await prisma.user.update({
        where: { email: userData.email },
        data: updateData,
      });
      users.push(user);
    } else {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          isAdmin: userData.isAdmin,
        },
      });
      users.push(user);
    }
  }

  return users;
}

/**
 * Creates or updates categories in the database
 * @returns Array of created/updated categories
 */
async function seedCategories(): Promise<Category[]> {
  const categories: Category[] = [];
  
  for (const [categoryName, categoryId] of Object.entries(CategoriesEnum)) {
    if (!isNaN(Number(categoryName))) continue;
    
    const category = await prisma.category.upsert({
      where: { id: categoryId as number },
      update: {
        name: categoryName,
      },
      create: {
        id: categoryId as number,
        name: categoryName,
      },
    });
    categories.push(category);
  }

  return categories;
}

/**
 * Creates or updates products in the database
 * @returns Array of created/updated products
 */
async function seedProducts(): Promise<Product[]> {
  // Define products with their respective category IDs
  const productsData = [
    // Electronics products
    {
      name: 'Smartphone X Pro',
      description: 'Latest smartphone with advanced camera and long battery life',
      price: 999.99,
      stockQuantity: 100,
      categoryId: CategoriesEnum.ELECTRONICS
    },
    {
      name: 'Laptop Ultra',
      description: 'Lightweight laptop with high performance for professionals',
      price: 1499.99,
      stockQuantity: 50,
      categoryId: CategoriesEnum.ELECTRONICS
    },
    // Clothing products
    {
      name: 'Premium Cotton T-Shirt',
      description: 'Comfortable everyday t-shirt made from organic cotton',
      price: 29.99,
      stockQuantity: 200,
      categoryId: CategoriesEnum.CLOTHING
    },
    {
      name: 'Winter Jacket',
      description: 'Warm and waterproof jacket perfect for cold weather',
      price: 149.99,
      stockQuantity: 75,
      categoryId: CategoriesEnum.CLOTHING
    },
    // Books products
    {
      name: 'Programming Guide 2023',
      description: 'Comprehensive guide to modern programming techniques',
      price: 49.99,
      stockQuantity: 120,
      categoryId: CategoriesEnum.BOOKS
    },
    {
      name: 'Business Strategy Masterclass',
      description: 'Learn effective business strategies from industry experts',
      price: 39.99,
      stockQuantity: 90,
      categoryId: CategoriesEnum.BOOKS
    }
  ];

  const products: Product[] = [];

  for (const productData of productsData) {
    // Check if product already exists by name
    const existingProduct = await prisma.product.findFirst({
      where: { name: productData.name }
    });

    if (existingProduct) {
      // Update existing product
      const product = await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          description: productData.description,
          price: productData.price,
          stockQuantity: productData.stockQuantity,
          categoryId: productData.categoryId
        }
      });
      products.push(product);
    } else {
      // Create new product
      const product = await prisma.product.create({
        data: productData
      });
      products.push(product);
    }
  }

  return products;
}

/**
 * Creates or updates statuses in the database
 * @returns Array of created/updated statuses
 */
async function seedStatuses(): Promise<Status[]> {
  const statuses: Status[] = [];
  
  const statusDescriptions = {
    [StatusEnum.PENDING]: 'Order has been created but not processed',
    [StatusEnum.PROCESSING]: 'Order is being processed',
    [StatusEnum.SHIPPED]: 'Order has been shipped',
    [StatusEnum.DELIVERED]: 'Order has been delivered',
    [StatusEnum.COMPLETED]: 'Order has been completed',
    [StatusEnum.CANCELED]: 'Order has been canceled',
    [StatusEnum.REFUNDED]: 'Order has been refunded',
  };
  
  const finalStatuses = [
    StatusEnum.COMPLETED,
    StatusEnum.CANCELED,
    StatusEnum.REFUNDED
  ];

  for (const [statusName, statusId] of Object.entries(StatusEnum)) {
    if (!isNaN(Number(statusName))) continue;
    
    const status = await prisma.status.upsert({
      where: { id: statusId as number },
      update: {
        name: statusName,
        description: statusDescriptions[statusId as number],
        isFinal: finalStatuses.includes(statusId as number),
      },
      create: {
        id: statusId as number,
        name: statusName,
        description: statusDescriptions[statusId as number],
        isFinal: finalStatuses.includes(statusId as number),
      },
    });
    statuses.push(status);
  }

  return statuses;
}

/**
 * Sets up the order status flow by configuring the nextStatusId relationships
 */
async function setupStatusFlow() {
  const statusFlow = [
    { current: StatusEnum.PENDING, next: StatusEnum.PROCESSING },
    { current: StatusEnum.PROCESSING, next: StatusEnum.SHIPPED },
    { current: StatusEnum.SHIPPED, next: StatusEnum.DELIVERED },
    { current: StatusEnum.DELIVERED, next: StatusEnum.COMPLETED },
  ];

  for (const flow of statusFlow) {
    await prisma.status.update({
      where: { id: flow.current },
      data: { nextStatusId: flow.next }
    });
  }
}

// Script execution
main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });