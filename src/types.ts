export interface OptionEffect {
  wealth?: number;
  freedom?: number;
  connection?: number;
  peace?: number;
  happiness?: number;
  health?: number;
  stress?: number;
  growth?: number;
}

export interface ChoiceOption {
  text: string;
  subtext: string;
  effects: OptionEffect;
  narration: string; // Dynamic storyline unfolding depending on choice
}

export interface Scenario {
  time: string;
  period: "morning" | "noon" | "afternoon" | "evening" | "weekend";
  sceneTitle: string;
  description: string;
  illustration: string; // Tailwind emoji-vibe bg
  options: ChoiceOption[];
}

export interface CustomTrial {
  id: string;
  title: string;
  subtitle: string;
  career: string;
  city: string;
  lifestyle: string;
  vibe: string;
  duration: string;
  coverImage: string; // CSS styling gradient or dynamic illustration
  difficulty: number; // 1-5
  freedom: number; // percentage
  connection: number; // percentage
  wealth: number; // percentage
  peace: number; // percentage
  scenarios: Scenario[];
}

export interface ChoiceRecord {
  time: string;
  sceneTitle: string;
  selectedOption: string;
  narrationResult: string;
  effects: OptionEffect;
}

export interface SavedResult {
  id: string;
  date: string;
  trialId: string;
  trialTitle: string;
  city: string;
  careerTitle: string;
  resonance: string;
  cityMatchScore: number;
  cityMatchComment: string;
  mappedCareer: string;
  marketVibe: string;
  salaryExpectation: string;
  actionItem: string;
  choices: ChoiceRecord[];
  stats: {
    happiness: number;
    health: number;
    stress: number;
    growth: number;
    wealth?: number;
    freedom?: number;
    connection?: number;
    peace?: number;
  };
}
