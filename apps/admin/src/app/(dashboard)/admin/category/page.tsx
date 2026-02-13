"use client";

import PageHeader from "@/components/Pages/PageHeader";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/features/category/categoryApi";
import { CategoryForm } from "@/features/category/components/CategoryForm";

import { IconEdit, IconTrash } from "@pawpal/icons";
import {
  CategoryInput,
  CategoryResponse,
  CategoryUpdateInput,
} from "@pawpal/shared";
import {
  ActionIcon,
  Button,
  DataTable,
  Group,
  Modal,
  Stack,
} from "@pawpal/ui/core";
import { useConfirmation, useDisclosure } from "@pawpal/ui/hooks";
import { Notifications } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function CategoryPage() {
  const t = useTranslations("Category");
  const tDatatable = useTranslations("Datatable");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isFetching } = useGetCategoriesQuery({
    page,
    limit,
    search,
  });

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryResponse | null>(null);
  const { confirmation } = useConfirmation();

  const handleCreate = () => {
    setSelectedCategory(null);
    open();
  };

  const handleEdit = (category: CategoryResponse) => {
    setSelectedCategory(category);
    open();
  };

  const handleDelete = (id: string) =>
    confirmation(
      async () => {
        const res = await deleteCategory(id);
        if (!res.error) {
          Notifications.show({
            color: "green",
            message: t("notify.deleted.message"),
          });
        }
      },
      {
        title: t("confirmation.delete.title"),
        message: t("confirmation.delete.message"),
      },
    );

  const handleSubmit = async (values: CategoryInput | CategoryUpdateInput) => {
    if (selectedCategory) {
      const res = await updateCategory({
        id: selectedCategory.id,
        body: values as CategoryUpdateInput,
      });
      if (!res.error) {
        Notifications.show({
          color: "green",
          message: t("notify.updated.message"),
        });
        close();
      }
    } else {
      const res = await createCategory(values as CategoryInput);
      if (!res.error) {
        Notifications.show({
          color: "green",
          message: t("notify.created.message"),
        });
        close();
      }
    }
  };

  return (
    <Stack>
      <PageHeader title={t("main.title")} />

      <Group justify="flex-end">
        <Button onClick={handleCreate}>{t("main.create")}</Button>
      </Group>

      <DataTable
        withTableBorder
        borderRadius="sm"
        striped
        highlightOnHover
        records={data?.data || []}
        columns={[
          {
            accessor: "name",
            title: tDatatable("category.name"),
          },
          { accessor: "slug", title: tDatatable("category.slug") },
          {
            accessor: "actions",
            title: tDatatable("category.actions"),
            width: 100,
            render: (record: CategoryResponse) => (
              <Group gap="xs">
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  onClick={() => handleEdit(record)}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => handleDelete(record.id)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ),
          },
        ]}
        totalRecords={data?.total || 0}
        recordsPerPage={limit}
        page={page}
        onPageChange={setPage}
        onRecordsPerPageChange={setLimit}
        recordsPerPageOptions={[10, 20, 50]}
        minHeight={200}
        fetching={isFetching}
      />

      <Modal
        opened={opened}
        onClose={close}
        title={selectedCategory ? t("main.edit") : t("main.create")}
      >
        <CategoryForm
          initialValues={selectedCategory || undefined}
          onSubmit={handleSubmit}
          isLoading={isCreating || isUpdating}
          isEdit={!!selectedCategory}
        />
      </Modal>
    </Stack>
  );
}
