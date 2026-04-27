const Place = require("../models/Place");

// CREATE PLACE - ADMIN ONLY
exports.createPlace = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add places" });
    }

    let {
      name,
      description,
      category,
      location,
      lat,
      lng,
      blockName,
      floor,
      cabinNumber,
    } = req.body;

    name = name?.trim();
    description = description?.trim();
    category = category?.trim() || "general";
    location = location?.trim();
    blockName = blockName?.trim() || "";
    floor = floor?.trim() || "";
    cabinNumber = cabinNumber?.trim() || "";

    if (!name || !description || !location) {
      return res.status(400).json({
        message: "Name, description, and location are required",
      });
    }

    if (lat === undefined || lng === undefined || lat === "" || lng === "") {
      return res.status(400).json({
        message: "Latitude and longitude are mandatory",
      });
    }

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);

    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
      return res.status(400).json({
        message: "Latitude and longitude must be valid numbers",
      });
    }

    const existingPlace = await Place.findOne({
      name: new RegExp(`^${name}$`, "i"),
      location: new RegExp(`^${location}$`, "i"),
    }).lean();

    if (existingPlace) {
      return res.status(400).json({
        message: "A place with the same name and location already exists",
      });
    }

    const place = await Place.create({
      name,
      description,
      category,
      location,
      lat: parsedLat,
      lng: parsedLng,
      blockName,
      floor,
      cabinNumber,
      createdBy: req.user._id,
    });

    res.status(201).json(place);
  } catch (error) {
    console.error("createPlace error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET PLACES
exports.getPlaces = async (req, res) => {
  try {
    const { search = "", category = "", limit = 100, page = 1 } = req.query;

    const query = {};

    if (search.trim()) {
      query.$text = { $search: search.trim() };
    }

    if (category.trim() && category !== "all") {
      query.category = category.trim();
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 200);
    const skip = (pageNumber - 1) * limitNumber;

    const places = await Place.find(query)
      .select(
        "name description location category lat lng blockName floor cabinNumber createdBy createdAt"
      )
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();

    const total = await Place.countDocuments(query);

    res.json({
      total,
      page: pageNumber,
      limit: limitNumber,
      places,
    });
  } catch (error) {
    console.error("getPlaces error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PLACE - ADMIN ONLY
exports.updatePlace = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update places" });
    }

    let {
      name,
      description,
      category,
      location,
      lat,
      lng,
      blockName,
      floor,
      cabinNumber,
    } = req.body;

    const updates = {
      name: name?.trim(),
      description: description?.trim(),
      category: category?.trim(),
      location: location?.trim(),
      blockName: blockName?.trim() || "",
      floor: floor?.trim() || "",
      cabinNumber: cabinNumber?.trim() || "",
    };

    if (lat !== undefined) {
      const parsedLat = Number(lat);
      if (Number.isNaN(parsedLat)) {
        return res.status(400).json({ message: "Latitude must be a valid number" });
      }
      updates.lat = parsedLat;
    }

    if (lng !== undefined) {
      const parsedLng = Number(lng);
      if (Number.isNaN(parsedLng)) {
        return res.status(400).json({ message: "Longitude must be a valid number" });
      }
      updates.lng = parsedLng;
    }

    const updatedPlace = await Place.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json(updatedPlace);
  } catch (error) {
    console.error("updatePlace error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE PLACE - ADMIN ONLY
exports.deletePlace = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete places" });
    }

    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    await Place.findByIdAndDelete(req.params.id);

    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    console.error("deletePlace error:", error);
    res.status(500).json({ message: "Server error" });
  }
};