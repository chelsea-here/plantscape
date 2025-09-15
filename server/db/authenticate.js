const client = require("./client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const findUserByToken = async (token) => {
  try {
    const payload = await jwt.verify(token, process.env.JWT);
    const SQL = `
        SELECT  id, username, is_admin
        FROM users
        WHERE id = $1
        `;
    const response = await client.query(SQL, [payload.id]);
    return response.rows[0];
  } catch (error) {
    console.error("Error in findUserByToken:", error); // Use console.error for errors
    const er = Error("Bad Token");
    er.status = 401;
    throw er;
  }
};

const authenticate = async (credentials) => {
  try {
    const SQL = `
        SELECT id, password
        FROM users
        WHERE username = $1
        `;
    const response = await client.query(SQL, [credentials.username]);

    if (!response.rows.length) {
      console.log("Authentication Failed: Username not found in database.");
      const error = Error("incorrect username");
      error.status = 401;
      throw error;
    }

    const userFromDb = response.rows[0];
    console.log(
      "User found in DB. Hashed password from DB:",
      userFromDb.password
    );

    // Compare the provided plaintext password with the hashed password from the DB
    const valid = await bcrypt.compare(
      credentials.password,
      userFromDb.password
    );
    console.log(
      "bcrypt.compare result (true for valid, false for invalid):",
      valid
    );

    if (!valid) {
      console.log("Authentication Failed: Incorrect password provided.");
      const error = Error("incorrect password");
      error.status = 401;
      throw error;
    }

    console.log("Authentication Successful!");
    const token = await jwt.sign({ id: userFromDb.id }, process.env.JWT);
    return { token };
  } catch (error) {
    console.error("Error during authentication process:", error); // Catch any unexpected errors here
    throw error; // Re-throw the error so the calling function can handle it
  }
};

module.exports = {
  authenticate,
  findUserByToken,
};
