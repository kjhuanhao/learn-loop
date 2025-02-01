"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
  OnChangeFn,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  page: number
  pageSize: number
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  getData: () => void
  total?: number
  rowSelection?: RowSelectionState
  setRowSelection?: OnChangeFn<RowSelectionState>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  page,
  pageSize,
  setPage,
  setPageSize,
  getData,
  total = 0,
  rowSelection = {},
  setRowSelection,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  })

  const totalPages = Math.ceil(total / pageSize)
  const canPreviousPage = page > 1
  const canNextPage = page < totalPages

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
    setPage(1)
  }

  if (isLoading) {
    return (
      <div className="overflow-hidden bg-white">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="w-full">
            <Table>
              <TableHeader className="sticky top-0">
                <TableRow>
                  <TableHead className="w-[40px] bg-gray-50/80 h-12 px-4">
                    <Skeleton className="h-4 w-4" />
                  </TableHead>
                  {columns.map((column, index) => (
                    <TableHead
                      key={index}
                      className="bg-gray-50/80 h-12 px-4 text-xs font-medium text-gray-500 transition-colors"
                      style={{
                        width:
                          index === 0
                            ? "35%"
                            : index === columns.length - 1
                              ? "80px"
                              : "auto",
                      }}
                    >
                      <Skeleton className="h-4 w-[80px]" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow
                    key={index}
                    className="border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50"
                  >
                    <TableCell className="w-[40px] px-4">
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    {columns.map((_, cellIndex) => (
                      <TableCell
                        className="px-4 py-3"
                        key={cellIndex}
                        style={{
                          width:
                            cellIndex === 0
                              ? "35%"
                              : cellIndex === columns.length - 1
                                ? "80px"
                                : "auto",
                        }}
                      >
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8.6rem)] flex-col overflow-hidden border">
      <ScrollArea className="flex-1">
        <div className="w-full">
          <Table>
            <TableHeader className="sticky top-0 border-none">
              <TableRow>
                <TableHead className="w-[40px] px-4">
                  <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) =>
                      table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                    className="translate-y-[2px]"
                  />
                </TableHead>
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className="h-12 px-4 text-xs font-medium text-gray-500 transition-colors border-none"
                      style={{
                        width:
                          index === 0
                            ? "35%"
                            : index === columns.length - 1
                              ? "80px"
                              : "auto",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50"
                  >
                    <TableCell className="w-[40px] px-4">
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="translate-y-[2px]"
                      />
                    </TableCell>
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        className="px-4 py-3"
                        key={cell.id}
                        style={{
                          width:
                            index === 0
                              ? "35%"
                              : index === columns.length - 1
                                ? "80px"
                                : "auto",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-[200px] text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                      <svg
                        className="h-10 w-10 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="text-sm text-gray-500">
                        暂无数据，请先添加题目
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      <div className="flex items-center justify-between border-t bg-background px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div>每页显示</div>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div>条</div>
        </div>
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-2 text-sm">
            <div>第 {page} 页</div>
            <div className="text-muted-foreground">共 {totalPages} 页</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPage(page - 1)}
              disabled={!canPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPage(page + 1)}
              disabled={!canNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
