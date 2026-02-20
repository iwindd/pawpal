/**
 * Enum of all available permissions in the system.
 * Maps to the `permissions` table `name` column.
 */
export enum PermissionEnum {
  /** Superadmin wildcard — bypasses all permission checks */
  Wildcard = "*.*",

  OrderManagement = "Order.Management",
  ProductManagement = "Product.Management",
  TagManagement = "Tag.Management",
  CategoryManagement = "Category.Management",
  CustomerManagement = "Customer.Management",
  EmployeeManagement = "Employee.Management",
  RoleManagement = "Role.Management",
  CarouselManagement = "Carousel.Management",
  PaymentGatewayManagement = "PaymentGateway.Management",
  ResourceManagement = "Resource.Management",
}
