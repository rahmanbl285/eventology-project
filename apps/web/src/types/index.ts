import { ReactNode } from "react"


export interface UserInfo {
    id: number;
    isOrganizer: boolean;
    username: string;
  }
  
export interface UserContextType {
    userInfo: UserInfo | null;
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  }

export interface IDiscount {
    id: number
    discount: number
    expiredDiscount: Date
}

export type IMyDiscProps = {
    data: IDiscount[] 
    emptyTitle: string,
    emptyStateSubtext: string,
    collectionType?: 'MyDiscount' | "Events_Organized"
}

export interface IPoint {
    id: number
    amount: number
    expiredPoints: Date
}

export type IFileUploaderProps = {
    image: string;
    onFieldChange: (url: string) => void;
    setFiles: React.Dispatch<React.SetStateAction<File | null>>;
}

export type ICardDashboard = {
    title: string
    num: number
    ket: string
}

export type ICardEvent = {
    id?: number
    image: string
    title: string
    startDate: string
    price: number
    city: string
    slug: string
    Tickets?: ITicket[] 
}

export type IProvince = {
    id: string;
    name: string;
}

export type ICity = {
    id: string;
    province_id: string;
    name: string;
}

export type ITitleArr = {
    id?: number
    title: string
    slug: string
}

export type IEvent = {
    province: string
    id: number
    title: string;
    startDate: string
    endDate: string
    category: ICategory
    image: string;
    description: string;
    address: string;
    city: string;
    slug: string
    Tickets: ITicket[]
    users: IUser
}

export type ITicket = {
    id: number
    eventsId: number
    type: string;
    isPaid: boolean;
    availableSeat: number;
    price: number;
    startSaleDate: string
    endSaleDate: string
}

export type ITicketDetail = {
    onCountChange: (count: number, eventsId: number) => void;
    type: string
    availableSeat: number;
    price: number;
    endSaleDate: string
}

export type IUser = {
    id: number
    name: string
    username: string
    email: string
    image: string
}

export enum ICategory {
    Festival = 'Festival',
    Konser = 'Konser',
    Pertandingan = 'Pertandingan',
    Pameran = 'Pameran',
    Konferensi = 'Konferensi',
    Workshop = 'Workshop',
    Pertunjukan = 'Pertunjukan',
    Seminar = 'Seminar'
}

export type ICheckoutTicket = {
    ticketCount: number;
    price: number;
    ticketTypes: { [key: string]: number };
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string;
  className?: string
}