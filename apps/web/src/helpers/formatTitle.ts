export default function splitTitle (text: string, length: number) {
    if (text.length <= length) {
        return text
    } else {
        return text.substring(0, length) + '...'
    }
}