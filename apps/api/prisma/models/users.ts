import { hash } from "bcrypt";

export enum UserStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    DEACTIVATE = 'DEACTIVATE'
  }

export enum ReferralStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE'
  }

export async function listUsers () {
    return [
        {
            id: 1,
            name: "Cinot",
            username: "cinotburayot",
            email: "somnambulitts@gmail.com",
            password: await hash('Asd123', 10),
            image: 'https://firebasestorage.googleapis.com/v0/b/company-project-skin1004.appspot.com/o/eventology%2Fuser%2F1.jpg?alt=media&token=6bc21d6d-dd3d-4c3d-b871-443f329fc5cc',
            isActive: true,
            isOrganizer: true,
            status: UserStatus.ACTIVE,
            createdAt: "2024-12-13T04:07:41.621Z",
            deactivateAt: null
        },
        {
            id: 2,
            name: "Inces",
            username: "incesmerences",
            email: "somnambulitts+1@gmail.com",
            password: await hash('Asd123', 10),
            image: 'https://firebasestorage.googleapis.com/v0/b/company-project-skin1004.appspot.com/o/eventology%2Fuser%2F2.jpg?alt=media&token=787a80f6-25a9-4f67-925b-75788de43090',
            isActive: true,
            isOrganizer: true,
            status: UserStatus.ACTIVE,
            createdAt: "2024-12-13T04:09:26.600Z",
            deactivateAt: null
        },
        {
            id: 3,
            name: "Poni",
            username: "ponitampan",
            email: "somnambulitts+2@gmail.com",
            password: await hash('Asd123', 10),
            image: 'https://firebasestorage.googleapis.com/v0/b/company-project-skin1004.appspot.com/o/eventology%2Fuser%2F3.jpg?alt=media&token=c601379d-0d31-401c-ade9-cbd9e16b3987',
            isActive: true,
            isOrganizer: true,
            status: UserStatus.ACTIVE,
            createdAt: "2024-12-13T04:10:20.973Z",
            deactivateAt: null
        },
        {
            id: 4,
            name: "Sukun",
            username: "sukunbatu",
            email: "somnambulitts+3@gmail.com",
            password: await hash('Asd123', 10),
            image: 'https://firebasestorage.googleapis.com/v0/b/company-project-skin1004.appspot.com/o/eventology%2Fuser%2F4.jpg?alt=media&token=d7a2a0ff-9b7c-4356-aaa4-dff4a93b5cac',
            isActive: true,
            isOrganizer: false,
            status: UserStatus.ACTIVE,
            createdAt: "2024-12-13T04:10:47.960Z",
            deactivateAt: null
        },
        {
            id: 5,
            name: "Yaya",
            username: "yayabuled",
            email: "somnambulitts+4@gmail.com",
            password: await hash('Asd123', 10),
            image: 'https://firebasestorage.googleapis.com/v0/b/company-project-skin1004.appspot.com/o/eventology%2Fuser%2F5.jpg?alt=media&token=5736ddcd-91dd-4cba-a543-63ba75a40f09',
            isActive: true,
            isOrganizer: false,
            status: UserStatus.ACTIVE,
            createdAt: "2024-12-13T04:11:12.384Z",
            deactivateAt: null
        },
        {
            id: 6,
            name: "Monde",
            username: "mondebayi",
            email: "somnambulitts+5@gmail.com",
            password: await hash('Asd123', 10),
            image: 'https://firebasestorage.googleapis.com/v0/b/company-project-skin1004.appspot.com/o/eventology%2Fuser%2F6.jpg?alt=media&token=9c755dc8-814d-47b6-b013-11270b733b9a',
            isActive: true,
            isOrganizer: false,
            status: UserStatus.ACTIVE,
            createdAt: "2024-12-13T04:11:34.340Z",
            deactivateAt: null
        },
        {
            id: 7,
            name: "Ngongo",
            username: "ngongoren",
            email: "somnambulitts+6@gmail.com",
            password: await hash('Asd123', 10),
            image: 'https://firebasestorage.googleapis.com/v0/b/company-project-skin1004.appspot.com/o/eventology%2Fuser%2F7.jpg?alt=media&token=dc87fa47-35a7-4e8d-98d9-04d8133925ea',
            isActive: true,
            isOrganizer: false,
            status: UserStatus.ACTIVE,
            createdAt: "2024-12-13T04:12:16.064Z",
            deactivateAt: null
        },
        {
            id: 8,
            name: "Batik",
            username: "mbakutik",
            email: "somnambulitts+7@gmail.com",
            password: await hash('Asd123', 10),
            image: 'https://firebasestorage.googleapis.com/v0/b/company-project-skin1004.appspot.com/o/eventology%2Fuser%2F8.jpg?alt=media&token=d32d4d02-e14c-41c4-b487-8d801a03dc93',
            isActive: true,
            isOrganizer: false,
            status: UserStatus.ACTIVE,
            createdAt: "2024-12-13T04:12:44.811Z",
            deactivateAt: null
        },
        {
            id: 9,
            name: "Kulin",
            username: "kulintampan",
            email: "somnambulitts+8@gmail.com",
            password: await hash('Asd123', 10),
            image: 'https://firebasestorage.googleapis.com/v0/b/company-project-skin1004.appspot.com/o/eventology%2Fuser%2F9.jpg?alt=media&token=6c6fe01b-ecee-48b9-92d4-97c4aec843de',
            isActive: true,
            isOrganizer: false,
            status: UserStatus.ACTIVE,
            createdAt: "2024-12-13T05:06:05.484Z",
            deactivateAt: null
        },
    ]
}

export async function listReferrals () {
    return [
        {
            id: 1,
            usersId:1,
            myReferralCode: "MZ76MMK1",
            referralStatus: ReferralStatus.ACTIVE
        },
        {
            id: 2,
            usersId: 2,
            myReferralCode: "HVQBA1UA",
            referralStatus: ReferralStatus.ACTIVE
        },
        {
            id: 3,
            usersId: 3,
            myReferralCode: "FSVEG7MX",
            referralStatus: ReferralStatus.ACTIVE
        },
        {
            id: 4,
            usersId: 4,
            myReferralCode: "LCQ1F6BC",
            referralStatus: ReferralStatus.ACTIVE
        },
        {
            id: 5,
            usersId: 5,
            myReferralCode: "39CI2FRG",
            referralStatus: ReferralStatus.ACTIVE
        },
        {
            id: 6,
            usersId: 6,
            myReferralCode: "HZSWX7TC",
            referralStatus: ReferralStatus.ACTIVE
        },
        {
            id: 7,
            usersId: 7,
            myReferralCode: "0FYNK5QV",
            referralStatus: ReferralStatus.ACTIVE
        },
        {
            id: 8,
            usersId: 8,
            myReferralCode: "CJ15IDEY",
            referralStatus: ReferralStatus.ACTIVE
        },
        {
            id: 9,
            usersId: 9,
            myReferralCode: "EZLBFB4F",
            referralStatus: ReferralStatus.ACTIVE
        }
    ]
    
}

export async function listPoints () {
    return [
        {
            id: 1,
            amount: 10000,
            expiredPoints: "2025-03-13T05:06:32.983Z",
            usersId: 8
        },
        {
            id: 2,
            amount: 10000,
            expiredPoints: "2024-12-13T05:06:32.983Z",
            usersId: 8
        },
        {
            id: 3,
            amount: 10000,
            expiredPoints: "2025-01-13T05:06:32.983Z",
            usersId: 9
        },
        {
            id: 4,
            amount: 10000,
            expiredPoints: "2025-02-13T05:06:32.983Z",
            usersId: 6
        },
    ]
}

export async function listDiscounts () {
    return [
        {
            id: 1,
            discount: 10,
            expiredDiscount: "2025-03-13T05:06:32.989Z",
            usersId: 9
        },
        {
            id: 2,
            discount: 10,
            expiredDiscount: "2025-01-13T05:06:32.989Z",
            usersId: 8
        },
        {
            id: 3,
            discount: 10,
            expiredDiscount: "2024-01-13T05:06:32.989Z",
            usersId: 7
        },
    ]
}