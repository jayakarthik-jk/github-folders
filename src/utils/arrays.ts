import type { ContainerChildProps } from "@/components/common/Container";

export const filter = <T extends ContainerChildProps>(
  components: T[],
  searchQuery: string
): T[] => {
  const filteredComponents = components.filter((component) =>
    new RegExp(searchQuery, "i").test(component.title)
  );
  return filteredComponents;
};

export const sort = <T extends ContainerChildProps>(
  components: T[],
  sortOrder: SortOptions = "asc"
): T[] => {
  const direction = sortOrder === "asc" ? 1 : -1;
  return components.sort((a, b) => (a.title < b.title ? -1 : 1) * direction);
};

export const paginate = <T extends ContainerChildProps>(
  components: T[],
  currentPage = 1,
  pageSize = 30
): T[] => {
  const paginatedComponents = [...components];
  if (components.length > pageSize) {
    const start = (currentPage - 1) * pageSize;
    paginatedComponents.splice(0, start);
    paginatedComponents.splice(pageSize, paginatedComponents.length - pageSize);
  }
  return paginatedComponents;
};
