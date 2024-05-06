import { format } from "date-fns"
import { desc, eq } from "drizzle-orm";

import { formatter } from '@/lib/utils';
import OrderClient from './components/client'
import { OrderColumn } from './components/columns';
import { db } from "@/server/db";
import { type OrderItems, orderItems, orders, products, stores } from "@/server/db/schema";

export default async function OrdersPage({ params }: { params: { storeId: string } }) {

  const ordersData = await db.select()
    .from(orders)
    .innerJoin(stores, eq(orders.storeId, stores.id))
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(stores.id, params.storeId))
    .orderBy(desc(orders.createdAt));

  const orderItemsMap = new Map<string, OrderItems[]>();

  for (const item of ordersData) {
    const orderId = item.orders.id;
    const orderItem = { ...item.order_items, products: item.products };

    if (!orderItemsMap.has(orderId)) {
      orderItemsMap.set(orderId, []);
    }

    orderItemsMap.get(orderId)!.push(orderItem);
  }

  const formattedOrders: OrderColumn[] = Array.from(orderItemsMap.keys()).map((orderId) => {
    const orderItems = orderItemsMap.get(orderId)!;
    const order = ordersData.find((item) => item.orders.id === orderId)!.orders;

    return {
      id: order.id,
      phone: order.phone ?? '',
      address: order.address ?? '',
      isPaid: order.isPaid ?? false,
      products: orderItems.map((orderItem: OrderItems) => orderItem.products.name).join(", "),
      totalPrice: formatter().format(orderItems.reduce((total, orderItem: OrderItems) => {
        return total + Number(orderItem.products.price);
      }, 0)),
      createdAt: format(order.createdAt ?? new Date(), "MMMM do, yyyy")
    };
  });

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}
