exports.getDashboard = async (req, res) => {
  try {
    res.status(200).send("Here is your dashboard!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
