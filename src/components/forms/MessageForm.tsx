import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import Button from '../ui/Button';

interface MessageFormProps {
  onSendMessage: (content: string) => void;
  className?: string;
  placeholder?: string;
}

const MessageForm: React.FC<MessageFormProps> = ({
  onSendMessage,
  className = '',
  placeholder = 'Type your message...',
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      onSendMessage(message.trim());
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-end space-x-2 ${className}`}>
      <div className="flex-grow">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 resize-none"
        />
      </div>
      <Button
        type="submit"
        disabled={!message.trim() || isSubmitting}
        className="mb-1"
        rightIcon={<SendHorizontal className="w-4 h-4" />}
      >
        Send
      </Button>
    </form>
  );
};

export default MessageForm;