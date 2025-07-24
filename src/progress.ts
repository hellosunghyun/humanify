import { Readable } from "stream";
import { verbose } from "./verbose.js";

export function showProgress(stream: Readable) {
  let bytes = 0;
  let i = 0;
  stream.on("data", (data) => {
    bytes += data.length;
    if (i++ % 1000 !== 0) return;
    process.stdout.clearLine?.(0);
    process.stdout.write(`\rDownloaded ${formatBytes(bytes)}`);
  });
}

function formatBytes(numBytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  while (numBytes > 1024 && unitIndex < units.length) {
    numBytes /= 1024;
    unitIndex++;
  }
  return `${numBytes.toFixed(2)} ${units[unitIndex]}`;
}

export function showPercentage(percentage: number, current?: number, total?: number) {
  const percentageStr = Math.round(percentage * 100);
  let progressText: string;
  
  if (current !== undefined && total !== undefined) {
    progressText = `Processing: ${current}/${total}`;
  } else {
    progressText = `Processing: ${percentageStr}%`;
  }
  
  if (!verbose.enabled) {
    process.stdout.clearLine?.(0);
    process.stdout.cursorTo(0);
    process.stdout.write(progressText);
  } else {
    verbose.log(progressText);
  }
  if (percentage === 1) {
    process.stdout.write("\n");
  }
}
