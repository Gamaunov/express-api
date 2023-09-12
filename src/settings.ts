import express, { Request, Response } from "express";
import { HTTP_STATUSES } from "./consts/http-statuses";
export const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

const products = [
  { id: 1, title: "tomato" },
  { id: 2, title: "orange" },
];

app.get("/", (req: Request, res: Response) => {
  res.send("send this");
});

app.get("/products", (req: Request, res: Response) => {
  const titleParam = req.query.title;

  if (typeof titleParam === "string") {
    const searchString = titleParam.toLowerCase();
    const filteredProducts = products.filter((p) =>
      p.title.toLowerCase().includes(searchString),
    );
    res.send(filteredProducts);
  } else {
    res.send(products);
  }
});

app.post("/products", (req: Request, res: Response) => {
  const newProduct = {
    id: +new Date(),
    title: req.body.title,
  };

  products.push(newProduct);
  res.sendStatus(HTTP_STATUSES.CREATED_201).send(newProduct);
});

app.get("/products/:id", (req: Request, res: Response) => {
  let product = products.find((p) => p.id === +req.params.id);

  if (product) {
    res.send(product);
  } else {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
});

app.put("/products/:id", (req: Request, res: Response) => {
  let product = products.find((p) => p.id === +req.params.id);

  if (product) {
    product.title = req.body.title;
    res.send(product);
  } else {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
});

app.delete("/products/:id", (req: Request, res: Response) => {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === +req.params.id) {
      products.splice(i, 1);
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
      return;
    }
  }

  res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});
