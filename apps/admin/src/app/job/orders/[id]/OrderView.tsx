import { AdminOrderResponse } from "@pawpal/shared";
import { Paper } from "@pawpal/ui/core";

interface OrderViewProps {
  order: AdminOrderResponse;
}

const OrderView = ({ order }: OrderViewProps) => {
  return <Paper>{JSON.stringify(order)}</Paper>;
};

export default OrderView;
