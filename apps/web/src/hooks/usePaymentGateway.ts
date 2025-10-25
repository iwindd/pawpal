import API from "@/libs/api/client";
import { useQuery } from "@tanstack/react-query";

const usePaymentGateway = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["payment-gateway"],
    queryFn: async () => await API.paymentGateway.findAllActive(),
  });

  return {
    data: data?.data,
    isLoading,
  };
};

export default usePaymentGateway;
