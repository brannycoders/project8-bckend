const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./model/User");

app.use(express.json());
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// add user route
app.post("/add-user", async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res
      .status(400)
      .send({ error: error.message, validationErrors: error.errors });
  }
});

// update email
app.post("/update-email", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { name },
      { email },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//   add users

app.post("/add-users", async (req, res) => {
  try {
    const users = req.body;
    const validUsers = users.filter((user) => {
      return user.age >= 18 && user.age <= 99;
    });

    if (validUsers.length !== users.length) {
      return res.status(400).send({ error: "Some users failed validation" });
    }

    const result = await User.insertMany(validUsers);
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
