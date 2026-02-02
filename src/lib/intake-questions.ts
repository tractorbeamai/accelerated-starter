export interface IntakeQuestion {
  key: string;
  text: string;
  followUp?: string;
}

export const INTAKE_QUESTIONS: IntakeQuestion[] = [
  {
    key: "current_situation",
    text: "What's your current role, and what's prompting you to explore new opportunities?",
  },
  {
    key: "pe_exposure",
    text: "Have you worked directly with private equity firms before, either at a fund or within a portfolio company? Tell me about that experience.",
  },
  {
    key: "value_creation",
    text: "When you step into a new organization, how do you typically approach the first 100 days? What do you prioritize?",
  },
  {
    key: "functional_expertise",
    text: "What would you say is your core functional superpower? Where do you create the most impact?",
  },
  {
    key: "ideal_role",
    text: "Describe your ideal next role. What would make you excited to get out of bed every day?",
  },
  {
    key: "fund_preferences",
    text: "Are there specific fund sizes, industries, or investment stages you're most drawn to?",
  },
  {
    key: "geography",
    text: "What's your geographic flexibility? Open to relocation, or does location matter?",
  },
  {
    key: "compensation",
    text: "To make sure we're aligned on expectations, what's your target total compensation range?",
  },
  {
    key: "timeline",
    text: "How soon are you realistically looking to make a move?",
  },
  {
    key: "anything_else",
    text: "Is there anything else you'd like us to know that would help us find the right fit for you?",
  },
];

export const INITIAL_MESSAGE = (firstName?: string | null) =>
  `Thanks for taking the time${firstName ? `, ${firstName}` : ""}. I'm going to ask you a few questions to better understand your background and what you're looking for. This helps us match you with the right opportunities. Ready to begin?`;

export const COMPLETION_MESSAGE =
  "That's everything I need for now. Our team will review your profile and reach out when we have opportunities that match. Thanks for joining the Taurean network.";
