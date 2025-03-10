export function formatDateCard(date: string, includeYear: boolean = false): { month: string; day: string; year?: string; time?: string } {
    const monthOptions: Intl.DateTimeFormatOptions = { month: 'short' }; // Untuk bulan
    const dayOptions: Intl.DateTimeFormatOptions = { day: 'numeric' }; // Untuk tanggal
    const yearOptions: Intl.DateTimeFormatOptions = { year: 'numeric' }; // Untuk tahun
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true }; // Untuk jam dan menit

    // Cek jika date kosong atau tidak valid
    if (!date || isNaN(new Date(date).getTime())) {
        return { month: '', day: '', year: '', time: '' }; // Atau bisa melempar error, tergantung kebutuhan
    }

    const parsedDate = new Date(date);

    const month = new Intl.DateTimeFormat('id-ID', monthOptions).format(parsedDate);
    const day = new Intl.DateTimeFormat('id-ID', dayOptions).format(parsedDate);

    // Jika includeYear true, ambil tahun, jika tidak, tahun tidak disertakan
    const year = includeYear
        ? new Intl.DateTimeFormat('id-ID', yearOptions).format(parsedDate)
        : undefined;

    const time = new Intl.DateTimeFormat('id-ID', timeOptions).format(parsedDate); // Ambil waktu (jam dan menit)

    return { month, day, year, time };
}
