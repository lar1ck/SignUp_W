import { useEffect, useId, useMemo, useRef, useState } from "react"
import AddProductDialog from "./addProductDialog"
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  // Columns3Icon,
  EllipsisIcon,
  // FilterIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react"
import axios from 'axios'
import { cn } from "../lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "./ui/pagination"
import {
  Popover,
  PopoverContent,
  // PopoverTrigger,
} from "./ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import EditProductDialog from "./editProductDialog"

interface Product {
  id: number;
  name: string;
  image_url: string;
  category: string;
  price: number;
  quantity: number;
  expiration_date: string | null;
  date_added: string;
  date_modified: string;
}

const multiColumnFilterFn: FilterFn<Product> = (row, _, filterValue) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.category}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

const categoryFilterFn: FilterFn<Product> = (
  row,
  _,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true
  const category = row.getValue("category") as string
  return filterValue.includes(category)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Product",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <img
          src={row.original.image_url}
          alt={row.original.name}
          className="h-10 w-10 rounded-md object-cover"
        />
        <div className="font-medium">{row.getValue("name")}</div>
      </div>
    ),
    size: 200,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Category",
    accessorKey: "category",
    size: 120,
    filterFn: categoryFilterFn,
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return formatted
    },
    size: 100,
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
    size: 80,
  },
  {
    header: "Expiration",
    accessorKey: "expiration_date",
    cell: ({ row }) => (
      <div>
        {row.original.expiration_date
          ? formatDate(row.original.expiration_date)
          : "N/A"}
      </div>
    ),
    size: 120,
  },
  {
    header: "Last Updated",
    accessorKey: "date_modified",
    cell: ({ row }) => (
      <div className="text-sm">
        {formatDate(row.original.date_modified)}
        <br />
        <span className="text-muted-foreground">
          {formatTime(row.original.date_modified)}
        </span>
      </div>
    ),
    size: 150,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
]

export default function ProductTable() {
  const id = useId()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [data, setData] = useState<Product[]>([])
  const token = localStorage.getItem('token')
  const [isAddOpen, setIsAddOpen] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("http://localhost:5000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })
        setData(response.data)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchProducts()
  }, [token])

  const handleDeleteRows = async () => {
    const selectedRows = table.getSelectedRowModel().rows
    const selectedIds = selectedRows.map(row => row.original.id)

    try {
      await Promise.all(selectedIds.map(id =>
        axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ))

      const updatedData = data.filter(
        (item) => !selectedIds.includes(item.id)
      )
      setData(updatedData)
      table.resetRowSelection()
    } catch (error) {
      console.error("Error deleting products:", error)
    }
  }

  // const handleEditProduct = async (updatedProduct: Product) => {
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:5000/api/products/${updatedProduct.id}`,
  //       updatedProduct,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     )
  //     setData(data.map(product =>
  //       product.id === updatedProduct.id ? response.data : product
  //     ))
  //   } catch (error) {
  //     console.error("Error updating product:", error)
  //   }
  // }

  const handleAddProduct = async (newProduct: Omit<Product, 'id' | 'date_added' | 'date_modified'>) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/products",
        newProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      setData([response.data, ...data])
    } catch (error) {
      console.error("Error creating product:", error)
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  })

  const categoryColumn = table.getColumn("category")
  const uniqueCategoryValues = useMemo(() => {
    if (!categoryColumn) return []
    return Array.from(categoryColumn.getFacetedUniqueValues().keys()).sort()
  }, [categoryColumn])

  const categoryCounts = useMemo(() => {
    if (!categoryColumn) return new Map()
    return categoryColumn.getFacetedUniqueValues()
  }, [categoryColumn])

  const selectedCategories = useMemo(() => {
    const filterValue = categoryColumn?.getFilterValue() as string[]
    return filterValue ?? []
  }, [categoryColumn])

  const handleCategoryChange = (checked: boolean, value: string) => {
    const filterValue = categoryColumn?.getFilterValue() as string[]
    const newFilterValue = filterValue ? [...filterValue] : []

    if (checked) {
      newFilterValue.push(value)
    } else {
      const index = newFilterValue.indexOf(value)
      if (index > -1) {
        newFilterValue.splice(index, 1)
      }
    }

    categoryColumn?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
  }

  return (
    <div className="space-y-4">
      <AddProductDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSave={handleAddProduct}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer min-w-60 ps-9",
                Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9"
              )}
              value={
                (table.getColumn("name")?.getFilterValue() ?? "") as string
              }
              onChange={(e) =>
                table.getColumn("name")?.setFilterValue(e.target.value)
              }
              placeholder="Filter by name or category..."
              type="text"
              aria-label="Filter by name or category"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("name")?.getFilterValue()) && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn("name")?.setFilterValue("")
                  if (inputRef.current) {
                    inputRef.current.focus()
                  }
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          <Popover>
            {/* <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Category
                {selectedCategories.length > 0 && (
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {selectedCategories.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger> */}
            <PopoverContent className="w-auto min-w-36 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  Filters
                </div>
                <div className="space-y-3">
                  {uniqueCategoryValues.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-${i}`}
                        checked={selectedCategories.includes(value)}
                        onCheckedChange={(checked: boolean) =>
                          handleCategoryChange(checked, value)
                        }
                      />
                      <Label
                        htmlFor={`${id}-${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        {value}{" "}
                        <span className="text-muted-foreground ms-2 text-xs">
                          {categoryCounts.get(value)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            {/* <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                View
              </Button>
            </DropdownMenuTrigger> */}
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    onSelect={(event) => event.preventDefault()}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3">
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <TrashIcon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Delete
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border">
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "product"
                        : "products"}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            className="ml-auto"
            variant="outline"
            onClick={() => setIsAddOpen(true)}
          >
            <PlusIcon
              className="-ms-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Add product
          </Button>
        </div>
      </div>

      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    className="h-11"
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className="flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          if ((e.key === "Enter" || e.key === " ")) {
                            e.preventDefault()
                            header.column.getToggleSortingHandler()?.(e)
                          }
                        }}
                        tabIndex={0}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} />,
                          desc: <ChevronDownIcon className="shrink-0 opacity-60" size={16} />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="last:py-0">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p className="text-sm whitespace-nowrap" aria-live="polite">
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                table.getState().pagination.pageSize,
                table.getRowCount()
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getRowCount()}
            </span>
          </p>
        </div>

        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronFirstIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeftIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRightIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronLastIcon size={16} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

function RowActions({ row }: { row: Row<Product> }) {
  const token = localStorage.getItem('token')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [originalProduct, setOriginalProduct] = useState(row.original)

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${row.original.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleEdit = async (updatedProduct: Product) => {
    try {
      const payload = {
        ...updatedProduct,
        // Preserve original image URL if not changed
        image_url: updatedProduct.image_url.startsWith('blob:')
          ? originalProduct.image_url
          : updatedProduct.image_url
      }

      const response = await axios.put(
        `http://localhost:5000/api/products/${updatedProduct.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      // Update local state with the response data
      setOriginalProduct(response.data)
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none"
              aria-label="Open actions menu"
            >
              <EllipsisIcon size={16} />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
              <span>Edit</span>
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={handleDelete}
          >
            <span>Delete</span>
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProductDialog
        product={originalProduct}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={(updatedProduct) => {
          handleEdit(updatedProduct)
          setIsEditOpen(false)
        }}
      />
    </>
  )
}