import React, { useState, useEffect } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestion, submitAnswer } from '../redux/quizSlice';
import QuestionCard from '../components/QuestionCard';
import OptionButton from '../components/OptionButton';
import ResultOverlay from '../components/ResultOverlay';
import { fadeIn, slideIn } from '../utils/animations';

const QuizScreen = () => {
  const dispatch = useDispatch();
  const { currentQuestion, isLoading, result } = useSelector(state => state.quiz);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));

  useEffect(() => {
    dispatch(fetchQuestion());
  }, []);

  useEffect(() => {
    if (currentQuestion) {
      fadeIn(fadeAnim);
      slideIn(slideAnim);
    }
  }, [currentQuestion]);

  const handleAnswer = (answer) => {
    dispatch(submitAnswer(answer));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <QuestionCard
          question={currentQuestion.question}
          image={currentQuestion.image}
        />
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <OptionButton
              key={index}
              option={option}
              onPress={() => handleAnswer(option)}
            />
          ))}
        </View>
      </Animated.View>
      {result && <ResultOverlay result={result} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  optionsContainer: {
    marginTop: 20,
  },
});

export default QuizScreen;