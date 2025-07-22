const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();

const prisma = new PrismaClient();

// Helper function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Helper function to generate unique slug
async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingRoom = await prisma.room.findUnique({
      where: { slug },
    });

    if (!existingRoom) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// CREATE - Create a new room
router.post("/", async (req, res) => {
  try {
    const { name, createdBy, note } = req.body;

    // Validate required fields
    if (!name || !createdBy) {
      return res.status(400).json({
        error: "Missing required fields: name and createdBy are required",
      });
    }

    // Generate slug from name
    const baseSlug = generateSlug(name);

    // Generate unique slug
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    // Create the room
    const room = await prisma.room.create({
      data: {
        name,
        slug: uniqueSlug,
        createdBy,
        note: note || null,
      },
    });

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// READ - Get all rooms
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = {};

    // Add search functionality
    if (search) {
      whereClause = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
          { note: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const [rooms, totalCount] = await Promise.all([
      prisma.room.findMany({
        where: whereClause,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.room.count({ where: whereClause }),
    ]);

    res.json({
      rooms,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// READ - Get room by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      return res.status(404).json({
        error: "Room not found",
      });
    }

    res.json({ room });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// READ - Get room by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const room = await prisma.room.findUnique({
      where: { slug },
    });

    if (!room) {
      return res.status(404).json({
        error: "Room not found",
      });
    }

    res.json({ room });
  } catch (error) {
    console.error("Error fetching room by slug:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// UPDATE - Update room by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, note } = req.body;

    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id },
    });

    if (!existingRoom) {
      return res.status(404).json({
        error: "Room not found",
      });
    }

    // If slug is being updated, check for uniqueness
    if (slug && slug !== existingRoom.slug) {
      const slugExists = await prisma.room.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return res.status(409).json({
          error: "Room with this slug already exists",
        });
      }
    }

    // Update the room
    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(note !== undefined && { note }),
      },
    });

    res.json({
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// DELETE - Delete room by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id },
    });

    if (!existingRoom) {
      return res.status(404).json({
        error: "Room not found",
      });
    }

    // Delete the room
    await prisma.room.delete({
      where: { id },
    });

    res.json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

module.exports = router;
