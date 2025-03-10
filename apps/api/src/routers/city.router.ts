import { LocationController } from "@/controllers/city.controller";
import { Router } from "express";

export class LocationRouter {
    private router: Router
    private locationController: LocationController

    constructor() {
        this.router = Router()
        this.locationController = new LocationController()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get('/cities/:provinsiId', this.locationController.getCities)
        this.router.get('/provinces', this.locationController.getProvinces)
        this.router.get('/', this.locationController.getAllLocation)
    }

    getRouter() {
        return this.router
    }
}