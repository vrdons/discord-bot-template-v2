import fs, { PathLike } from "fs";
import path from "path";

import { arrayToMap } from "./utils";
export function getJSON(filePath: PathLike) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    //  console.error(`Error reading or parsing JSON file at ${filePath}:`, err);
    fs.writeFileSync(filePath, "{}");
    return {};
  }
}
export function isFolder(path: PathLike) {
  try {
    const status = fs.statSync(path);
    return status.isDirectory();
  } catch {
    return false;
  }
}
export function createFolder(path: PathLike) {
  try {
    if (fs.existsSync(path)) fs.rmSync(path);
    fs.mkdirSync(path);
  } catch {}
}

export async function loadStructures<T>(dir: PathLike, recursive = true, type?: string): Promise<T[]> {
  const statDir = fs.statSync(dir);
  if (!statDir.isDirectory()) {
    createFolder(dir);
    return [];
  }
  const files = fs.readdirSync(dir);
  const structures: T[] = [];

  for (const file of files) {
    const fullPath = path.join(dir.toString(), file);
    const statFile = fs.statSync(fullPath);

    if (statFile.isDirectory() && recursive) {
      structures.push(...(await loadStructures<T>(fullPath, recursive, type)));
      continue;
    }

    if (!file.endsWith(".js") && !file.endsWith(".ts")) {
      // console.error(`[${type}] ${file} atlanıyor...`);
      continue;
    }

    try {
      const structure = require(path.join(dir.toString(), file)).default;
      //  console.debug(`[${type}] ${file} yükleniyor...`);
      structures.push(structure);
      delete require.cache[require.resolve(path.join(dir.toString(), file))];
    } catch (_) {
      //   console.error(`[${type}] ${file} yüklenemedi: ${_}`);
    }
  }

  return structures;
}
export async function loadMap<T extends { data: { name: string } }>(dir: PathLike, recursive = true, type?: string): Promise<Map<string, T>> {
  const items = await loadStructures<T>(dir, recursive, type);
  return arrayToMap(items, (i) => i.data.name);
}
export async function loadArray<T>(dir: PathLike, recursive = true, type?: string): Promise<T[]> {
  return await loadStructures<T>(dir, recursive, type);
}
