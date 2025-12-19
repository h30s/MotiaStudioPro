import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

export function generateId(prefix: string = "id"): string {
    const random = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now().toString(36);
    return `${prefix}_${timestamp}${random}`;
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function estimateGenerationTime(description: string): number {
    // Base time: 15 seconds
    // Add 5 seconds per 100 characters
    const baseTime = 15;
    const charTime = Math.ceil(description.length / 100) * 5;
    return Math.min(baseTime + charTime, 60); // Max 60 seconds
}

export function estimateDeploymentTime(fileCount: number): number {
    // Base time: 30 seconds
    // Add 5 seconds per file
    const baseTime = 30;
    const fileTime = fileCount * 5;
    return Math.min(baseTime + fileTime, 90); // Max 90 seconds
}

export function validateLanguage(lang: string): 'typescript' | 'python' | 'go' {
    if (lang === 'python' || lang === 'go') return lang;
    return 'typescript'; // Default
}
