import express from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';

const {
  UserClass,
  BookClass,
  StockManagerClass,
  BookCategoryClass,
  SearchClass,
  NotificationClass
} = controllers;
const {
  middleware: authMiddleware,
  adminMiddleware
} = middlewares;

const router = express.Router();

router.get('/', (req, res) =>
  res
    .send({
      message: 'Hello, welcome to Hello-Books Api version 1'
    }));

router.post('/users/signup', UserClass.signup);
router.post('/users/signin', UserClass.signin);

router.post('/users/reset-password', UserClass.sendResetPasswordMail);
router.post('/users/reset-password/verify', UserClass.resetPassword);

router.route('/users/:userId/books')
  .post(authMiddleware, BookClass.borrowBook)
  .get(authMiddleware, BookClass.getBorrowedBook);

router.route('/users/:userId/books/:borrowedBookId')
  .put(authMiddleware, BookClass.returnBorrowedBook);

router.route('/users')
  .get(authMiddleware, UserClass.getUsers);

router.route('/users/:userId')
  .get(authMiddleware, UserClass.getUsers)
  .put(authMiddleware, UserClass.updateUser);

router.route('/books')
  .get(authMiddleware, BookClass.get)
  .post(authMiddleware, BookClass.create);

router.route('/notifications')
  .get(authMiddleware, adminMiddleware, NotificationClass.get);

router.route('/books/stocks')
  .post(authMiddleware, adminMiddleware, StockManagerClass.create)
  .get(authMiddleware, adminMiddleware, StockManagerClass.get);

router.route('/books/categories')
  .post(authMiddleware, adminMiddleware, BookCategoryClass.add)
  .get(authMiddleware, BookCategoryClass.get);

router.route('/books/histories/:userId')
  .get(authMiddleware, BookClass.getHistories);

router.route('/books/:id')
  .get(authMiddleware, authMiddleware, BookClass.get)
  .delete(authMiddleware, adminMiddleware, BookClass.delete);

router.route('/books/:bookId')
  .put(authMiddleware, authMiddleware, BookClass.edit);

router.route('/books/categories/:categoryId')
  .put(authMiddleware, adminMiddleware, BookCategoryClass.update)
  .delete(authMiddleware, adminMiddleware, BookCategoryClass.delete);

router.route('/books/stocks/:stockId')
  .delete(authMiddleware, adminMiddleware, StockManagerClass.delete);

router.route('/search')
  .get(authMiddleware, SearchClass.get);

export default router;
