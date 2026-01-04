// Collection of typing test paragraphs with varying lengths
export const paragraphs: string[] = [
  // Short paragraphs
  "the quick brown fox jumps over the lazy dog.",
  
  "coding is fun and rewarding when you solve problems.",
  
  "practice makes perfect. keep typing every day.",
  
  "javascript is a versatile language used everywhere.",
  
  "react makes building user interfaces simple and fast.",
  
  // Medium paragraphs
  "the best way to learn programming is by writing code every single day. consistency beats intensity.",
  
  "a good developer writes code that humans can understand. machines will figure out the rest eventually.",
  
  "debugging is twice as hard as writing the code in the first place. so write simple code always.",
  
  "the only way to go fast is to go well. clean code is not written by following rules but by caring.",
  
  "programming is not about typing fast. it is about thinking clearly and solving problems efficiently.",
  
  "typescript adds static types to javascript making it easier to catch errors before runtime happens.",
  
  "web development has evolved from simple html pages to complex applications that rival desktop software.",
  
  // Longer paragraphs
  "artificial intelligence is transforming how we interact with technology. from voice assistants to recommendation systems these tools are becoming part of daily life. learning to work with ai will be essential.",
  
  "the internet has connected billions of people around the world. information flows freely and ideas spread faster than ever before. this connectivity brings both opportunities and challenges for society.",
  
  "software engineering is more than just writing code. it involves understanding user needs designing solutions and working with teams. communication skills are just as important as technical abilities.",
  
  "open source software has revolutionized the tech industry. developers from around the world collaborate on projects that power everything from smartphones to servers. contributing to open source is a great way to learn.",
  
  "algorithms are the building blocks of computer science. understanding how to design efficient algorithms helps solve complex problems. big tech companies often test algorithm knowledge in interviews.",
  
  "the command line is a powerful tool that every developer should master. while graphical interfaces are user friendly the terminal offers speed and flexibility that cannot be matched by clicking buttons.",
  
  "version control systems like git have changed how teams collaborate on code. branching merging and pull requests enable multiple developers to work on the same project without stepping on each other.",
  
  "responsive web design ensures websites look good on all devices. from tiny phones to large monitors the same code adapts to different screen sizes. this approach has become standard in modern development.",
  
  // Long paragraphs
  "learning to type fast is a skill that pays dividends throughout your career. whether you are writing code documentation or emails faster typing means more time for thinking and less time for mechanical input. aim for accuracy first then speed will follow naturally.",
  
  "the cloud has fundamentally changed how we build and deploy applications. instead of managing physical servers developers can spin up resources on demand. services like aws azure and google cloud offer virtually unlimited computing power at your fingertips.",
  
  "cybersecurity is becoming increasingly important as more of our lives move online. protecting user data and preventing unauthorized access are responsibilities every developer shares. understanding common vulnerabilities helps build more secure systems from the start.",
  
  "machine learning models are trained on vast amounts of data to recognize patterns and make predictions. from image recognition to natural language processing these models are powering the next generation of intelligent applications that seem almost magical.",
  
  "functional programming emphasizes immutability and pure functions. this paradigm reduces side effects and makes code easier to test and reason about. languages like haskell and concepts from functional programming have influenced modern javascript and python.",
  
  // Extra long paragraphs
  "the history of computing spans barely a century yet has transformed every aspect of human life. from room sized machines that performed simple calculations to smartphones more powerful than early supercomputers the pace of change has been remarkable. understanding this history provides perspective on where technology might go next.",
  
  "building scalable systems requires thinking about performance from the beginning. database queries network requests and memory usage all impact how well an application handles growth. profiling and optimization are ongoing processes not one time tasks that you do at the end of a project.",
  
  "design patterns are reusable solutions to common problems in software design. patterns like singleton factory and observer have stood the test of time because they solve real challenges developers face regularly. learning these patterns improves your ability to communicate with other developers.",
  
  "test driven development flips the traditional coding process on its head. by writing tests first you define what success looks like before implementing the solution. this approach often leads to cleaner code and fewer bugs because you think through edge cases upfront.",
  
  "the tech industry moves fast and continuous learning is essential for staying relevant. new frameworks languages and tools emerge constantly. successful developers balance learning new things with deepening expertise in their core skills. find what excites you and dive deep.",
];

// Get a random paragraph
export function getRandomParagraph(): string {
  const index = Math.floor(Math.random() * paragraphs.length);
  return paragraphs[index]!;
}

// Get a random paragraph different from the current one
export function getNewRandomParagraph(currentParagraph: string): string {
  if (paragraphs.length <= 1) return paragraphs[0]!;
  
  let newParagraph: string;
  do {
    newParagraph = getRandomParagraph();
  } while (newParagraph === currentParagraph);
  
  return newParagraph;
}
