"use client";
import { AppShell, Grid, Stack } from "@pawpal/ui/core";
import TransactionActionFooter from "./components/TransactionActionFooter";
import TransactionAssignedCard from "./components/TransactionAssignedCard";
import TransactionDetailCard from "./components/TransactionDetailCard";
import TransactionFinancialCard from "./components/TransactionFinancialCard";

export default function TransactionDetailPage() {
  return (
    <AppShell padding="md">
      <AppShell.Main p={0}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack>
              <TransactionAssignedCard />
              <TransactionFinancialCard />
              <TransactionDetailCard />
            </Stack>
          </Grid.Col>
        </Grid>
      </AppShell.Main>
      <AppShell.Footer
        px={{
          lg: "3xl",
        }}
      >
        <TransactionActionFooter />
      </AppShell.Footer>
    </AppShell>
  );
}
