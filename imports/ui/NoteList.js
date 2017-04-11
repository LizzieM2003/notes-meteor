import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import { Notes } from '../api/notes';
import NoteListHeader from './NoteListHeader';
import NoteListItem from './NoteListItem';
import NoteListEmptyItem from './NoteListEmptyItem';


export class NoteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: ''
    };
    this.filterNotes = this.filterNotes.bind(this);
    this.renderNoteItems = this.renderNoteItems.bind(this);
  }

  filterNotes (e) {
    this.setState({filter: this.refs.search.value.trimLeft().trimRight().toLowerCase()});
    this.props.Session.set('isNavOpen', true);
  }

  renderNoteItems () {
    if (this.state.filter) {
      const notes = this.props.notes.filter(note => {
        return note.title.toLowerCase().includes(this.state.filter) ||
          note.body.toLowerCase().includes(this.state.filter)
      });
      return notes.map(note => <NoteListItem key={note._id} note={note}/>);
    }
    return this.props.notes.map(note => <NoteListItem key={note._id} note={note}/>);
  }

  render() {
    return (
      <div className="item-list">
        <NoteListHeader/>
        {this.props.notes.length === 0 ? <NoteListEmptyItem /> :
          <input type="text"
            className="filter-item"
            placeholder="Search Notes"
            ref="search"
            value={this.state.filter}
            onChange={this.filterNotes}
          />
          }
        {this.renderNoteItems()}
      </div>
    );
  }
}

// export const NoteList = (props) => {
//   const renderNoteItems = () => {
//     return props.notes.map(note => <NoteListItem key={note._id} note={note}/>);
//   }
//
//   return (
//     <div className="item-list">
//       <NoteListHeader/>
//       {props.notes.length === 0 ? <NoteListEmptyItem /> : undefined }
//       {/* filter notes first then render them */}
//       {renderNoteItems()}
//     </div>
//   );
// };

NoteList.propTypes = {
  notes: React.PropTypes.array.isRequired
};

export default createContainer(() => {
  const selectedNoteId = Session.get('selectedNoteId');
  Meteor.subscribe('notes');

  return {
    notes: Notes.find({}, {
      sort: {updatedAt: -1}
    }).fetch().map(note => {
      const selected = selectedNoteId === note._id;
      return {...note, selected };
    }),
    Session
  };
}, NoteList);
