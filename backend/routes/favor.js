const express = require("express");
const router = express.Router();
const Favor = require("../../models/Favor");
const passport = require("passport");

// Retrieve favor list for a specific user
router.get("/user/:userID", async (req, res) => {
  //passport.authenticate("jwt", { session: false }),
  await Favor.find({"ownerID": req.params.userID}).populate('debtorID','userName').exec()
    .then((favors) => res.status(200).json(favors))
    .catch((err) =>
      res
        .status(400)
        .json({ user: "Error fetching requests of logged in user!" })
    );
});

// Create new favor
router.post(
  "/create",
  //passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const favor = req.body;
    const newFavor = new Favor(favor);
    newFavor
      .save()
      .then((favor) => res.json(favor))
      .catch((err) =>
        res.status(400).json('Error: ' + err)
      );
  }
);

module.exports = router;
