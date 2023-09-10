export type LineStatus = {
    key: string;
    status: string;
    value: unknown;
    valueOld?: unknown;
    valueNew?: unknown;
    children?: Record<string, unknown>[];
}
