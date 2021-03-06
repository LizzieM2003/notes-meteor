import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import expect from 'expect';
import { mount } from 'enzyme';

import { notes } from '../fixtures/fixtures';
import { Editor } from './Editor';

if (Meteor.isClient) {
  describe('Editor', function() {
    let browserHistory;
    let call;

    beforeEach(function() {
      call = expect.createSpy();
      browserHistory = {
        push: expect.createSpy()
      };
    });

    it('should render pick note message', function() {
      const wrapper = mount(<Editor call={call} browserHistory={browserHistory}/>);
      expect(wrapper.find('p').text()).toBe('Pick or create a note to get started.');
    });

    it('should render note not found message', function() {
      const wrapper = mount(<Editor selectedNoteId="123" call={call} browserHistory={browserHistory} />);
      expect(wrapper.find('p').text()).toBe('Note not found.');
    });

    it('should remove note', function() {
      const selectedNoteId = notes[0]._id
      const wrapper = mount(<Editor note={notes[0]} selectedNoteId={selectedNoteId} call={call} browserHistory={browserHistory} />);
      console.log(wrapper);
      console.log(wrapper.find('button'));
      console.log(wrapper.find('Modal'));
      console.log(wrapper.find('#refButton'));
      const modal = wrapper.find('Modal');
      modal.nodes[0].props.children[1].props.simulate('click');
      expect(call).toHaveBeenCalledWith('notes.remove', selectedNoteId);
      expect(browserHistory.push).toHaveBeenCalledWith('/dashboard');
    });

    it('should update the note body on textarea change', function() {
      const selectedNoteId = notes[0]._id
      const newBody = 'This is my new body text';
      const wrapper = mount(<Editor note={notes[0]} selectedNoteId={selectedNoteId} call={call} browserHistory={browserHistory} />);

      wrapper.find('textarea').simulate('change', {
        target: {
          value: newBody
        }
      });
      expect(wrapper.state('body')).toBe(newBody);
      expect(call).toHaveBeenCalledWith('notes.update', selectedNoteId, { body: newBody });
    });

    it('should update the note title on input change', function() {
      const selectedNoteId = notes[0]._id
      const newTitle = 'This is my new title';
      const wrapper = mount(<Editor note={notes[0]} selectedNoteId={selectedNoteId} call={call} browserHistory={browserHistory} />);

      wrapper.find('input').simulate('change', {
        target: {
          value: newTitle
        }
      });
      expect(wrapper.state('title')).toBe(newTitle);
      expect(call).toHaveBeenCalledWith('notes.update', selectedNoteId, { title: newTitle });
    });

    it('should set state for new note', function() {
      const wrapper = mount(<Editor call={call} browserHistory={browserHistory}/>);

      wrapper.setProps({
        selectedNoteId: notes[0]._id,
        note: notes[0]
      });

      expect(wrapper.state('title')).toBe(notes[0].title);
      expect(wrapper.state('body')).toBe(notes[0].body);
    });

    it('should not set state if note prop not provided', function() {
      const wrapper = mount(<Editor call={call} browserHistory={browserHistory}/>);

      wrapper.setProps({
        selectedNoteId: notes[0]._id
      });

      expect(wrapper.state('title')).toBe('');
      expect(wrapper.state('body')).toBe('');
    });
  });
}
