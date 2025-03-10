import { API_URL, token } from "./utils"


export const RegUser = async (data: any) => {
    const res = await fetch (`${API_URL}users/register`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const result = await res.json()
    return result
}

export const LoginUser = async (data: any) => {
    const res = await fetch (`${API_URL}users/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const result = await res.json()
    return result
}

export const GetUserProfile = async () => {
    const res = await fetch (`${API_URL}profiles/user-profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
    })
    const result = await res.json()

    return result
}

export const UpdatePassword = async (data: any) => {
    const res = await fetch (
        `${API_URL}profiles/update/password`,
        {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
    )
    const result = await res.json()
    if (result.status !== 'OK') {
        throw new Error (result.message || 'Edit Password Failed')
    }
    return result
}

export const VerifPassword = async (data:any) => {
    const res = await fetch (
        `${API_URL}profiles/verify/password`,
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
    )
    const result = await res.json()
    return result
}

export const UpdateEmail = async (data: any) => {
      const res = await fetch(
        `${API_URL}profiles/update/email`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await res.json()
      return result
} 

export const DeactivateAccount = async (data: any) => {
      const res = await fetch(
        `${API_URL}users/deactivate-account`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await res.json()
      return result
} 

export const VerifyEmail = async (token: string) => {
    const res = await fetch (
        `${API_URL}profiles/update/email/${token}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    const result = await res.json()
    return result
}

export const ActivateAccount = async (token: string) => {
    const res = await fetch(`${API_URL}users/activate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    )
    const result = await res.json()
    return result
}

export const EditUserProfile = async (formData: FormData, token: string) => {
    const res = await fetch(`${API_URL}profiles/update`, {
        method: 'PATCH',
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
    const result = await res.json()
    return result
}

export const SwitchIsOrganizer = async () => {
    const res = await fetch (`${API_URL}users/update-organizer`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const result = await res.json()
    return result
}