import API from "@/libs/api/client";
import { useQuery } from "@tanstack/react-query";

const usePaymentGateway = (paymentGatewayId: string) => {
  return useQuery({
    queryKey: ["paymentGateway", paymentGatewayId],
    queryFn: () => API.paymentGateway.getGateway(paymentGatewayId),
  });
};

export default usePaymentGateway;
