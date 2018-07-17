UPDATE transactions dest, (SELECT * FROM line_items) src 
  SET dest.isReturn = src.isReturn, dest.returnedQuantity = src.returnedQuantity, dest.wasReturned = src.wasReturned where dest.lineItemId = src.id;
