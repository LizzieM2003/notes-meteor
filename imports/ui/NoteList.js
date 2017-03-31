import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Notes } from '../api/notes';
import NoteListHeader from './NoteListHeader';
import NoteListItem from './NoteListItem';
import NoteListEmptyItem from './NoteListEmptyItem';

export const NoteList = (props) => {
  const renderNoteItems = () => {
    return props.notes.map(note => <NoteListItem key={note._id} note={note}/>);
  }

  return (
    <div>
      <NoteListHeader/>
      {props.notes.length === 0 ? <NoteListEmptyItem /> : undefined }
      {renderNoteItems()}
      NoteList { props.notes.length }
    </div>
  );
};

NoteList.propTypes = {
  notes: React.PropTypes.array.isRequired
};

export default createContainer(() => {
  Meteor.subscribe('notes');

  return {
    notes: Notes.find().fetch()
  };
}, NoteList);
