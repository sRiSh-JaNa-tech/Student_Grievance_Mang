const bcrypt = require('bcrypt');

async function test() {
  try {
    console.log("Generating salt...");
    const salt = await bcrypt.genSalt(10);
    console.log("Salt generated:", salt);
    const hash = await bcrypt.hash("admin989", salt);
    console.log("Hash generated:", hash);
  } catch (err) {
    console.error("Bcrypt error:", err);
  }
}

test();
