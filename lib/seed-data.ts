export type SeedFigure = {
  slug: string;
  name: string;
  category: string;
  description: string;
  /** Wikipedia page title (use the exact title with underscores and accents). */
  wiki: string;
  /** Fallback avatar shown if Wikipedia thumbnail can't be fetched. */
  photo_url: string;
};

function avatar(name: string, bg = "c1121f") {
  const seed = encodeURIComponent(name);
  return `https://api.dicebear.com/9.x/initials/png?seed=${seed}&backgroundColor=${bg}&textColor=f4ede0&fontWeight=900&fontSize=46&size=512`;
}

export const SEED_FIGURES: SeedFigure[] = [
  // World leaders / politicians
  {
    slug: "donald-trump",
    name: "Donald Trump",
    category: "Politics",
    description: "Former US president, polarizing global political figure.",
    wiki: "Donald_Trump",
    photo_url: avatar("Donald Trump"),
  },
  {
    slug: "joe-biden",
    name: "Joe Biden",
    category: "Politics",
    description: "US president 2021–2025, frequently criticized across the spectrum.",
    wiki: "Joe_Biden",
    photo_url: avatar("Joe Biden", "0a0a0a"),
  },
  {
    slug: "vladimir-putin",
    name: "Vladimir Putin",
    category: "Politics",
    description: "President of Russia, internationally condemned over the war in Ukraine.",
    wiki: "Vladimir_Putin",
    photo_url: avatar("Vladimir Putin"),
  },
  {
    slug: "narendra-modi",
    name: "Narendra Modi",
    category: "Politics",
    description: "Prime Minister of India, polarizing figure both at home and abroad.",
    wiki: "Narendra_Modi",
    photo_url: avatar("Narendra Modi", "fcbf49"),
  },
  {
    slug: "xi-jinping",
    name: "Xi Jinping",
    category: "Politics",
    description: "General Secretary of the CCP, criticized globally over human rights.",
    wiki: "Xi_Jinping",
    photo_url: avatar("Xi Jinping"),
  },
  {
    slug: "benjamin-netanyahu",
    name: "Benjamin Netanyahu",
    category: "Politics",
    description: "Prime Minister of Israel, target of mass global protest.",
    wiki: "Benjamin_Netanyahu",
    photo_url: avatar("Benjamin Netanyahu", "0a0a0a"),
  },
  {
    slug: "kim-jong-un",
    name: "Kim Jong Un",
    category: "Politics",
    description: "Supreme Leader of North Korea.",
    wiki: "Kim_Jong_Un",
    photo_url: avatar("Kim Jong Un"),
  },
  {
    slug: "recep-tayyip-erdogan",
    name: "Recep Tayyip Erdoğan",
    category: "Politics",
    description: "President of Turkey, widely criticized over press freedom.",
    wiki: "Recep_Tayyip_Erdoğan",
    photo_url: avatar("Recep Erdogan", "0a0a0a"),
  },
  {
    slug: "nicolas-maduro",
    name: "Nicolás Maduro",
    category: "Politics",
    description: "President of Venezuela, internationally contested.",
    wiki: "Nicolás_Maduro",
    photo_url: avatar("Nicolas Maduro"),
  },
  {
    slug: "viktor-orban",
    name: "Viktor Orbán",
    category: "Politics",
    description: "Prime Minister of Hungary, criticized over democratic backsliding.",
    wiki: "Viktor_Orbán",
    photo_url: avatar("Viktor Orban", "fcbf49"),
  },
  {
    slug: "jair-bolsonaro",
    name: "Jair Bolsonaro",
    category: "Politics",
    description: "Former president of Brazil, facing multiple legal cases.",
    wiki: "Jair_Bolsonaro",
    photo_url: avatar("Jair Bolsonaro"),
  },
  {
    slug: "boris-johnson",
    name: "Boris Johnson",
    category: "Politics",
    description: "Former UK Prime Minister, brought down by Partygate scandal.",
    wiki: "Boris_Johnson",
    photo_url: avatar("Boris Johnson", "0a0a0a"),
  },

  // Tech / business
  {
    slug: "elon-musk",
    name: "Elon Musk",
    category: "Tech",
    description: "CEO of Tesla, owner of X, polarizing tech figure.",
    wiki: "Elon_Musk",
    photo_url: avatar("Elon Musk"),
  },
  {
    slug: "mark-zuckerberg",
    name: "Mark Zuckerberg",
    category: "Tech",
    description: "CEO of Meta, frequent target over privacy and platform harms.",
    wiki: "Mark_Zuckerberg",
    photo_url: avatar("Mark Zuckerberg", "0a0a0a"),
  },
  {
    slug: "jeff-bezos",
    name: "Jeff Bezos",
    category: "Tech",
    description: "Founder of Amazon, criticized over labor practices and wealth.",
    wiki: "Jeff_Bezos",
    photo_url: avatar("Jeff Bezos", "fcbf49"),
  },
  {
    slug: "sam-altman",
    name: "Sam Altman",
    category: "Tech",
    description: "CEO of OpenAI, divisive figure in the AI debate.",
    wiki: "Sam_Altman",
    photo_url: avatar("Sam Altman"),
  },
  {
    slug: "sundar-pichai",
    name: "Sundar Pichai",
    category: "Tech",
    description: "CEO of Alphabet/Google, criticized over layoffs and product cuts.",
    wiki: "Sundar_Pichai",
    photo_url: avatar("Sundar Pichai", "0a0a0a"),
  },
  {
    slug: "bobby-kotick",
    name: "Bobby Kotick",
    category: "Business",
    description: "Former CEO of Activision Blizzard, target of widespread gamer ire.",
    wiki: "Bobby_Kotick",
    photo_url: avatar("Bobby Kotick"),
  },
  {
    slug: "adam-neumann",
    name: "Adam Neumann",
    category: "Business",
    description: "Founder of WeWork, synonymous with startup excess.",
    wiki: "Adam_Neumann",
    photo_url: avatar("Adam Neumann", "fcbf49"),
  },
  {
    slug: "martin-shkreli",
    name: "Martin Shkreli",
    category: "Business",
    description: "Pharma exec dubbed “the most hated man in America” by media.",
    wiki: "Martin_Shkreli",
    photo_url: avatar("Martin Shkreli"),
  },

  // Entertainment / influencers / sports
  {
    slug: "kanye-west",
    name: "Kanye West",
    category: "Entertainment",
    description: "Rapper turned controversial public figure (Ye).",
    wiki: "Kanye_West",
    photo_url: avatar("Kanye West"),
  },
  {
    slug: "andrew-tate",
    name: "Andrew Tate",
    category: "Influencer",
    description: "Controversial influencer facing criminal charges in Romania.",
    wiki: "Andrew_Tate",
    photo_url: avatar("Andrew Tate", "0a0a0a"),
  },
  {
    slug: "logan-paul",
    name: "Logan Paul",
    category: "Influencer",
    description: "YouTuber and boxer, history of public scandals.",
    wiki: "Logan_Paul",
    photo_url: avatar("Logan Paul", "fcbf49"),
  },
  {
    slug: "jake-paul",
    name: "Jake Paul",
    category: "Influencer",
    description: "YouTuber-turned-boxer, polarizing combat-sports figure.",
    wiki: "Jake_Paul",
    photo_url: avatar("Jake Paul"),
  },
  {
    slug: "conor-mcgregor",
    name: "Conor McGregor",
    category: "Sports",
    description: "Former UFC champion, frequent legal and PR controversy.",
    wiki: "Conor_McGregor",
    photo_url: avatar("Conor McGregor", "0a0a0a"),
  },
  {
    slug: "floyd-mayweather",
    name: "Floyd Mayweather",
    category: "Sports",
    description: "Boxer with a long history of domestic violence allegations.",
    wiki: "Floyd_Mayweather_Jr.",
    photo_url: avatar("Floyd Mayweather", "fcbf49"),
  },
  {
    slug: "drake",
    name: "Drake",
    category: "Entertainment",
    description: "Rapper, target of public ire after the Kendrick Lamar feud.",
    wiki: "Drake_(musician)",
    photo_url: avatar("Drake"),
  },
  {
    slug: "justin-bieber",
    name: "Justin Bieber",
    category: "Entertainment",
    description: "Pop singer, recurrent tabloid villain over the years.",
    wiki: "Justin_Bieber",
    photo_url: avatar("Justin Bieber", "0a0a0a"),
  },
  {
    slug: "harvey-weinstein",
    name: "Harvey Weinstein",
    category: "Entertainment",
    description: "Convicted producer, central figure of the #MeToo reckoning.",
    wiki: "Harvey_Weinstein",
    photo_url: avatar("Harvey Weinstein"),
  },
  {
    slug: "sean-combs",
    name: "Sean “Diddy” Combs",
    category: "Entertainment",
    description: "Rapper-mogul indicted on federal racketeering and trafficking charges.",
    wiki: "Sean_Combs",
    photo_url: avatar("Sean Combs", "0a0a0a"),
  },
];
