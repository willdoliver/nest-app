import { Module, OnModuleInit } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule implements OnModuleInit {
  constructor(
    private prismaService: PrismaService,
    private productsService: ProductsService,
  ) {}
  async onModuleInit() {
    const products = new Array(10).fill(0).map((_, index) => index + 1);
    console.log(products);
    // delete all products
    const deleted = await this.prismaService.product.deleteMany();
    console.log('deleted: ', deleted);

    // create products again
    for (const productIndex of products) {
      console.log({
        name: `Product ${productIndex}`,
        slug: `product-${productIndex}`,
        description: `Product ${productIndex} description`,
        price: productIndex * 100,
      });
      await this.prismaService.product.create({
        data: {
          name: `Product ${productIndex}`,
          slug: `product-${productIndex}`,
          description: `Product ${productIndex} description`,
          price: productIndex * 100,
        },
      });
    }
  }
}
