import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchQuestion = createAsyncThunk(
  'quiz/fetchQuestion',
  async () => {
    const response = await api.get('/questions/random');
    return response.data;
  }
);

export const submitAnswer = createAsyncThunk(
  'quiz/submitAnswer',
  async (answer, { getState }) => {
    const { currentQuestion } = getState().quiz;
    const response = await api.post('/answers', {
      questionId: currentQuestion.id,
      answer,
    });
    return response.data;
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    currentQuestion: null,
    isLoading: false,
    result: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuestion = action.payload;
        state.result = null;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.result = action.payload;
      });
  },
});

export default quizSlice.reducer;