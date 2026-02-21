import { MantineThemeOverride } from "@mantine/core";
import Button from "./button";
import Card from "./card";
import Container from "./container";
import Modal from "./modal";

export const components = {
  Container,
  Modal,
  Card,
  Button,
} satisfies MantineThemeOverride["components"];
