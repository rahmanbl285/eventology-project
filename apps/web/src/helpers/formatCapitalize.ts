export function capitalizeWords(text: string): string {
    return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}