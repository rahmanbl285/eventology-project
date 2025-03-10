import { responseError } from "@/helpers/resError";
import { Request, Response } from "express";

export class LocationController {

    async getAllLocation(req: Request, res: Response) {
        try {
            const resProvinces = await fetch(`https://open-api.my.id/api/wilayah/provinces`)
            if (!resProvinces.ok) {
                throw new Error('Failed to fetch provinces: ' + resProvinces.statusText);
            }

            const provinces = await resProvinces.json()

            const allLocations = await Promise.all(
                provinces.map(async(province: { id: string, name: string}) => {
                    const resCities = await fetch(`https://open-api.my.id/api/wilayah/regencies/${province.id}`)
                    if (!resCities.ok) {
                        throw new Error(`Failed to fetch cities for province ${province.id}: ${resCities.statusText}`);
                    }

                    const cities = await resCities.json()

                    return {
                        province: {
                            id: province.id,
                            name: province.name
                        },
                        cities
                    }
                })
            )

            res.status(200).json({
                status: 'OK',
                data: allLocations,
            });
        } catch (err) {
            responseError(res, err)
        }
    }

    async getProvinces(req: Request, res: Response) {
        try {
            const response = await fetch(`https://open-api.my.id/api/wilayah/provinces`);

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            res.status(200).json({
                status: 'OK',
                data
            });
        } catch (err) {
            responseError(res, err);
        }
    }

    async getCities (req: Request, res: Response) {
        try {
           const { provinsiId } = req.params

           if(!provinsiId) {
            return res.status(400).json({
                status: 'error',
                message: 'Parameter provinsi_id diperlukan'
            });
           }

           const response = await fetch(`https://open-api.my.id/api/wilayah/regencies/${provinsiId}`)
           if (!response.ok) {
            throw new Error('Failed to fetch cities: ' + response.statusText);
            }

            const data = await response.json()
            console.log(data);
            
            if(!data || data.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Kota tidak ditemukan untuk provinsi ini'
                });
            }

            res.status(200).json({
                status: 'OK',
                data
            });
        } catch (err) {
            responseError(res, err);
        }
    }
}