import { app } from "./settings";

const port = process.env.PORT || 3006;

app.listen(port, () => {
  console.log(`listening port: ${port}`);
});
