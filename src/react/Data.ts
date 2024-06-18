export interface Module {
  name: string;
  port: string;
  url: string;
  display: Display;
  source: string;
  image: string;
  tags: {
    name: string;
    subject_name: Subject;
  }[];
  group?: string;
  parent_module?: ParentModule;
}

export interface Feedback {
  id?: number;
  username: string;
  firstResponse: string;
  secondResponse: string;
}

export interface Resource {
  id: number;
  name: string;
  filename: string;
  firstName: string;
  username: string;
  description: string;
  grades: string[];
  isPublic: boolean;
  approved: boolean;

  // Date strings
  created_at: string;
  last_updated_at: string;
}

export interface User{
  username: string;
  password: string;
  isAdmin?: boolean;
  token?: string;
}

export interface FullUser{
  id?: any,
  firstName: string,
  lastName: string,
  username: string,
  securityAnswer: string,
  token: string,
  isAdmin: boolean,
  doneOnboarding: boolean,
  notifications: Notification[]
}

export interface Notification {
  id: number;
    sender: string;
    title: string;
    message: string;
    resource_name: string;
    read: boolean;  
  
    // Date strings
    time_sent: string;
}

interface ParentModule {
  name: string;
  parent_module?: ParentModule | null;
}

const commonGroupCopyStart = 'This section contains learning resources';
const standardizedTestsCopy = 'This section contains practice US Standardized Tests and answer keys. These resources are intended for students in advanced years of secondary school, espeically those preparing for further education or university.';

const commonSubjectCopyStart = (subject: string) =>
  `Welcome to ${subject}! Here, you will find a wide range of learning content about`;

export enum Subject {
  Math = 'Mathematics',
  Science = 'Science',
  SocialSciences = 'Social Sciences',
  Arts = 'Arts & Humanities',
  Technology = 'Technology',
  Languages = 'Languages',
  Literature = 'Literature',
  EverydayLife = 'Everyday Life',
}

export enum Source {
  AfricanStorybooks = 'African Storybooks',
  CK12 = 'CK-12 Textbooks',
  CurriculumGuides = 'Curriculum Guides',
  GCF = 'GCF Learnfree',
  GBOFW = 'Great Books of the World',
  HesperianHealth = 'Hesperian Health Guides',
  Infonet = 'Infonet - Biovision',
  InteractiveWorldMap = 'Interactive World Map',
  KALite = 'KA Lite Essentials',
  MedlinePlus = 'Medline Plus',
  // MusicTheory = 'Music Theory',
  PracticalAction = 'Practical Action',
  Simbi = 'Simbi Reading',
  UgandaNCDC = 'Uganda NCDC',
  Wikipedia = 'Wikipedia for Schools',
  // Wikivoyage = 'Wikivoyage',
  // Wiktionary = 'Wiktionary',
}

export const Math = {
  'Foundational Mathematics': `${commonGroupCopyStart} that help to build a strong understanding of basic Mathematics.`,
  'Algebra': `${commonGroupCopyStart} that help to understand equations and how to solve them.`,
  'Geometry': `${commonGroupCopyStart} about shapes, spaces and sizes.`,
  'Statistics & Probability': `${commonGroupCopyStart} that help to understand probability and data analysis.`,
  'Calculus':`${commonGroupCopyStart} that help to understand calculus at a basic level and at an advanced level.`,
  'Tests & Textbooks': standardizedTestsCopy,
}

export const Science = {
  'General Science': `${commonGroupCopyStart} about science in general.`,
  'Biology': `${commonGroupCopyStart} that help to build a scientific understanding of biology, life, DNA, and more.`,
  'Chemistry': `${commonGroupCopyStart} that help to build a scientific understanding of chemicals, atoms, elements, and more.`,
  'Physics': `${commonGroupCopyStart} that help to build a scientific understanding of physics, motions, forces, and gravity.`,
  'Astronomy': `${commonGroupCopyStart} that help to build a scientific understanding of stars, galaxies, Planet Earth, and the origins and scale of the universe.`,
  'Earth Sciences': `${commonGroupCopyStart} that help to build a scientific understanding of the Earth, its land, water, atmosphere, and climate.`,
  'Engineering': `${commonGroupCopyStart} that help to build a scientific understanding of circuits, robotics, and more.`,
}

export const Arts = {
  'History': `${commonGroupCopyStart} that help to build and understanding of world history.`,
  'Geography': `${commonGroupCopyStart} about the geography of Earth.`,
  'Religious Studies': `${commonGroupCopyStart} that help to build an understanding of world religion.`,
  'Art & Design': `${commonGroupCopyStart} that help to build an understanding of art, design, and technology practices around the world.`,
  'Music': `${commonGroupCopyStart} that help to build an understanding of music theory and history.`,
  'Culture & People': `${commonGroupCopyStart} about different world cultures, famous historical figures, and more.`,
}

export const Literature = {
  'Simbi Reading':  'With the Simbi reading platform, you can read along to thousands of books that have been narrated by people in over 80 countries around the world! Choose a story, select an accent or language that you want to read along to, and start reading!',
  'Southern & Eastern African Language Books': 'This section contains short storybooks in Southern and Eastern African languages.',
  'Genres': 'This section contains non-fiction and fiction books in a variety of genres.',
  'Tests & Textbooks': standardizedTestsCopy,
  'Reading & Spelling': `${commonGroupCopyStart} that help to improve reading and spelling skills.`,
}

export const Technology = {
  'Social Media & Internet': `${commonGroupCopyStart} about social media, the internet, and using them safely.`,
  'Computers': `${commonGroupCopyStart} that help to build a foundational understanding of computers and devices.`,
  'Programming & Computing': `${commonGroupCopyStart} the help to build an understanding of computer programming, code, and more.`,
}

export const EverydayLife = {
  'Everyday Life': `${commonGroupCopyStart} about everyday life, money, currency, and more.`,
  'Careers': `${commonGroupCopyStart} to help improve workplace skills, career planning, and starting your own business.`,
  'Farming & Agriculture': `${commonGroupCopyStart} that help to build an understanding of best farming practices, plant care, and pest control.`,
  'Resource Management': `${commonGroupCopyStart} about using, managing, and preserving natural resources.`,
  'Human Health & Healthcare': `${commonGroupCopyStart} that help to build an understanding of human health and wellbeing.`,
  'Animal Health': `${commonGroupCopyStart} that help to build an understanding of animal health and wellbeing.`,
  'Environment': `${commonGroupCopyStart} that help to build an understanding of the world around us, ecosystems, and climate change.`,
  'Infrastructure': `${commonGroupCopyStart} about infrastructure, energy, building construction, and more.`,
  'Practical Skills': `${commonGroupCopyStart} about practical skills and how they are used.`,
  'Medical Encyclopedia': 'This section contains a large encyclopedia about medicines, healthcare, and medical conditions.',
}

export const SocialSciences = {
  'Economics': 'This section contains advanced learning resources about economics.',
  'Development & Business': 'This section contains resources that help to build a more theoretical understanding of business, entrepreneurship, and economics.',
  'Citizenship': 'This section contains resources about citizenship.',
}

export const Languages = {
  'Southern & Eastern African Languages': `${commonGroupCopyStart} that help to improve a number of languages spoken across Southern and Eastern Africa.`,
  'Ugandan Languages': 'This section contains resouces that help you to practice your reading, writing, and speaking in English, Alur, Aringati, Ateso, Kakwa, Luganda, Runyankole Rukiga, Runyoro, and Kiswahili.',
  'World Languages': `${commonGroupCopyStart} about languages spoken around the world.`,
}

export const SubjectCopy = {
  [Subject.Math]: {
    copy: `${commonSubjectCopyStart(Subject.Math)} Mathematics, including early mathematics, algebra, calculus, and lots more!`,
    tags: Math,
  },
  [Subject.Science]: {
    copy: `${commonSubjectCopyStart(Subject.Science)} Science, including DNA, galaxies, chemicals, and lots more!`,
    tags: Science,
  },
  [Subject.Arts]: {
    copy: `${commonSubjectCopyStart(Subject.Arts)} the Humanities, including world history, music, geography and more!`,
    tags: Arts,
  },
  [Subject.Literature]: {
    copy: 'Welcome to Literature! Here, you will find a wide range of books to explore, read, and enjoy!',
    tags: Literature,
  },
  [Subject.Technology]: {
    copy: `${commonSubjectCopyStart(Subject.Technology)} Technology, including computers, online safety, programming, and more!`,
    tags: Technology,
  },
  [Subject.EverydayLife]: {
    copy: `${commonSubjectCopyStart(Subject.EverydayLife)} career healthcare, farming, using natural resources, workplace skills, and so much more!`,
    tags: EverydayLife,
  },
  [Subject.SocialSciences]: {
    copy: `${commonSubjectCopyStart(Subject.SocialSciences)} Social Sciences, including economics, finance, business, and more!`,
    tags: SocialSciences,
  },
  [Subject.Languages]: {
    copy: 'Welcome to Languages! Here, you will be able to practice and learn about languages from around the world.',
    tags: Languages,
  },
};

export const SourceCopy = {
  [Source.KALite]: 'Khan Academy Lite Essentials includes thousands of video lessons and exercises on mathematics, science, and more. This incredible learning resource is brought to you by Khan Academy and The Foundation for Learning Equality. You can create an account to track your progress. When you return, you can login and view your progress.',
  [Source.GBOFW]: 'A selection of over 400 classic, well-known books from around the world, provided by Project Gutenberg.',
  [Source.AfricanStorybooks]: 'These stories are in 11 languages spoken in many countries in Southern and Eastern Africa. Reading these short, fun books are a perfect way to practice reading and language learning at the same time.',
  [Source.CK12]: 'High-quality U.S. Curriculum textbooks about Science, Technology, Engineering and Mathematics from ck12.org.',
  [Source.GCF]: 'A collection of hundreds of illustrated articles and videos about technology, job training, reading, and math skills, produced by the Goodwill Community Foundation.',
  [Source.PracticalAction]: 'Practical Action provides information on a wide range of agricultural, environmental, and health topics.',
  [Source.Infonet]: 'Well-organized, illustrated information on a wide range of agricultural, environmental, and health topics.',
  [Source.MedlinePlus]: 'A collection of more than 4,000 medical articles from the U.S. National Library of Medicine and the National Institutes of Health. These materials do not provide medical advice and are for informational purposes only. This content is not intended to be a substitute for professional medical advice, diagnosis or treatment. Always seek the advice of a qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read here.',
  // [Source.MusicTheory]: 'Comprehensive music theory lessons and exercises to begin your journey into the realm of music from musictheory.net.',
  [Source.HesperianHealth]: 'A collection of detailed, illustrated guides on healthcare in remote areas where access to doctors and facilities is limited. These materials do not provide medical advice and are for informational purposes only. This content is not intended to be a substitute for professional medical advice, diagnosis or treatment. Always seek the advice of a qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read here.',
  [Source.Wikipedia]: 'A collection of 6,000 articles and 50,000 images on hundreds of topics and subjects from Wikipedia for Schools.',
  [Source.CurriculumGuides]: 'Curriculum guides for primary and secondary school teachers, created by the National Curriculum Development Centre of Uganda. Choose between primary and secondary, select a grade, and then browse the curriculum guides by subject area or in full.',
  // [Source.Wikivoyage]: 'A worldwide travel guide created by Kiwix with information on destinations around the world. Make geography come alive!',
  // [Source.Wiktionary]: 'Wiktionary is a multilingual dictionary which aims to describe all words of all languages using definitions and descriptions in English.',
  [Source.InteractiveWorldMap]: 'Explore Earth with this interactive and searchable world map from OpenStreetMaps and the XSCE project.',
  [Source.Simbi]: 'With the Simbi reading platform, you can read along to thousands of books that have been narrated by people in over 80 countries around the world! Choose a story, select an accent or language that you want to read along to, and start reading!',
  [Source.UgandaNCDC]: 'A collection of learning resources from the Ugandan National Curriculum Development Centre designed to help P1-P7 and S1-S6 students learn at home or in the classroom.',
};

export const getSourceGroupCopy = (group: string, source: string) => {
  if (source === 'African Storybooks') {
    return 'This section contains short books that help to improve a number of languages spoken across Southern and Eastern Africa.';
  }

  if (group === 'Standardized Tests') {
    return standardizedTestsCopy;
  }

  let subject = group.replaceAll('&', 'and').toLowerCase();

  if (subject.endsWith('age')) {
    subject += ' groups';
  } else if (subject.endsWith('subject')) {
    subject += ' area'
  } else if (['Humanities', 'Digital World', 'Environment'].includes(group)) {
    subject = 'the ' + subject;
  }

  return `Learn more about ${subject} with this content from ${source}.`;
}

export const SearchKeywords: { [k: string]: Source } = {
  'ck12': Source.CK12,
  'ck-12': Source.CK12,
  'ck12 textbooks': Source.CK12,
  'gcf': Source.GCF,
  'hesperian': Source.HesperianHealth,
  'infonet': Source.Infonet,
  'biovision': Source.Infonet,
  'ka': Source.KALite,
  'ka lite': Source.KALite,
  'medline': Source.MedlinePlus,
  'wikipedia': Source.Wikipedia,
  'ncdc' : Source.UgandaNCDC,
  'uganda national curriculum': Source.UgandaNCDC,
}

export const SubjectSearchKeywords: { [k: string]: Subject } = {
  'math': Subject.Math,
  'sci': Subject.Science,
  'scien': Subject.Science,
  'arts': Subject.Arts,
  'arts a': Subject.Arts,
  'arts an': Subject.Arts,
  'arts and': Subject.Arts,
  'arts and h': Subject.Arts,
  'arts and hu': Subject.Arts,
  'arts and hum': Subject.Arts,
  'arts and huma': Subject.Arts,
  'arts and human': Subject.Arts,
  'arts and humani': Subject.Arts,
  'arts and humanit': Subject.Arts,
  'arts and humaniti': Subject.Arts,
  'arts and humanitie': Subject.Arts,
  'arts and humanities': Subject.Arts,
  'arts &': Subject.Arts,
  'arts & h': Subject.Arts,
  'arts & hu': Subject.Arts,
  'arts & hum': Subject.Arts,
  'arts & huma': Subject.Arts,
  'arts & human': Subject.Arts,
  'arts & humani': Subject.Arts,
  'arts & humanit': Subject.Arts,
  'arts & humaniti': Subject.Arts,
  'arts & humanitie': Subject.Arts,
  'arts & humanities': Subject.Arts,
  'tech': Subject.Technology,
  'techno': Subject.Technology,
  'lang': Subject.Languages,
  'languag': Subject.Languages,
  'language': Subject.Languages,
  'lit': Subject.Literature,
  'liter': Subject.Literature,
  'every': Subject.EverydayLife,
  'everyday': Subject.EverydayLife,
  'life': Subject.EverydayLife,
}

export const ParentName: { [k: string]: string } = {
  'art-and-design': 'Art and Design',
  'religious-education': 'Religious Education',
  'social-studies': 'Social Studies',
  'foods-and-nutrition': 'Foods and Nutrition',
  'physical-education': 'Physical Education',
  'pre-primary': 'Pre-primary and parent workbooks',
  'general-science': 'General Science',
  'english': 'English',
  // 'english-northern-tanzania': 'English - Northern Tanzania',
  // 'english-safrica': 'English - South Africa',
  'isindebele': 'isiNdebele',
  'isixhosa': 'isiXhosa',
  'isizulu': 'isiZulu',
  'sesotho-lesotho': 'Sesotho - Lesotho',
  'sesotho-safrica': 'Sesotho - South Africa',
};

export enum Display {
  Primary = 'primary',
  Secondary = 'secondary',
  Text = 'text'
}

// This is an old interface, only used for pulling the seed data for the backend
export interface DataObject {
  name: string;
  image?: string;
  port: string;
  url: string;
  type: string;
  by: string;
  tags: {
    [Subject.Math]?: keyof typeof Math,
    [Subject.Science]?: keyof typeof Science,
    [Subject.Arts]?: keyof typeof Arts,
    [Subject.Literature]?: keyof typeof Literature,
    [Subject.Technology]?: keyof typeof Technology,
    [Subject.EverydayLife]?: keyof typeof EverydayLife,
    [Subject.SocialSciences]?: keyof typeof SocialSciences,
    [Subject.Languages]?: keyof typeof Languages,
  }
}

export const subjects = Object.values(Subject);
export const sources = Object.values(Source);
 
export const matchesKeyword = (search: string): Source | undefined => {
  const idx = (sources.map(e => e.toLowerCase()).indexOf(search.toLowerCase()));
  if (idx >= 0) {
    return sources[idx];
  }

  return SearchKeywords[search.toLowerCase()];
}

export const matchesSubjectKeyword = (search: string): Subject | undefined => {
  const idx = (subjects.map(e => e.toLowerCase()).indexOf(search.toLowerCase()));
  if (idx >= 0) {
    return subjects[idx];
  }
  return SubjectSearchKeywords[search.toLowerCase()];
}