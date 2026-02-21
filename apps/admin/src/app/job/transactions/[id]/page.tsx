"use client";
import { Grid, Stack } from "@pawpal/ui/core";
import TransactionAssignedCard from "./components/TransactionAssignedCard";
import TransactionDetailCard from "./components/TransactionDetailCard";
import TransactionFinancialCard from "./components/TransactionFinancialCard";

export default function TransactionDetailPage() {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Stack>
          <TransactionAssignedCard />
          <TransactionFinancialCard />
          <TransactionDetailCard />
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
