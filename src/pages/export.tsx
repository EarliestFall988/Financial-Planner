import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import type { Split } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PropagateSpinner } from "~/components/PropagateSpinner";
import { Header } from "~/components/header";
import { api } from "~/utils/api";
import xlsx from "json-as-xlsx";
import { formatCurrency } from "~/utils/currency";

const ExportPage: NextPage = () => {
  const { back, push } = useRouter();

  const [getSplitData, setSplitData] = useState<Split[]>([]);
  const [getSelectedSplitData, setSelectedSplitData] = useState<string[]>([]);

  const { data, isLoading } = api.split.getAll.useQuery();

  useEffect(() => {
    if (data) {
      setSplitData(data);
    }
  }, [data]);

  const { data: exportData, isLoading: loadingExportData } =
    api.aggregate.getDataToExport.useQuery({
      includedBudgetPartitionIds: getSelectedSplitData,
    });

  const goBack = () => {
    if (window.history.length > 1) {
      void back();
    } else {
      void push("/finances");
    }
  };

  const downloadExportedExpenses = () => {
    console.log("Downloading expenses");

    if (getSelectedSplitData.length === 0) {
      console.log("No splits selected");
      return;
    }

    if (exportData) {
      const data = [
        {
          sheet: "Expense Report - " + new Date().toISOString().split("T")[0],
          columns: [
            { label: "Title", value: "name" },
            { label: "Amount", value: "amount" },
            { label: "Date", value: "date" },
            { label: "Category", value: "budget" },
            { label: "Notes", value: "description" },
          ],
          content: exportData.payables.map((item) => ({
            name: item.name,
            amount: `(${formatCurrency.format(
              Math.abs(parseFloat(item.amount.toString() ?? 0)),
            )})`,
            date: item.date,
            budget: item.Budget?.name ?? item.budgetId,
            description: item.description,
          })),
        },
      ];

      console.log(data);

      const settings = {
        fileName: "Expense Report - " + new Date().toISOString().split("T")[0], // Name of the resulting spreadsheet
        extraLength: 3, // A bigger number means that columns will be wider
        writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
        writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
        RTL: false, // Display the columns from right-to-left (the default value is false)
      };

      xlsx(data, settings);
    }
  };

  const ToggleSelected = (id: string) => {
    if (getSelectedSplitData.includes(id)) {
      setSelectedSplitData((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedSplitData((prev) => [...prev, id]);
    }
  };

  const isSelected = (id: string) => {
    const selected = getSelectedSplitData.includes(id);

    if (selected) {
      return "bg-sky-600 text-white border-0";
    } else {
      return "bg-zinc-700 text-zinc-200 bg-zinc-600";
    }
  };

  return (
    <div className="min-h-[100vh] bg-zinc-800 text-zinc-200">
      <Header title="Export Expenses" back={goBack} />
      <div className="p-2">
        {!isLoading && getSplitData.length === 0 && (
          <div className="text-center text-lg font-semibold">
            No expenses to export
          </div>
        )}
        {isLoading && (
          <div className="text-center text-lg font-semibold">Loading...</div>
        )}
        {getSplitData.length > 0 && (
          <div className=" rounded bg-zinc-700 p-5">
            <div className="pb-2 text-lg font-bold">
              <p>Select Budget Splits to Include</p>
            </div>
            <div className="flex flex-wrap gap-5">
              {getSplitData.map((split) => {
                return (
                  <button
                    onClick={() => ToggleSelected(split.id)}
                    className={`rounded-full px-4 py-1 transition duration-200 hover:scale-105 ${isSelected(
                      split.id,
                    )}`}
                    key={split.id}
                  >
                    <div>{split.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div></div>
        <div className="flex w-full items-center justify-center py-4">
          <button
            onClick={downloadExportedExpenses}
            className="flex lg:w-1/5 w-3/4 items-center justify-center gap-3 rounded-full bg-sky-600 p-2 text-lg font-semibold transition duration-200 hover:bg-sky-500"
          >
            {loadingExportData ? (
              <div>
                <PropagateSpinner></PropagateSpinner>
              </div>
            ) : (
              "Export (.xlsx)"
            )}
            <ArrowDownTrayIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
