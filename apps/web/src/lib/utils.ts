import Cookies from "js-cookie";

export const token = Cookies.get('token')

export const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL
