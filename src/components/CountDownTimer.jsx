import React, { useState, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';

const CountdownTimer = ({ initialMinutes, logoutFunction }) => {
  const storedTime = localStorage.getItem('timeLeft');
  const initialTime = storedTime ? parseInt(storedTime, 10) : initialMinutes * 60;

  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        localStorage.setItem('timeLeft', newTime);
        return newTime;
      });
    }, 1000);

    if (timeLeft <= 0) {
      clearInterval(timer);
      logoutFunction();
    }

    return () => clearInterval(timer);
  }, [timeLeft, logoutFunction]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Box
      d="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      p={2}
      borderRadius="md"
      boxShadow="lg"
      bg="red.300"
    >
      <Text fontSize="sm">
        Tiempo de sesión:
      </Text>
      <Text fontSize="md" fontWeight="bold">
        {formatTime(timeLeft)}
      </Text>
    </Box>
  );
};

export default CountdownTimer;
