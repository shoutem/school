export function renderBuyTitle(book) {
  let buyTitle = 'BUY THIS BOOK';
  if (book.buyLinkTitle) {
    buyTitle = book.buyLinkTitle.toUpperCase();
  }
  return buyTitle;
}

