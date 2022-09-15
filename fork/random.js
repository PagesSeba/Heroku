const generateRandomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomsNum = (cant) => {
  let nums = {};
  if (cant) {
    for (let i = 0; i < cant; i++) {
      let num = generateRandomNum(1, 1000);
      nums[num.toString()]
        ? (nums[num.toString()] = nums[num.toString()] + 1)
        : (nums[num.toString()] = 1);
    }
  } else {
    for (let i = 0; i < 1e8; i++) {
      let num = generateRandomNum(1, 1000);
      nums[num.toString()]
        ? (nums[num.toString()] = nums[num.toString()] + 1)
        : (nums[num.toString()] = 1);
    }
  }
  return nums;
};

process.on("message", (msg) => {
  const nums = getRandomsNum(parseInt(msg));
  process.send(nums);
});

process.send("listo");
