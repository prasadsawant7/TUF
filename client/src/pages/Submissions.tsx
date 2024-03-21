import { useEffect, useState } from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Submission } from "@/@types/submission";
import { formatISODate } from "@/lib/date";
import { getLanguage } from "@/lib/code";
import { languageOptions } from "@/components/custom/form";
import { decode } from "js-base64";
import axios from "axios";

const columns: ColumnDef<Submission>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("username")}</div>
    ),
  },
  {
    accessorKey: "language_id",
    header: "Language",
    cell: ({ row }) => {
      const lang_id = row.getValue("language_id");
      if (lang_id) {
        const language = getLanguage(languageOptions, lang_id.toString());

        return <div className="capitalize">{language}</div>;
      }
      return <div className="capitalize">NA</div>;
    },
  },
  {
    accessorKey: "source_code",
    header: () => <div>Source Code</div>,
    cell: ({ row }) => {
      const decodedSourceCode = decode(row.getValue("source_code"));

      return <div>{decodedSourceCode.slice(0, 101)}</div>;
    },
  },
  {
    accessorKey: "stdin",
    header: "Input",
    cell: ({ row }) => {
      const decodedInput = decode(row.getValue("stdin"));
      return <div>{decodedInput}</div>;
    },
  },
  {
    accessorKey: "stdout",
    header: "Output",
    cell: ({ row }) => {
      if (row.getValue("stdout")) {
        const decodedOutput = decode(row.getValue("stdout"));
        return <div>{decodedOutput}</div>;
      }
      return <div>NA</div>;
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      if (row.getValue("time")) {
        return <div>{row.getValue("time")}</div>;
      }
      return <div>NA</div>;
    },
  },
  {
    accessorKey: "memory",
    header: "Memory",
    cell: ({ row }) => {
      const memory = row.getValue("memory");
      if (memory) {
        return <div>{memory?.toString()}</div>;
      }
      return <div>NA</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <div>{row.getValue("status")}</div>;
    },
  },
  {
    accessorKey: "submitted_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-base hover:bg-leetcode-card hover:text-leetcode-table-fg-head"
        >
          Submission Time
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formattedDate = formatISODate(row.getValue("submitted_at"));
      return <div>{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const submission = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open Menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(submission.id)}
            >
              Copy Submission ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Submission</DropdownMenuItem>
            <DropdownMenuItem>Delete Submission</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function Submissions() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Submission[]>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios(
          `${import.meta.env.VITE_SERVER_URL}/submissions`
        );

        if (response.status === 200) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <div className="flex items-center py-6">
        <Input
          placeholder="Filter usernames..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm rounded-md border-0 bg-leetcode-card"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="ml-auto bg-leetcode-card hover:bg-leetcode-nav"
            >
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="rounded-md border-0 bg-leetcode-card text-leetcode-fg"
            align="end"
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    className="cursor-pointer capitalize"
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "language_id"
                      ? "Language"
                      : column.id === "submitted_at"
                        ? "Submission Time"
                        : column.id === "source_code"
                          ? "Source Code"
                          : column.id === "stdin"
                            ? "Input"
                            : column.id === "stdout"
                              ? "Output"
                              : column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border-0">
        <Table className="rounded-md">
          <TableHeader className="rounded-md bg-leetcode-table-bg-1 text-leetcode-table-fg-head">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b-[1px] hover:bg-leetcode-table-bg-1"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="py-2 text-base"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="border-0">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    index % 2 === 0
                      ? "border-none bg-leetcode-table-bg-2 text-base text-leetcode-table-fg-body hover:bg-leetcode-table-bg-2"
                      : "border-none bg-leetcode-table-bg-1 text-base text-leetcode-table-fg-head hover:bg-leetcode-table-bg-1"
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
