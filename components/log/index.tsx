// Packages
import { useAtom } from "jotai";

// DB
import { useLogs } from "@/lib/swr-hooks";
import { pageAtom } from "@/lib/atoms";
import { LogObject } from "@/lib/types";
import { convertToNZTime } from "@/lib/data-functions";

// Components
import ListLog from "./list-log";

export default function LogScreen() {
  // SWR
  const { logs, isLogsLoading } = useLogs();

  // Atoms
  const [page] = useAtom(pageAtom);

  console.log(convertToNZTime());

  return (
    <div
      className={`flex overflow-x-hidden ${page !== "logs" ? "hidden" : ""}`}
    >
      <div className="h-menu w-full overflow-y-scroll px-2 bg-white">
        <div className="text-2xl mt-4 mb-2 text-black font-mono">Logs</div>
        {isLogsLoading ? (
          <div className="w-full flex h-full">
            <div className="loading-icon" />
          </div>
        ) : (
          logs?.map((log: LogObject) => <ListLog log={log} key={log?.id} />)
        )}
      </div>
    </div>
  );
}
