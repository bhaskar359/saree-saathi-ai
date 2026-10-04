import { Router } from "express";
import { searchController } from "../controllers/search-controller.js";
import { validateSearchRequest } from "../middleware/validate-search.js";

const router = Router();

router.post("/search", validateSearchRequest, searchController);

export default router;
