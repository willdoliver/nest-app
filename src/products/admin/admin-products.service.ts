import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductSlugAlreadyExistsError } from '../errors';
import { NotFoundError } from 'src/common/errors';

@Injectable()
export class AdminProductsService {
  constructor(private prismaService: PrismaService) {}
  create(createProductDto: CreateProductDto) {
    const productExists = this.prismaService.product.findFirst({
      where: {
        slug: createProductDto.slug,
      },
    });

    if (productExists) {
      throw new ProductSlugAlreadyExistsError(createProductDto.slug);
    }

    return this.prismaService.product.create({
      data: createProductDto,
    });
  }

  findAll() {
    return this.prismaService.product.findMany();
  }

  async findOne(id: string) {
    const product = await this.prismaService.product.findFirst({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundError('Product', id);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // check for update to an existing slug
    let product = await this.prismaService.product.findFirst({
      where: {
        slug: updateProductDto.slug,
      },
    });

    if (product && product.slug === updateProductDto.slug) {
      throw new ProductSlugAlreadyExistsError(updateProductDto.slug);
    }

    // find the correct product object
    product =
      product && product.id === id
        ? product
        : await this.prismaService.product.findFirst({
            where: {
              id,
            },
          });

    if (!product) {
      throw new NotFoundError('Product', id);
    }

    return this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    const product = await this.prismaService.product.findFirst({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundError('Product', id);
    }

    return await this.prismaService.product.delete({ where: { id } });
  }
}
