import { PrismaClient, Role, TalentCategory, TalentStatus, AnalyticsEventType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');
  
  // Create admin user
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@torchgroup.co' },
    update: {},
    create: {
      email: 'admin@torchgroup.co',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log('Admin user created:', admin.email);

  // Create staff user
  const staffPassword = await hash('staff123', 10);
  const staff = await prisma.user.upsert({
    where: { email: 'staff@torchgroup.co' },
    update: {},
    create: {
      email: 'staff@torchgroup.co',
      name: 'Staff User',
      password: staffPassword,
      role: Role.STAFF,
    },
  });
  console.log('Staff user created:', staff.email);

  // Create blog posts
  const blogPosts = [
    {
      title: 'Introducing Torch Group',
      slug: 'introducing-torch-group',
      excerpt: 'Learn about our mission and values at Torch Group.',
      content: `
# Introducing Torch Group

Welcome to Torch Group, your premier partner in creative excellence. We are dedicated to illuminating your brand's potential through innovative solutions tailored to your unique needs.

## Our Mission

At Torch Group, we believe in the power of collaboration and creativity. Our mission is to empower brands with the tools and strategies they need to shine in today's competitive marketplace.

## Our Approach

We combine strategic thinking with creative execution to deliver results that exceed expectations. Our team of experts works closely with you to understand your goals and develop solutions that drive success.

## Get in Touch

Ready to ignite your brand's potential? Contact us today to learn more about how Torch Group can help you achieve your goals.
      `,
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date(),
      coverImage: 'https://utfs.io/f/9c5f7f68-41e0-4d1b-9b4a-d1d812db5167-1fvxo9.jpg',
    },
    {
      title: 'The Future of Digital Marketing',
      slug: 'future-of-digital-marketing',
      excerpt: 'Explore emerging trends in digital marketing for 2025 and beyond.',
      content: `
# The Future of Digital Marketing

The digital marketing landscape is constantly evolving. As we move into 2025 and beyond, new technologies and strategies are emerging that will shape the way brands connect with their audiences.

## AI-Powered Personalization

Artificial intelligence is revolutionizing the way marketers deliver personalized experiences. By analyzing vast amounts of data, AI can help brands create highly targeted campaigns that resonate with individual consumers.

## Immersive Experiences

Virtual and augmented reality are creating new opportunities for brands to engage with their audiences. From virtual product trials to immersive brand experiences, these technologies are changing the game for marketers.

## Sustainable Marketing

Consumers are increasingly conscious of environmental issues, and brands that demonstrate a commitment to sustainability will have a competitive edge. Sustainable marketing is not just good for the planet—it's good for business.

## Privacy-First Approaches

As privacy regulations tighten and cookies phase out, marketers need to develop new strategies for tracking and targeting. First-party data collection and transparent practices will be key to success in this new era.
      `,
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      coverImage: 'https://utfs.io/f/e2e0b8b9-40c1-4304-9a9c-6a6cf9c579e2-1fvxoa.jpg',
    },
    {
      title: 'Talent Spotlight: Meet Our Creative Director',
      slug: 'talent-spotlight-creative-director',
      excerpt: 'Get to know the creative genius behind Torch Group's most successful campaigns.',
      content: `
# Talent Spotlight: Meet Our Creative Director

In this inaugural edition of our Talent Spotlight series, we're featuring Sarah Johnson, the Creative Director at Torch Group. With over 15 years of experience in the industry, Sarah has been the driving force behind some of our most successful campaigns.

## Background and Experience

Sarah began her career in advertising after graduating from the Rhode Island School of Design. She worked with several high-profile agencies before joining Torch Group in 2020.

"I was drawn to Torch Group because of the collaborative atmosphere and the opportunity to work with a diverse range of clients," says Sarah. "The team here is truly exceptional, and I'm constantly inspired by the creativity and dedication everyone brings to the table."

## Creative Philosophy

Sarah's approach to creative direction is rooted in storytelling. "Every brand has a unique story to tell," she explains. "My job is to help uncover that story and present it in a way that resonates with the audience."

Her process involves deep research into the client's industry, audience, and competitors, followed by collaborative brainstorming sessions with the creative team.

## Notable Projects

During her time at Torch Group, Sarah has led campaigns for clients across various industries, from technology to healthcare to consumer goods. Some of her most notable work includes:

- The rebranding of TechNova, a leading tech startup
- The award-winning "Illuminate" campaign for Solstice Energy
- The interactive digital experience for Horizon Healthcare's patient portal

## Looking Ahead

As Torch Group continues to grow, Sarah is excited about the future. "We're constantly evolving and pushing boundaries," she says. "I'm particularly interested in exploring how emerging technologies like AR and VR can create more immersive brand experiences."

Stay tuned for more Talent Spotlight features, where we'll introduce you to the amazing individuals who make Torch Group shine.
      `,
      authorId: staff.id,
      isPublished: true,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      coverImage: 'https://utfs.io/f/17e77a98-6f5f-48c6-a1e6-5b80bd49d6c9-1fvxob.jpg',
    },
  ];

  for (const post of blogPosts) {
    const createdPost = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
    console.log('Blog post created:', createdPost.title);
  }

  // Create team members
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Creative Director',
      bio: 'Sarah has over 15 years of experience in creative direction and brand strategy. She leads our creative team with vision and purpose.',
      image: 'https://utfs.io/f/d27e24c1-022f-49f7-a99b-e527d7eb9f69-1awtmn.jpg',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        twitter: 'https://twitter.com/sarahjcreative',
      },
      isPublished: true,
    },
    {
      name: 'Michael Rodriguez',
      role: 'Technical Director',
      bio: 'Michael brings technical expertise and innovation to every project. With a background in software development and digital strategy, he bridges the gap between creativity and technology.',
      image: 'https://utfs.io/f/ae8c68d9-1954-40a8-87e5-7a36f59217f0-1awtmo.jpg',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/michaelrodriguez',
        github: 'https://github.com/mrodriguez',
      },
      isPublished: true,
    },
    {
      name: 'Emily Chen',
      role: 'Marketing Strategist',
      bio: 'Emily specializes in developing comprehensive marketing strategies that drive results. Her analytical approach and creative thinking help clients achieve their business goals.',
      image: 'https://utfs.io/f/5a7b20c1-f5b2-4c5c-b0d8-995c86f3c3a0-1awtmp.jpg',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/emilychen',
        twitter: 'https://twitter.com/emilystrategist',
      },
      isPublished: true,
    },
    {
      name: 'James Wilson',
      role: 'Client Relations Manager',
      bio: 'James ensures that our clients receive exceptional service from start to finish. His communication skills and attention to detail make him an invaluable member of the team.',
      image: 'https://utfs.io/f/6b9c1e8a-7d3f-49a9-b13a-d9f712f77d1e-1awtmq.jpg',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/jameswilson',
      },
      isPublished: true,
    },
  ];

  for (const member of teamMembers) {
    const createdMember = await prisma.teamMember.upsert({
      where: { name: member.name },
      update: {},
      create: member,
    });
    console.log('Team member created:', createdMember.name);
  }

  // Create talents
  const talents = [
    {
      name: 'Alex Morgan',
      role: 'Digital Artist',
      category: TalentCategory.DESIGN,
      bio: 'Alex creates stunning digital art that captures the imagination. With a unique style blending surrealism and minimalism, their work has been featured in galleries across the country.',
      imageUrl: 'https://utfs.io/f/7e5c8d2a-6b1f-4e8c-a9d3-f83c24b4e3b1-1awtmr.jpg',
      status: TalentStatus.ACTIVE,
    },
    {
      name: 'Jamie Lee',
      role: 'UI/UX Designer',
      category: TalentCategory.DESIGN,
      bio: 'Jamie specializes in creating intuitive and beautiful user interfaces. Their work combines aesthetic appeal with functional design, resulting in exceptional user experiences.',
      imageUrl: 'https://utfs.io/f/8f4d19b7-3c9e-4e0a-b8f2-f1d6a3f9c4d2-1awtms.jpg',
      status: TalentStatus.ACTIVE,
    },
    {
      name: 'Taylor Swift',
      role: 'Singer-Songwriter',
      category: TalentCategory.MUSIC,
      bio: 'Taylor is an award-winning composer and performer, specializing in a blend of folk and pop music. Her emotive lyrics and captivating melodies have earned her a dedicated following.',
      imageUrl: 'https://utfs.io/f/9e2a7b5c-4d8f-4e3b-a1c9-d0e6f2g3h4i5-1awtmt.jpg',
      status: TalentStatus.ACTIVE,
    },
    {
      name: 'David Chen',
      role: 'Mobile Developer',
      category: TalentCategory.TECHNOLOGY,
      bio: 'David is a mobile app developer with expertise in React Native and Swift. He has created successful apps for startups and established companies alike.',
      imageUrl: 'https://utfs.io/f/0a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p-1awtmu.jpg',
      status: TalentStatus.PENDING,
    },
    {
      name: 'Sophia Rodriguez',
      role: 'Brand Strategist',
      category: TalentCategory.MARKETING,
      bio: 'Sophia helps brands discover and articulate their unique voice. Her strategic approach to branding has helped numerous companies stand out in crowded markets.',
      imageUrl: 'https://utfs.io/f/5p6o7n8m-9l0k1j2i-3h4g5f6e-7d8c9b0a-1awtmv.jpg',
      status: TalentStatus.PENDING,
    },
  ];

  for (const talent of talents) {
    const createdTalent = await prisma.talent.upsert({
      where: { name: talent.name },
      update: {},
      create: talent,
    });
    console.log('Talent created:', createdTalent.name);
  }

  // Create projects
  const projects = [
    {
      title: 'TechNova Rebrand',
      slug: 'technova-rebrand',
      description: 'A complete rebrand for TechNova, a leading technology startup.',
      content: `
# TechNova Rebrand

## Project Overview

TechNova approached Torch Group with a challenge: their brand no longer reflected their position as an industry leader in AI and machine learning solutions. We were tasked with creating a new visual identity that would communicate their innovative approach and technical expertise.

## Our Approach

We began with a comprehensive brand audit, analyzing TechNova's current positioning, competitive landscape, and target audience. Through workshops with their leadership team, we identified key brand attributes: innovative, trustworthy, accessible, and forward-thinking.

Using these insights, we developed a new visual identity system that included:

- A redesigned logo that incorporates elements of connectivity and intelligence
- A refreshed color palette centered around deep blues and vibrant purples
- Custom iconography representing their core service areas
- Typography that balances technical precision with approachability
- Brand photography guidelines emphasizing human connection with technology

## Results

The rebrand was launched to widespread acclaim, with positive feedback from clients, employees, and industry observers. TechNova reported a 35% increase in website engagement and a 20% improvement in lead quality following the rebrand.

The new brand identity has provided TechNova with a flexible system that can evolve with their business while maintaining a consistent and recognizable presence in the market.
      `,
      coverImage: 'https://utfs.io/f/1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p-1fvxoc.jpg',
      clientName: 'TechNova Inc.',
      completionDate: new Date(2025, 2, 15), // March 15, 2025
      isPublished: true,
    },
    {
      title: 'Solstice Energy Campaign',
      slug: 'solstice-energy-campaign',
      description: 'An award-winning campaign for renewable energy provider Solstice Energy.',
      content: `
# Solstice Energy "Illuminate" Campaign

## Project Overview

Solstice Energy, a growing renewable energy provider, partnered with Torch Group to develop a campaign that would increase brand awareness and drive customer acquisition in a competitive market.

## The Challenge

Renewable energy is a crowded space, with many companies offering similar products and services. Solstice needed to differentiate themselves and communicate their unique value proposition: community-focused solar energy solutions that make renewable energy accessible to everyone.

## Our Solution

We created "Illuminate," a multi-channel campaign centered around the idea of bringing light to communities and empowering individuals to make a positive impact on the environment.

The campaign included:

- A series of emotionally resonant video ads showcasing real communities transformed by renewable energy
- Print and digital advertisements featuring striking imagery and compelling messaging
- A redesigned website with improved user experience and clear calls to action
- Social media content that encouraged audience engagement and sharing
- Community events in key markets to build personal connections with potential customers

## Results

The "Illuminate" campaign exceeded all expectations, resulting in:

- 45% increase in brand awareness in target markets
- 67% growth in website traffic
- 28% improvement in lead-to-customer conversion rate
- 300% increase in social media engagement
- Industry recognition, including a Silver Award at the Annual Energy Marketing Excellence Awards

Most importantly, Solstice Energy reported a 40% increase in new customer acquisition during the campaign period, establishing them as a leading provider in their market.
      `,
      coverImage: 'https://utfs.io/f/7q8r9s0t-1u2v3w4x-5y6z7a8b-9c0d1e2f-1fvxod.jpg',
      clientName: 'Solstice Energy',
      completionDate: new Date(2025, 0, 20), // January 20, 2025
      isPublished: true,
    },
    {
      title: 'Horizon Healthcare Patient Portal',
      slug: 'horizon-healthcare-portal',
      description: 'A user-centered redesign of Horizon Healthcare's patient portal.',
      content: `
# Horizon Healthcare Patient Portal Redesign

## Project Overview

Horizon Healthcare, a regional healthcare provider with multiple facilities, engaged Torch Group to redesign their patient portal to improve user experience, increase patient engagement, and support their mission of patient-centered care.

## The Challenge

The existing patient portal suffered from poor usability, outdated design, and limited functionality. Patient adoption was low, and feedback indicated frustration with the system. Horizon Healthcare needed a solution that would make healthcare management easier and more accessible for their diverse patient population.

## Our Approach

We took a user-centered design approach, beginning with extensive research:

- In-depth interviews with patients from various demographics
- Usability testing of the existing portal
- Stakeholder workshops with healthcare providers and administrators
- Competitive analysis of leading healthcare portals

Based on our research findings, we developed a comprehensive redesign that prioritized:

1. **Simplified Navigation**: Intuitive information architecture based on patient mental models
2. **Accessibility**: WCAG 2.1 AA compliance to ensure access for patients with disabilities
3. **Mobile Optimization**: Responsive design for seamless use across devices
4. **Personalization**: Customizable dashboard showing relevant information to each patient
5. **Clear Communication**: Simplified language and visual cues to improve comprehension

## The Solution

The redesigned portal features:

- A dashboard providing at-a-glance information on upcoming appointments, prescriptions, and test results
- Streamlined appointment scheduling with intelligent availability recommendations
- Secure messaging system for direct communication with healthcare providers
- Medication management tools with reminders and refill requests
- Interactive health trackers for chronic condition management
- Educational resources tailored to each patient's health profile

## Results

Since launching the redesigned portal:

- Patient adoption increased by 65%
- Portal-scheduled appointments rose by 42%
- Call center volume decreased by 28%
- Patient satisfaction scores improved from 3.2/5 to 4.7/5
- Provider time spent on administrative tasks reduced by 15%

The portal has become a cornerstone of Horizon Healthcare's digital transformation strategy, supporting their goal of providing connected, patient-centered care.
      `,
      coverImage: 'https://utfs.io/f/3g4h5i6j-7k8l9m0n-1o2p3q4r-5s6t7u8v-1fvxoe.jpg',
      clientName: 'Horizon Healthcare',
      completionDate: new Date(2024, 10, 5), // November 5, 2024
      isPublished: true,
    },
  ];

  for (const project of projects) {
    const createdProject = await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
    console.log('Project created:', createdProject.title);
  }

  // Create contact messages
  const contactMessages = [
    {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1234567890',
      subject: 'Project Inquiry',
      message: 'I would like to discuss a potential project for my company. We are looking for a creative partner to help us with our upcoming product launch. Please contact me at your earliest convenience.',
      isRead: false,
    },
    {
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '+0987654321',
      subject: 'Job Opportunity',
      message: 'I am very impressed with your portfolio and would love to explore job opportunities at Torch Group. I have attached my resume for your review. I have 5 years of experience in graphic design and branding.',
      isRead: true,
      attachment: 'https://utfs.io/f/9f0e1d2c-3b4a-5678-9012-3456789abcde-resume.pdf',
    },
    {
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      phone: '+1122334455',
      subject: 'Partnership Proposal',
      message: 'Our agency would like to discuss a potential partnership with Torch Group. We specialize in digital marketing and believe there could be synergies between our organizations. Please let me know if you would be interested in scheduling a call to discuss further.',
      isRead: false,
    },
  ];

  for (const message of contactMessages) {
    const createdMessage = await prisma.contactMessage.create({
      data: message,
    });
    console.log('Contact message created:', createdMessage.subject);
  }

  // Create analytics events
  const now = new Date();
  const analyticsEvents = [
    // Page views from today
    ...Array(15).fill(null).map((_, i) => ({
      type: AnalyticsEventType.PAGE_VIEW,
      meta: { path: '/', referrer: 'https://google.com', userAgent: 'Mozilla/5.0' },
      createdAt: new Date(now.getTime() - i * 10 * 60 * 1000), // 10 minutes apart
    })),
    
    // Page views from yesterday
    ...Array(12).fill(null).map((_, i) => ({
      type: AnalyticsEventType.PAGE_VIEW,
      meta: { path: '/', referrer: 'https://facebook.com', userAgent: 'Mozilla/5.0' },
      createdAt: new Date(now.getTime() - (24 * 60 * 60 * 1000) - i * 20 * 60 * 1000), // yesterday
    })),
    
    // Form submissions
    ...Array(5).fill(null).map((_, i) => ({
      type: AnalyticsEventType.FORM_SUBMIT,
      meta: { formId: 'contact', success: true },
      createdAt: new Date(now.getTime() - i * 3 * 60 * 60 * 1000), // 3 hours apart
    })),
    
    // Phone verifications
    ...Array(3).fill(null).map((_, i) => ({
      type: AnalyticsEventType.PHONE_VERIFIED,
      meta: { formId: 'contact' },
      createdAt: new Date(now.getTime() - i * 12 * 60 * 60 * 1000), // 12 hours apart
    })),
    
    // Talent clicks
    ...Array(8).fill(null).map((_, i) => ({
      type: AnalyticsEventType.TALENT_CLICK,
      meta: { talentId: talents[i % talents.length].name },
      createdAt: new Date(now.getTime() - i * 6 * 60 * 60 * 1000), // 6 hours apart
    })),
  ];

  for (const event of analyticsEvents) {
    await prisma.analyticsEvent.create({
      data: event,
    });
  }
  console.log(`Created ${analyticsEvents.length} analytics events`);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 