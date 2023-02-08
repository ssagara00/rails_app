import React from "react";
import axios from 'axios';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Item from '../posts/Item';
import { Post } from '../../interfaces/interface';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Post CRUD', () => {
  beforeEach(() => {
    //jest.clearAllMocks()
  })

  const setupList = () => {
    const post: Post = { id: 1, user_id: 1, title: 'first', contents: 'sampleA' };
    const setPosts = jest.fn();

//const ini = [{id: 1, user_id: 1, title: 'first', contents: 'sampleA',},{id: 2, user_id: 1, title: 'second', contents: 'sampleB',},{id: 3, user_id: 1, title: 'third', contents: 'sampleC',},];
//const ini = {user_id: 1, title: 'first', contents: 'sampleA'};
    //setPosts(ini);
    //mockedAxios.get.mockResolvedValue({ data: [{ id: 1, user_id: 1, title: 'first', contents: 'sampleA' }]});

//mockedAxios.get.mockResolvedValue({ data: [{ id: 1, user_id: 1, title: 'first', contents: 'sampleA' }]});

render(<Item post={post} setPosts={setPosts} />);
    //render(<List posts={posts} setPosts={setPosts} />);
  }

  it('onClick check', async() => {
    setupList();
    await waitFor(() => {
      //const listElements = screen.findAllByRole('listitem');
      //expect(listElements).toHaveLength(1);
    })
  });

});
