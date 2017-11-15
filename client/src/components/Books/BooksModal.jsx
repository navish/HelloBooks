import {
  onClickOpenBookCover
} from 'assets/js/modal';
import {
  addBook,
  updateBook,
  getBook,
  setBooks
} from 'actions/books';
import Modal from 'Modal';
import Button from 'form/Button';
import InputField from 'form/InputField';
import Textarea from 'form/TextareaField';
import { addFlashMessage } from 'actions/flashMessages';
import { isImage, isPDF } from 'utils';
import { getBookCategories } from 'actions/categories';
import validateBook from 'utils/validators/book';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Document, Page } from 'react-pdf';
import UploadBookCover from './UploadBookCover';

/**
 * @class BooksModal
 * @extends {Component}
 */
class BooksModal extends Component {
  /**
     * Creates an instance of BooksModal.
     * @param {object} props
     * @memberof BooksModal
     */
  constructor(props) {
    super(props);
    this.state = {
      done: false,
      isLoading: false,
      showCoverBook: false,
      imageSrc: '',
      oldImageURL: this.props.book ? this.props.book.coverPhotoPath : '',
      oldDocumentURL: this.props.book ? this.props.book.documentPath : '',
      categories: [],
      clientErrors: {},
      serverErrors: '',
      isOpenModal: false,
      book: {
        id: this.props.book ? this.props.book.id : null,
        title: this.props.book ? this.props.book.title : '',
        description: this.props.book ? this.props.book.description : '',
        bookURL: this.props.book ? this.props.book.bookURL : '',
        stockQuantity: '',
        ISBN: this.props.book ? this.props.book.ISBN : '',
        publishedDate: this.props.book ? this.props.book.publishedDate : '',
        author: this.props.book ? this.props.book.author : '',
        bookCategoryId: this.props.book ? this.props.book.bookCategoryId : '',
        coverPhotoPath: this.props.book ? this.props.book.coverPhotoPath : '',
        documentPath: this.props.book ? this.props.book.documentPath : ''
      }
    };

    this.onChange = this.onChange.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.onChangeUploadInput = this.onChangeUploadInput.bind(this);
    this.onChangeUploadFile = this.onChangeUploadFile.bind(this);
    this.onClickOk = this.onClickOk.bind(this);
    this.closeOnClick = this.closeOnClick.bind(this);
    this.onChangePublishedDate = this.onChangePublishedDate.bind(this);
    this.toggleOpenModal = this.toggleOpenModal.bind(this);
    this.goToBooksPage = this.goToBooksPage.bind(this);
  }


  /**
     * @returns {void}
     * @memberof BooksModal
     */
  componentDidMount() {
    this.setState({ isOpenModal: true });
    this.props.getCategoriesAction();
  }


  /**
     * @returns {void}
     * @param {object} nextProps
     * @memberof BooksModal
     */
  componentWillReceiveProps(nextProps) {
    if (this.props.params.id && this.props.book !== nextProps.book) {
      this.setState({
        book: { ...nextProps.book }
      });
    }
    if (this.props.coverPhotoPath !== nextProps.coverPhotoPath) {
      this.setState({
        book: {
          ...this.state.book,
          coverPhotoPath: nextProps.coverPhotoPath
        }
      });
    }
    if (this.props.categories !== nextProps.categories) {
      this.setState({ categories: nextProps.categories });
    }
  }

  /**
 * @returns {void}
 * @memberof BooksModal
 */
  goToBooksPage() {
    this.context.router.push('/books');
  }

  /**
 * @returns {void}
 * @memberof BooksModal
 */
  toggleOpenModal() {
    this.setState({
      isOpenModal: !this.state.isOpenModal
    });
  }

  /**
     * @returns {void}
     * @param {object} event
     * @memberof BooksModal
     */
  closeOnClick(event) {
    event.preventDefault();
    this.setState({
      showCoverBook: false,
      imageSrc: '',
      book: {
        ...this.state.book,
        coverPhotoPath: ''
      }
    });
  }


  /**
   * @returns {boolean} isFormValid
   * @memberof BooksModal
   */
  isFormValid() {
    const { errors, isValid } = validateBook(this.state.book);
    if (!isValid) {
      this.setState({ clientErrors: errors });
    }
    return isValid;
  }

  /**
     * @return {void}
     * @param {object} event
     * @memberof BooksModal
     */
  onClickSubmit(event) {
    event.preventDefault();

    if (!this.isFormValid()) { return; }

    this.setState({ isLoading: true });

    const bookData = {
      ...this.state.book,
      oldImageURL: this.state.oldImageURL,
      oldDocumentURL: this.state.oldDocumentURL
    };

    if (this.props.params.id) {
      this.props.updateBook(bookData)
        .then(
          () => {
            this.setState({
              isLoading: false,
              isOpenModal: false
            });
          },
          (errors) => {
            const errorMessage =
            typeof errors.message === 'string' ?
              errors.message :
              errors.response.data;
            this.setState({
              isLoading: false,
              serverErrors: errorMessage
            });
          }
        );
    } else {
      this.props.addBook(bookData)
        .then(
          (response) => {
            this.setState({
              isLoading: false,
              isOpenModal: false
            });
            this.props.addFlashMessage({
              type: 'success',
              text: response.data
            });
          },
          (errors) => {
            const errorMessage =
            typeof errors.message === 'string' ?
              errors.message :
              errors.response.data;
            this.setState({
              isLoading: false,
              serverErrors: errorMessage
            });
          }
        );
    }
  }

  /**
     * @param {object} event
     * @returns {void}
     * @memberof BooksModal
     */
  onChangeUploadInput(event) {
    const files = event.target.files[0];
    if (!window.FileReader) return;
    if (isImage(files.type)) {
      const reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onloadend = (result) => {
        this.setState({
          showCoverBook: true,
          imageSrc: result.target.result
        });
      };
    } else {
      this.setState({
        serverErrors: 'Cover photo must be of image type'
      });
    }
  }

  /**
     * @param {object} event
     * @returns {object} JSX
     * @memberof BooksModal
     */
  onChangeUploadFile(event) {
    const files = event.target.files[0];
    // no file selected, or no FileReader support
    if (!window.FileReader) return;
    // only image file
    if (isPDF(files.type)) {
      const reader = new FileReader(); // instance of the FileReader
      reader.readAsDataURL(files);
      reader.onloadend = (result) => {
        this.setState({
          book: {
            ...this.state.book,
            documentPath: result.target.result
          }
        });
      };
    } else {
      this.setState({
        serverErrors: 'File must be of PDF type'
      });
    }
  }


  /**
     * @returns {void}
     * @memberof BooksModal
     */
  onClickOk() {
    this.setState({ showCoverBook: false });
  }


  /**
     * @returns {void}
     * @param {object} event
     * @memberof BooksModal
     */
  onChange(event) {
    const { book } = this.state;
    const newBook = {
      ...book,
      [event.target.name]: event.target.value
    };
    this.setState({ book: newBook });
  }

  /**
     * @returns {void}
     * @param {string} date
     * @memberof BooksModal
     */
  onChangePublishedDate(date) {
    const { book } = this.state;
    const newBook = {
      ...book,
      publishedDate: date
    };
    this.setState({ book: newBook });
  }

  /**
     * @returns {object} JSX
     * @memberof BooksModal
     */
  render() {
    const {
      showCoverBook,
      clientErrors,
      serverErrors,
      categories
    } = this.state;
    const {
      coverPhotoPath,
      id: bookId,
      documentPath: fileData
    } = this.state.book;
    const headerOptions = [
      (
        <span
          key="triggerUpload"
          className="d-inline-flex"
        >
          <InputField
            type="file"
            id="triggerUploadInput"
            name="triggerUploadInput"
            hide
            onChange={this.onChangeUploadInput}
            accept="image/*" />

          <Button
            className="btn-sm btn-light mr-sm-1"
            icon="image"
            onClick = {(event) => onClickOpenBookCover(event, 'triggerUploadInput')}
          >
            <span className="hidden-xs-down">
              {coverPhotoPath ? 'Change' : 'Add'} cover
            </span>
          </Button>
        </span>
      ),
      (<span key="triggerUploadDoc" className="d-inline-flex"
      >
        <InputField
          type="file"
          id="triggerUploadDoc"
          hide
          name="triggerUploadDoc"
          onChange={this.onChangeUploadFile}
          accept="application/pdf"
        />

        <Button
          key="triggerUploadDoc"
          className="btn-sm btn-default"
          icon="folder"
          onClick = {(event) => onClickOpenBookCover(event, 'triggerUploadDoc')}
        >
          <span
            className="hidden-xs-down">
            {fileData ? 'Change' : 'Add'} file
          </span>
        </Button>
      </span>
      )
    ];
    return (
      <Modal
        isOpenModal={this.state.isOpenModal}
        backdrop="static"
        toggleOpenModal={this.toggleOpenModal}
        title={showCoverBook ? 'Upload cover photo' : 'Manage a book'}
        size="lg"
        headerOptions={headerOptions}
        btnClass = "btn-success"
        btnLabel= {showCoverBook ? 'Ok' : 'Submit'}
        closeLabel = {showCoverBook ? 'Cancel' : 'Close'}
        closeOnClick = {showCoverBook ? this.closeOnClick : this.toggleOpenModal}
        onClosed = {this.goToBooksPage}
        btnOnClick={showCoverBook ? this.onClickOk : this.onClickSubmit}
        btnDisabled={this.state.isLoading}
      >
        {serverErrors &&
          <div className="alert alert-danger">
            {serverErrors.message || serverErrors}
          </div>
        }
        {clientErrors.coverPhotoPath &&
          <div className="alert alert-danger">
            {clientErrors.coverPhotoPath}
          </div>
        }

        {clientErrors.documentPath &&
          <div className="alert alert-danger">
            {clientErrors.documentPath}
          </div>
        }

        { showCoverBook ?
          (
            <UploadBookCover
              id="upload-cover"
              imageSrc={this.state.imageSrc} />
          ) :

          (
            <div>
              <div className="row" id="addBookForm">
                <div className="col-sm-6">
                  <InputField
                    label="Title"
                    name="title"
                    value={this.state.book.title}
                    icon="pencil"
                    onChange={this.onChange} />
                  {clientErrors.title &&
                    <p className="form-text text-danger">
                      {clientErrors.title}
                    </p> }
                </div>
                <div className="col-sm-6 mdb-form form-sm">
                  <label>Book category</label>
                  <select
                    className="form-control"
                    name="bookCategoryId"
                    value={this.state.book.bookCategoryId}
                    onChange={this.onChange}>
                    <option value="0">
                        Book category...
                    </option>
                    {
                      categories.map(category => (
                        <option
                          key={category.id}
                          value={category.id}>
                          {category.name}
                        </option>
                      ))
                    }
                  </select>
                  {clientErrors.bookCategoryId &&
                    <p className="form-text text-danger">
                      {clientErrors.bookCategoryId}
                    </p> }
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <InputField
                    label="Book author"
                    name="author"
                    icon="user"
                    value={this.state.book.author}
                    onChange={this.onChange} />
                  {clientErrors.author &&
                    <p className="form-text text-danger">
                      {clientErrors.author}
                    </p> }
                </div>
                { !bookId &&
                  <div className="col-sm-6">
                    <InputField
                      label="Number of copies"
                      name="stockQuantity"
                      icon="hashtag"
                      value={this.state.book.stockQuantity}
                      onChange={this.onChange} />
                    {clientErrors.stockQuantity &&
                    <p className="form-text text-danger">
                      {clientErrors.stockQuantity}
                    </p> }
                  </div>
                }
                <div className="col-sm-6">
                  <InputField
                    label="ISBN"
                    name="ISBN"
                    icon="th-large"
                    value={this.state.book.ISBN}
                    onChange={this.onChange} />
                  {clientErrors.ISBN &&
                    <p className="form-text text-danger">
                      {clientErrors.ISBN}
                    </p> }
                </div>
                <div className="col-sm-6">
                  <InputField
                    label="Book url"
                    name="bookURL"
                    icon="link"
                    value={this.state.book.bookURL}
                    onChange={this.onChange} />
                  {clientErrors.bookURL &&
                    <p className="form-text text-danger">
                      {clientErrors.bookURL}
                    </p> }
                </div>
                <div className="col-sm-6">
                  <InputField
                    label="Published Year"
                    name="publishedDate"
                    icon="calendar"
                    value={this.state.book.publishedDate}
                    onChange={this.onChange} />
                  {clientErrors.publishedDate &&
                    <p className="form-text text-danger">
                      {clientErrors.publishedDate}
                    </p> }
                </div>
              </div>
              <div className="mt-3">
                <Textarea
                  name="description"
                  placeholder="Description for this book"
                  rows="5"
                  className="form-control"
                  value={this.state.book.description}
                  onChange={this.onChange} />
                {clientErrors.description &&
                      <p className="form-text text-danger">
                        {clientErrors.description}
                      </p>
                }
              </div>
              <div className="row">
                {coverPhotoPath && <div className="col-sm-5">
                  <img
                    src={coverPhotoPath}
                    alt="Book cover"
                    style={{ width: 'auto', height: '300px' }} />
                </div>
                }
                {fileData && <div className="col-sm-7">
                  <Document
                    file={fileData}
                  >
                    <Page
                      pageNumber={1}
                      width={250}
                    />
                  </Document>
                </div>
                }
              </div>
            </div>
          )}
      </Modal>
    );
  }
}

BooksModal.contextTypes = {
  router: PropTypes.object.isRequired
};

BooksModal.propTypes = {
  book: PropTypes.object,
  coverPhotoPath: PropTypes.string,
  addFlashMessage: PropTypes.func.isRequired,
  addBook: PropTypes.func.isRequired,
  updateBook: PropTypes.func.isRequired,
  getBook: PropTypes.func.isRequired,
  setBooks: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  getCategoriesAction: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired
};

const mapStateToProps = (state, props) => {
  if (props.params.id && state.books && state.books) {
    return {
      book: state.books
        .find(item => item.id === parseInt(props.params.id, 10)),
      coverPhotoPath: state.cropper.coverPhotoPath,
      categories: state.categories
    };
  }
  return {
    book: null,
    coverPhotoPath: state.cropper.coverPhotoPath,
    categories: state.categories
  };
};

export default connect(mapStateToProps, {
  addFlashMessage,
  addBook,
  updateBook,
  getBook,
  setBooks,
  getCategoriesAction: getBookCategories
})(BooksModal);