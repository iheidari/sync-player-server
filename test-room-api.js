const axios = require("axios");

const BASE_URL = "http://localhost:3000/api/rooms";

// Test data
const testRoom = {
  name: "Test Room",
  slug: "test-room",
  createdBy: "test-user",
  note: "This is a test room",
};

async function testRoomAPI() {
  console.log("🧪 Testing Room CRUD API...\n");

  try {
    // Test 1: Create a room
    console.log("1️⃣ Creating a room...");
    const createResponse = await axios.post(BASE_URL, testRoom);
    console.log("✅ Room created:", createResponse.data);
    const roomId = createResponse.data.room.id;

    // Test 2: Get all rooms
    console.log("\n2️⃣ Getting all rooms...");
    const getAllResponse = await axios.get(BASE_URL);
    console.log("✅ All rooms:", getAllResponse.data);

    // Test 3: Get room by ID
    console.log("\n3️⃣ Getting room by ID...");
    const getByIdResponse = await axios.get(`${BASE_URL}/${roomId}`);
    console.log("✅ Room by ID:", getByIdResponse.data);

    // Test 4: Get room by slug
    console.log("\n4️⃣ Getting room by slug...");
    const getBySlugResponse = await axios.get(
      `${BASE_URL}/slug/${testRoom.slug}`
    );
    console.log("✅ Room by slug:", getBySlugResponse.data);

    // Test 5: Update room
    console.log("\n5️⃣ Updating room...");
    const updateData = {
      name: "Updated Test Room",
      note: "This room has been updated",
    };
    const updateResponse = await axios.put(`${BASE_URL}/${roomId}`, updateData);
    console.log("✅ Room updated:", updateResponse.data);

    // Test 6: Search rooms
    console.log("\n6️⃣ Searching rooms...");
    const searchResponse = await axios.get(`${BASE_URL}?search=test`);
    console.log("✅ Search results:", searchResponse.data);

    // Test 7: Delete room
    console.log("\n7️⃣ Deleting room...");
    const deleteResponse = await axios.delete(`${BASE_URL}/${roomId}`);
    console.log("✅ Room deleted:", deleteResponse.data);

    console.log("\n🎉 All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Run the tests
testRoomAPI();
