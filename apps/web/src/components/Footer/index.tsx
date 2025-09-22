"use client";
import { Container, Grid, Group, Stack, Text, Title } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import classes from "./style.module.css";

const Footer = () => {
  const __ = useTranslations("Footer");

  return (
    <footer className={classes.footer}>
      <Container size="xl" className={classes.inner}>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="md">
              <Title order={5}>{__("quickLinks")}</Title>
              <Stack gap="xs">
                <Link href="/" className={classes.footerLink}>
                  {__("quickLinksLinks.home")}
                </Link>
                <Link href="/products" className={classes.footerLink}>
                  {__("quickLinksLinks.products")}
                </Link>
                <Link href="/topup" className={classes.footerLink}>
                  {__("quickLinksLinks.topup")}
                </Link>
                <Link href="/help" className={classes.footerLink}>
                  {__("quickLinksLinks.help")}
                </Link>
              </Stack>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="md">
              <Title order={5}>{__("customerService")}</Title>
              <Stack gap="xs">
                <Link href="/contact" className={classes.footerLink}>
                  {__("customerServiceLinks.contactUs")}
                </Link>
                <Link href="/faq" className={classes.footerLink}>
                  {__("customerServiceLinks.faq")}
                </Link>
              </Stack>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="md">
              <Title order={5}>{__("legal")}</Title>
              <Stack gap="xs">
                <Link href="/privacy-policy" className={classes.footerLink}>
                  {__("legalLinks.privacyPolicy")}
                </Link>
                <Link href="/terms-of-service" className={classes.footerLink}>
                  {__("legalLinks.termsOfService")}
                </Link>
                <Link href="/cookie-policy" className={classes.footerLink}>
                  {__("legalLinks.cookiePolicy")}
                </Link>
              </Stack>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="md">
              <Title order={5}>{__("followUs")}</Title>
              <Stack gap="xs">
                <Link href="/privacy" className={classes.footerLink}>
                  {__("followUsLinks.facebook")}
                </Link>
                <Link href="/terms" className={classes.footerLink}>
                  {__("followUsLinks.line")}
                </Link>
              </Stack>
            </Stack>
          </Grid.Col>
        </Grid>

        <div className={classes.bottomSection}>
          <Text size="sm" c="dimmed">
            {__("copyright")}
          </Text>
          <Group gap="md">
            <Link href="#" className={classes.bottomLink}>
              {__("privacyPolicy")}
            </Link>
            <Link href="#" className={classes.bottomLink}>
              {__("termsOfService")}
            </Link>
          </Group>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
