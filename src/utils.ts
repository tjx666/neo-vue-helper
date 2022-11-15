import { exec as _exec } from 'node:child_process';
import { constants as FS_CONSTANTS } from 'node:fs';
import fs from 'node:fs/promises';

export function pathExists(path: string) {
    return fs
        .access(path, FS_CONSTANTS.F_OK)
        .then(() => true)
        .catch(() => false);
}

export async function isDirectory(path: string) {
    const stats = await fs.stat(path);
    return stats.isDirectory();
}
