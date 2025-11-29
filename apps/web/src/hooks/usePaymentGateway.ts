import API from "@/libs/api/client";
import { useQuery } from "@tanstack/react-query";

const usePaymentGateway = () => {
  const query = useQuery({
    queryKey: ["payment-gateway"],
    queryFn: async () => await API.payment.gateway.findAllActive(),
  });

  return {
    ...query,
    data: query.data?.data || [],
    defaultPaymentGateway: query.data?.data?.[0] || null,
  };
};

export default usePaymentGateway;
