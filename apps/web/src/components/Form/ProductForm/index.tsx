"use client";
import PurchaseConfirmationModal from "@/components/Modals/PurchaseConfirmationModal";
import useFormValidate from "@/hooks/useFormValidate";
import {
  buildFieldSchema,
  defaultPaymentMethod,
  ENUM_DISCOUNT_TYPE,
  ProductPackage,
  ProductResponse,
  PurchaseInput,
  purchaseSchema,
} from "@pawpal/shared";
import { Button, Grid, Stack } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import AmountPartial from "./partials/AmountPartial";
import CodePartial from "./partials/CodePartial";
import FieldPartial from "./partials/FieldPartial";
import InfoPartial from "./partials/InfoPartial";
import PackagePartial from "./partials/PackagePartial";
import PaymentPartial from "./partials/PaymentPartial";

export type PurchaseFormInput = Omit<PurchaseInput, "fields"> & {
  fields: Record<string, any>;
};

interface ProductFormProps {
  product: ProductResponse;
  onPurchase: (values: PurchaseInput) => void;
  isLoading: boolean;
}

const ProductForm = ({ product, onPurchase, isLoading }: ProductFormProps) => {
  const [showConfirmationModal, { open, close }] = useDisclosure(false);
  const __ = useTranslations("ProductDetail");
  const fieldSchema = useRef(buildFieldSchema(product.fields));
  const [selectedPackage, setSelectedPackage] = useState<ProductPackage>(
    product.packages[0] as ProductPackage
  );
  const schema = useRef(
    purchaseSchema.extend({
      fields: fieldSchema.current.schema,
    })
  );

  const form = useFormValidate<PurchaseFormInput>({
    schema: schema.current,
    group: "purchase",
    mode: "uncontrolled",
    initialValues: {
      packageId: selectedPackage.id,
      amount: 1,
      paymentMethod: defaultPaymentMethod,
      fields: fieldSchema.current.default,
      includeWalletBalance: false,
    },
    onValuesChange: (values) => {
      const pkg = product.packages.find((p) => p.id === values.packageId);
      if (pkg) setSelectedPackage(pkg);
    },
  });

  const [submittedValues, setSubmittedValues] =
    useState<PurchaseFormInput | null>(null);

  const handlePurchase = () => {
    onPurchase(submittedValues as PurchaseInput);
    close();
  };

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          setSubmittedValues(values);
          open();
        })}
      >
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12 }}>
            <InfoPartial product={product} />
          </Grid.Col>

          <Grid.Col span={{ base: 8 }}>
            <PackagePartial product={product} form={form} />
          </Grid.Col>

          <Grid.Col span={{ base: 4 }}>
            <Stack gap="lg">
              <FieldPartial fields={product.fields} form={form} />
              <AmountPartial form={form} />
              <CodePartial />
              <PaymentPartial form={form} selectedPackage={selectedPackage} />

              {/* Purchase Button */}
              <Button size="lg" fullWidth type="submit">
                {__("purchase")}
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </form>

      <PurchaseConfirmationModal
        opened={showConfirmationModal}
        onConfirm={handlePurchase}
        onClose={close}
        loading={isLoading}
        title={product.name}
        package={selectedPackage?.name || ""}
        amount={submittedValues?.amount || 0}
        price={(selectedPackage?.price || 0) * (submittedValues?.amount || 0)}
        paymentMethod={submittedValues?.paymentMethod}
        includeWalletBalance={submittedValues?.includeWalletBalance}
        fields={
          product.fields.map((field) => ({
            label: field.label,
            value: submittedValues?.fields[field.id] || "",
          })) || []
        }
        sale={
          selectedPackage?.sale && {
            type: ENUM_DISCOUNT_TYPE.PERCENT,
            value: selectedPackage.sale.percent,
          }
        }
      />
    </>
  );
};

export default ProductForm;
