export default function EmailCensored (email: string) {
    const [localPart, domain] = email.split('@')
    const censored = localPart.slice(0, 3).padEnd(localPart.length, '*')
    
    return `${censored}@${domain}`
}