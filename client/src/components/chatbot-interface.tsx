import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface ChatbotInterfaceProps {
  messages: {
    sender: "user" | "bot";
    content: string;
  }[];
  suggestedQuestions: string[];
  onSendMessage: (message: string) => void;
}

export default function ChatbotInterface({
  messages,
  suggestedQuestions,
  onSendMessage,
}: ChatbotInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    await onSendMessage(inputValue);
    setInputValue("");
    setIsLoading(false);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    onSendMessage(question);
  };

  // Scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden animated-element">
        <div className="flex flex-col md:flex-row h-96">
          <div className="w-full md:w-1/3 bg-primary p-4 text-white">
            <h3 className="text-xl font-bold mb-4">How I Can Help</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex">
                <i className="fa-solid fa-map-marker-alt mt-1 mr-3"></i>
                <span>Suggest optimal locations for new infrastructure</span>
              </li>
              <li className="flex">
                <i className="fa-solid fa-coins mt-1 mr-3"></i>
                <span>Provide budget estimates and financial planning</span>
              </li>
              <li className="flex">
                <i className="fa-solid fa-leaf mt-1 mr-3"></i>
                <span>Analyze environmental impact of your development plans</span>
              </li>
              <li className="flex">
                <i className="fa-solid fa-users mt-1 mr-3"></i>
                <span>Assess community needs and suggest priorities</span>
              </li>
              <li className="flex">
                <i className="fa-solid fa-lightbulb mt-1 mr-3"></i>
                <span>Share innovative sustainable development ideas</span>
              </li>
              <li className="flex">
                <i className="fa-solid fa-question-circle mt-1 mr-3"></i>
                <span>Answer questions about game mechanics and rules</span>
              </li>
            </ul>
          </div>
          
          <div className="w-full md:w-2/3 flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto bg-neutral bg-opacity-30" id="chatMessages">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : ''} mb-4 animate-fadeIn`}>
                  {message.sender === 'bot' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white mr-2 flex-shrink-0 shadow-md">
                      <span className="text-lg">🧠</span>
                    </div>
                  )}
                  
                  <div className={`${
                    message.sender === 'bot' 
                      ? 'bg-gradient-to-r from-primary/20 to-blue-500/15 border-l-4 border-primary shadow-md' 
                      : 'bg-gradient-to-r from-accent/20 to-green-500/15 border-r-4 border-accent shadow-md'
                    } rounded-lg py-3 px-4 max-w-md`}
                  >
                    <p className="text-sm text-foreground font-medium">
                      {message.content}
                    </p>
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-green-500 flex items-center justify-center text-white ml-2 flex-shrink-0 shadow-md">
                      <span className="text-lg">👤</span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 border-t border-gray-200">
              <form onSubmit={handleSubmit} className="flex">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about village development..."
                  className="flex-1 focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 ml-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <i className="fa-solid fa-paper-plane"></i>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 animated-element">
        <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
          <span className="mr-2">🔍</span> 
          Ask Maya
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              className={`text-left p-3 border-2 text-sm justify-start h-auto group transition-all duration-300 
                ${index % 3 === 0 ? 'border-primary/60 bg-primary/5 hover:bg-primary/20' : 
                index % 3 === 1 ? 'border-secondary/60 bg-secondary/5 hover:bg-secondary/20' :
                'border-accent/60 bg-accent/5 hover:bg-accent/20'}`}
              onClick={() => handleSuggestedQuestion(question)}
              disabled={isLoading}
            >
              <div className="flex items-center">
                <span className="mr-2 text-lg">
                  {index % 5 === 0 ? '🔎' : 
                   index % 5 === 1 ? '💡' : 
                   index % 5 === 2 ? '🎮' :
                   index % 5 === 3 ? '🏆' : '🌱'}
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">{question}</span>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <h4 className="font-medium text-primary flex items-center">
            <span className="mr-2">💫</span> Fun Fact
          </h4>
          <p className="text-sm mt-1 text-muted-foreground">
            Villages that balance economic, social, and environmental development have 30% higher sustainability scores! Try asking Maya for specific strategies.
          </p>
        </div>
      </div>
    </div>
  );
}
