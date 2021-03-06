import React from 'react';
import BooksList from 'components/Books/BooksList';

const Dashboard = () => (
  <div className="row">
    <div
      className="col-sm-8 col-md-7 col-lg-8 offset-lg-2">
      <h4 className="title mb-2 mr-4">Dashboard</h4>
      <div className="mb-4">
        <small>
        Welcome. Here are some books you may find interesting.
        Use the form below to filter through the list.
        </small>
      </div>
      <BooksList />
    </div>
  </div>
);

export default Dashboard;
