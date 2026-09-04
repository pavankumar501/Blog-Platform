require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    const admin = await User.create({ name: 'Admin', email: 'admin@bloghub.com', password: 'admin123', role: 'admin', bio: 'Platform administrator and tech enthusiast' });
    const author1 = await User.create({ name: 'Priya Sharma', email: 'priya@bloghub.com', password: 'author123', bio: 'Travel writer and food blogger from Mumbai. Loves exploring hidden gems across India.' });
    const author2 = await User.create({ name: 'Rahul Verma', email: 'rahul@bloghub.com', password: 'author123', bio: 'Software engineer turned full-time writer. Writes about tech, startups, and the Indian ecosystem.' });
    const author3 = await User.create({ name: 'Ananya Gupta', email: 'ananya@bloghub.com', password: 'author123', bio: 'Yoga instructor and wellness advocate. Passionate about holistic living and mindful nutrition.' });

    console.log('Users created');

    const categories = await Category.insertMany([
      { name: 'Technology', slug: 'technology', description: 'Latest in tech, programming, and digital innovation', postCount: 0 },
      { name: 'Lifestyle', slug: 'lifestyle', description: 'Tips for balanced and fulfilling living', postCount: 0 },
      { name: 'Travel', slug: 'travel', description: 'Exploring destinations, cultures, and adventures', postCount: 0 },
      { name: 'Food', slug: 'food', description: 'Recipes, restaurant reviews, and culinary journeys', postCount: 0 },
      { name: 'Health', slug: 'health', description: 'Wellness, fitness, and mental health', postCount: 0 },
      { name: 'Business', slug: 'business', description: 'Startups, entrepreneurship, and career growth', postCount: 0 },
      { name: 'Education', slug: 'education', description: 'Learning resources, edtech, and academic insights', postCount: 0 },
      { name: 'Entertainment', slug: 'entertainment', description: 'Movies, music, books, and pop culture', postCount: 0 }
    ]);
    const catMap = {};
    categories.forEach(c => catMap[c.name] = c._id);
    console.log('Categories created');

    const posts = [
      {
        title: 'Why Every Indian Developer Should Learn Rust in 2026',
        content: `<p>The Indian tech industry is evolving at an unprecedented pace. While Python, JavaScript, and Go continue to dominate job listings, a quieter revolution is brewing in systems programming — and its name is Rust.</p>
<h2>What Makes Rust Special?</h2>
<p>Rust isn't just another programming language. It's a paradigm shift. Developed by Mozilla and now backed by the Linux Foundation, Rust offers memory safety without garbage collection, zero-cost abstractions, and fearless concurrency. For a country like India, where server costs and energy efficiency matter deeply, Rust's performance characteristics are game-changing.</p>
<h2>The Indian Context</h2>
<p>India's UPI infrastructure processes billions of transactions monthly. Every millisecond of latency costs money. Companies like PhonePe, Razorpay, and Paytm are increasingly exploring Rust for their performance-critical services. The Bengaluru Rust Meetup community has grown 300% in the last year alone.</p>
<h2>Getting Started</h2>
<p>You don't need to rewrite your entire stack. Start with small tools and CLI applications. The Rust Book is free, and the community is incredibly welcoming. With platforms like SeriesClue and RustBridge India, there's never been a better time to start learning.</p>
<h2>Career Opportunities</h2>
<p>Rust developers command some of the highest salaries in the Indian tech market. Companies like Microsoft, Amazon, and a growing number of Indian startups are actively hiring Rust developers. The scarcity of talent means those who invest in learning Rust now will have a significant career advantage.</p>`,
        excerpt: 'Rust is becoming essential for Indian developers. Here\'s why you should learn it now.',
        author: author2._id,
        category: catMap['Technology'],
        tags: ['Rust', 'Programming', 'Career', 'India'],
        views: 2847,
        likes: [author1._id, author3._id, admin._id],
        published: true,
        featured: true,
        featuredImage: 'https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=800'
      },
      {
        title: 'A Food Trail Through Old Delhi: Chandni Chowk to Jama Masjid',
        content: `<p>Old Delhi is not just a place — it's a living, breathing museum of flavours that have been perfected over centuries. Every lane, every gali, every corner has a story told through food.</p>
<h2>The Morning Start: Natraj Dahi Bhalle</h2>
<p>Begin your day at Natraj, a tiny shop near Chandni Chowk that has been serving the most legendary dahi bhalle since 1940. The soft, melt-in-your-mouth bhalle topped with tangy tamarind chutney, spicy green chutney, and a generous helping of dahi is the perfect wake-up call for your taste buds.</p>
<h2>The Paratha Wali Gali</h2>
<p>No food trail in Old Delhi is complete without visiting the iconic Paratha Wali Gali. This narrow lane is lined with shops that have been frying parathas for generations. From aloo to rabri to mutton keema, the variety is staggering. The most popular choice? A flaky, golden paratha stuffed with spiced potato, served with a fiery mirch ka achar.</p>
<h2>Jama Masjid Area</h2>
<p>As you approach Jama Masjid, the aroma of grilled meats becomes overwhelming in the best way possible. Karim's, established in 1913 by descendants of Mughal court chefs, serves a mutton korma so rich and flavourful that it literally melts on your tongue. Their chicken changezi is another must-try — a creamy, mildly spiced curry that pairs perfectly with their house-baked khameeri roti.</p>
<h2>The Sweet End</h2>
<p>End your trail at Haji Mohd. Hussain near Dariba Kalan for the most incredible rabri falooda you'll ever taste. The thick, creamy rabri combined with vermicelli, basil seeds, and rose syrup creates a symphony of flavours that will haunt your dreams for days.</p>
<p>Old Delhi's food trail is more than a culinary experience — it's a journey through time, culture, and the incredible diversity of Indian cuisine.</p>`,
        excerpt: 'A mouthwatering journey through the historic streets of Old Delhi, where every dish tells a centuries-old story.',
        author: author1._id,
        category: catMap['Food'],
        tags: ['Delhi', 'Street Food', 'Old Delhi', 'Food Trail'],
        views: 4102,
        likes: [admin._id, author2._id, author3._id],
        published: true,
        featured: true,
        featuredImage: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800'
      },
      {
        title: 'Digital Detox: A Week Without Screens in Rishikesh',
        content: `<p>I spent seven days in Rishikesh without my phone, laptop, or any screen. Here's what happened to my mind, body, and soul.</p>
<h2>Day 1-2: The Withdrawal</h2>
<p>The first two days were brutal. I kept reaching for my phone that wasn't there. My fingers itched to scroll, to check notifications, to doom-scroll through Twitter. The anxiety was palpable — I felt disconnected, isolated, and irritable. But something shifted on the evening of Day 2 as I sat by the Ganga watching the Ganga Aarti. The mesmerizing chants, the floating diyas, the sacred river — it was like nothing I'd ever experienced through a screen.</p>
<h2>Day 3-4: Finding Rhythm</h2>
<p>By Day 3, my body clock had reset. I was waking up with the sun and falling asleep with the moon. I started attending morning yoga sessions at Parmarth Niketan. Without the distraction of notifications, I could actually focus. My meditation went from restless fidgeting to genuine presence. I had deep, meaningful conversations with fellow travellers that lasted hours — conversations I would have normally cut short to check my phone.</p>
<h2>Day 5-7: Transformation</h2>
<p>The last three days were pure bliss. I hiked to Neer Garh Waterfall in complete solitude. I read two books. I wrote in a physical journal. I had the most incredible meal of my life at a tiny cafe in Tapovan — a simple thali that tasted extraordinary because I was fully present while eating.</p>
<h2>Lessons Learned</h2>
<p>The biggest revelation was how much of my daily anxiety was manufactured by my screen habits. My mind became quieter. I slept better. I felt more creative, more alive, more connected to the world around me. I'm not going to give up technology — but I'm implementing strict digital boundaries. Phone stays in another room after 8 PM. No social media before 10 AM. One screen-free day per week.</p>`,
        excerpt: 'What happens when you spend a week in Rishikesh without any screens? More than you\'d expect.',
        author: author3._id,
        category: catMap['Health'],
        tags: ['Digital Detox', 'Rishikesh', 'Mental Health', 'Wellness'],
        views: 3521,
        likes: [author1._id, author2._id],
        published: true,
        featured: true,
        featuredImage: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800'
      },
      {
        title: 'Building a Successful Startup from Tier-2 India: Lessons from Jaipur',
        content: `<p>You don't need to be in Bengaluru or Mumbai to build a successful startup. Here are practical lessons from founders who built thriving businesses from Jaipur.</p>
<h2>The Myth of the Silicon Valley of India</h2>
<p>For years, the Indian startup ecosystem has been centred around a few metros. But the tide is turning. Jaipur, Ahmedabad, Lucknow, Indore, and Kochi are producing incredible companies with lower burn rates and stronger unit economics.</p>
<h2>Lower Costs, Higher Talent</h2>
<p>Operating costs in Jaipur are 60-70% lower than Bengaluru. Office spaces, employee salaries, and living expenses are significantly more affordable. But here's the kicker — the talent is just as good. Institutions like MNIT and IIIT produce world-class engineers who are often overlooked by metro-based recruiters.</p>
<h2>The Community Factor</h2>
<p>Tier-2 cities have tight-knit startup communities. In Jaipur, the Startup Saturday chapter and the Rajasthan Startup Fest have created genuine ecosystems of support. Mentors are more accessible, collaboration is more organic, and the sense of community is palpable.</p>
<h2>Case Studies</h2>
<p>Companies like Vernacular.ai (Bengaluru roots, Jaipur team), Picxy (Hyderabad), and Cubeo AI (Jaipur) prove that geography is not destiny. These companies have raised significant funding, serve global customers, and compete with metro-based startups head-on.</p>
<h2>Practical Advice</h2>
<p>Start with a problem you see in your local market. Build your MVP with a lean team. Leverage the lower burn rate to reach profitability faster. Use the saved capital for marketing and growth. And most importantly — embrace your city's unique advantages rather than trying to replicate the Bengaluru playbook.</p>`,
        excerpt: 'You don\'t need Bengaluru to build a startup. Here\'s how founders in tier-2 cities are winning.',
        author: author2._id,
        category: catMap['Business'],
        tags: ['Startup', 'Tier-2 Cities', 'Jaipur', 'Entrepreneurship'],
        views: 1893,
        likes: [author1._id, admin._id],
        published: true,
        featured: false,
        featuredImage: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800'
      },
      {
        title: 'The Magic of Kerala Backwaters: A Houseboat Journey',
        content: `<p>Gliding through the emerald waters of Kerala's backwaters on a traditional kettuvallam is one of India's most magical experiences.</p>
<h2>Setting Sail from Alleppey</h2>
<p>We boarded our houseboat at Alleppey (Alappuzha), the Venice of the East, at sunrise. The morning mist hung low over the palm-fringed waterways, creating an ethereal landscape that felt almost dreamlike. Our kettuvallam — a converted rice barge with thatched roof and wooden interiors — became our floating home for the next 24 hours.</p>
<h2>Life on the Water</h2>
<p>The backwaters are a unique ecosystem — a network of canals, rivers, lakes, and lagoons running parallel to the Arabian Sea coast. As we cruised through narrow waterways barely wider than our boat, we witnessed village life unfold on the banks. Women washing clothes, children walking to school, fishermen casting nets — all reflected perfectly in the still water.</p>
<h2>The Food</h2>
<p>Our onboard chef prepared a traditional Kerala sadya — a feast served on a banana leaf with over 20 items. The fish curry, made with fresh karimeen (pearl spot) from the backwaters, was cooked in a clay pot with kodampuli (Malabar tamarind). The combination of tangy, spicy, and coconut flavours was absolutely divine.</p>
<h2>Sunset and Stars</h2>
<p>As the sun set, the backwaters transformed. The water turned from emerald to gold to deep purple. We anchored near a village and sat on the deck watching fireflies dance among the mangroves. Without city light pollution, the Milky Way was visible in all its glory — a sight many Indians have never experienced.</p>`,
        excerpt: 'A serene journey through Kerala\'s famous backwaters aboard a traditional houseboat.',
        author: author1._id,
        category: catMap['Travel'],
        tags: ['Kerala', 'Backwaters', 'Houseboat', 'Alleppey'],
        views: 3210,
        likes: [author2._id, author3._id, admin._id],
        published: true,
        featured: true,
        featuredImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'
      },
      {
        title: 'Understanding the Indian Education System: What Needs to Change',
        content: `<p>India produces millions of graduates every year, yet employers consistently report a skills gap. Here's a deep dive into what's broken and how we can fix it.</p>
<h2>The Rote Learning Problem</h2>
<p>Our education system still largely revolves around memorisation rather than understanding. Students are taught to reproduce textbook content in exams rather than think critically, solve problems, or create something new. The NEP 2020 was a step in the right direction, but implementation remains the biggest challenge.</p>
<h2>The Rural-Urban Divide</h2>
<p>A student in a metro city has access to digital classrooms, international faculty, and global curriculum. A student in rural India often studies in crumbling buildings with outdated textbooks and underpaid teachers. This divide isn't just about infrastructure — it's about aspirations, opportunities, and futures.</p>
<h2>What Works</h2>
<p>Schools like Riverside School in Ahmedabad, which focus on design thinking and real-world problem solving, produce remarkably creative and capable students. Institutions like Ashoka University and Krea University are redefining liberal arts education. And platforms like Khan Academy India and DIKSHA are making quality education accessible at scale.</p>
<h2>The Way Forward</h2>
<p>We need to rethink assessment entirely. Portfolio-based evaluations, project work, internships, and peer learning should complement or replace traditional exams. Teacher training needs massive investment. And the stigma around vocational education must end — skilled tradespeople are as valuable as any engineer or doctor.</p>`,
        excerpt: 'Why India\'s education system needs a complete overhaul, and practical ways to achieve it.',
        author: author2._id,
        category: catMap['Education'],
        tags: ['Education', 'NEP', 'India', 'Learning'],
        views: 2156,
        likes: [author1._id, author3._id],
        published: true,
        featured: false,
        featuredImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800'
      },
      {
        title: 'The Rise of OTT Platforms in India: How They Changed Entertainment Forever',
        content: `<p>From Sacred Games to Panchayat, Indian OTT content has redefined storytelling. Here's how streaming platforms transformed the Indian entertainment landscape.</p>
<h2>The Pre-OTT Era</h2>
<p>Before Netflix, Amazon Prime, and Hotstar, Indian entertainment meant either Bollywood blockbusters or television serials. There was very little in between — no space for nuanced, complex storytelling that didn't need to fit a 3-hour movie format or cater to a family audience watching together.</p>
<h2>The Content Revolution</h2>
<p>OTT platforms gave creators the freedom to tell stories they always wanted to tell. Sacred Games showed that Indian audiences were ready for dark, complex narratives. Panchayat proved that a simple story set in rural India could captivate millions. Made in Heaven tackled taboo subjects with sensitivity and style. These shows didn't just entertain — they started conversations.</p>
<h2>The Economics</h2>
<p>India's OTT market is projected to reach $12 billion by 2028. With over 500 million internet users and cheap data (thanks to Jio's revolution), the audience is massive and growing. Regional language content is the fastest-growing segment — shows in Tamil, Telugu, Malayalam, and Bengali are finding audiences far beyond their home states.</p>
<h2>The Challenges</h2>
<p>Content fatigue is real. With so many platforms releasing content every week, viewer attention is increasingly fragmented. The economics are also challenging — most platforms are still not profitable in India. And the regulatory landscape continues to evolve, creating both opportunities and uncertainties.</p>`,
        excerpt: 'How streaming platforms transformed Indian entertainment and gave birth to a golden age of content.',
        author: author1._id,
        category: catMap['Entertainment'],
        tags: ['OTT', 'Streaming', 'Indian Content', 'Netflix'],
        views: 2789,
        likes: [author2._id, admin._id],
        published: true,
        featured: false,
        featuredImage: 'https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?w=800'
      },
      {
        title: 'From Alwar to Silicon Valley: My Journey as an Indian Woman in Tech',
        content: `<p>I grew up in a small town in Rajasthan where girls were expected to become teachers or nurses. Today, I lead a product team at a Fortune 500 tech company. This is my story.</p>
<h2>The Beginning</h2>
<p>In Alwar, Rajasthan, my father ran a small shop selling electrical goods. My mother was a homemaker who had never used a computer. When I expressed interest in engineering after my 10th board exams, the reactions ranged from surprise to scepticism. "Girls don't do engineering," I was told repeatedly. But my parents, despite their limited education, supported my dream.</p>
<h2>The Struggle</h2>
<p>Engineering college in Jaipur was a culture shock. I was one of 15 girls in a batch of 120. The hostel had no Wi-Fi. The computer lab had 30-year-old machines. But I discovered something magical — code doesn't care about your gender, your background, or your family income. It only cares about your logic and creativity.</p>
<h2>The Breakthrough</h2>
<p>A hackathon during my third year changed everything. Our team built an app that connected rural farmers with urban buyers, cutting out middlemen. We won the national round and got noticed by a tech company. That led to an internship in Bengaluru, then a full-time role, and eventually a transfer to their US office.</p>
<h2>Paying It Forward</h2>
<p>Today, I run a mentorship programme for girls from tier-2 and tier-3 cities who want to pursue careers in technology. We've helped over 500 girls get into engineering colleges and tech companies. The talent is there — all it needs is opportunity and support.</p>`,
        excerpt: 'From a small town in Rajasthan to leading a tech team in Silicon Valley — a journey of grit and determination.',
        author: author3._id,
        category: catMap['Technology'],
        tags: ['Women in Tech', 'India', 'Inspiration', 'Career'],
        views: 4521,
        likes: [author1._id, author2._id, admin._id],
        published: true,
        featured: false,
        featuredImage: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800'
      },
      {
        title: 'Mastering the Art of South Indian Filter Coffee',
        content: `<p>South Indian filter coffee isn't just a beverage — it's a ritual, a tradition, and for many, the highlight of their morning. Here's how to make the perfect cup.</p>
<h2>The Equipment</h2>
<p>The traditional South Indian coffee filter is a two-tiered stainless steel device. The upper chamber holds the coffee powder with perforations at the bottom, while the lower chamber collects the decoction. A good filter costs between ₹200-500 and lasts a lifetime. The tumbler and davara (the traditional serving set) aren't just for aesthetics — the act of pouring between the two vessels aerates the coffee and cools it to the perfect drinking temperature.</p>
<h2>The Coffee Powder</h2>
<p>The secret lies in the blend. Traditional South Indian coffee is a mix of about 80% dark-roasted Arabica coffee and 20% chicory. The chicory adds a slightly bitter, caramel-like depth that's essential to the authentic taste. Brands like Cothas, Narasu's, and Blue Mountain are popular in different regions. The roast should be dark — almost oily — and freshly ground.</p>
<h2>The Method</h2>
<p>Boil water and fill the upper chamber with freshly boiled water. Place the pressing disc (the plunger) on top and cover. Wait 10-12 minutes for the decoction to drip through. In a separate vessel, heat whole milk with sugar. Add 2-3 tablespoons of decoction to the tumbler, pour in the sweetened hot milk, and serve in the traditional davara set.</p>
<h2>The Ritual</h2>
<p>The final step is the most iconic — the long pour. Hold the tumbler and davara at a distance and pour the coffee back and forth between them. This isn't just for show; it cools the coffee to drinking temperature and creates a beautiful, frothy top. The ideal filter coffee should be strong, sweet, and aromatic — a perfect start to any morning.</p>`,
        excerpt: 'Learn the traditional method of making the perfect South Indian filter coffee at home.',
        author: author1._id,
        category: catMap['Food'],
        tags: ['Coffee', 'South Indian', 'Recipe', 'Tradition'],
        views: 3876,
        likes: [author2._id, author3._id, admin._id],
        published: true,
        featured: false,
        featuredImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800'
      },
      {
        title: 'Pranayama for Beginners: Ancient Breathing Techniques for Modern Stress',
        content: `<p>In our hyper-connected world, the ancient practice of pranayama offers a powerful antidote to modern stress. Here's a beginner's guide.</p>
<h2>Why Pranayama?</h2>
<p>Modern life bombards us with stimuli. Our nervous system is constantly in fight-or-flight mode, flooding our bodies with cortisol and adrenaline. Pranayama — the yogic science of breath control — directly activates the parasympathetic nervous system, shifting our body from stress to recovery. Research from AIIMS Delhi has shown that just 15 minutes of daily pranayama can significantly reduce anxiety and improve sleep quality.</p>
<h2>Anulom Vilom (Alternate Nostril Breathing)</h2>
<p>This is perhaps the most well-known pranayama technique. Sit comfortably with your spine straight. Close your right nostril with your thumb. Inhale slowly through the left nostril for 4 counts. Close the left nostril with your ring finger, release the right, and exhale for 4 counts. Inhale through the right for 4 counts, close it, exhale through the left for 4 counts. That's one cycle. Start with 5 cycles and gradually increase to 15-20.</p>
<h2>Kapalabhati (Skull-Shining Breath)</h2>
<p>This is an energising technique that clears the mind and stimulates the solar plexus. Sit comfortably, take a deep breath in, and then perform rapid, forceful exhalations through the nose while pulling your navel towards your spine. The inhale happens passively. Start with 30 pumps per round and do 3 rounds. Avoid this if you have high blood pressure or are pregnant.</p>
<h2>Bhramari (Humming Bee Breath)</h2>
<p>This is the ultimate technique for calming an anxious mind. Close your ears with your thumbs, place your index fingers gently on your closed eyelids, and hum like a bee on each exhalation. The vibration of the hum creates a soothing effect on the nervous system. Even 5 minutes of Bhramari can bring a profound sense of peace.</p>`,
        excerpt: 'Ancient Indian breathing techniques that are scientifically proven to reduce stress and improve focus.',
        author: author3._id,
        category: catMap['Health'],
        tags: ['Pranayama', 'Yoga', 'Mental Health', 'Wellness'],
        views: 2934,
        likes: [author1._id, admin._id],
        published: true,
        featured: false,
        featuredImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'
      },
      {
        title: 'The Hidden Gems of Northeast India: A Photographer\'s Guide',
        content: `<p>Northeast India is arguably the most photogenic and least explored region in the country. Here are my favourite hidden gems that will fill your camera roll.</p>
<h2>Mawlynnong, Meghalaya</h2>
<p>Known as Asia's cleanest village, Mawlynnong is a photographer's paradise. The living root bridges — centuries-old structures grown from the roots of rubber fig trees — are unlike anything else on Earth. The most famous one, the Double Decker Root Bridge at Nongriat, requires a 3-hour trek but rewards you with extraordinary views. Morning fog creates magical conditions for landscape photography.</p>
<h2>Dzükou Valley, Nagaland-Manipur Border</h2>
<p>Often called the Valley of Flowers of the Northeast, Dzükou is carpeted with the rare Dzükou lily (found only here) during monsoon season. The trek to reach the valley is challenging but worthwhile. The undulating green hills, wild streams, and flower-covered meadows create compositions that look almost surreal.</p>
<h2>Majuli Island, Assam</h2>
<p>The world's largest river island, Majuli sits in the middle of the Brahmaputra River. It's home to centuries-old Vaishnavite monasteries (satras) and a way of life that has remained largely unchanged. The island is slowly shrinking due to erosion — making it not just beautiful but poignant. The mask-making artisans of Samaguri Satra are incredible subjects for portrait photography.</p>
<h2>Tawang, Arunachal Pradesh</h2>
<p>The Tawang Monastery, perched at 3,000 metres, is the largest Buddhist monastery in India and the second largest in the world after Lhasa. The road to Tawang, crossing the Sela Pass at 13,700 feet, is one of India's most scenic drives. Snow-capped peaks, frozen lakes, and ancient monasteries — Tawang offers everything a photographer could dream of.</p>`,
        excerpt: 'Discover the most stunning and least-explored corners of Northeast India through a photographer\'s lens.',
        author: author1._id,
        category: catMap['Travel'],
        tags: ['Northeast India', 'Photography', 'Hidden Gems', 'Adventure'],
        views: 2678,
        likes: [author2._id, author3._id],
        published: true,
        featured: false,
        featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
      },
      {
        title: 'Building Scalable APIs with Node.js: Lessons from Indian SaaS Companies',
        content: `<p>India's SaaS industry is booming, and many of these companies have shared their API architecture lessons. Here's what I've learned from building and studying APIs at scale.</p>
<h2>The Indian SaaS Boom</h2>
<p>India now has over 100 SaaS companies valued at over $1 billion. Companies like Zoho, Freshworks, Postman, and Razorpay have built APIs that handle millions of requests daily. Their engineering blogs and conference talks are goldmines of practical knowledge.</p>
<h2>Choosing the Right Architecture</h2>
<p>Node.js remains the most popular choice for API development in Indian SaaS companies, and for good reason. Its event-driven, non-blocking I/O model handles high-concurrency efficiently. But the key is knowing when NOT to use Node.js. CPU-intensive operations should be offloaded to worker threads or separate services.</p>
<h2>Database Design Patterns</h2>
<p>The most successful Indian SaaS companies use a combination of SQL (for transactional data) and NoSQL (for logs, analytics, and flexible schemas). MongoDB works well for content-heavy applications, while PostgreSQL is preferred for financial data. The pattern of using read replicas for scaling reads while keeping writes on the primary is almost universal.</p>
<h2>Lessons from Razorpay</h2>
<p>Razorpay processes over $100 billion in annual payments. Their API design principles include: idempotency for all write operations, versioned APIs with deprecation timelines, comprehensive request/response logging, and circuit breakers for downstream services. These practices aren't luxury features — they're essential for any production API.</p>`,
        excerpt: 'Practical API architecture lessons drawn from India\'s fastest-growing SaaS companies.',
        author: author2._id,
        category: catMap['Technology'],
        tags: ['Node.js', 'API', 'SaaS', 'Architecture'],
        views: 1654,
        likes: [author1._id],
        published: true,
        featured: false,
        featuredImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800'
      },
      {
        title: 'Monsoon Travel in India: Embracing the Rainy Season',
        content: `<p>While most tourists avoid India during monsoon, locals know it's the most magical time to travel. Here's why — and where to go.</p>
<h2>The Magic of Monsoon</h2>
<p>When the monsoon arrives in June, India transforms. The parched earth turns emerald green. Waterfalls that are dry most of the year roar to life. The heat gives way to cool, misty weather. And the crowds disappear — you'll often have entire monuments and beaches to yourself.</p>
<h2>Coorg, Karnataka</h2>
<p>Coorg during monsoon is breathtaking. The coffee plantations are lush and vibrant, mist rolls through the valleys, and Abbey Falls is at its most powerful. The drive from Bengaluru to Coorg through the winding ghat roads, with rain pattering on the windshield and the landscape turning impossibly green, is an experience in itself.</p>
<h2>Munnar, Kerala</h2>
<p>The tea gardens of Munnar, blanketed in low-hanging clouds and draped in rain, look like scenes from a movie. The weather is cool and pleasant, perfect for long walks through the plantations. The nearby waterfalls — Cheeyappara and Valara — are spectacular during the monsoon.</p>
<h2>Valley of Flowers, Uttarakhand</h2>
<p>The Valley of Flowers is only accessible during monsoon (July-August), and it's worth every rainy step of the trek. Over 300 species of wildflowers carpet the valley in every colour imaginable. The combination of alpine meadows, snow-capped peaks, and monsoon clouds creates landscapes that defy description.</p>`,
        excerpt: 'Why India\'s monsoon season is actually the best time to travel, and where to go.',
        author: author1._id,
        category: catMap['Travel'],
        tags: ['Monsoon', 'Travel', 'India', 'Offbeat'],
        views: 2234,
        likes: [author3._id, admin._id],
        published: true,
        featured: false,
        featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
      },
      {
        title: 'The Psychology of Colors in Indian Design: From Rangoli to UX',
        content: `<p>India has one of the richest colour traditions in the world. Here's how understanding Indian colour psychology can transform your design work.</p>
<h2>Colours in Indian Culture</h2>
<p>In India, colours aren't just aesthetic choices — they carry deep cultural and emotional significance. Saffron represents sacrifice and courage. Red symbolises purity and fertility (hence its dominance in weddings). Green is associated with nature and prosperity. Yellow signifies knowledge and learning. Understanding these associations is crucial for any designer working with Indian audiences.</p>
<h2>Rangoli: The Original UX</h2>
<p>Traditional rangoli designs are essentially early examples of user experience design. They guide foot traffic (wayfinding), convey messages (communication design), and create emotional responses (emotional design) — all using colour as the primary tool. The geometric patterns and colour combinations used in rangoli have been refined over thousands of years.</p>
<h2>Modern Application</h2>
<p>Indian fintech apps like PhonePe use purple (traditionally associated with royalty and prosperity) as their primary colour. Zoho uses blue (trust and reliability). Meesho uses pink (feminine energy and warmth, given their female-dominated seller base). These choices aren't accidental — they're deeply rooted in colour psychology.</p>
<h2>Design Principles</h2>
<p>When designing for Indian audiences: use warm, vibrant colours for emotional products; use cool, muted tones for professional tools; leverage culturally significant colour associations; and always test with diverse audiences across regions, as colour preferences vary significantly across India's linguistic and cultural groups.</p>`,
        excerpt: 'How India\'s rich colour traditions can inform modern design, from rangoli to digital products.',
        author: author3._id,
        category: catMap['Entertainment'],
        tags: ['Design', 'Colour Psychology', 'Indian Culture', 'UX'],
        views: 1987,
        likes: [author1._id, author2._id],
        published: true,
        featured: false,
        featuredImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'
      },
      {
        title: 'Indian EdTech After the Bubble: What Actually Works',
        content: `<p>The Indian EdTech sector saw massive growth and a painful correction. Here's an honest assessment of what's working and what's not.</p>
<h2>The Boom and Bust</h2>
<p>Between 2020 and 2022, Indian EdTech raised over $10 billion. Bylines were full of "unicorn" stories. Then reality hit. Byju's, the poster child of Indian EdTech, faced severe financial difficulties. Several promising startups shut down. The sector's valuation corrected sharply.</p>
<h2>What Failed</h2>
<p>The biggest failure was trying to replicate the Western EdTech model of scaling through aggressive marketing and discounting. Indian parents and students aren't the same as their Western counterparts. Trust, family involvement, and proven outcomes matter more than slick marketing. Companies that spent more on customer acquisition than on product quality paid the price.</p>
<h2>What's Working</h2>
<p>The survivors and winners share common traits: focus on specific niches rather than trying to be everything to everyone, sustainable unit economics from Day 1, strong offline-online hybrid models, and genuine learning outcomes. Companies like PhysicsWallah (affordable test prep), Scaler (tech upskilling), and CollegeDunia (discovery platform) are thriving because they solve real problems efficiently.</p>
<h2>The Future</h2>
<p>The Indian EdTech sector isn't dead — it's maturing. The next wave will be characterised by niche products, sustainable growth, integration with formal education (rather than trying to replace it), and AI-powered personalisation. The market is too big and the opportunity too real for EdTech to disappear. It just needs to grow up.</p>`,
        excerpt: 'An honest look at Indian EdTech — what survived, what failed, and where the industry is heading.',
        author: author2._id,
        category: catMap['Education'],
        tags: ['EdTech', 'India', 'Startups', 'Learning'],
        views: 1543,
        likes: [author1._id, admin._id],
        published: true,
        featured: false,
        featuredImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800'
      }
    ];

    const createdPosts = await Post.insertMany(posts);
    console.log(`${createdPosts.length} posts created`);

    for (const post of posts) {
      const cat = categories.find(c => c._id.toString() === post.category.toString());
      if (cat) {
        await Category.findByIdAndUpdate(cat._id, { $inc: { postCount: 1 } });
      }
    }

    const comments = [
      { post: createdPosts[0]._id, author: author1._id, content: 'Great article! I\'ve been meaning to learn Rust. This article convinced me to start.' },
      { post: createdPosts[0]._id, author: author3._id, content: 'The performance benefits are real. We migrated one microservice to Rust and saw 40% reduction in memory usage.' },
      { post: createdPosts[1]._id, author: author2._id, content: 'Karim\'s is an institution! I make it a point to visit every time I\'m in Delhi.' },
      { post: createdPosts[1]._id, author: author3._id, content: 'This makes me so hungry! Adding Old Delhi food trail to my next trip itinerary.' },
      { post: createdPosts[2]._id, author: author1._id, content: 'I did a similar 5-day digital detox in Hampi. The first two days are rough but it gets so much better.' },
      { post: createdPosts[2]._id, author: author2._id, content: 'This is exactly what I needed to read. Booking Rishikesh for next month!' },
      { post: createdPosts[4]._id, author: author3._id, content: 'The houseboat experience is truly magical. The food alone is worth the trip.' },
      { post: createdPosts[7]._id, author: author1._id, content: 'This is so inspiring! The mentorship programme is incredible work.' },
      { post: createdPosts[10]._id, author: author2._id, content: 'Northeast India is criminally underrated. Tawang is absolutely stunning.' },
      { post: createdPosts[14]._id, author: author1._id, content: 'Finally an honest take on EdTech. The industry needed this reality check.' }
    ];

    const replies = [
      { post: createdPosts[0]._id, author: author2._id, content: 'Thanks Priya! Let me know if you need any resources to get started.' },
      { post: createdPosts[1]._id, author: author1._id, content: 'Haha yes! Karim\'s butter chicken is legendary.' },
      { post: createdPosts[7]._id, author: author3._id, content: 'Thank you Rahul. Representation matters and I want to see more girls in tech.' }
    ];

    for (const comment of comments) {
      const createdComment = await Comment.create(comment);
      const matchingReply = replies.find(r => r.post.toString() === comment.post.toString());
      if (matchingReply) {
        await Comment.create({
          post: matchingReply.post,
          author: matchingReply.author,
          content: matchingReply.content,
          parentComment: createdComment._id
        });
      }
    }

    console.log('Comments created');
    console.log('Seed completed successfully!');
    console.log('Admin login: admin@bloghub.com / admin123');
    console.log('Author logins: priya@bloghub.com, rahul@bloghub.com, ananya@bloghub.com / author123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
