
const responseTemplates = [
    "I understand what you're saying about {topic}. Can you tell me more?",
    "That's interesting! How do you feel about {topic}?",
    "I've been thinking about {topic} as well lately. What aspects interest you most?",
    "Thanks for sharing about {topic}. Have you considered {related}?",
    "I'm curious about your thoughts on {topic}. What led you to this interest?",
    "I find {topic} fascinating too! What's your experience with it?",
    "Let's explore {topic} together. What specifically would you like to discuss?",
    "When it comes to {topic}, I think there's a lot to unpack. Where should we start?",
    "I appreciate you bringing up {topic}. It's something worth discussing.",
    "Your point about {topic} is intriguing. How did you come to that conclusion?"
  ];
  
  const relatedTopics = {
    "work": ["work-life balance", "career growth", "productivity", "workplace culture"],
    "technology": ["AI", "blockchain", "virtual reality", "smart devices", "privacy"],
    "health": ["exercise", "nutrition", "mental wellness", "sleep", "stress management"],
    "relationships": ["communication", "boundaries", "trust", "personal growth"],
    "entertainment": ["movies", "music", "games", "books", "art"],
    "learning": ["education", "skills development", "knowledge acquisition", "creativity"],
    "future": ["goals", "planning", "aspirations", "possibilities", "growth"]
  };
  
  const defaultTopics = ["that", "your message", "this topic", "your thoughts", "your question"];
  
  const extractTopics = (message) => {
    const lowercaseMsg = message.toLowerCase();
    for (const [key, _] of Object.entries(relatedTopics)) {
      if (lowercaseMsg.includes(key)) {
        return {
          mainTopic: key,
          relatedTopic: relatedTopics[key][Math.floor(Math.random() * relatedTopics[key].length)]
        };
      }
    }
    
    const words = lowercaseMsg.split(' ');
    const potentialTopics = words.filter(word => 
      word.length > 4 && 
      !['about', 'would', 'could', 'should', 'think', 'because'].includes(word)
    );
    
    if (potentialTopics.length > 0) {
      const randomTopic = potentialTopics[Math.floor(Math.random() * potentialTopics.length)];
      return {
        mainTopic: randomTopic,
        relatedTopic: defaultTopics[Math.floor(Math.random() * defaultTopics.length)]
      };
    }
    
    return {
      mainTopic: defaultTopics[Math.floor(Math.random() * defaultTopics.length)],
      relatedTopic: defaultTopics[Math.floor(Math.random() * defaultTopics.length)]
    };
  };
  
  const generateResponse = async (userMessage, user) => {

    const { mainTopic, relatedTopic } = extractTopics(userMessage);
    const template = responseTemplates[Math.floor(Math.random() * responseTemplates.length)];
    let response = template
      .replace('{topic}', mainTopic)
      .replace('{related}', relatedTopic);
    if (Math.random() < 0.3) {
      const personalizedIntros = [
        `${user?.username}, `,
        `By the way ${user?.username}, `,
        `You know ${user?.username}, `
      ];
      const intro = personalizedIntros[Math.floor(Math.random() * personalizedIntros.length)];
      response = intro + response.charAt(0).toLowerCase() + response.slice(1);
    }
    
    return response;
  };
  
  module.exports = {
    generateResponse
  };