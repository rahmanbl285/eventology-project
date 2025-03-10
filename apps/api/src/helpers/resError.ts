import { Response } from "express";

export const responseError = (res: Response, err: any) => {
    console.log(err);
    res.status(400).json({
        status: 'error',
        message: err
    })
}