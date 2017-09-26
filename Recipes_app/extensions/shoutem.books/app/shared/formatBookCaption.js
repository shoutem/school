export function formatBookCaption(book) {
  let authorAndPrice;
  if (book.author && book.price) {
    authorAndPrice = `${book.author}    •   ${book.price}`;
  } else {
    authorAndPrice = book.author || book.price;
  }
  return authorAndPrice;
}

