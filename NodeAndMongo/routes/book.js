import db from "../conf/Mongodb.js";
import express from "express";

const router = express.Router();

const booksCollection = db.collection("books");
//1
router.post("/", async (req, res) => {
  try {
    const bookToAdd = {
      _id: req.body.title,
      subtitle: req.body.subtitle,
      authors: req.body.authors,
      publisher: req.body.publisher,
      description: req.body.description,
      pageCount: req.body.pageCount,
      averageRating: req.body.averageRating,
      language: req.body.language,
    };
    const result = await booksCollection.insertOne(bookToAdd);
    res.json(result);
  } catch (err) {
    res.send("Error " + err);
  }
});
//2
router.post("/insert-many", async (req, res) => {
  try {
    const booksToAdd = req.body.map((book) => {
      return {
        _id: book.title,
        subtitle: book.subtitle,
        authors: book.authors,
        publisher: book.publisher,
        description: book.description,
        pageCount: book.pageCount,
        averageRating: book.averageRating,
        language: book.language,
      };
    });
    const result = await booksCollection.insertMany(booksToAdd);
    res.json(result);
  } catch (err) {
    res.send("Error " + err);
  }
});

//3
router.get("/title/:title", async (req, res) => {
  try {
    const result = await booksCollection.find({ _id: req.params.title });
    const allBooks = await scanCursor(result);
    await res.json(allBooks);
  } catch (err) {
    res.send("Error " + err);
  }
});
//4
router.get("/author/:author", async (req, res) => {
  try {
    const result = await booksCollection.find({ authors: req.params.author });
    const allBooks = await scanCursor(result);
    await res.json(allBooks);
  } catch (err) {
    res.send("Error " + err);
  }
});

//5
router.get("/rating/:title", async (req, res) => {
  try {
    const result = await booksCollection
      .find({ _id: req.params.title })
      .project({ averageRating: 1 });
    const allBooks = await scanCursor(result);
    await res.json(allBooks);
  } catch (err) {
    res.send("Error " + err);
  }
});

//6
router.get("/get-all-sorted-by-rating", async (req, res) => {
  try {
    const result = await booksCollection.find({}).sort({ averageRating: 1 });
    const allBooks = await scanCursor(result);
    await res.json(allBooks);
  } catch (err) {
    res.send("Error " + err);
  }
});

//7
router.get("/get-by-page-number/:pagesNumeber", async (req, res) => {
  try {
    const result = await booksCollection.find({
      pageCount: { $lt: Number(req.params.pagesNumeber) },
    });
    const allBooks = await scanCursor(result);
    await res.json(allBooks);
  } catch (err) {
    res.send("Error " + err);
  }
});

//8
router.get("/get-total-pages-by-number", async (req, res) => {
  try {
    const result = await booksCollection.aggregate([
      { $group: { _id: "$language", totalPagesCount: { $sum: "$pageCount" } } },
    ]);
    const allBooks = await scanCursor(result);
    await res.json(allBooks);
  } catch (err) {
    res.send("Error " + err);
  }
});

//9
router.put("/", async (req, res) => {
  const updateDoc = {
    $set: {
      _id: book.title,
      subtitle: book.subtitle,
      authors: book.authors,
      publisher: book.publisher,
      description: book.description,
      pageCount: book.pageCount,
      averageRating: book.averageRating,
      language: book.language,
    },
  };

  const result = await booksCollection.updateMany(
    { subtitle: req.body.subtitle },
    updateDoc
  );
  res.json(result);
});

router.delete("/:wordToDelete", async (req, res) => {
  const result = await booksCollection.deleteMany({
    description: { $regex: /Here/ },
  });
  res.json(result);
});

const scanCursor = async (result) => {
  const allBooks = [];
  await result.forEach((document) => {
    allBooks.push(document);
  });
  return allBooks;
};

export default router;
