import { API_URL, token } from "./utils";

export const CreateOrder = async (data: any) => {
    const res = await fetch(`${API_URL}orders/create-order`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const result = await res.json();
    return result;
}

export const CreatePayment = async (transactionIds: number[]) => {
    const res = await fetch (`${API_URL}orders/create-payment/${transactionIds.join('-')}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!res.ok) {
        throw `Error ${res.statusText}`
    }

    const result = await res.json()
    return result
}

export const getTransactions = async (transactionIds: number[]) => {
    const res = await fetch(`${API_URL}orders/${transactionIds.join('-')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw `Error ${res.statusText}`
    }

    const result = await res.json()
    return result
};

export const GetEventOrderSummary = async () => {
    const res = await fetch (`${API_URL}orders/event-order-sum`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    const result = await res.json()
    return result
}

export const GetUserOrderSummary = async () => {
    const res = await fetch (`${API_URL}orders/transaction-result`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const result = await res.json()
    return result
}

export const ConfirmOrder = async (transactionId: string, isConfirmed: boolean) => {
    const res = await fetch (`${API_URL}orders/confirm-order`, {
        method: 'POST',
        body: JSON.stringify({ transactionId, isConfirmed }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })

    const result = await res.json()
    return result
}