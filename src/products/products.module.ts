import { Module, OnModuleInit } from '@nestjs/common';
import { AdminProductsService } from './admin/admin-products.service';
import { AdminProductsController } from './admin/admin-products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsController } from './public/products.controller';
import { ProductsService } from './public/products.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminProductsController, ProductsController],
  providers: [AdminProductsService, ProductsService],
})
export class ProductsModule implements OnModuleInit {
  constructor(
    private prismaService: PrismaService,
    private productsService: AdminProductsService,
  ) {}
  async onModuleInit() {
    const products = new Array(10).fill(0).map((_, index) => index + 1);
    // console.log(products);
    // delete all products
    const deleted = await this.prismaService.product.deleteMany();
    // console.log('deleted: ', deleted);

    // create products again
    for (const productIndex of products) {
      // console.log({
      //   name: `Product ${productIndex}`,
      //   slug: `product-${productIndex}`,
      //   description: `Product ${productIndex} description`,
      //   price: productIndex * 100,
      // });
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
