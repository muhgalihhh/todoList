import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Avatar,
  Chip,
  Alert
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';

const ChatApp = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Halo! Saya adalah AI Assistant yang terhubung dengan Cursor API. Bagaimana saya bisa membantu Anda hari ini?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessageToCursorAPI = async (message) => {
    try {
      const apiKey = import.meta.env.VITE_CURSOR_API_KEY;
      const apiUrl = import.meta.env.VITE_CURSOR_API_URL || 'https://api.cursor.sh/v1';
      const model = import.meta.env.VITE_CURSOR_MODEL || 'cursor-small';

      if (!apiKey) {
        throw new Error('API key tidak ditemukan. Silakan atur VITE_CURSOR_API_KEY di file .env');
      }

      const response = await axios.post(`${apiUrl}/chat/completions`, {
        model: model,
        messages: [
          { role: 'user', content: message }
        ],
        max_tokens: 150,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Cursor API:', error);
      
      // Enhanced error handling
      if (error.response?.status === 401) {
        throw new Error('API key tidak valid. Silakan periksa kembali VITE_CURSOR_API_KEY Anda.');
      } else if (error.response?.status === 429) {
        throw new Error('Terlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server Cursor API sedang bermasalah. Silakan coba lagi nanti.');
      }
      
      // Fallback response for demo purposes when API is not configured
      if (error.message.includes('API key tidak ditemukan')) {
        const responses = [
          "Saya adalah demo AI Chat Assistant. Untuk menghubungkan ke Cursor API yang sesungguhnya, silakan atur API key Anda di file .env",
          "Ini adalah mode demo. Terima kasih atas pertanyaan Anda! Sebagai AI assistant, saya siap membantu dengan berbagai tugas programming dan coding.",
          "Mode demo aktif. Saya dapat membantu Anda dengan penulisan kode, debugging, dan memberikan saran tentang best practices dalam development.",
          "Demo mode: Apakah ada proyek coding tertentu yang sedang Anda kerjakan? Saya siap membantu!"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
      }
      
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      const aiResponse = await sendMessageToCursorAPI(inputMessage);
      
      // Simulate typing delay
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      setError('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', py: 2 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
            <BotIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
              AI Chat Assistant
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Powered by Cursor API
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Chip 
              label="Online" 
              size="small" 
              sx={{ 
                bgcolor: '#4caf50', 
                color: 'white',
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  marginRight: 1
                }
              }} 
            />
          </Box>
        </Box>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Messages Container */}
      <Paper 
        elevation={1} 
        sx={{ 
          flex: 1, 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#f8f9fa'
        }}
      >
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                gap: 1,
                maxWidth: '80%',
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
              }}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: message.sender === 'user' ? '#2196f3' : '#ff9800'
                  }}
                >
                  {message.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                </Avatar>
                
                <Box>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: message.sender === 'user' ? '#2196f3' : 'white',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2,
                      borderTopLeftRadius: message.sender === 'user' ? 2 : 0.5,
                      borderTopRightRadius: message.sender === 'user' ? 0.5 : 2,
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.text}
                    </Typography>
                  </Paper>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      mt: 0.5,
                      display: 'block',
                      textAlign: message.sender === 'user' ? 'right' : 'left'
                    }}
                  >
                    {message.timestamp}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff9800' }}>
                <BotIcon />
              </Avatar>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  borderTopLeftRadius: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  AI sedang mengetik
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {[0, 1, 2].map((dot) => (
                    <Box
                      key={dot}
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        bgcolor: '#666',
                        animation: 'typing 1.4s infinite ease-in-out',
                        animationDelay: `${dot * 0.16}s`,
                        '@keyframes typing': {
                          '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
                          '40%': { transform: 'scale(1)', opacity: 1 }
                        }
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: 'white' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan Anda di sini..."
              variant="outlined"
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: '#f5f5f5'
                }
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{
                bgcolor: '#2196f3',
                color: 'white',
                width: 48,
                height: 48,
                '&:hover': {
                  bgcolor: '#1976d2'
                },
                '&.Mui-disabled': {
                  bgcolor: '#ccc'
                }
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
            </IconButton>
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatApp;