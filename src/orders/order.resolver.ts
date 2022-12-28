import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { Cart } from 'src/cart/models/cart.model';
import { CartService } from 'src/cart/cart.service';
import { Vendor } from 'src/vendors/models/vendor.model';
import { VendorsService } from 'src/vendors/vendors.service';
import { UpdateOrderInput } from './dto/update-order.input';
import { Order } from './models/order.model';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { OrdersService } from './orders.service';
import { SortOrder } from 'src/common/sort-order/sort-order.input';
import { OrdersFilterInput } from 'src/common/filter/filter.input';
import { PaginatedOrders } from './models/paginated-orders.model';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly vendorService: VendorsService,
    private readonly cartService: CartService
  ) {}

  @Query(() => Order)
  getOrder(@Args('id') id: string) {
    return this.ordersService.getOrder(id);
  }

  @Query(() => PaginatedOrders)
  async getOrders(
    @Args('vendorId', { nullable: true }) vendorId: string,
    @Args('pagination', { nullable: true }) pg?: PaginationArgs,
    @Args('sortOrder', { nullable: true }) sortOrder?: SortOrder,
    @Args('filter', { nullable: true }) filter?: OrdersFilterInput
  ): Promise<PaginatedOrders> {
    return await this.ordersService.getOrders(vendorId, pg, sortOrder, filter);
  }

  @Mutation(() => Order)
  updateOrder(@Args('id') id: string, @Args('data') data: UpdateOrderInput) {
    return this.ordersService.updateOrder(id, data);
  }

  @Mutation(() => Order)
  deleteOrder(@Args('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }

  @ResolveField('vendor')
  vendor(@Parent() order: Order): Promise<Vendor> {
    return this.vendorService.getVendor(order.vendorId);
  }
  @ResolveField('cart')
  cart(@Parent() order: Order): Promise<Cart> {
    return this.cartService.getCart(order.cartId);
  }
}
