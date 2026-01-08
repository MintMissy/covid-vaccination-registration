/**
 * Base Repository Interface
 *
 * This interface defines the common CRUD operations that all repositories should implement.
 * It provides a consistent contract for data access operations across the application.
 */
export interface IRepository<T, CreateDto, UpdateDto> {
  create(data: CreateDto): Promise<T>;
  findById(id: string | number): Promise<T | null>;
  findAll(options?: FindAllOptions): Promise<PaginatedResult<T>>;
  update(id: string | number, data: UpdateDto): Promise<T>;
  delete(id: string | number): Promise<void>;
}

export interface FindAllOptions {
  page?: number;
  limit?: number;
  where?: any;
  orderBy?: any;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
