const test = function (req, res) {
  res.status(200).send({
    status: true,
  });
};

module.exports = {
  test: test
}