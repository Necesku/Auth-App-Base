const app = require("express")();
const { router } = require("./users/router.js");

app.use("/users/", router);

app.listen(3000, () => {
    console.log("✅ | Started on port 3000!");
})