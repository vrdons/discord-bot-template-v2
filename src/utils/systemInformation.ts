import { readFileSync } from "fs";
import os from "os";
import { resolve } from "path";
import process from "process";

export type SystemInformation = {
  platform: `${NodeJS.Platform}|${NodeJS.Architecture}`;
  cwd: string;
  NodeVersion: string;
  PackageVersion: string;
  processorCores: number;
  processorModel: string;
  processorSpeed: number;
  MemoryUsage: number;
  HostName: string;
  TotalMem: number;
  FreeMem: number;
  Uptime: number;
  UsedMem: number;
};
export async function getSystemInformation(): Promise<SystemInformation> {
  const pkg = getPackageJSON();
  let platform =
    os.platform() + // win32
    "|" +
    process.arch; // x64
  let cwd = process.cwd();
  let NodeVersion = process.version; // v23.9.0
  let PackageVersion = pkg.version || "0.0.0"; // 0.1.0
  let processors = os.cpus(); // 2
  let processorCores = processors.length; //2
  let processorSpeed = Math.max(...processors.map((x) => x.speed)); // 3292
  let processorModel = processors.find((x) => x)?.model ?? "Unknown"; // Intel(R) Pentium(R) CPU G3260 @ 3.30GHz
  let MemoryUsage = process.memoryUsage().heapUsed; // 8.94 MB
  let HostName = os.hostname(); //DESKTOP-R3G40OG
  let TotalMem = os.totalmem(); // 8.51 GB
  let FreeMem = os.freemem(); // 1.77 GB
  let UsedMem = os.totalmem() - os.freemem(); // 1.77 GB
  let Uptime = Math.round(process.uptime()) * 1000;
  const result = {
    platform,
    cwd,
    NodeVersion,
    PackageVersion,
    processorCores,
    processorModel,
    processorSpeed,
    MemoryUsage,
    HostName,
    TotalMem,
    FreeMem,
    UsedMem,
    Uptime
  } as SystemInformation;
  return result;
}
export function getPackageJSON() {
  try {
    const pkgPath = resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return pkg;
  } catch (_) {
    return { version: "0.0.0" };
  }
}
