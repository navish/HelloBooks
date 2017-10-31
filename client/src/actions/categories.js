import axios from 'axios';
import types from './types';
import { addFlashMessage } from './flashMessages';

const { API_VERSION } = window;
const {
  CATEGORY_ADDED,
  CATEGORY_FETCHED,
  CATEGORY_EDITED,
  CATEGORY_DELETED
} = types;

export const categoryAdded = category => ({
  type: CATEGORY_ADDED,
  category
});

export const categoryFetched = category => ({
  type: CATEGORY_FETCHED,
  category
});

export const categoryEdited = category => ({
  type: CATEGORY_EDITED,
  category
});

export const categoryDeleted = id => ({
  type: CATEGORY_DELETED,
  id
});

export const addBookCategory = data =>
  dispatch =>
    axios
      .post(`/api/${API_VERSION}/books/categories`, data)
      .then(
        (response) => {
          dispatch(categoryAdded(response.data.category));
          dispatch(addFlashMessage({
            type: 'success',
            text: response.data
          }));
          return response;
        },
        (errors) => {
          dispatch(addFlashMessage({
            type: 'error',
            text: errors.response.data
          }));
          return errors;
        }
      );

export const getBookCategories = () =>
  dispatch =>
    axios
      .get(`/api/${API_VERSION}/books/categories`)
      .then(
        (response) => {
          dispatch(categoryFetched(response.data.data));
          return response;
        },
        (errors) => {
          dispatch(addFlashMessage({
            type: 'error',
            text: errors.response.data
          }));
          return errors;
        }
      );

export const editBookCategory = data =>
  dispatch =>
    axios
      .put(`/api/${API_VERSION}/books/categories/${data.id}`, data)
      .then(
        (response) => {
          dispatch(categoryEdited(response.data.data));
          dispatch(addFlashMessage({
            type: 'success',
            text: response.data
          }));
          return response;
        },
        (errors) => {
          dispatch(addFlashMessage({
            type: 'error',
            text: errors.response.data
          }));
          return errors;
        }
      );

export const deleteBookCategory = data =>
  dispatch =>
    axios
      .delete(`/api/${API_VERSION}/books/categories/${data.id}`, data)
      .then(
        (response) => {
          dispatch(categoryDeleted(data.id));
          dispatch(addFlashMessage({
            type: 'success',
            text: response.data
          }));
          return response;
        },
        (errors) => {
          dispatch(addFlashMessage({
            type: 'error',
            text: errors.response.data
          }));
          return errors;
        }
      );
