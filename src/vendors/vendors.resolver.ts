import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VendorsService } from './vendors.service';
import { Vendor } from './models/vendor.model';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/models/user.model';
import { AddDeliveryAreasInput } from './dto/add-delivery-areas.input';
import { VendorView } from './vendors.module';

@Resolver(() => Vendor)
export class VendorsResolver {
  constructor(private vendorsService: VendorsService) {}

  @Query(() => [Vendor])
  async getVendors(): Promise<Vendor[]> {
    return this.vendorsService.getVendors();
  }

  @Query(() => Vendor)
  async getVendor(@Args('id') id: string): Promise<Vendor> {
    return await this.vendorsService.getVendor(id);
  }

  @Query(() => Vendor)
  getVendorBySlug(@Args('slug') slug: string) {
    return this.vendorsService.getVendorBySlug(slug);
  }

  @Query(() => VendorView)
  getVendorView(@Args('vendorId') vendorId: string): Promise<VendorView> {
    return this.vendorsService.getVendorView(vendorId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Vendor)
  async createVendor(
    @UserEntity() user: User,
    @Args('data') data: CreateVendorInput
  ): Promise<Vendor> {
    return await this.vendorsService.createVendor(data, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Vendor)
  async updateVendor(
    @Args('id') id: string,
    @Args('data') data: UpdateVendorInput
  ): Promise<Vendor> {
    return await this.vendorsService.updateVendor(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Vendor)
  async deleteVendor(@Args('id') id: string): Promise<Vendor> {
    return await this.vendorsService.deleteVendor(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Vendor)
  async addDeliveryAreas(
    @Args('id') id: string,
    @Args('areas', { type: () => [AddDeliveryAreasInput] })
    areas: AddDeliveryAreasInput[]
  ): Promise<Vendor> {
    return await this.vendorsService.addDeliveryAreas(id, areas);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Boolean)
  async isVendorSlugAvailable(@Args('slug') slug: string) {
    try {
      await this.getVendorBySlug(slug);
      return false;
    } catch (error) {
      return true;
    }
  }
}
