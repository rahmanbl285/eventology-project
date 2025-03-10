import { IProvince } from "@/types";
import { API_URL, token } from "./utils";

export const GetEvent = async () => {
    const res = await fetch (`${API_URL}events`, {
        method: 'GET'
    })
    const result = await res.json()

    return result
}

export const GetTopEventsAllTime = async() => {
    const res = await fetch (`${API_URL}events/top-events-all-time`, {
        method: 'GET'
    })
    const result = await res.json()
    return result
}

export const GetEventByOrganizer = async () => {
    const res = await fetch (`${API_URL}events/by-organizer`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const result = await res.json()

    return result
}

export const GetTickets = async () => {
    const res = await fetch (`${API_URL}events/ticket`, {
        method: 'GET'
    })
    const result = await res.json()
    
    return result
}

export const GetEventSlug = async (id?: number, slug?: string) => {
    if (!slug) throw new Error("Slug is required");

    const url = id 
        ? `${API_URL}events/${slug}?id=${id}`
        : `${API_URL}events/${slug}`;

    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error("Failed to fetch event");

    return res.json();
};


export const CreateEvent = async (formData: FormData) => {
    const res = await fetch (
        `${API_URL}events/create-event`,
        {
            method: 'POST',
            body: formData,
            headers: {
               'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        const result = await res.json()        

        return result
}

export const UpdateEvent = async (formData: FormData, id: number) => {
    try {
        const res = await fetch(`${API_URL}events/update-event/${id}`, {
            method: 'PATCH',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        
        const result = await res.json();
        return result;

    } catch (error) {
        console.error('Error updating event:', error);
        throw error;  
    }
};

export const DeleteEvent = async (id: number) => {
    try {
        const res = await fetch (`${API_URL}events/${id}/delete`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        const result = await res.json()
        return result
    } catch (err) {
        console.error(err)
    }
}


export const CreateTicket = async (data: any) => {
    const res = await fetch (`${API_URL}users/register`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const result = await res.json()
    return result
}

export const getProvinces = async (): Promise<IProvince[]> => {
    const res = await fetch(`${API_URL}location/provinces`, {
        method: 'GET'
    });
    const result = await res.json();
    
    if (result && Array.isArray(result.data)) {
        return result.data.map((item: any) => ({
            id: item.id,
            name: item.name
        }));
    } else {
        return [];
    }
};

export const getAllLocation = async() => {
    const res = await fetch (`${API_URL}location/`, {
        method: 'GET'
    })
    const result = await res.json()
    const data = result.data.flatMap ((item:any)=> item.cities.map((city:any) => city.name))
    
    return data
}


export const getCities = async(selectedProvince: string) => {
    const res = await fetch (
        `${API_URL}location/cities/${selectedProvince}`, {
            method: 'GET'
        }
    )
    const result = await res.json()
    return result;
}