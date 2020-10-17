const express = require("express");
const router = express.Router();
const Favor = require("../../models/Favor");
const passport = require("passport");

//test get all favors from db
// router.get("/",async (req,res)=>{
//   await Favor.find().then((favors)=>res.status(200).json(favors)).catch((err)=>{
//     console.log(err);
//   })
// })

// Retrieve favor list for a specific user
router.get("/user/:userID", async (req, res) => {
  passport.authenticate("jwt", { session: false }),
    await Favor.find({ ownerID: req.params.userID })
      .populate("debtorID", "userName")
      .exec()
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
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const favor = req.body;
    const newFavor = new Favor(favor);
    newFavor
      .save()
      .then((favor) => res.json(favor))
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

// Update a specific favor's status as Completed
router.patch(
  "/update/:id",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Favor.update({ _id: req.params.id }, { $set: { isComplete: true } })
      .then(() => res.json("Favor is marked as completed!"))
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

// Delete a specific favor
router.route("/delete/:id").delete(
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Favor.deleteOne({ _id: req.params.id })
      .then(() => res.json("Item Deleted"))
      .catch((err) => res.status(400).json("Error: " + err));
  }
);
module.exports = router;
